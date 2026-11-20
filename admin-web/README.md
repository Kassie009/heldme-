# admin-web/ — Panel del Administrador General (Jorge, frontend)

Aplicación web React **exclusiva** del Administrador General. Se ejecuta en local o en
hosting estático gratuito. Sin dominio propio (ARQ-08).

## Creación del proyecto

```bash
# Dentro de esta carpeta, cuando se inicie la app:
npm create vite@latest . -- --template react
npm install
npm run dev
```

## Alcance del panel

- Revisión de verificaciones profesionales con enlaces temporales a evidencias (RF-04, RNF-03).
- Autorización de instructores y aprobación de cursos (RF-23).
- Moderación de publicaciones, reportes y disputas (RF-26, RF-34).
- Sanciones y strikes (RF-31, RN-09), suspensión/reactivación de cuentas.
- Revisión de comprobantes de material (RF-41) y consulta de pagos e historial (RF-27, RF-38).

## Reglas de Jorge

- Solo la **anon key** de Supabase; toda decisión pasa por `/admin/*` de la API (ARQ-03, RNF-02).
- Compatibilidad objetivo: las dos versiones más recientes de Chrome y Edge (RNF-08); Firefox cuando sea compatible.
