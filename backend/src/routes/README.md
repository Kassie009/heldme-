# backend/src/routes/

Rutas por módulo, conforme a `docs/endpoints-esquema.pdf`. Base: `/api/v1`.

| Archivo | Módulo | Referencias |
|---|---|---|
| `auth.js` | Registro (login/logout los gestiona Supabase Auth) | RF-01, RF-42 |
| `me.js` | Perfil y modo activo | RF-02, RN-12 |
| `profesionistas.js` | Solicitud de modo profesionista y archivos | RF-03, RF-04, RN-02 |
| `servicios.js` | Publicación y administración de servicios | RF-05, RN-03 |
| `busqueda.js` | Búsqueda, autocompletado, ortografía y IA con fallback | RF-06..RF-11, RF-35, RN-10 |
| `necesidades.js` | Necesidades y notificaciones | RF-12, RF-13 |
| `cotizaciones.js` | Cotizaciones, versiones y adicionales | RF-14..RF-16, RN-06, RN-07 |
| `contrataciones.js` | Estados, acuerdos, códigos, calificación, cancelación | RF-17, RF-20, RF-21, RF-29, RF-32, RF-33, RF-41 |
| `disponibilidad.js` | Horarios y reservas sin duplicados | RF-18 |
| `conversaciones.js` | Chat privado con Realtime | RF-19, RNF-13 |
| `pagos.js` | Pagos de prueba y desglose de comisión | RF-38, RF-40, RN-11 |
| `cursos.js` | Instructor, cursos e inscripciones | RF-22..RF-25, RN-05, RN-14 |
| `reportesInasistencia.js` | Reportes de inasistencia | RF-30, RF-31, RN-09 |
| `disputas.js` | Disputas de finalización | RF-34, RN-15 |
| `admin.js` | Verificaciones, moderación, sanciones, historial | RF-04, RF-23, RF-26, RF-27, RF-34 |
| `webhooks.js` | Stripe webhook (sin JWT, valida firma y deduplica) | RF-37 |
