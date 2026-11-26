# mobile/ — App móvil HeldMe! (Jorge, frontend)

Expo + React Native. **Un solo tipo de cuenta por usuario** (cliente o profesionista,
elegido al registrarse y no cambiable — SRS v3.4). No existe portal web de trabajador.

## Ejecutar

```bash
npm install
npx expo start    # escanear QR con Expo Go, o tecla w para navegador
```

Si Expo Go marca error de sesión ("signed in as..."): hacer `npx expo login` con la
misma cuenta del teléfono, o cerrar sesión dentro de Expo Go.

## Pantallas implementadas (1-26 del mockup, solo frontend)

| # | Pantalla | Archivo |
|---|---|---|
| 1 | Tipo de cuenta (exclusivo, no cambiable) | `src/screens/TipoCuenta.js` |
| 2 | Iniciar sesión con selector de tipo | `src/screens/IniciarSesion.js` |
| 3 | Registro de cliente (+18, términos y privacidad) | `src/screens/RegistroCliente.js` |
| 4 | Registro profesionista (paso 1) | `src/screens/RegistroProfesionista.js` |
| 5 | Perfil y evidencia (paso 2, enviar a verificación) | `src/screens/PerfilProfesional.js` |
| 6 | Menú lateral (drawer por tipo de cuenta) | `src/screens/MenuLateral.js` |
| 7 | Buscar: autocompletado + ortografía | `src/screens/Buscar.js` |
| 8 | Resultados con orientación IA (solo registros reales) | `src/screens/ResultadosIA.js` |
| 9 | Cambiar categoría (sugerida por IA) | `src/screens/CambiarCategoria.js` |
| 10 | Sin resultados / búsqueda convencional | `src/screens/SinResultados.js` |
| 11 | Publicar necesidad (zona aproximada, sin GPS) | `src/screens/PublicarNecesidad.js` |
| 12 | Mis solicitudes (activas/anteriores) | `src/screens/MisSolicitudes.js` |
| 13 | Cotizaciones recibidas (comparar y seleccionar) | `src/screens/CotizacionesRecibidas.js` |
| 14 | Conversaciones (lista de chats) | `src/screens/Conversaciones.js` |
| 15 | Negociar por chat | `src/screens/Chat.js` |
| 16 | Acuerdos de materiales | `src/screens/AcuerdosServicio.js` |
| 17 | Contrataciones (activas, finalizadas, canceladas) | `src/screens/Contrataciones.js` |
| 18 | Contratación y códigos (inicio, fin, pago de prueba) | `src/screens/ContratacionDetalle.js` |
| 19 | Desglose del pago (plataforma, directo, comisión) | `src/screens/DesglosePago.js` |
| 20 | Pago no autorizado (tarjeta de prueba y reintento) | `src/screens/PagoNoAutorizado.js` |
| 21 | Trabajo adicional (versiones de cotización) | `src/screens/TrabajoAdicional.js` |
| 22 | Código de finalización (vigencia 24 h) | `src/screens/CodigoFinalizacion.js` |
| 23 | Calificar servicio (1 a 5 estrellas) | `src/screens/CalificarServicio.js` |
| 24 | Reportar inasistencia (explicación y evidencias) | `src/screens/ReportarInasistencia.js` |
| 25 | Cancelar contratación (regla 48 h) | `src/screens/CancelarContratacion.js` |
| 26 | Cursos (catálogo y modalidades) | `src/screens/Cursos.js` |

### Pantallas del profesionista (40-52 del mockup, págs. 9-11)

| # | Pantalla | Archivo |
|---|---|---|
| 40 | Mis cotizaciones (versiones y adicionales) | `src/profesionista/screens/MisCotizaciones.js` |
| 41 | Conversaciones / Chat (lista) | `src/profesionista/screens/Conversaciones.js` |
| 42 | Chat (conversación y tarjeta de cotización) | `src/profesionista/screens/ChatConversacion.js` |
| 43 | Iniciar servicio (código de inicio) | `src/profesionista/screens/IniciarServicio.js` |
| 44 | Finalizar servicio (comprobantes y código de fin) | `src/profesionista/screens/FinalizarServicio.js` |
| 45 | Solicitar revisión (sin segundo código) | `src/profesionista/screens/SolicitarRevision.js` |
| 46 | Desglose del pago (plataforma, directo, comisión) | `src/profesionista/screens/DesglosePago.js` |
| 47 | Cancelar contratación (regla 48 h y strike) | `src/profesionista/screens/CancelarContratacion.js` |
| 48 | Cursos · Autorización (rango mínimo Plata) | `src/profesionista/screens/CursosAutorizacion.js` |
| 49 | Nuevo curso (presencial / en línea, borrador y envío) | `src/profesionista/screens/NuevoCurso.js` |
| 50 | Mis cursos (publicados, cupo e inscritos) | `src/profesionista/screens/MisCursos.js` |
| 51 | Perfil y rango (calificación y verificación) | `src/profesionista/screens/PerfilProfesional.js` |
| 52 | Perfil con sanción (strikes, suspensión e historial) | `src/profesionista/screens/PerfilProfesional.js` |

- Identidad visual: `src/theme.js` (manual: navy `#102044`, teal `#176B78`, lienzo `#F4F7F8`).
- Componentes compartidos: `src/ui.js` (TopBar, botones, tarjetas, chips, menú) y `src/profesionista/components/`.
- Navegación: pila simple en `App.js` (push/back/reset/replace + drawer overlay) con adaptadores en `src/profesionista/rutas.js`.
  Los botones de atrás regresan a la pantalla anterior real.
- Pruebas unitarias del módulo profesionista: `npm test`.
- Todo es estático: los formularios validan en cliente pero no envían datos.

## Reglas de Jorge (frontend)

- Solo usa la **anon key** de Supabase; toda operación sensible pasa por la API (ARQ-03).
- Validar archivos en cliente: JPG/JPEG/PNG/WebP ≤ 5 MB, PDF ≤ 10 MB (RNF-12).
- Suscribirse a Supabase Realtime para el chat (RNF-13).
- Mensajes de error comprensibles y reintentos sin duplicar (RNF-09).
- Sin referencias RF/ARQ en los textos visibles de la app (van en comentarios y commits).
- Mientras el backend no esté listo, trabajar con datos simulados (mocks).

## Estado del mockup

Las 52 pantallas del mockup móvil (páginas 1 a 11) se encuentran implementadas en frontend con datos simulados.
