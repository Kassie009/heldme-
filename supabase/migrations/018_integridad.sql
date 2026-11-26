-- 018_integridad.sql
-- Tablas: transiciones_contratacion. Restricciones y triggers sobre tablas existentes
-- Referencias: RF-02, RF-03, RF-04, RF-17, RF-20, RF-23, RF-24, RF-26, RN-03, RN-12, RN-14
-- Criterios de aceptación que la base de datos hace cumplir aunque el backend tenga un error.

-- ---------------------------------------------------------------------------
-- 1. Las partes (cliente y profesionista) son las mismas a lo largo del flujo.
--    Las políticas RLS se apoyan en estas columnas, así que no pueden desalinearse.
-- ---------------------------------------------------------------------------
alter table public.necesidades
  add constraint necesidades_id_cliente_key unique (id, cliente_id);

alter table public.cotizaciones
  add constraint cotizaciones_partes_key unique (id, cliente_id, profesionista_id);
alter table public.cotizaciones
  add constraint cotizaciones_cliente_necesidad_fk
  foreign key (necesidad_id, cliente_id) references public.necesidades (id, cliente_id);

alter table public.cotizacion_versiones
  add constraint cotizacion_versiones_id_cotizacion_key unique (id, cotizacion_id);

alter table public.contrataciones
  add constraint contrataciones_partes_key unique (id, cliente_id, profesionista_id);
alter table public.contrataciones
  add constraint contrataciones_partes_fk
  foreign key (cotizacion_id, cliente_id, profesionista_id)
  references public.cotizaciones (id, cliente_id, profesionista_id);
-- La versión aceptada pertenece a la cotización contratada
alter table public.contrataciones
  add constraint contrataciones_version_fk
  foreign key (version_aceptada_id, cotizacion_id)
  references public.cotizacion_versiones (id, cotizacion_id);

alter table public.calificaciones
  add constraint calificaciones_partes_fk
  foreign key (contratacion_id, cliente_id, profesionista_id)
  references public.contrataciones (id, cliente_id, profesionista_id);

-- En pagos de curso contratacion_id es null y la llave no se evalúa
alter table public.pagos_prueba
  add constraint pagos_prueba_partes_fk
  foreign key (contratacion_id, cliente_id, profesionista_id)
  references public.contrataciones (id, cliente_id, profesionista_id);

alter table public.conversaciones
  add constraint conversaciones_partes_cotizacion_fk
  foreign key (cotizacion_id, cliente_id, profesionista_id)
  references public.cotizaciones (id, cliente_id, profesionista_id);
alter table public.conversaciones
  add constraint conversaciones_partes_contratacion_fk
  foreign key (contratacion_id, cliente_id, profesionista_id)
  references public.contrataciones (id, cliente_id, profesionista_id);
alter table public.conversaciones
  add constraint conversaciones_cliente_necesidad_fk
  foreign key (necesidad_id, cliente_id) references public.necesidades (id, cliente_id);

-- ---------------------------------------------------------------------------
-- 2. Tipo de cuenta exclusivo (RN-12, RF-02): un cliente no cotiza ni publica servicios y
--    un profesionista no contrata ni se inscribe a cursos.
--    Uso: execute function exigir_tipo_cuenta('<columna con el perfil>', '<tipo requerido>')
-- ---------------------------------------------------------------------------
create or replace function public.exigir_tipo_cuenta()
returns trigger
language plpgsql
as $$
declare
  v_perfil_id uuid := (to_jsonb(new) ->> tg_argv[0])::uuid;
  v_tipo text;
begin
  select tipo_cuenta into v_tipo from public.perfiles where id = v_perfil_id;
  if v_tipo is distinct from tg_argv[1] then
    raise exception 'Esta operación en % requiere una cuenta de tipo % (RN-12)', tg_table_name, tg_argv[1];
  end if;
  return new;
end;
$$;

create trigger profesionistas_tipo_cuenta
  before insert on public.profesionistas
  for each row execute function public.exigir_tipo_cuenta('id', 'profesionista');

create trigger necesidades_tipo_cuenta
  before insert or update of cliente_id on public.necesidades
  for each row execute function public.exigir_tipo_cuenta('cliente_id', 'cliente');

create trigger cotizaciones_tipo_cuenta
  before insert or update of cliente_id on public.cotizaciones
  for each row execute function public.exigir_tipo_cuenta('cliente_id', 'cliente');

create trigger conversaciones_tipo_cuenta
  before insert or update of cliente_id on public.conversaciones
  for each row execute function public.exigir_tipo_cuenta('cliente_id', 'cliente');

create trigger inscripciones_tipo_cuenta
  before insert or update of cliente_id on public.inscripciones
  for each row execute function public.exigir_tipo_cuenta('cliente_id', 'cliente');

-- ---------------------------------------------------------------------------
-- 3. Verificación profesional (RF-03, RF-04)
-- ---------------------------------------------------------------------------
-- Toda decisión administrativa lleva responsable y fecha; rechazar o pedir información exige motivo
alter table public.solicitudes_verificacion
  add constraint solicitudes_verificacion_decision check (
    estado not in ('aprobado', 'rechazado', 'requiere_informacion', 'suspendido')
    or (revisado_por is not null and revisado_en is not null)
  );
alter table public.solicitudes_verificacion
  add constraint solicitudes_verificacion_motivo check (
    estado not in ('rechazado', 'requiere_informacion', 'suspendido') or motivo_decision is not null
  );

-- RF-03: no se envía la solicitud sin al menos una evidencia
create or replace function public.validar_envio_solicitud()
returns trigger
language plpgsql
as $$
begin
  if new.estado = 'pendiente' and (tg_op = 'INSERT' or old.estado <> 'pendiente') then
    if not exists (
      select 1 from public.archivos_verificacion
      where solicitud_id = new.id and tipo = 'evidencia'
    ) then
      raise exception 'La solicitud de verificación requiere al menos una evidencia (RF-03)';
    end if;
    new.enviada_en := now();
  end if;
  return new;
end;
$$;

create trigger solicitudes_verificacion_validar_envio
  before insert or update of estado on public.solicitudes_verificacion
  for each row execute function public.validar_envio_solicitud();

-- RF-04: cada cambio de estado queda en el historial y se refleja en el perfil profesional
create or replace function public.registrar_cambio_solicitud()
returns trigger
language plpgsql
as $$
declare
  v_decision boolean := new.estado in ('aprobado', 'rechazado', 'requiere_informacion', 'suspendido');
begin
  if tg_op = 'UPDATE' and new.estado = old.estado then
    return new;
  end if;

  insert into public.historial_verificacion (solicitud_id, estado_anterior, estado_nuevo, motivo, actor_id)
  values (
    new.id,
    case when tg_op = 'UPDATE' then old.estado end,
    new.estado,
    case when v_decision then new.motivo_decision end,
    case when v_decision then new.revisado_por else new.profesionista_id end
  );

  -- Un perfil ya aprobado o suspendido solo cambia por una decisión de aprobar o suspender: abrir
  -- otra solicitud (p. ej. para subir una licencia) o que se la rechacen no le quita la aprobación.
  update public.profesionistas
  set estado_verificacion = case
        when new.estado in ('aprobado', 'suspendido') or estado_verificacion not in ('aprobado', 'suspendido')
          then new.estado
        else estado_verificacion
      end,
      -- RN-04: Bronce salvo que el administrador asigne Plata
      rango_inicial = case
        when new.estado = 'aprobado' then coalesce(new.rango_asignado, rango_inicial, 'bronce')
        else rango_inicial
      end,
      aprobado_en = case when new.estado = 'aprobado' then coalesce(aprobado_en, now()) else aprobado_en end
  where id = new.profesionista_id;

  return new;
end;
$$;

create trigger solicitudes_verificacion_registrar_cambio
  after insert or update of estado on public.solicitudes_verificacion
  for each row execute function public.registrar_cambio_solicitud();

-- ---------------------------------------------------------------------------
-- 4. Publicación de servicios (RF-04, RF-26, RN-03) y de cursos (RF-23, RF-24, RN-14)
-- ---------------------------------------------------------------------------
create or replace function public.validar_publicacion_servicio()
returns trigger
language plpgsql
as $$
begin
  if new.estado <> 'publicado' then
    return new;
  end if;

  if not exists (
    select 1
    from public.profesionistas p
    join public.perfiles f on f.id = p.id
    where p.id = new.profesionista_id
      and p.estado_verificacion = 'aprobado'
      and f.estado_cuenta = 'activa'
  ) then
    raise exception 'Solo un profesionista aprobado y con cuenta activa puede publicar servicios (RF-04, RF-26)';
  end if;

  if exists (select 1 from public.categorias where id = new.categoria_id and requiere_licencia)
     and not exists (
       select 1
       from public.archivos_verificacion a
       join public.solicitudes_verificacion s on s.id = a.solicitud_id
       where a.id = new.licencia_archivo_id
         and a.tipo = 'licencia'
         and a.estado_revision = 'aprobado'
         and s.profesionista_id = new.profesionista_id
     ) then
    raise exception 'Esta categoría es una actividad regulada: se requiere una licencia aprobada antes de publicar (RN-03)';
  end if;

  return new;
end;
$$;

create trigger servicios_validar_publicacion
  before insert or update of estado, categoria_id, licencia_archivo_id on public.servicios
  for each row execute function public.validar_publicacion_servicio();

create or replace function public.validar_publicacion_curso()
returns trigger
language plpgsql
as $$
begin
  if new.estado <> 'publicado' or (tg_op = 'UPDATE' and old.estado = 'publicado') then
    return new;
  end if;

  if tg_op = 'INSERT' or old.estado not in ('aprobado', 'pausado') then
    raise exception 'Un curso solo puede publicarse después de que el administrador lo apruebe (RF-23)';
  end if;

  if not exists (select 1 from public.instructores where id = new.instructor_id and estado = 'aprobado') then
    raise exception 'El instructor no está autorizado para publicar cursos (RF-23, RN-14)';
  end if;

  if new.modalidad = 'en_linea'
     and not exists (select 1 from public.curso_accesos where curso_id = new.id) then
    raise exception 'Un curso en línea necesita su enlace externo antes de publicarse (RF-24)';
  end if;

  return new;
end;
$$;

create trigger cursos_validar_publicacion
  before insert or update of estado on public.cursos
  for each row execute function public.validar_publicacion_curso();

-- ---------------------------------------------------------------------------
-- 5. Transiciones válidas de una contratación (RF-17).
--    Están en una tabla para que el equipo pueda ajustarlas sin tocar código.
-- ---------------------------------------------------------------------------
create table public.transiciones_contratacion (
  estado_origen  text not null,
  estado_destino text not null,
  descripcion    text not null,
  primary key (estado_origen, estado_destino)
);

insert into public.transiciones_contratacion (estado_origen, estado_destino, descripcion) values
  ('contratado', 'en_proceso', 'El profesionista valida el código de inicio (RF-29)'),
  ('contratado', 'cancelado', 'Cancelación antes del inicio; se cancela la preautorización (RN-15)'),
  ('contratado', 'en_revision_administrativa', 'Reporte de inasistencia o disputa antes del inicio (RF-30)'),
  ('en_proceso', 'pendiente_ajuste', 'Trabajo adicional en espera de la autorización del cliente (RF-16)'),
  ('en_proceso', 'pendiente_confirmacion', 'El profesionista marca el servicio como realizado; se genera el segundo código (RF-20)'),
  ('en_proceso', 'en_revision_administrativa', 'Cancelación después del inicio o disputa (RN-15, RF-34)'),
  ('pendiente_ajuste', 'en_proceso', 'El cliente acepta o rechaza el trabajo adicional'),
  ('pendiente_ajuste', 'en_revision_administrativa', 'Disputa sobre el trabajo adicional (RF-34)'),
  ('pendiente_confirmacion', 'finalizado', 'Se valida el código de finalización y se captura el pago (RN-08)'),
  ('pendiente_confirmacion', 'en_revision_administrativa', 'El código venció o el profesionista pide revisión (RF-34)'),
  ('en_revision_administrativa', 'finalizado', 'El administrador resuelve capturar total o parcialmente (RN-15)'),
  ('en_revision_administrativa', 'cancelado', 'El administrador resuelve cancelar la preautorización (RN-15)'),
  ('en_revision_administrativa', 'contratado', 'El administrador rechaza el reporte y la cita sigue en pie'),
  ('en_revision_administrativa', 'en_proceso', 'El administrador rechaza el reporte y el servicio continúa')
on conflict (estado_origen, estado_destino) do nothing;

alter table public.transiciones_contratacion enable row level security;

create or replace function public.validar_transicion_contratacion()
returns trigger
language plpgsql
as $$
begin
  if tg_op = 'INSERT' then
    if new.estado <> 'contratado' then
      raise exception 'Una contratación nueva inicia en estado contratado (RF-17)';
    end if;
  elsif new.estado <> old.estado
        and not exists (
          select 1 from public.transiciones_contratacion
          where estado_origen = old.estado and estado_destino = new.estado
        ) then
    raise exception 'Transición de contratación no permitida: % -> % (RF-17)', old.estado, new.estado;
  end if;
  return new;
end;
$$;

create trigger contrataciones_validar_transicion
  before insert or update of estado on public.contrataciones
  for each row execute function public.validar_transicion_contratacion();

-- ---------------------------------------------------------------------------
-- 6. Calificaciones y mensajes
-- ---------------------------------------------------------------------------
-- RF-20: solo se califica un servicio confirmado
create or replace function public.validar_calificacion()
returns trigger
language plpgsql
as $$
begin
  if not exists (
    select 1 from public.contrataciones
    where id = new.contratacion_id and estado = 'finalizado'
  ) then
    raise exception 'Solo se puede calificar un servicio finalizado (RF-20)';
  end if;
  return new;
end;
$$;

create trigger calificaciones_validar
  before insert on public.calificaciones
  for each row execute function public.validar_calificacion();

-- Mantiene el orden de la bandeja de conversaciones. Es security definer porque quien envía
-- el mensaje desde la app no tiene permiso de modificar conversaciones.
create or replace function public.actualizar_ultimo_mensaje()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.conversaciones
  set ultimo_mensaje_en = new.creado_en
  where id = new.conversacion_id;
  return new;
end;
$$;

create trigger mensajes_actualizar_ultimo_mensaje
  after insert on public.mensajes
  for each row execute function public.actualizar_ultimo_mensaje();
