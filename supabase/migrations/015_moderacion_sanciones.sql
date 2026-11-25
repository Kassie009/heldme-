-- 015_moderacion_sanciones.sql
-- Tablas: reportes_contenido, sanciones
-- Referencias: RF-26, RF-31, RN-09, RN-14

-- Reportes y reclamaciones sobre publicaciones, perfiles o mensajes (RF-26).
-- Las inasistencias se reportan en reportes_inasistencia.
create table public.reportes_contenido (
  id            uuid primary key default gen_random_uuid(),
  reportado_por uuid not null references public.perfiles (id),
  recurso_tipo  text not null check (recurso_tipo in ('servicio', 'curso', 'necesidad', 'perfil', 'mensaje', 'calificacion')),
  recurso_id    uuid not null,
  motivo        text not null
    check (motivo in ('contenido_inapropiado', 'informacion_falsa', 'fraude', 'acoso', 'actividad_sin_licencia', 'otro')),
  descripcion   text,
  estado        text not null default 'pendiente' check (estado in ('pendiente', 'en_revision', 'procedente', 'improcedente')),
  accion_tomada text, -- p. ej. 'servicio retirado', 'cuenta suspendida'
  revisado_por  uuid references public.perfiles (id),
  revisado_en   timestamptz,
  creado_en     timestamptz not null default now(),
  constraint reportes_contenido_revision check (
    estado not in ('procedente', 'improcedente') or (revisado_por is not null and revisado_en is not null)
  )
);

-- Un usuario no repite el mismo reporte mientras siga abierto (RNF-09)
create unique index reportes_contenido_abierto_idx
  on public.reportes_contenido (reportado_por, recurso_tipo, recurso_id)
  where estado in ('pendiente', 'en_revision');
create index reportes_contenido_estado_idx on public.reportes_contenido (estado, creado_en);
create index reportes_contenido_recurso_idx on public.reportes_contenido (recurso_tipo, recurso_id);

-- Historial de sanciones de cualquier cuenta (RN-09). El estado vigente se refleja en
-- perfiles (estado_cuenta, suspendida_hasta, bloqueo_solicitudes_hasta) y en metricas_profesionista.
create table public.sanciones (
  id            uuid primary key default gen_random_uuid(),
  perfil_id     uuid not null references public.perfiles (id),
  tipo          text not null
    check (tipo in (
      'advertencia',                  -- primer strike
      'suspension_48h',               -- segundo strike
      'penalizacion_rango',           -- segundo strike: se muestra un rango inferior
      'bloqueo_nuevos_servicios',     -- tercer strike: hasta que el administrador revise
      'bloqueo_solicitudes_24h',      -- cliente con cancelación injustificada o inasistencia
      'suspension_administrativa',    -- moderación (RF-26)
      'baja'                          -- eliminación de la cuenta
    )),
  motivo        text not null,
  strike_id     uuid references public.strikes (id),
  reporte_id    uuid references public.reportes_inasistencia (id),
  inicia_en     timestamptz not null default now(),
  termina_en    timestamptz, -- null = indefinida, hasta que se levante
  aplicada_por  uuid references public.perfiles (id), -- null = la aplicó el sistema
  levantada_en  timestamptz,
  levantada_por uuid references public.perfiles (id),
  creado_en     timestamptz not null default now(),
  constraint sanciones_periodo check (termina_en is null or termina_en > inicia_en)
);

create index sanciones_perfil_idx on public.sanciones (perfil_id, inicia_en desc);

alter table public.reportes_contenido enable row level security;
alter table public.sanciones enable row level security;
