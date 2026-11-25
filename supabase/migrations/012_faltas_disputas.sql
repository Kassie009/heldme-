-- 012_faltas_disputas.sql
-- Tablas: reportes_inasistencia, strikes, disputas
-- Referencias: RF-30, RF-31, RF-34, RN-09, RN-15

-- Reporte de una falta; el administrador lo revisa antes de confirmarla (RF-30)
create table public.reportes_inasistencia (
  id              uuid primary key default gen_random_uuid(),
  contratacion_id uuid not null references public.contrataciones (id),
  reportado_por   uuid not null references public.perfiles (id),
  reportado_id    uuid not null references public.perfiles (id), -- quien habría cometido la falta
  motivo          text not null check (motivo in ('inasistencia', 'cancelacion_injustificada')),
  explicacion     text not null,
  evidencias      text[] not null default '{}', -- rutas del bucket privado
  estado          text not null default 'pendiente' check (estado in ('pendiente', 'aceptado', 'rechazado')),
  resolucion      text,
  revisado_por    uuid references public.perfiles (id),
  revisado_en     timestamptz,
  creado_en       timestamptz not null default now(),
  constraint reportes_inasistencia_partes check (reportado_por <> reportado_id),
  unique (contratacion_id, reportado_por, motivo)
);

create index reportes_inasistencia_estado_idx on public.reportes_inasistencia (estado, creado_en);

-- Falta confirmada de un profesionista (RF-31). La falta del cliente se sanciona con
-- perfiles.bloqueo_solicitudes_hasta (RN-09).
create table public.strikes (
  id               uuid primary key default gen_random_uuid(),
  profesionista_id uuid not null references public.profesionistas (id),
  reporte_id       uuid unique references public.reportes_inasistencia (id),
  contratacion_id  uuid references public.contrataciones (id),
  numero           smallint not null check (numero between 1 and 3), -- posición entre los strikes vigentes
  -- 1.º advertencia; 2.º suspensión de 48 h y penalización de rango; 3.º bloqueo hasta revisión
  sancion          text not null check (sancion in ('advertencia', 'suspension_48h_penalizacion_rango', 'bloqueo_revision_administrativa')),
  motivo           text not null,
  confirmado_por   uuid not null references public.perfiles (id),
  confirmado_en    timestamptz not null default now(),
  -- Deja de contar tras 6 meses sin nuevas faltas, pero el registro permanece
  vigente          boolean not null default true,
  caducado_en      timestamptz
);

create index strikes_profesionista_idx on public.strikes (profesionista_id, vigente);

-- Disputas de realización o finalización (RF-34)
create table public.disputas (
  id               uuid primary key default gen_random_uuid(),
  contratacion_id  uuid not null references public.contrataciones (id),
  abierta_por      uuid references public.perfiles (id), -- null = la abrió el sistema
  motivo           text not null
    check (motivo in ('sin_codigo_finalizacion', 'codigo_vencido', 'cancelacion_tras_inicio', 'inconformidad', 'otro')),
  descripcion      text,
  evidencias       text[] not null default '{}',
  estado           text not null default 'abierta' check (estado in ('abierta', 'en_revision', 'resuelta', 'cerrada')),
  -- Resolución del administrador: qué pasa con el monto preautorizado (RN-15)
  resolucion       text,
  decision_pago    text check (decision_pago in ('captura_total', 'captura_parcial', 'cancelacion')),
  monto_a_capturar numeric(10, 2) check (monto_a_capturar >= 0),
  resuelta_por     uuid references public.perfiles (id),
  resuelta_en      timestamptz,
  creado_en        timestamptz not null default now(),
  actualizado_en   timestamptz not null default now(),
  constraint disputas_captura_parcial check (decision_pago <> 'captura_parcial' or monto_a_capturar is not null),
  constraint disputas_resolucion check (
    estado not in ('resuelta', 'cerrada')
    or (resolucion is not null and decision_pago is not null and resuelta_por is not null)
  )
);

-- Una sola disputa en curso por contratación
create unique index disputas_una_abierta_idx
  on public.disputas (contratacion_id)
  where estado in ('abierta', 'en_revision');
create index disputas_estado_idx on public.disputas (estado, creado_en);

create trigger disputas_set_actualizado_en
  before update on public.disputas
  for each row execute function public.set_actualizado_en();

alter table public.reportes_inasistencia enable row level security;
alter table public.strikes enable row level security;
alter table public.disputas enable row level security;
