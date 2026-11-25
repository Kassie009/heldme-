-- 017_curso_accesos.sql
-- Tablas: curso_accesos. Se elimina cursos.enlace_externo
-- Referencias: RF-24, RN-05

-- El enlace de un curso en línea solo debe verlo quien esté inscrito (RN-05). RLS protege filas,
-- no columnas, así que el enlace sale de cursos (catálogo visible) y pasa a una tabla propia.
create table public.curso_accesos (
  curso_id       uuid primary key references public.cursos (id) on delete cascade,
  enlace_externo text not null check (enlace_externo ~* '^https://'), -- p. ej. Google Meet o Zoom
  indicaciones   text, -- contraseña de la sala, materiales, etc.
  actualizado_en timestamptz not null default now()
);

create trigger curso_accesos_set_actualizado_en
  before update on public.curso_accesos
  for each row execute function public.set_actualizado_en();

insert into public.curso_accesos (curso_id, enlace_externo)
select id, enlace_externo
from public.cursos
where enlace_externo is not null;

alter table public.cursos drop column enlace_externo;

alter table public.curso_accesos enable row level security;
