# backend/ — API HeldMe! (Luis Ángel, backend)

API Node.js + Express sobre `/api/v1`. Concentra validaciones, reglas de negocio
(RN-01 a RN-15) y las integraciones con Gemini y Stripe Test Mode.
Las claves privadas **nunca** van en las apps cliente (ARQ-03).

## Pila

- Node.js + Express
- Supabase (Auth, Storage, Realtime, PostgreSQL)
- Gemini API (con fallback a búsqueda convencional, RNF-06)
- Stripe **Test Mode** (preautorización/captura manual, webhooks)

## Estructura

```
backend/
├── package.json
├── .env.example          # Plantilla; el .env real NUNCA se sube
└── src/
    ├── index.js          # Servidor Express
    ├── config/           # Variables de entorno y clientes (supabase, stripe, gemini)
    ├── middlewares/      # JWT (RNF-01), roles/propiedad (RNF-02), paginación 20 (RNF-10), errores (RNF-09)
    ├── routes/           # Rutas por módulo según docs/endpoints-esquema.pdf
    ├── services/         # Reglas de negocio, comisiones (RN-11), códigos, Gemini, Stripe
    └── tests/            # Iñaki — pruebas automatizadas
```

## Rutas (resumen — detalle completo en docs/endpoints-esquema.pdf)

- **Base:** `/api/v1`. Todo requiere JWT salvo `/auth/registro`, login y `/webhooks/stripe`.
- **Listados:** máximo 20 elementos por página (RNF-10).
- **Roles:** `cliente`, `profesionista`, `admin`. `/admin/*` solo Administrador General.

## Comandos

```bash
npm install
npm run dev        # desarrollo con recarga
npm start          # producción
npm test           # pruebas de Iñaki (backend/src/tests)
```

## Webhooks en local

```bash
stripe listen --forward-to localhost:3000/api/v1/webhooks/stripe
```
