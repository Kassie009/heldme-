-- 013_historial_eventos.sql
-- Tablas: historial_eventos (solo INSERT)
-- Referencias: RF-26, RF-27, RNF-07

-- Bitácora de cotizaciones, versiones, aceptaciones, acuerdos, códigos, cambios de estado,
-- faltas y acciones administrativas. Cada evento guarda actor, fecha, acción y recurso (RF-27).
create table public.historial_eventos (
  id              bigint generated always as identity primary key,
  actor_id        uuid references public.perfiles (id), -- null = sistema o webhook
  actor_tipo      text not null check (actor_tipo in ('cliente', 'profesionista', 'admin', 'sistema')),
  accion          text not null, -- p. ej. 'cotizacion.aceptada', 'contratacion.estado_cambiado', 'cuenta.suspendida'
  recurso_tipo    text not null, -- nombre de la tabla del recurso
  recurso_id      uuid not null,
  contratacion_id uuid references public.contrataciones (id), -- arma el expediente de una disputa (RF-34)
  datos           jsonb not null default '{}', -- estado anterior y nuevo, motivo, montos
  creado_en       timestamptz not null default now(),
  constraint historial_eventos_actor check ((actor_tipo = 'sistema') = (actor_id is null))
);

create index historial_eventos_recurso_idx on public.historial_eventos (recurso_tipo, recurso_id, creado_en);
create index historial_eventos_contratacion_idx on public.historial_eventos (contratacion_id, creado_en)
  where contratacion_id is not null;
create index historial_eventos_actor_idx on public.historial_eventos (actor_id, creado_en);

-- Solo INSERT: ni el backend con service_role puede alterar o borrar el historial
create or replace function public.historial_eventos_solo_insert()
returns trigger
language plpgsql
as $$
begin
  raise exception 'historial_eventos es de solo inserción (RF-27)';
end;
$$;

create trigger historial_eventos_inmutable
  before update or delete on public.historial_eventos
  for each row execute function public.historial_eventos_solo_insert();

create trigger historial_eventos_sin_truncate
  before truncate on public.historial_eventos
  for each statement execute function public.historial_eventos_solo_insert();

revoke update, delete, truncate on public.historial_eventos from anon, authenticated;

alter table public.historial_eventos enable row level security;
