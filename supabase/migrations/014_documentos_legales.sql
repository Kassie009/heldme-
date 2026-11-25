-- 014_documentos_legales.sql
-- Tablas: documentos_legales
-- Referencias: RF-42

-- Versiones publicadas de los términos de uso y del aviso de privacidad.
-- La versión vigente de cada documento es la de vigente_desde más reciente que no sea futura.
create table public.documentos_legales (
  id            uuid primary key default gen_random_uuid(),
  documento     text not null check (documento in ('terminos_uso', 'aviso_privacidad')),
  version       text not null,
  titulo        text not null,
  contenido     text, -- texto completo; null mientras el equipo lo redacta
  vigente_desde timestamptz not null default now(),
  creado_en     timestamptz not null default now(),
  unique (documento, version)
);

insert into public.documentos_legales (documento, version, titulo) values
  ('terminos_uso', '1.0', 'Términos de uso de HeldMe!'),
  ('aviso_privacidad', '1.0', 'Aviso de privacidad de HeldMe!')
on conflict (documento, version) do nothing;

-- Solo se puede aceptar una versión que exista
alter table public.aceptaciones_legales
  add constraint aceptaciones_legales_documento_fk
  foreign key (documento, version) references public.documentos_legales (documento, version);

alter table public.documentos_legales enable row level security;
