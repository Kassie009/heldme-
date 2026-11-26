-- 007_disponibilidad.sql
-- Tablas: disponibilidad, reservas
-- Referencias: RF-18 (exclusión contra empalmes)

-- Necesaria para combinar uuid con rangos en la restricción de exclusión
create extension if not exists btree_gist with schema extensions;

-- Horario del profesionista: bloques semanales recurrentes o excepciones en una fecha concreta
create table public.disponibilidad (
  id               uuid primary key default gen_random_uuid(),
  profesionista_id uuid not null references public.profesionistas (id) on delete cascade,
  dia_semana       smallint check (dia_semana between 0 and 6), -- 0 = domingo
  fecha            date, -- excepción puntual
  hora_inicio      time not null,
  hora_fin         time not null,
  disponible       boolean not null default true, -- false = bloqueo (vacaciones, día inhábil)
  creado_en        timestamptz not null default now(),
  constraint disponibilidad_horas check (hora_fin > hora_inicio),
  constraint disponibilidad_semanal_o_fecha check (num_nonnulls(dia_semana, fecha) = 1)
);

create index disponibilidad_profesionista_idx on public.disponibilidad (profesionista_id, dia_semana, fecha);

-- Citas que ocupan la agenda del profesionista
create table public.reservas (
  id               uuid primary key default gen_random_uuid(),
  profesionista_id uuid not null references public.profesionistas (id) on delete cascade,
  contratacion_id  uuid references public.contrataciones (id) on delete cascade, -- null = bloqueo manual
  inicio           timestamptz not null,
  fin              timestamptz not null,
  estado           text not null default 'confirmada' check (estado in ('confirmada', 'completada', 'cancelada')),
  nota             text,
  creado_en        timestamptz not null default now(),
  actualizado_en   timestamptz not null default now(),
  constraint reservas_periodo check (fin > inicio),
  -- RF-18: el mismo profesionista no puede tener dos reservas vigentes que se empalmen
  constraint reservas_sin_empalmes exclude using gist (
    profesionista_id with =,
    tstzrange(inicio, fin, '[)') with &&
  ) where (estado <> 'cancelada')
);

create index reservas_contratacion_idx on public.reservas (contratacion_id);

create trigger reservas_set_actualizado_en
  before update on public.reservas
  for each row execute function public.set_actualizado_en();

alter table public.disponibilidad enable row level security;
alter table public.reservas enable row level security;
