-- 016_busqueda.sql
-- Tablas: consultas_ia. Columnas nuevas: servicios.busqueda, cursos.busqueda
-- Referencias: RF-06, RF-09, RF-10, RF-11, RF-35, RN-10, RNF-05, RNF-06, RNF-14

-- Búsqueda convencional por texto que no depende de Gemini (RF-11) e ignora acentos:
-- 'plomeria' encuentra 'Plomería'.
create extension if not exists unaccent with schema extensions;

-- unaccent() no es inmutable por sí sola; esta envoltura permite usarla en columnas generadas e índices
create or replace function public.sin_acentos(p_texto text)
returns text
language sql
immutable
strict
parallel safe
set search_path = ''
as $$
  select extensions.unaccent('extensions.unaccent'::regdictionary, p_texto);
$$;

-- Uso desde el backend:
--   where busqueda @@ websearch_to_tsquery('spanish', public.sin_acentos('fuga de agua'))
alter table public.servicios
  add column busqueda tsvector
  generated always as (to_tsvector('spanish'::regconfig, public.sin_acentos(titulo || ' ' || descripcion))) stored;

alter table public.cursos
  add column busqueda tsvector
  generated always as (to_tsvector('spanish'::regconfig, public.sin_acentos(titulo || ' ' || descripcion))) stored;

create index servicios_busqueda_texto_idx on public.servicios using gin (busqueda);
create index cursos_busqueda_texto_idx on public.cursos using gin (busqueda);

-- Bitácora de las llamadas a Gemini. Sirve para limitar el uso por usuario y por día (RNF-06),
-- para demostrar qué texto se envió (RNF-14) y para registrar la corrección de categoría (RF-35).
create table public.consultas_ia (
  id                    uuid primary key default gen_random_uuid(),
  usuario_id            uuid not null references public.perfiles (id) on delete cascade,
  texto_enviado         text not null, -- texto de búsqueda ya depurado, sin datos personales
  categoria_sugerida_id uuid references public.categorias (id),
  categoria_elegida_id  uuid references public.categorias (id), -- distinta cuando el usuario corrige
  resultado             text not null
    check (resultado in ('ok', 'error', 'timeout', 'cuota_agotada', 'respuesta_invalida')),
  uso_respaldo          boolean not null default false, -- se respondió con la búsqueda convencional
  modelo                text,
  latencia_ms           integer check (latencia_ms >= 0),
  creado_en             timestamptz not null default now()
);

create index consultas_ia_usuario_idx on public.consultas_ia (usuario_id, creado_en desc);
create index consultas_ia_fecha_idx on public.consultas_ia (creado_en);

alter table public.consultas_ia enable row level security;
