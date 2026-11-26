-- 010_cursos.sql
-- Tablas: instructores, cursos, inscripciones
-- Referencias: RF-22, RF-23, RF-24, RF-25, RN-05, RN-14, RN-15, RNF-09

-- Autorización para impartir cursos (RF-22, RF-23). Requiere rango Plata o superior (RN-05).
create table public.instructores (
  id               uuid primary key default gen_random_uuid(),
  profesionista_id uuid not null unique references public.profesionistas (id) on delete cascade,
  -- 'inhabilitado': perdió la elegibilidad por rango, penalización o suspensión (RN-14)
  estado           text not null default 'pendiente'
    check (estado in ('pendiente', 'aprobado', 'rechazado', 'inhabilitado')),
  motivo_solicitud text,
  motivo_decision  text,
  revisado_por     uuid references public.perfiles (id),
  revisado_en      timestamptz,
  solicitado_en    timestamptz not null default now(),
  actualizado_en   timestamptz not null default now()
);

create trigger instructores_set_actualizado_en
  before update on public.instructores
  for each row execute function public.set_actualizado_en();

create table public.cursos (
  id              uuid primary key default gen_random_uuid(),
  instructor_id   uuid not null references public.instructores (id),
  categoria_id    uuid not null references public.categorias (id),
  titulo          text not null,
  descripcion     text not null,
  imagen_url      text,
  modalidad       text not null check (modalidad in ('presencial', 'en_linea')),
  -- Presencial: zona aproximada (ARQ-07)
  ciudad          text,
  colonia         text,
  codigo_postal   text,
  -- En línea: enlace externo gratuito. Solo deben verlo los alumnos inscritos (RN-05),
  -- así que el backend no debe incluir esta columna en el catálogo público.
  enlace_externo  text,
  precio          numeric(10, 2) not null check (precio >= 0), -- precio de prueba
  cupo_maximo     integer not null check (cupo_maximo > 0),
  inscritos       integer not null default 0,
  fecha_inicio    timestamptz not null,
  fecha_fin       timestamptz not null,
  horario         text, -- p. ej. 'Sábados de 10:00 a 12:00'
  -- RF-24
  estado          text not null default 'borrador'
    check (estado in ('borrador', 'pendiente_revision', 'aprobado', 'publicado', 'pausado',
                      'rechazado', 'finalizado', 'cancelado')),
  motivo_decision text,
  revisado_por    uuid references public.perfiles (id),
  revisado_en     timestamptz,
  creado_en       timestamptz not null default now(),
  actualizado_en  timestamptz not null default now(),
  constraint cursos_fechas check (fecha_fin >= fecha_inicio),
  -- RF-25: el cupo nunca se excede, aunque lleguen inscripciones simultáneas
  constraint cursos_cupo check (inscritos between 0 and cupo_maximo),
  constraint cursos_modalidad_presencial check (modalidad <> 'presencial' or ciudad is not null)
);

create index cursos_instructor_idx on public.cursos (instructor_id);
create index cursos_busqueda_idx on public.cursos (estado, categoria_id, ciudad);
create index cursos_titulo_trgm_idx on public.cursos using gin (titulo extensions.gin_trgm_ops);

create trigger cursos_set_actualizado_en
  before update on public.cursos
  for each row execute function public.set_actualizado_en();

create table public.inscripciones (
  id             uuid primary key default gen_random_uuid(),
  curso_id       uuid not null references public.cursos (id),
  cliente_id     uuid not null references public.perfiles (id),
  -- 'baja': la solicitó el alumno; 'cancelada': el curso fue cancelado (RN-15)
  estado         text not null default 'pendiente_pago'
    check (estado in ('pendiente_pago', 'confirmada', 'baja', 'cancelada')),
  confirmada_en  timestamptz,
  baja_en        timestamptz,
  motivo_baja    text,
  creado_en      timestamptz not null default now(),
  actualizado_en timestamptz not null default now()
);

-- Una sola inscripción vigente por alumno y curso (RNF-09)
create unique index inscripciones_vigente_idx
  on public.inscripciones (curso_id, cliente_id)
  where estado in ('pendiente_pago', 'confirmada');
create index inscripciones_cliente_idx on public.inscripciones (cliente_id, creado_en desc);

create trigger inscripciones_set_actualizado_en
  before update on public.inscripciones
  for each row execute function public.set_actualizado_en();

alter table public.instructores enable row level security;
alter table public.cursos enable row level security;
alter table public.inscripciones enable row level security;
