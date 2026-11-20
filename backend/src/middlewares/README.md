# backend/src/middlewares/

Middlewares previstos:
- `auth.js` — verificación de JWT de Supabase; rechaza token expirado (RNF-01).
- `roles.js` — validación de rol (`cliente`, `profesionista`, `admin`) y propiedad (RNF-02, RN-01).
- `paginacion.js` — máximo 20 elementos por página (RNF-10).
- `validarArchivo.js` — JPG/JPEG/PNG/WebP ≤ 5 MB, PDF ≤ 10 MB (RNF-12).
- `errores.js` — mensajes comprensibles; reintentos sin duplicar operaciones (RNF-09).
