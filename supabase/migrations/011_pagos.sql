-- 011_pagos.sql
-- Tablas: pagos_prueba, eventos_stripe, comisiones
-- Referencias: RF-36, RF-37, RF-38, RF-40, RN-08, RN-11, RN-15, RNF-09
-- Todo ocurre en Stripe Test Mode: ningún registro representa dinero real.

-- Un PaymentIntent de prueba por registro. Una contratación puede tener varios
-- (monto original, trabajos adicionales, nueva autorización si la anterior expiró).
create table public.pagos_prueba (
  id                       uuid primary key default gen_random_uuid(),
  tipo                     text not null check (tipo in ('servicio', 'curso')),
  contratacion_id          uuid references public.contrataciones (id),
  inscripcion_id           uuid references public.inscripciones (id),
  cotizacion_version_id    uuid references public.cotizacion_versiones (id), -- versión aceptada que cubre
  cliente_id               uuid not null references public.perfiles (id),
  profesionista_id         uuid not null references public.profesionistas (id),
  stripe_payment_intent_id text unique,
  stripe_reembolso_id      text unique,
  clave_idempotencia       text not null unique, -- evita pagos duplicados al reintentar (RNF-09)
  moneda                   text not null default 'mxn',
  monto_autorizado         numeric(10, 2) not null check (monto_autorizado > 0),
  monto_capturado          numeric(10, 2) not null default 0,
  monto_reembolsado        numeric(10, 2) not null default 0,
  -- RF-38
  estado                   text not null default 'pendiente'
    check (estado in ('pendiente', 'preautorizado', 'capturado', 'rechazado', 'cancelado', 'reembolsado')),
  -- RN-08: si la cita es a más de 5 días, la preautorización se programa 48 h antes
  preautorizar_en          timestamptz,
  preautorizado_en         timestamptz,
  autorizacion_expira_en   timestamptz, -- alrededor de 7 días después de autorizar
  capturado_en             timestamptz,
  cancelado_en             timestamptz,
  reembolsado_en           timestamptz,
  motivo_fallo             text,
  creado_en                timestamptz not null default now(),
  actualizado_en           timestamptz not null default now(),
  constraint pagos_prueba_recurso check (
    (tipo = 'servicio' and contratacion_id is not null and inscripcion_id is null)
    or (tipo = 'curso' and inscripcion_id is not null and contratacion_id is null)
  ),
  -- Captura total o parcial, nunca mayor a lo autorizado (RN-08, RN-15)
  constraint pagos_prueba_captura check (monto_capturado between 0 and monto_autorizado),
  constraint pagos_prueba_reembolso check (monto_reembolsado between 0 and monto_capturado)
);

create index pagos_prueba_contratacion_idx on public.pagos_prueba (contratacion_id);
create index pagos_prueba_inscripcion_idx on public.pagos_prueba (inscripcion_id);
create index pagos_prueba_cliente_idx on public.pagos_prueba (cliente_id, creado_en desc);
create index pagos_prueba_por_preautorizar_idx on public.pagos_prueba (preautorizar_en) where estado = 'pendiente';

create trigger pagos_prueba_set_actualizado_en
  before update on public.pagos_prueba
  for each row execute function public.set_actualizado_en();

-- Webhooks recibidos (RF-37). stripe_event_id único descarta los duplicados.
create table public.eventos_stripe (
  id              uuid primary key default gen_random_uuid(),
  stripe_event_id text not null unique,
  tipo            text not null, -- p. ej. 'payment_intent.amount_capturable_updated'
  pago_id         uuid references public.pagos_prueba (id),
  payload         jsonb not null,
  livemode        boolean not null default false check (livemode = false), -- solo Test Mode
  recibido_en     timestamptz not null default now(),
  procesado_en    timestamptz,
  error           text
);

create index eventos_stripe_pago_idx on public.eventos_stripe (pago_id);

-- Comisión simulada y su desglose (RF-40, RN-11)
create table public.comisiones (
  id                            uuid primary key default gen_random_uuid(),
  pago_id                       uuid not null unique references public.pagos_prueba (id) on delete cascade,
  mano_obra                     numeric(10, 2) not null default 0 check (mano_obra >= 0),
  diagnostico                   numeric(10, 2) not null default 0 check (diagnostico >= 0),
  material_comprobado           numeric(10, 2) not null default 0 check (material_comprobado >= 0), -- exento
  material_sin_comprobante      numeric(10, 2) not null default 0 check (material_sin_comprobante >= 0),
  precio_curso                  numeric(10, 2) not null default 0 check (precio_curso >= 0),
  tasa                          numeric(5, 4) not null default 0.10 check (tasa between 0 and 1),
  -- El material sin comprobante cuenta como mano de obra
  base_comision                 numeric(12, 2) generated always as
    (mano_obra + diagnostico + material_sin_comprobante + precio_curso) stored,
  monto_comision                numeric(12, 2) generated always as
    (round((mano_obra + diagnostico + material_sin_comprobante + precio_curso) * tasa, 2)) stored,
  -- Lo absorbe HeldMe! con cargo a su comisión; no se traslada a cliente ni profesionista
  costo_procesamiento_simulado  numeric(10, 2) not null default 0 check (costo_procesamiento_simulado >= 0),
  creado_en                     timestamptz not null default now()
);

alter table public.pagos_prueba enable row level security;
alter table public.eventos_stripe enable row level security;
alter table public.comisiones enable row level security;
