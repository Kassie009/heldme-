-- 002_profesionistas_verificacion.sql
-- Tablas: profesionistas, solicitudes_verificacion, archivos_verificacion, historial_verificacion
-- Referencias: RF-03, RF-04, RF-13, RN-02, RN-03, RN-04, RN-13, RNF-12

-- Perfil profesional público. Relación 1:1 con perfiles de tipo 'profesionista'.
create table public.profesionistas (
  id                    uuid primary key references public.perfiles (id) on delete cascade,
  descripcion           text,
  habilidades           text,
  experiencia           text,
  anios_experiencia     smallint check (anios_experiencia >= 0),
  -- Zona de atención, usada para notificar necesidades (RF-13)
  zona_ciudad           text,
  zona_colonias         text[] not null default '{}',
  zona_codigos_postales text[] not null default '{}',
  -- RF-04
  estado_verificacion   text not null default 'borrador'
    check (estado_verificacion in ('borrador', 'pendiente', 'requiere_informacion', 'aprobado', 'rechazado', 'suspendido')),
  -- RN-04: Bronce por defecto; Plata solo como excepción de ingreso aprobada por el administrador
  rango_inicial         text check (rango_inicial in ('bronce', 'plata')),
  aprobado_en           timestamptz,
  creado_en             timestamptz not null default now(),
  actualizado_en        timestamptz not null default now()
);

create index profesionistas_estado_zona_idx on public.profesionistas (estado_verificacion, zona_ciudad);

create trigger profesionistas_set_actualizado_en
  before update on public.profesionistas
  for each row execute function public.set_actualizado_en();

-- Cada envío o reenvío de la verificación. Contiene los datos de identidad, que son privados (RN-13).
create table public.solicitudes_verificacion (
  id                      uuid primary key default gen_random_uuid(),
  profesionista_id        uuid not null references public.profesionistas (id) on delete cascade,
  estado                  text not null default 'borrador'
    check (estado in ('borrador', 'pendiente', 'requiere_informacion', 'aprobado', 'rechazado', 'suspendido')),
  -- Datos para la revisión de identidad (RF-03)
  nombre_legal            text,
  tipo_identificacion     text,
  numero_identificacion   text,
  -- Lo declarado al momento de enviar
  habilidades_declaradas  text,
  experiencia_declarada   text,
  solicita_rango_superior boolean not null default false,
  -- Decisión administrativa: motivo, fecha y responsable (RF-04)
  rango_asignado          text check (rango_asignado in ('bronce', 'plata')),
  motivo_decision         text,
  revisado_por            uuid references public.perfiles (id),
  revisado_en             timestamptz,
  enviada_en              timestamptz,
  creado_en               timestamptz not null default now(),
  actualizado_en          timestamptz not null default now()
);

create index solicitudes_verificacion_estado_idx on public.solicitudes_verificacion (estado, enviada_en);

-- Solo una solicitud en trámite por profesionista
create unique index solicitudes_verificacion_una_abierta_idx
  on public.solicitudes_verificacion (profesionista_id)
  where estado in ('borrador', 'pendiente', 'requiere_informacion');

create trigger solicitudes_verificacion_set_actualizado_en
  before update on public.solicitudes_verificacion
  for each row execute function public.set_actualizado_en();

-- Archivos del bucket privado de verificación (ARQ-05, RNF-03)
create table public.archivos_verificacion (
  id              uuid primary key default gen_random_uuid(),
  solicitud_id    uuid not null references public.solicitudes_verificacion (id) on delete cascade,
  -- 'evidencia' es obligatoria; 'certificado' es opcional (RN-02); 'licencia' aplica a actividades reguladas (RN-03)
  tipo            text not null check (tipo in ('identificacion', 'evidencia', 'certificado', 'licencia')),
  ruta_storage    text not null unique,
  nombre_original text,
  mime_type       text not null,
  tamano_bytes    integer not null check (tamano_bytes > 0),
  descripcion     text,
  estado_revision text not null default 'pendiente' check (estado_revision in ('pendiente', 'aprobado', 'rechazado')),
  observaciones   text,
  creado_en       timestamptz not null default now(),
  -- RNF-12: imágenes hasta 5 MB, PDF hasta 10 MB
  constraint archivos_verificacion_formato check (
    (mime_type in ('image/jpeg', 'image/png', 'image/webp') and tamano_bytes <= 5242880)
    or (mime_type = 'application/pdf' and tamano_bytes <= 10485760)
  )
);

create index archivos_verificacion_solicitud_idx on public.archivos_verificacion (solicitud_id, tipo);

-- Cada cambio de estado de una solicitud (RF-04)
create table public.historial_verificacion (
  id              uuid primary key default gen_random_uuid(),
  solicitud_id    uuid not null references public.solicitudes_verificacion (id) on delete cascade,
  estado_anterior text,
  estado_nuevo    text not null,
  motivo          text,
  actor_id        uuid references public.perfiles (id),
  creado_en       timestamptz not null default now()
);

create index historial_verificacion_solicitud_idx on public.historial_verificacion (solicitud_id, creado_en);

alter table public.profesionistas enable row level security;
alter table public.solicitudes_verificacion enable row level security;
alter table public.archivos_verificacion enable row level security;
alter table public.historial_verificacion enable row level security;
