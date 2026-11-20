# supabase/ — Base de datos HeldMe! (Jeshua, base de datos)

PostgreSQL en Supabase. Se usan Auth, Storage y Realtime según corresponda.
Todas las tablas expuestas llevan **RLS** (ARQ-04). Claves primarias `uuid`.

## Cómo aplicar migraciones

```bash
supabase link --project-ref TU-PROJECT-REF
supabase db push
```

## Migraciones (orden obligatorio)

| # | Archivo | Tablas | Referencias |
|---|---|---|---|
| 001 | `001_perfiles.sql` | perfiles, aceptaciones_legales | RF-42 |
| 002 | `002_profesionistas_verificacion.sql` | profesionistas, solicitudes_verificacion, archivos_verificacion, historial_verificacion | RF-03, RF-04, RN-02, RN-04 |
| 003 | `003_categorias_servicios.sql` | categorias, servicios | RF-05, RF-06, RN-03 |
| 004 | `004_necesidades_notificaciones.sql` | necesidades, notificaciones | RF-12, RF-13, ARQ-07 |
| 005 | `005_cotizaciones.sql` | cotizaciones, cotizacion_versiones, cotizacion_conceptos | RF-14..RF-16, RNF-07 |
| 006 | `006_contrataciones.sql` | contrataciones, preguntas_acuerdo, acuerdos, codigos_servicio | RF-17, RF-29, RF-32, RF-33, RN-08 |
| 007 | `007_disponibilidad.sql` | disponibilidad, reservas | RF-18 (exclusión contra empalmes) |
| 008 | `008_conversaciones.sql` | conversaciones, mensajes | RF-19, RNF-13 (Realtime) |
| 009 | `009_calificaciones.sql` | calificaciones, metricas_profesionista | RF-20, RF-21, RN-04 |
| 010 | `010_cursos.sql` | instructores, cursos, inscripciones | RF-22..RF-25, RN-05, RN-14 |
| 011 | `011_pagos.sql` | pagos_prueba, eventos_stripe, comisiones | RF-36..RF-38, RF-40, RN-11 |
| 012 | `012_faltas_disputas.sql` | reportes_inasistencia, strikes, disputas | RF-30, RF-31, RF-34, RN-09 |
| 013 | `013_historial_eventos.sql` | historial_eventos (solo INSERT) | RF-27 |

Cada migración incluye un encabezado con los RF/RN que cubre y una lista de pendientes.

## Storage (ARQ-05)

- Bucket **privado** `evidencias` — solo propietario y admin; URLs firmadas con expiración (RNF-03).
- Bucket **privado** `comprobantes` — solo partes de la contratación y admin (RF-41).
- Bucket **público** `publico` — imágenes de servicios y perfiles.

## Respaldo (RNF-11)

- Manual **semanal** y antes de cambios importantes de esquema.
- Los respaldos se guardan **fuera del repositorio** (están en .gitignore) con fecha en el nombre.
- Prueba de restauración al menos una vez al mes y antes de la entrega final.
