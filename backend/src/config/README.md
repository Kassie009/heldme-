# backend/src/config/

Configuración central del backend.

Archivos previstos:
- `env.js` — lectura y validación de variables de entorno (falla rápido si falta alguna).
- `supabase.js` — cliente Supabase con `service_role` (solo backend, ARQ-03).
- `stripe.js` — cliente Stripe en **Test Mode** con captura manual (RN-08).
- `gemini.js` — cliente Gemini con límites, timeout y control de cuota (RN-10, RNF-06, RNF-14).
