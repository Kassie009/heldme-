-- 019_metricas_rangos.sql
-- Funciones y triggers sobre metricas_profesionista
-- Referencias: RF-21, RN-04, RN-09

-- El rango mostrado siempre se deriva del rango alcanzado y de la penalización (RN-09):
-- con penalización activa se muestra un nivel inferior; Bronce no desciende más.
create or replace function public.derivar_rango_mostrado()
returns trigger
language plpgsql
as $$
declare
  v_rangos constant text[] := array['bronce', 'plata', 'oro', 'diamante'];
begin
  new.rango_mostrado := v_rangos[
    greatest(array_position(v_rangos, new.rango) - (case when new.penalizacion_activa then 1 else 0 end), 1)
  ];
  return new;
end;
$$;

create trigger metricas_profesionista_rango_mostrado
  before insert or update on public.metricas_profesionista
  for each row execute function public.derivar_rango_mostrado();

-- Recalcula contador, promedio y rango de un profesionista (RF-21, RN-04)
create or replace function public.recalcular_metricas_profesionista(p_profesionista_id uuid)
returns void
language plpgsql
as $$
declare
  v_rangos constant text[] := array['bronce', 'plata', 'oro', 'diamante'];
  v_servicios integer;
  v_calificaciones integer;
  v_promedio numeric(3, 2);
  v_inicial text;
  v_actual text;
  v_por_servicios text;
begin
  select count(*) into v_servicios
  from public.contrataciones
  where profesionista_id = p_profesionista_id and estado = 'finalizado';

  select count(*), round(avg(estrellas), 2) into v_calificaciones, v_promedio
  from public.calificaciones
  where profesionista_id = p_profesionista_id;

  select coalesce(rango_inicial, 'bronce') into v_inicial
  from public.profesionistas
  where id = p_profesionista_id;

  insert into public.metricas_profesionista (profesionista_id, rango)
  values (p_profesionista_id, v_inicial)
  on conflict (profesionista_id) do nothing;

  select rango into v_actual
  from public.metricas_profesionista
  where profesionista_id = p_profesionista_id
  for update;

  v_por_servicios := case
    when v_servicios >= 50 then 'diamante'
    when v_servicios >= 20 then 'oro'
    when v_servicios >= 5 then 'plata'
    else 'bronce'
  end;

  update public.metricas_profesionista
  set servicios_completados = v_servicios,
      total_calificaciones = v_calificaciones,
      calificacion_promedio = v_promedio,
      -- El rango nunca baja: se toma el mayor entre el actual, el inicial y el que corresponde por
      -- servicios. Este último solo cuenta con promedio de 4.0 o más; sin calificaciones todavía
      -- no hay promedio que bloquee el ascenso.
      rango = v_rangos[greatest(
        array_position(v_rangos, v_actual),
        array_position(v_rangos, v_inicial),
        case
          when v_promedio is null or v_promedio >= 4.0 then array_position(v_rangos, v_por_servicios)
          else 1
        end
      )]
  where profesionista_id = p_profesionista_id;
end;
$$;

-- Al aprobarse la verificación se crean las métricas con el rango inicial
create or replace function public.metricas_al_aprobar_profesionista()
returns trigger
language plpgsql
as $$
begin
  perform public.recalcular_metricas_profesionista(new.id);
  return new;
end;
$$;

create trigger profesionistas_metricas_al_aprobar
  after update of estado_verificacion, rango_inicial on public.profesionistas
  for each row
  when (new.estado_verificacion = 'aprobado')
  execute function public.metricas_al_aprobar_profesionista();

-- Cada servicio finalizado cuenta para el rango y para levantar la penalización (RN-09)
create or replace function public.metricas_al_finalizar_contratacion()
returns trigger
language plpgsql
as $$
begin
  update public.metricas_profesionista
  set penalizacion_servicios_restantes = greatest(penalizacion_servicios_restantes - 1, 0),
      penalizacion_activa = penalizacion_servicios_restantes > 1
  where profesionista_id = new.profesionista_id and penalizacion_activa;

  perform public.recalcular_metricas_profesionista(new.profesionista_id);
  return new;
end;
$$;

create trigger contrataciones_metricas_al_finalizar
  after update of estado on public.contrataciones
  for each row
  when (new.estado = 'finalizado' and old.estado <> 'finalizado')
  execute function public.metricas_al_finalizar_contratacion();

create or replace function public.metricas_al_calificar()
returns trigger
language plpgsql
as $$
begin
  perform public.recalcular_metricas_profesionista(new.profesionista_id);
  return new;
end;
$$;

create trigger calificaciones_metricas
  after insert on public.calificaciones
  for each row execute function public.metricas_al_calificar();
