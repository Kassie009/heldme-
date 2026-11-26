-- 001_perfiles.sql
-- Tablas: perfiles, aceptaciones_legales
-- Referencias: RF-01, RF-02, RF-26, RF-42, RN-09, RN-12, ARQ-07

-- Función compartida por todas las tablas con columna actualizado_en
create or replace function public.set_actualizado_en()
returns trigger
language plpgsql
as $$
begin
  new.actualizado_en = now();
  return new;
end;
$$;

-- Un perfil por cuenta de Supabase Auth. El correo y la contraseña viven en auth.users (RNF-01).
create table public.perfiles (
  id                        uuid primary key references auth.users (id) on delete cascade,
  tipo_cuenta               text not null check (tipo_cuenta in ('cliente', 'profesionista', 'admin')),
  nombre                    text not null,
  apellidos                 text not null,
  telefono                  text,
  fecha_nacimiento          date not null,
  foto_url                  text, -- bucket público
  -- Zona aproximada declarada, sin GPS (ARQ-07)
  ciudad                    text,
  colonia                   text,
  codigo_postal             text,
  -- Moderación (RF-26) y sanciones (RN-09)
  estado_cuenta             text not null default 'activa' check (estado_cuenta in ('activa', 'suspendida', 'eliminada')),
  suspendida_hasta          timestamptz, -- null con estado 'suspendida' = hasta que el administrador reactive
  motivo_suspension         text,
  bloqueo_solicitudes_hasta timestamptz, -- cliente con falta confirmada: 24 h sin solicitar trabajos
  creado_en                 timestamptz not null default now(),
  actualizado_en            timestamptz not null default now(),
  -- RF-42: solo mayores de 18 años
  constraint perfiles_mayor_de_edad check (fecha_nacimiento <= current_date - interval '18 years')
);

create index perfiles_tipo_cuenta_idx on public.perfiles (tipo_cuenta);

create trigger perfiles_set_actualizado_en
  before update on public.perfiles
  for each row execute function public.set_actualizado_en();

-- RN-12: el tipo de cuenta no puede cambiarse después del registro
create or replace function public.impedir_cambio_tipo_cuenta()
returns trigger
language plpgsql
as $$
begin
  if new.tipo_cuenta is distinct from old.tipo_cuenta then
    raise exception 'El tipo de cuenta no puede cambiarse después del registro (RN-12)';
  end if;
  return new;
end;
$$;

create trigger perfiles_tipo_cuenta_inmutable
  before update of tipo_cuenta on public.perfiles
  for each row execute function public.impedir_cambio_tipo_cuenta();

-- RF-42: aceptación de términos de uso y aviso de privacidad con fecha y versión
create table public.aceptaciones_legales (
  id          uuid primary key default gen_random_uuid(),
  perfil_id   uuid not null references public.perfiles (id) on delete cascade,
  documento   text not null check (documento in ('terminos_uso', 'aviso_privacidad')),
  version     text not null,
  aceptado_en timestamptz not null default now(),
  unique (perfil_id, documento, version)
);

alter table public.perfiles enable row level security;
alter table public.aceptaciones_legales enable row level security;
