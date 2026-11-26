-- 003_categorias_servicios.sql
-- Tablas: categorias, servicios
-- Referencias: RF-05, RF-06, RF-07, RF-08, RF-09, RF-26, RN-03, RNF-05

-- Búsqueda tolerante a errores ortográficos y autocompletado sobre el catálogo (RF-07, RF-08)
create extension if not exists pg_trgm with schema extensions;

create table public.categorias (
  id                 uuid primary key default gen_random_uuid(),
  nombre             text not null unique,
  slug               text not null unique,
  descripcion        text,
  categoria_padre_id uuid references public.categorias (id),
  -- Términos relacionados para autocompletado y para mapear la sugerencia de Gemini (RF-07, RF-09)
  palabras_clave     text[] not null default '{}',
  -- RN-03: actividad regulada que exige licencia antes de publicar
  requiere_licencia  boolean not null default false,
  activa             boolean not null default true,
  creado_en          timestamptz not null default now()
);

-- Servicios predeterminados que publica un profesionista aprobado (RF-05)
create table public.servicios (
  id                  uuid primary key default gen_random_uuid(),
  profesionista_id    uuid not null references public.profesionistas (id) on delete cascade,
  categoria_id        uuid not null references public.categorias (id),
  titulo              text not null,
  descripcion         text not null,
  tipo_precio         text not null default 'a_cotizar' check (tipo_precio in ('fijo', 'estimado', 'a_cotizar')),
  precio_base         numeric(10, 2) check (precio_base >= 0),
  -- Zona aproximada declarada (ARQ-07)
  ciudad              text not null,
  colonia             text,
  codigo_postal       text,
  imagenes            text[] not null default '{}', -- rutas del bucket público
  -- Solo 'publicado' aparece en las búsquedas (RF-05, RF-06)
  estado              text not null default 'borrador' check (estado in ('borrador', 'publicado', 'pausado', 'retirado')),
  -- RN-03: licencia aprobada cuando la categoría la exige
  licencia_archivo_id uuid references public.archivos_verificacion (id),
  -- RF-26: retiro por moderación
  moderado_por        uuid references public.perfiles (id),
  motivo_moderacion   text,
  creado_en           timestamptz not null default now(),
  actualizado_en      timestamptz not null default now(),
  constraint servicios_precio_segun_tipo check (tipo_precio = 'a_cotizar' or precio_base is not null)
);

create index servicios_profesionista_idx on public.servicios (profesionista_id);
create index servicios_busqueda_idx on public.servicios (estado, categoria_id, ciudad);
create index servicios_titulo_trgm_idx on public.servicios using gin (titulo extensions.gin_trgm_ops);

create trigger servicios_set_actualizado_en
  before update on public.servicios
  for each row execute function public.set_actualizado_en();

alter table public.categorias enable row level security;
alter table public.servicios enable row level security;
