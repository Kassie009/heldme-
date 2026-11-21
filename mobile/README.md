# mobile/ — App móvil HeldMe! (Jorge, frontend)

Expo + React Native. **Una sola app** para cliente y profesionista (RN-12, ARQ-02):
no existe portal web de trabajador; el profesionista hace todo desde la móvil.

## Creación del proyecto

```bash
# Dentro de esta carpeta, cuando se inicie la app:
npx create-expo-app@latest . --template blank
npx expo start          # probar con Expo Go
```

## Alcance de pantallas

### ✅ Implementadas (solo frontend, navegación visual)

| # | Pantalla | Archivo | Referencias SRS |
|---|---|---|---|
| 01 | Acceso y registro | `src/screens/AccesoRegistro.js` | RF-01, RF-02, RF-42 |
| 02 | Explorar servicios | `src/screens/ExplorarServicios.js` | RF-06, RF-07, RF-13 |
| 03 | Resultados de búsqueda inteligente | `src/screens/ResultadosBusqueda.js` | RF-08 a RF-11, RF-35 |
| 04 | Publicar una necesidad | `src/screens/PublicarNecesidad.js` | RF-12, ARQ-07, RNF-12 |

Identidad visual: `src/theme.js` (colores del Manual de identidad: navy `#102044`,
teal `#176B78`, fondo frío `#F4F7F8`, borde `#D8E1E5`). Componentes compartidos en
`src/ui.js` (botón primario teal, tarjeta blanca, chips, barra inferior).

Ejecutar:

```bash
npm install
npx expo start    # probar en Expo Go (teléfono) o tecla w para navegador
```

Las pantallas son estáticas: la navegación entre ellas es visual (`App.js` con
`useState`), sin react-navigation ni backend. Los formularios no envían datos.

## Alcance de pantallas (restantes, según mockups)

- Registro con fecha de nacimiento y aceptación de términos/privacidad (RF-42).
- Perfil y cambio de modo cliente/profesionista (RF-02).
- Solicitud de modo profesionista con evidencia obligatoria (RF-03).
- Búsqueda con IA y fallback convencional (RF-06..RF-11, RF-35).
- Publicar necesidades, cotizaciones, chat, códigos, calificaciones (RF-12..RF-21, RF-29).
- Panel del profesionista: servicios, solicitudes, cotizaciones, calendario, cursos (RF-39).

## Reglas de Jorge

- Solo usa la **anon key** de Supabase; toda operación sensible pasa por la API (ARQ-03).
- Validar archivos en cliente: JPG/JPEG/PNG/WebP ≤ 5 MB, PDF ≤ 10 MB (RNF-12).
- Suscribirse a Supabase Realtime para el chat (RNF-13).
- Mensajes de error comprensibles y reintentos sin duplicar (RNF-09).
- Mientras el backend no esté listo, trabajar con **datos simulados** (mocks).
