# backend/src/services/

Lógica de negocio pura (librería reutilizable por las rutas).

- `rangos.js` — Bronce (0–4), Plata (5–19), Oro (20–49), Diamante (50+); ascenso con promedio ≥ 4.0; sin descenso salvo sanción (RN-04).
- `strikes.js` — advertencia, suspensión 48 h con penalización de rango, bloqueo con 3; caducidad a 6 meses (RN-09).
- `comisiones.js` — 10% sobre mano de obra + diagnóstico; material comprobado exento; sin comprobante cuenta como mano de obra; cursos 10% (RN-11, RF-40).
- `codigos.js` — códigos de inicio y finalización, un solo uso, vigencia 24 h (RF-20, RF-29, RN-08).
- `preautorizacion.js` — retención 48 h antes de citas > 5 días; captura al validar 2.º código; reembolsos simulados (RN-08, RN-15).
- `gemini.js` — interpretación de consultas; sin datos privados (RNF-14); fallback a búsqueda convencional (RF-11, RN-10).
- `historial.js` — registro de eventos con actor, fecha, acción y recurso (RF-27).
- `cursos.js` — elegibilidad Plata+, cupo, reembolsos 48 h (RN-05, RN-14, RN-15).
