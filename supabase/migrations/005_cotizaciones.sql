-- 005_cotizaciones.sql
-- Tablas: cotizaciones, cotizacion_versiones, cotizacion_conceptos
-- Referencias: RF-14, RF-15, RF-16, RF-41, RN-06, RN-07, RN-11, RNF-07, RNF-09

-- Propuesta de un profesionista para una necesidad publicada o para un servicio predeterminado
create table public.cotizaciones (
  id               uuid primary key default gen_random_uuid(),
  necesidad_id     uuid references public.necesidades (id),
  servicio_id      uuid references public.servicios (id),
  profesionista_id uuid not null references public.profesionistas (id),
  cliente_id       uuid not null references public.perfiles (id),
  -- 'no_seleccionada': el cliente eligió otra propuesta para la misma necesidad (RF-15)
  estado           text not null default 'borrador'
    check (estado in ('borrador', 'enviada', 'aceptada', 'rechazada', 'no_seleccionada', 'retirada', 'vencida')),
  creado_en        timestamptz not null default now(),
  actualizado_en   timestamptz not null default now(),
  constraint cotizaciones_origen check (necesidad_id is not null or servicio_id is not null)
);

-- Una cotización por profesionista y necesidad; los cambios se hacen con versiones (RNF-09)
create unique index cotizaciones_necesidad_profesionista_idx
  on public.cotizaciones (necesidad_id, profesionista_id)
  where necesidad_id is not null;
create index cotizaciones_profesionista_idx on public.cotizaciones (profesionista_id, creado_en desc);
create index cotizaciones_cliente_idx on public.cotizaciones (cliente_id, creado_en desc);

create trigger cotizaciones_set_actualizado_en
  before update on public.cotizaciones
  for each row execute function public.set_actualizado_en();

-- Cada cambio o trabajo adicional genera una versión nueva; las anteriores se conservan (RF-16, RNF-07)
create table public.cotizacion_versiones (
  id                    uuid primary key default gen_random_uuid(),
  cotizacion_id         uuid not null references public.cotizaciones (id) on delete cascade,
  numero                integer not null check (numero > 0),
  es_adicional          boolean not null default false, -- trabajo adicional sobre una versión ya aceptada
  motivo_cambio         text,
  tipo_costo            text not null check (tipo_costo in ('fijo', 'estimado')), -- RN-06
  condiciones           text,
  fecha_cita_propuesta  timestamptz,
  duracion_estimada_min integer check (duracion_estimada_min > 0),
  -- Totales calculados por el backend a partir de los conceptos
  subtotal_mano_obra    numeric(10, 2) not null default 0 check (subtotal_mano_obra >= 0),
  subtotal_diagnostico  numeric(10, 2) not null default 0 check (subtotal_diagnostico >= 0),
  subtotal_materiales   numeric(10, 2) not null default 0 check (subtotal_materiales >= 0),
  -- Monto que se paga por la plataforma; excluye el material que compra el cliente (RN-08, RN-11)
  total                 numeric(10, 2) not null default 0 check (total >= 0),
  estado                text not null default 'borrador'
    check (estado in ('borrador', 'enviada', 'aceptada', 'rechazada', 'reemplazada')),
  vigencia_hasta        timestamptz,
  enviada_en            timestamptz,
  respondida_en         timestamptz, -- aceptación o rechazo explícito del cliente
  creado_en             timestamptz not null default now(),
  unique (cotizacion_id, numero)
);

-- Desglose de la versión (RF-14, RN-06)
create table public.cotizacion_conceptos (
  id                    uuid primary key default gen_random_uuid(),
  version_id            uuid not null references public.cotizacion_versiones (id) on delete cascade,
  tipo                  text not null check (tipo in ('mano_obra', 'diagnostico', 'material')),
  descripcion           text not null,
  cantidad              numeric(10, 2) not null default 1 check (cantidad > 0),
  precio_unitario       numeric(10, 2) not null check (precio_unitario >= 0),
  importe               numeric(12, 2) generated always as (round(cantidad * precio_unitario, 2)) stored,
  -- Solo materiales: quién los compra. Lo que compra el cliente no entra al pago en la plataforma (RN-11)
  comprado_por          text check (comprado_por in ('profesionista', 'cliente')),
  -- RF-41: foto del ticket o factura. Sin comprobante, el material cuenta como mano de obra para la comisión
  comprobante_ruta      text,
  comprobante_subido_en timestamptz,
  orden                 smallint not null default 0,
  creado_en             timestamptz not null default now(),
  constraint cotizacion_conceptos_material check (
    (tipo = 'material' and comprado_por is not null)
    or (tipo <> 'material' and comprado_por is null and comprobante_ruta is null)
  )
);

create index cotizacion_conceptos_version_idx on public.cotizacion_conceptos (version_id, orden);

-- RNF-07: una versión aceptada no se modifica ni se elimina
create or replace function public.proteger_version_aceptada()
returns trigger
language plpgsql
as $$
begin
  if old.estado = 'aceptada' then
    raise exception 'Una versión de cotización aceptada no puede modificarse ni eliminarse (RNF-07)';
  end if;
  if tg_op = 'DELETE' then
    return old;
  end if;
  return new;
end;
$$;

create trigger cotizacion_versiones_proteger_aceptada
  before update or delete on public.cotizacion_versiones
  for each row execute function public.proteger_version_aceptada();

-- RNF-07 / RF-41: en una versión aceptada los conceptos quedan fijos; solo se puede adjuntar el comprobante
create or replace function public.proteger_conceptos_aceptados()
returns trigger
language plpgsql
as $$
declare
  v_versiones uuid[];
  -- 'importe' se excluye porque las columnas generadas aún no están calculadas en NEW dentro de un
  -- trigger BEFORE; queda cubierto al comparar cantidad y precio_unitario
  v_campos_libres constant text[] := array['comprobante_ruta', 'comprobante_subido_en', 'importe'];
begin
  if tg_op = 'INSERT' then
    v_versiones := array[new.version_id];
  elsif tg_op = 'DELETE' then
    v_versiones := array[old.version_id];
  else
    v_versiones := array[old.version_id, new.version_id];
  end if;

  if exists (
    select 1 from public.cotizacion_versiones
    where id = any (v_versiones) and estado = 'aceptada'
  ) then
    if tg_op <> 'UPDATE'
       or (to_jsonb(new) - v_campos_libres) is distinct from (to_jsonb(old) - v_campos_libres) then
      raise exception 'Los conceptos de una versión aceptada no pueden modificarse; solo se permite adjuntar el comprobante (RNF-07, RF-41)';
    end if;
  end if;

  if tg_op = 'DELETE' then
    return old;
  end if;
  return new;
end;
$$;

create trigger cotizacion_conceptos_proteger_aceptados
  before insert or update or delete on public.cotizacion_conceptos
  for each row execute function public.proteger_conceptos_aceptados();

alter table public.cotizaciones enable row level security;
alter table public.cotizacion_versiones enable row level security;
alter table public.cotizacion_conceptos enable row level security;
