-- 009_calificaciones.sql
-- Tablas: calificaciones, metricas_profesionista
-- Referencias: RF-20, RF-21, RN-04, RN-09

-- Una calificación de 1 a 5 estrellas por servicio confirmado (RF-20)
create table public.calificaciones (
  id               uuid primary key default gen_random_uuid(),
  contratacion_id  uuid not null unique references public.contrataciones (id),
  cliente_id       uuid not null references public.perfiles (id),
  profesionista_id uuid not null references public.profesionistas (id),
  estrellas        smallint not null check (estrellas between 1 and 5),
  comentario       text,
  creado_en        timestamptz not null default now()
);

create index calificaciones_profesionista_idx on public.calificaciones (profesionista_id, creado_en desc);

-- Métricas y rango de cada profesionista aprobado (RF-21). Las actualiza el backend al confirmar servicios.
create table public.metricas_profesionista (
  profesionista_id                 uuid primary key references public.profesionistas (id) on delete cascade,
  servicios_completados            integer not null default 0 check (servicios_completados >= 0),
  total_calificaciones             integer not null default 0 check (total_calificaciones >= 0),
  calificacion_promedio            numeric(3, 2) check (calificacion_promedio between 1 and 5), -- null sin calificaciones
  -- RN-04: rango alcanzado; un promedio menor a 4.0 bloquea el ascenso pero no lo desciende
  rango                            text not null default 'bronce' check (rango in ('bronce', 'plata', 'oro', 'diamante')),
  -- RN-09: con penalización se muestra un nivel inferior al alcanzado
  rango_mostrado                   text not null default 'bronce' check (rango_mostrado in ('bronce', 'plata', 'oro', 'diamante')),
  penalizacion_activa              boolean not null default false,
  penalizacion_desde               timestamptz,
  -- Servicios confirmados sin faltas que faltan para levantar la penalización (inicia en 10)
  penalizacion_servicios_restantes smallint not null default 0 check (penalizacion_servicios_restantes between 0 and 10),
  strikes_vigentes                 smallint not null default 0 check (strikes_vigentes >= 0),
  actualizado_en                   timestamptz not null default now()
);

create trigger metricas_profesionista_set_actualizado_en
  before update on public.metricas_profesionista
  for each row execute function public.set_actualizado_en();

alter table public.calificaciones enable row level security;
alter table public.metricas_profesionista enable row level security;
