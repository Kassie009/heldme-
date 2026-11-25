-- 006_contrataciones.sql
-- Tablas: contrataciones, preguntas_acuerdo, acuerdos, codigos_servicio
-- Referencias: RF-15, RF-17, RF-20, RF-29, RF-32, RF-33, RN-07, RN-08, RN-09, RN-15

create table public.contrataciones (
  id                     uuid primary key default gen_random_uuid(),
  cotizacion_id          uuid not null unique references public.cotizaciones (id),
  -- Última versión aceptada; cambia al aceptarse un trabajo adicional (RF-16)
  version_aceptada_id    uuid not null references public.cotizacion_versiones (id),
  necesidad_id           uuid references public.necesidades (id),
  cliente_id             uuid not null references public.perfiles (id),
  profesionista_id       uuid not null references public.profesionistas (id),
  -- RF-17 ('publicado' y 'en_cotizacion' corresponden a necesidades)
  estado                 text not null default 'contratado'
    check (estado in ('contratado', 'en_proceso', 'pendiente_ajuste', 'pendiente_confirmacion',
                      'en_revision_administrativa', 'finalizado', 'cancelado')),
  fecha_cita             timestamptz not null,
  duracion_estimada_min  integer check (duracion_estimada_min > 0),
  direccion_servicio     text, -- visible solo para las partes; nunca se envía a Gemini (RNF-14)
  confirmada_en          timestamptz, -- acuerdos confirmados y preautorización aprobada o programada (RN-08)
  iniciado_en            timestamptz, -- código de inicio validado (RF-29)
  realizado_en           timestamptz, -- el profesionista marcó el servicio como realizado (RF-20)
  finalizado_en          timestamptz, -- código de finalización validado o resolución administrativa
  monto_final            numeric(10, 2) check (monto_final >= 0), -- puede ser menor al preautorizado (RN-08)
  -- RN-09 / RN-15
  cancelado_en           timestamptz,
  cancelado_por          uuid references public.perfiles (id),
  motivo_cancelacion     text,
  cancelacion_justificada boolean, -- null mientras no se determine
  creado_en              timestamptz not null default now(),
  actualizado_en         timestamptz not null default now()
);

-- RF-15: una sola propuesta contratada por necesidad
create unique index contrataciones_una_por_necesidad_idx
  on public.contrataciones (necesidad_id)
  where necesidad_id is not null and estado <> 'cancelado';
create index contrataciones_cliente_idx on public.contrataciones (cliente_id, estado);
create index contrataciones_profesionista_idx on public.contrataciones (profesionista_id, estado);

create trigger contrataciones_set_actualizado_en
  before update on public.contrataciones
  for each row execute function public.set_actualizado_en();

-- Catálogo de preguntas predefinidas que se muestran en cada contratación (RF-32)
create table public.preguntas_acuerdo (
  id        uuid primary key default gen_random_uuid(),
  clave     text not null unique,
  texto     text not null,
  opciones  text[] not null default '{}', -- vacío = respuesta libre
  orden     smallint not null default 0,
  activa    boolean not null default true,
  creado_en timestamptz not null default now()
);

insert into public.preguntas_acuerdo (clave, texto, opciones, orden) values
  ('compra_materiales', '¿Quién comprará los materiales?',
   array['El profesionista', 'El cliente', 'No se requieren materiales'], 1),
  ('pago_materiales', '¿Quién cubrirá el costo de los materiales?',
   array['El cliente, incluido en la cotización', 'El cliente, mediante compra directa', 'No aplica'], 2),
  ('gastos_adicionales', '¿Cómo se tratarán los gastos adicionales?',
   array['Se cotizan en una nueva versión y el cliente los autoriza antes de ejecutarse', 'No se aceptarán trabajos adicionales'], 3)
on conflict (clave) do nothing;

-- Respuestas y confirmación de ambas partes (RF-33). Un cambio crea un registro nuevo y
-- el anterior queda con vigente = false (RNF-07).
create table public.acuerdos (
  id                          uuid primary key default gen_random_uuid(),
  contratacion_id             uuid not null references public.contrataciones (id) on delete cascade,
  pregunta_id                 uuid references public.preguntas_acuerdo (id), -- null = acuerdo libre
  respuesta                   text not null,
  detalle                     text,
  propuesto_por               uuid not null references public.perfiles (id),
  confirmado_cliente_en       timestamptz,
  confirmado_profesionista_en timestamptz,
  vigente                     boolean not null default true,
  creado_en                   timestamptz not null default now()
);

create unique index acuerdos_vigente_por_pregunta_idx
  on public.acuerdos (contratacion_id, pregunta_id)
  where vigente and pregunta_id is not null;
create index acuerdos_contratacion_idx on public.acuerdos (contratacion_id);

-- Códigos de inicio y de finalización, de un solo uso (RF-20, RF-29, RN-08)
create table public.codigos_servicio (
  id                uuid primary key default gen_random_uuid(),
  contratacion_id   uuid not null references public.contrataciones (id) on delete cascade,
  tipo              text not null check (tipo in ('inicio', 'finalizacion')),
  codigo            text not null, -- el cliente lo consulta para compartirlo con el profesionista
  generado_en       timestamptz not null default now(),
  expira_en         timestamptz, -- finalización: 24 h desde que se genera
  usado_en          timestamptz,
  validado_por      uuid references public.perfiles (id),
  intentos_fallidos smallint not null default 0 check (intentos_fallidos >= 0),
  anulado_en        timestamptz, -- sustituido por un código nuevo
  constraint codigos_servicio_vigencia_finalizacion check (tipo <> 'finalizacion' or expira_en is not null)
);

-- Un solo código activo y un solo código usado por tipo en cada contratación
create unique index codigos_servicio_activo_idx
  on public.codigos_servicio (contratacion_id, tipo)
  where usado_en is null and anulado_en is null;
create unique index codigos_servicio_usado_idx
  on public.codigos_servicio (contratacion_id, tipo)
  where usado_en is not null;

alter table public.contrataciones enable row level security;
alter table public.preguntas_acuerdo enable row level security;
alter table public.acuerdos enable row level security;
alter table public.codigos_servicio enable row level security;
