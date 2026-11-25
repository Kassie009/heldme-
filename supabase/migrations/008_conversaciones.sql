-- 008_conversaciones.sql
-- Tablas: conversaciones, mensajes
-- Referencias: RF-19, RNF-13 (Realtime)

-- Chat privado entre un cliente y un profesionista, vinculado a una solicitud, cotización o contratación.
-- La misma conversación acompaña el flujo completo: los vínculos se van llenando conforme avanza.
create table public.conversaciones (
  id                uuid primary key default gen_random_uuid(),
  cliente_id        uuid not null references public.perfiles (id),
  profesionista_id  uuid not null references public.profesionistas (id),
  necesidad_id      uuid references public.necesidades (id),
  cotizacion_id     uuid references public.cotizaciones (id),
  contratacion_id   uuid references public.contrataciones (id),
  ultimo_mensaje_en timestamptz,
  creado_en         timestamptz not null default now(),
  constraint conversaciones_vinculo check (num_nonnulls(necesidad_id, cotizacion_id, contratacion_id) >= 1)
);

create unique index conversaciones_necesidad_profesionista_idx
  on public.conversaciones (necesidad_id, profesionista_id)
  where necesidad_id is not null;
create unique index conversaciones_cotizacion_idx
  on public.conversaciones (cotizacion_id)
  where cotizacion_id is not null;
create index conversaciones_cliente_idx on public.conversaciones (cliente_id, ultimo_mensaje_en desc);
create index conversaciones_profesionista_idx on public.conversaciones (profesionista_id, ultimo_mensaje_en desc);

-- El historial se conserva en PostgreSQL (RNF-13)
create table public.mensajes (
  id              uuid primary key default gen_random_uuid(),
  conversacion_id uuid not null references public.conversaciones (id) on delete cascade,
  remitente_id    uuid not null references public.perfiles (id),
  contenido       text,
  adjunto_ruta    text,
  leido_en        timestamptz,
  creado_en       timestamptz not null default now(),
  constraint mensajes_con_contenido check (contenido is not null or adjunto_ruta is not null)
);

create index mensajes_conversacion_idx on public.mensajes (conversacion_id, creado_en);

alter table public.conversaciones enable row level security;
alter table public.mensajes enable row level security;

-- Supabase Realtime: publica los mensajes nuevos (RNF-13)
do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    alter publication supabase_realtime add table public.mensajes;
  end if;
end;
$$;
