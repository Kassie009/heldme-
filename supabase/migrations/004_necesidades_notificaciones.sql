-- 004_necesidades_notificaciones.sql
-- Tablas: necesidades, notificaciones
-- Referencias: RF-12, RF-13, RF-17, ARQ-07

-- Necesidad que publica un cliente para recibir cotizaciones (RF-12)
create table public.necesidades (
  id             uuid primary key default gen_random_uuid(),
  cliente_id     uuid not null references public.perfiles (id),
  categoria_id   uuid not null references public.categorias (id),
  titulo         text not null,
  descripcion    text not null,
  imagenes       text[] not null default '{}', -- opcionales
  -- Zona aproximada declarada; no se exige GPS (ARQ-07)
  ciudad         text not null,
  colonia        text,
  codigo_postal  text,
  fecha_deseada  date,
  -- Parte inicial de los estados de RF-17; el resto vive en contrataciones
  estado         text not null default 'publicado'
    check (estado in ('publicado', 'en_cotizacion', 'contratado', 'finalizado', 'cancelado')),
  creado_en      timestamptz not null default now(),
  actualizado_en timestamptz not null default now()
);

create index necesidades_cliente_idx on public.necesidades (cliente_id, creado_en desc);
create index necesidades_busqueda_idx on public.necesidades (estado, categoria_id, ciudad);

create trigger necesidades_set_actualizado_en
  before update on public.necesidades
  for each row execute function public.set_actualizado_en();

-- Notificaciones dentro del sistema (RF-13). recurso_tipo/recurso_id apuntan a cualquier tabla,
-- por eso no llevan llave foránea.
create table public.notificaciones (
  id              uuid primary key default gen_random_uuid(),
  destinatario_id uuid not null references public.perfiles (id) on delete cascade,
  tipo            text not null, -- p. ej. 'necesidad_nueva', 'cotizacion_recibida', 'verificacion_aprobada'
  titulo          text not null,
  cuerpo          text,
  recurso_tipo    text,
  recurso_id      uuid,
  leida_en        timestamptz,
  creado_en       timestamptz not null default now()
);

create index notificaciones_destinatario_idx on public.notificaciones (destinatario_id, creado_en desc);
create index notificaciones_no_leidas_idx on public.notificaciones (destinatario_id) where leida_en is null;

alter table public.necesidades enable row level security;
alter table public.notificaciones enable row level security;
