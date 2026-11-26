-- 020_rls.sql
-- Funciones auxiliares, permisos, vista perfiles_publicos y políticas RLS de todas las tablas
-- Referencias: ARQ-03, ARQ-04, RF-02, RF-19, RN-01, RN-05, RN-13, RNF-02, RNF-03, RNF-13
--
-- Modelo de acceso:
--   * La app móvil y la web del administrador (rol authenticated) solo LEEN lo que les corresponde.
--   * Toda escritura pasa por la API de Express con service_role, que concentra las validaciones.
--     Únicas excepciones: enviar mensajes de chat y marcar mensajes o notificaciones como leídos.
--   * El rol anon (sin sesión) solo puede leer los documentos legales, necesarios para registrarse.

-- ---------------------------------------------------------------------------
-- Funciones auxiliares. Son security definer para consultar sin pasar por RLS y así evitar
-- recursión entre políticas.
-- ---------------------------------------------------------------------------
create or replace function public.es_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.perfiles
    where id = (select auth.uid()) and tipo_cuenta = 'admin' and estado_cuenta = 'activa'
  );
$$;

create or replace function public.es_profesionista_aprobado()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profesionistas p
    join public.perfiles f on f.id = p.id
    where p.id = (select auth.uid())
      and p.estado_verificacion = 'aprobado'
      and f.estado_cuenta = 'activa'
  );
$$;

create or replace function public.es_instructor_del_curso(p_curso_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.cursos c
    join public.instructores i on i.id = c.instructor_id
    where c.id = p_curso_id and i.profesionista_id = (select auth.uid())
  );
$$;

create or replace function public.tiene_inscripcion(p_curso_id uuid, p_solo_confirmada boolean default false)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.inscripciones
    where curso_id = p_curso_id
      and cliente_id = (select auth.uid())
      and (not p_solo_confirmada or estado = 'confirmada')
  );
$$;

-- ---------------------------------------------------------------------------
-- Datos públicos de un perfil. perfiles guarda teléfono, fecha de nacimiento y sanciones, por eso
-- solo la ven su dueño y el administrador; para mostrar el nombre y la foto de la contraparte
-- se usa esta vista, que se ejecuta con los permisos de su propietario.
-- ---------------------------------------------------------------------------
create or replace view public.perfiles_publicos as
select id, tipo_cuenta, nombre, apellidos, foto_url, ciudad
from public.perfiles
where estado_cuenta <> 'eliminada';

-- ---------------------------------------------------------------------------
-- Permisos por rol
-- ---------------------------------------------------------------------------
revoke all on all tables in schema public from anon, authenticated;
grant select on all tables in schema public to authenticated;
grant select on public.documentos_legales to anon;

-- Chat: el cliente no puede fijar id, creado_en ni leido_en al enviar
grant insert (conversacion_id, remitente_id, contenido, adjunto_ruta) on public.mensajes to authenticated;
grant update (leido_en) on public.mensajes to authenticated;
grant update (leida_en) on public.notificaciones to authenticated;

-- ---------------------------------------------------------------------------
-- Cuentas y documentos legales
-- ---------------------------------------------------------------------------
create policy perfiles_select on public.perfiles
  for select to authenticated
  using (id = (select auth.uid()) or (select public.es_admin()));

create policy aceptaciones_legales_select on public.aceptaciones_legales
  for select to authenticated
  using (perfil_id = (select auth.uid()) or (select public.es_admin()));

create policy documentos_legales_select on public.documentos_legales
  for select to anon, authenticated
  using (true);

-- ---------------------------------------------------------------------------
-- Profesionistas y verificación (RN-13: la documentación de verificación es privada)
-- ---------------------------------------------------------------------------
create policy profesionistas_select on public.profesionistas
  for select to authenticated
  using (
    estado_verificacion = 'aprobado'
    or id = (select auth.uid())
    or (select public.es_admin())
  );

create policy solicitudes_verificacion_select on public.solicitudes_verificacion
  for select to authenticated
  using (profesionista_id = (select auth.uid()) or (select public.es_admin()));

-- Se ve el archivo si se puede ver su solicitud (la política de arriba se aplica a la subconsulta)
create policy archivos_verificacion_select on public.archivos_verificacion
  for select to authenticated
  using (exists (select 1 from public.solicitudes_verificacion s where s.id = solicitud_id));

create policy historial_verificacion_select on public.historial_verificacion
  for select to authenticated
  using (exists (select 1 from public.solicitudes_verificacion s where s.id = solicitud_id));

-- ---------------------------------------------------------------------------
-- Catálogo
-- ---------------------------------------------------------------------------
create policy categorias_select on public.categorias
  for select to authenticated
  using (true);

-- Un servicio publicado deja de verse si su profesionista pierde la aprobación (RF-05, RF-26)
create policy servicios_select on public.servicios
  for select to authenticated
  using (
    profesionista_id = (select auth.uid())
    or (select public.es_admin())
    or (
      estado = 'publicado'
      and exists (
        select 1 from public.profesionistas p
        where p.id = profesionista_id and p.estado_verificacion = 'aprobado'
      )
    )
  );

-- ---------------------------------------------------------------------------
-- Necesidades y notificaciones
-- ---------------------------------------------------------------------------
-- La ve su autor, los profesionistas aprobados mientras recibe cotizaciones (RF-12)
-- y, después, quienes cotizaron
create policy necesidades_select on public.necesidades
  for select to authenticated
  using (
    cliente_id = (select auth.uid())
    or (select public.es_admin())
    or (estado in ('publicado', 'en_cotizacion') and (select public.es_profesionista_aprobado()))
    or exists (
      select 1 from public.cotizaciones c
      where c.necesidad_id = necesidades.id and c.profesionista_id = (select auth.uid())
    )
  );

create policy notificaciones_select on public.notificaciones
  for select to authenticated
  using (destinatario_id = (select auth.uid()));

create policy notificaciones_marcar_leida on public.notificaciones
  for update to authenticated
  using (destinatario_id = (select auth.uid()))
  with check (destinatario_id = (select auth.uid()));

-- ---------------------------------------------------------------------------
-- Cotizaciones: el cliente no ve los borradores del profesionista
-- ---------------------------------------------------------------------------
create policy cotizaciones_select on public.cotizaciones
  for select to authenticated
  using (
    profesionista_id = (select auth.uid())
    or (cliente_id = (select auth.uid()) and estado <> 'borrador')
    or (select public.es_admin())
  );

create policy cotizacion_versiones_select on public.cotizacion_versiones
  for select to authenticated
  using (
    exists (
      select 1 from public.cotizaciones c
      where c.id = cotizacion_id
        and (cotizacion_versiones.estado <> 'borrador' or c.profesionista_id = (select auth.uid()))
    )
  );

-- Incluye el comprobante de material: visible para las partes y el administrador (RF-41)
create policy cotizacion_conceptos_select on public.cotizacion_conceptos
  for select to authenticated
  using (exists (select 1 from public.cotizacion_versiones v where v.id = version_id));

-- ---------------------------------------------------------------------------
-- Contrataciones
-- ---------------------------------------------------------------------------
create policy contrataciones_select on public.contrataciones
  for select to authenticated
  using (
    cliente_id = (select auth.uid())
    or profesionista_id = (select auth.uid())
    or (select public.es_admin())
  );

create policy preguntas_acuerdo_select on public.preguntas_acuerdo
  for select to authenticated
  using (true);

create policy transiciones_contratacion_select on public.transiciones_contratacion
  for select to authenticated
  using (true);

create policy acuerdos_select on public.acuerdos
  for select to authenticated
  using (exists (select 1 from public.contrataciones c where c.id = contratacion_id));

-- Los códigos solo los ve el cliente, que es quien los comparte; el profesionista
-- nunca los lee de la base de datos (RF-20, RF-29)
create policy codigos_servicio_select on public.codigos_servicio
  for select to authenticated
  using (
    (select public.es_admin())
    or exists (
      select 1 from public.contrataciones c
      where c.id = contratacion_id and c.cliente_id = (select auth.uid())
    )
  );

-- ---------------------------------------------------------------------------
-- Agenda
-- ---------------------------------------------------------------------------
create policy disponibilidad_select on public.disponibilidad
  for select to authenticated
  using (true);

create policy reservas_select on public.reservas
  for select to authenticated
  using (
    profesionista_id = (select auth.uid())
    or (select public.es_admin())
    or exists (select 1 from public.contrataciones c where c.id = contratacion_id)
  );

-- ---------------------------------------------------------------------------
-- Chat (RF-19). El administrador puede leer para revisar disputas (RF-34), pero no escribir.
-- ---------------------------------------------------------------------------
create policy conversaciones_select on public.conversaciones
  for select to authenticated
  using (
    cliente_id = (select auth.uid())
    or profesionista_id = (select auth.uid())
    or (select public.es_admin())
  );

create policy mensajes_select on public.mensajes
  for select to authenticated
  using (exists (select 1 from public.conversaciones c where c.id = conversacion_id));

create policy mensajes_enviar on public.mensajes
  for insert to authenticated
  with check (
    remitente_id = (select auth.uid())
    and exists (
      select 1 from public.conversaciones c
      where c.id = conversacion_id
        and (select auth.uid()) in (c.cliente_id, c.profesionista_id)
    )
  );

-- Solo quien recibe el mensaje lo marca como leído
create policy mensajes_marcar_leido on public.mensajes
  for update to authenticated
  using (
    remitente_id <> (select auth.uid())
    and exists (
      select 1 from public.conversaciones c
      where c.id = conversacion_id
        and (select auth.uid()) in (c.cliente_id, c.profesionista_id)
    )
  )
  with check (remitente_id <> (select auth.uid()));

-- ---------------------------------------------------------------------------
-- Reputación: es información pública dentro de la plataforma
-- ---------------------------------------------------------------------------
create policy calificaciones_select on public.calificaciones
  for select to authenticated
  using (true);

create policy metricas_profesionista_select on public.metricas_profesionista
  for select to authenticated
  using (true);

-- ---------------------------------------------------------------------------
-- Cursos
-- ---------------------------------------------------------------------------
create policy instructores_select on public.instructores
  for select to authenticated
  using (
    estado = 'aprobado'
    or profesionista_id = (select auth.uid())
    or (select public.es_admin())
  );

-- Un curso publicado deja de verse si su instructor es inhabilitado (RN-14).
-- Quien se inscribió sigue viendo el curso aunque se pause, finalice o cancele
create policy cursos_select on public.cursos
  for select to authenticated
  using (
    (
      estado = 'publicado'
      and exists (select 1 from public.instructores i where i.id = instructor_id and i.estado = 'aprobado')
    )
    or (select public.es_admin())
    or public.es_instructor_del_curso(id)
    or public.tiene_inscripcion(id)
  );

-- RN-05: el enlace solo es visible para los alumnos con inscripción confirmada
create policy curso_accesos_select on public.curso_accesos
  for select to authenticated
  using (
    (select public.es_admin())
    or public.es_instructor_del_curso(curso_id)
    or public.tiene_inscripcion(curso_id, true)
  );

create policy inscripciones_select on public.inscripciones
  for select to authenticated
  using (
    cliente_id = (select auth.uid())
    or (select public.es_admin())
    or public.es_instructor_del_curso(curso_id)
  );

-- ---------------------------------------------------------------------------
-- Pagos de prueba
-- ---------------------------------------------------------------------------
create policy pagos_prueba_select on public.pagos_prueba
  for select to authenticated
  using (
    cliente_id = (select auth.uid())
    or profesionista_id = (select auth.uid())
    or (select public.es_admin())
  );

create policy eventos_stripe_select on public.eventos_stripe
  for select to authenticated
  using ((select public.es_admin()));

create policy comisiones_select on public.comisiones
  for select to authenticated
  using (exists (select 1 from public.pagos_prueba p where p.id = pago_id));

-- ---------------------------------------------------------------------------
-- Faltas, disputas, moderación e historial
-- ---------------------------------------------------------------------------
create policy reportes_inasistencia_select on public.reportes_inasistencia
  for select to authenticated
  using (
    reportado_por = (select auth.uid())
    or reportado_id = (select auth.uid())
    or (select public.es_admin())
  );

create policy strikes_select on public.strikes
  for select to authenticated
  using (profesionista_id = (select auth.uid()) or (select public.es_admin()));

create policy disputas_select on public.disputas
  for select to authenticated
  using (exists (select 1 from public.contrataciones c where c.id = contratacion_id));

create policy reportes_contenido_select on public.reportes_contenido
  for select to authenticated
  using (reportado_por = (select auth.uid()) or (select public.es_admin()));

create policy sanciones_select on public.sanciones
  for select to authenticated
  using (perfil_id = (select auth.uid()) or (select public.es_admin()));

create policy consultas_ia_select on public.consultas_ia
  for select to authenticated
  using (usuario_id = (select auth.uid()) or (select public.es_admin()));

-- Cada quien consulta sus propias acciones y el historial de sus contrataciones (RF-27)
create policy historial_eventos_select on public.historial_eventos
  for select to authenticated
  using (
    (select public.es_admin())
    or actor_id = (select auth.uid())
    or (
      contratacion_id is not null
      and exists (select 1 from public.contrataciones c where c.id = contratacion_id)
    )
  );

-- Supabase Realtime: avisa en vivo de las notificaciones nuevas (RF-13)
do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    alter publication supabase_realtime add table public.notificaciones;
  end if;
end;
$$;
