# Decisiones técnicas del equipo (ADRs breves)

| Fecha | Decisión | Motivo / referencia |
|---|---|---|
| 20 nov 2026 | Monorepo con carpetas por rol (mobile/, backend/, admin-web/, supabase/) | Plan de trabajo del documento técnico |
| 20 nov 2026 | Navegación con pila simple en App.js (sin react-navigation) por ahora | Facilidad para el demo; se evaluará expo-router al conectar backend |
| 24 nov 2026 | Tipografía Plus Jakarta Sans vía @expo-google-fonts; colores muestreados del mockup (#0D2042, #176A78, #F6F9FA) | Manual de identidad + mockup v3.4 |
| 26 nov 2026 | **Los códigos de inicio y finalización son de 4 dígitos numéricos** (ej. 4827) | Mockup móvil 11 de 12; un solo uso y vigencia 24 h (RN-08). Backend debe generar 4 dígitos únicos por contratación |
| 26 nov 2026 | El perfil del profesionista muestra la sección de sanciones SOLO si hay faltas confirmadas (no es una pantalla separada; los dos estados del mockup son demo) | RF-30/RF-31, RN-09 |
| 26 nov 2026 | Sesiones simuladas en memoria (src/cuentas.js) mientras no hay backend; Supabase Auth las reemplazará | Instrucción de la líder para la etapa de frontend |
| 26 nov 2026 | El menú lateral se cierra deslizando a la izquierda o tocando el fondo | Mejora de usabilidad propuesta por la líder |
