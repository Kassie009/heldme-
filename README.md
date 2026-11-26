# HeldMe!

Plataforma de servicios y cursos: aplicación móvil (Expo + React Native) para clientes y
profesionistas, aplicación web (React) para el Administrador General, API backend
(Node.js + Express), Supabase (PostgreSQL + Auth + Storage + Realtime), Gemini API y
Stripe **Test Mode**.

> Documento rector: `docs/SRS_v3.3.pdf` — Especificación de Requerimientos v3.3 (IEEE 830 simplificado).
> Documento técnico: `docs/endpoints-esquema.pdf` — Equipo, endpoints y esquema de base de datos.

> ℹ️ Los integrantes de la portada del SRS son los **dueños del proyecto**; el equipo que
> lo desarrolla es el que se lista abajo.

## Equipo y responsabilidades

| Integrante | Rol | Carpeta principal | Responsabilidades clave |
|---|---|---|---|
| **Kassandra** | Líder | `docs/`, GitHub | Coordinar al equipo, revisar y aprobar PRs, mantener el SRS y la matriz de trazabilidad, sesiones de revisión con asesores, política de costo cero (ARQ-08, RNF-15), cero secretos en el repo (ARQ-03). |
| **Jorge** | Frontend | `mobile/`, `admin-web/` | App móvil Expo + RN (cliente y profesionista) y app web React del Administrador General. Validación de archivos en cliente (RNF-12), consumo de la API, Realtime del chat (RNF-13), errores comprensibles (RNF-09). Solo usa la *anon key* de Supabase (ARQ-03). |
| **Luis Ángel** | Backend | `backend/` | API Node.js + Express: auth JWT, roles y propiedad, reglas de negocio (RN-01 a RN-15), integración Gemini con fallback (RN-10) y Stripe Test Mode, webhooks, paginación de 20 (RNF-10), validación de archivos (RNF-12), historial de acciones (RF-27). |
| **Jeshua** | Base de datos | `supabase/` | Migraciones 001–013, enums, RLS en todas las tablas expuestas (ARQ-04), buckets y políticas de Storage (ARQ-05), datos semilla (1,000 publicaciones para RNF-05), respaldos semanales y prueba de restauración mensual (RNF-11). |
| **Iñaki** | Tester | `docs/pruebas/`, `backend/src/tests/` | Casos de prueba por RF y RNF desde los criterios de aceptación del SRS (desde el inicio, no al final), pruebas entre cuentas y roles (RNF-02, RNF-03), rendimiento (RNF-05), simulación de fallos de Gemini (RNF-06), usabilidad con 3 personas (RNF-04), compatibilidad (RNF-08). |

## Flujo de trabajo en GitHub

- Ramas: `main` (estable, entregable), `develop` (integración), `feature/RF-XX-descripcion`.
- Ningún cambio entra a `main` sin **Pull Request aprobado por Kassandra**.
- Cada PR menciona los **RF o RN** que implementa y, si aplica, el caso de prueba de Iñaki.
- **Nunca** se suben `.env`, claves, evidencias reales ni respaldos (ARQ-03, ARQ-05, RNF-11).

## Dependencias entre roles

1. Jeshua entrega primero el esquema y las políticas RLS; sin eso nadie puede avanzar.
2. Luis Ángel construye los endpoints sobre ese esquema y publica las rutas con ejemplos de petición/respuesta.
3. Jorge consume los endpoints; mientras tanto trabaja con datos simulados.
4. Iñaki escribe los casos de prueba desde los criterios de aceptación del SRS desde el inicio.
5. Kassandra revisa cada PR y cierra el ciclo con la matriz de trazabilidad.

## Estructura del repositorio

```
heldme/
├── docs/                  # Kassandra — SRS, matriz, endpoints, sesiones de revisión
│   └── pruebas/           # Iñaki — casos de prueba (esperado vs. obtenido)
├── backend/               # Luis Ángel — API Node.js + Express (/api/v1)
│   └── src/
│       ├── config/        # Variables de entorno, clientes Supabase/Stripe/Gemini
│       ├── middlewares/   # JWT, roles, propiedad, paginación, errores
│       ├── routes/        # Rutas por módulo (ver docs/endpoints-esquema.pdf)
│       ├── services/      # Reglas de negocio RN-01..RN-15, Gemini, Stripe
│       └── tests/         # Iñaki — pruebas automatizadas del backend
├── mobile/                # Jorge — app Expo + React Native (cliente y profesionista)
├── admin-web/             # Jorge — panel React del Administrador General
└── supabase/
    ├── migrations/        # Jeshua — 001 a 013, con RLS
    └── seed/              # Datos semilla (1,000 publicaciones, RNF-05)
```

## Restricciones transversales

- **ARQ-08 / RNF-15:** costo cero. Planes gratuitos, Test Mode y ejecución local. Ninguna tarjeta registrada.
- **ARQ-03:** claves de Gemini, Stripe y Supabase (service role) solo en variables de entorno del backend. Nunca en el código de las apps.
- **ARQ-04:** RLS en todas las tablas expuestas + validaciones del backend.
- **ARQ-05:** evidencias en bucket privado; imágenes públicas en bucket `publico` separado.
- **ARQ-07:** zona aproximada declarada (ciudad/colonia/CP); sin GPS ni mapas.

## Servicios y entorno

- Backend: ejecución local o plan gratuito de Render (webhooks en local con Stripe CLI).
- Admin web: local o hosting estático gratuito.
- Móvil: Expo Go + compilaciones gratuitas de EAS; APK de prueba para Android.
