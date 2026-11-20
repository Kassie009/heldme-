# backend/src/tests/ — Pruebas automatizadas (Iñaki, tester)

Pruebas del backend con `node --test` (sin dependencias extra).

## Cobertura prioritaria

| Área | Referencia |
|---|---|
| Seguridad entre cuentas y roles | RNF-02, RNF-03 |
| Rechazo de token expirado | RNF-01 |
| Fallback de búsqueda al fallar Gemini (timeout/cuota/error) | RF-11, RNF-06 |
| Paginación de 20 sin omisiones ni duplicados | RNF-10 |
| Reintentos sin duplicar cotizaciones, inscripciones ni pagos | RNF-09 |
| Cálculo de comisión (ej. SRS: $500 + $1,000 comprobado + $200 sin comprobante → $70) | RF-40, RN-11 |
| Códigos de un solo uso con vigencia 24 h | RF-20, RF-29, RN-08 |
| Webhooks: firma válida actualiza; inválidos/duplicados no | RF-37 |

Formato de resultados documentados en `docs/pruebas/` (esperado vs. obtenido).
