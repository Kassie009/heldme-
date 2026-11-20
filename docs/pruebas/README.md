# docs/pruebas/ — Casos de prueba (Iñaki, tester)

Casos de prueba derivados de los **criterios de aceptación** del SRS v3.3.
Se escriben **desde el inicio del proyecto**, no al final (plan de trabajo, etapa 1).

## Estructura

```
pruebas/
├── plantilla_caso_prueba.md   # Formato único para todos los casos
├── RF/                        # Un archivo por bloque funcional
│   ├── RF-01_a_08_cuenta_y_busqueda.md
│   ├── RF-09_a_21_necesidades_cotizaciones.md
│   ├── RF-22_a_41_cursos_pagos.md
│   └── ...
├── RNF/                       # Requerimientos no funcionales
│   ├── RNF-02_seguridad_roles.md
│   ├── RNF-05_rendimiento_busqueda.md
│   └── ...
└── resultados/                # Ejecuciones fechadas (esperado vs. obtenido)
```

## Cobertura obligatoria (según el documento técnico)

- Pruebas **entre cuentas y roles** — RNF-02, RNF-03 (una cuenta no puede leer archivos de terceros).
- **Rendimiento de búsqueda** — RNF-05: ≤ 3 s con 1,000 publicaciones.
- **Simulación de fallos de Gemini** — RNF-06: timeout, cuota agotada, error → búsqueda convencional disponible.
- **Usabilidad** — RNF-04: 3 personas sin experiencia completan flujos de cliente y profesionista.
- **Compatibilidad** — RNF-08: Android 10+, iOS 15+ (iPhone físico con Expo Go), Chrome y Edge.
- **Reintentos sin duplicados** — RNF-09: no duplicar cotizaciones, inscripciones ni pagos.
