# Guía de la líder — Kassandra

Responsabilidades (según `docs/endpoints-esquema.pdf`): coordinar al equipo, revisar y
aprobar Pull Requests, mantener el SRS y la matriz de trazabilidad, sesiones de revisión
con asesores, vigilar la política de costo cero (ARQ-08, RNF-15) y que no haya secretos
en el repositorio (ARQ-03).

---

## A. Configuración única (hacer una sola vez, ~15 min)

### 1. Proteger la rama `main`
1. Entra a https://github.com/Kassie009/heldme-
2. **Settings → Branches → Add classic branch protection rule** (o "Add branch protection rule").
3. Branch name pattern: `main`
4. Activa:
   - ☑ **Require a pull request before merging**
   - ☑ Require approvals: **1** (tú)
   - ☑ (si aparece) Require conversation resolution before merging
5. **Save / Create**.

Resultado: nadie puede hacer push directo a `main`; todo pasa por PR que tú apruebas.

### 2. Invitar al equipo
1. **Settings → Collaborators → Add people**
2. Agrega por su usuario de GitHub a: Jorge, Jeshua, Luis Ángel e Iñaki.
3. Cada quien acepta la invitación desde su correo.

### 3. Crear el tablero del proyecto
1. Pestaña **Projects → New project (Board)**.
2. Columnas: `Backlog` · `En progreso` · `En revisión` · `Hecho`.
3. Crea una tarjeta por RF o bloque (ej. "RF-01 Registro"), asígnala al responsable
   y ponla en la etapa correspondiente (usa el plan de trabajo de 5 etapas del PDF).

### 4. Regla acordada con el equipo
- Rama de trabajo: `feature/RF-XX-descripcion` creada **desde `develop`**.
- PRs siempre **hacia `develop`**. `develop → main` solo tú, al completar cada etapa.

---

## B. Rutina de cada Pull Request (tu checklist de revisión)

Cuando alguien te pida revisión (te llega notificación en GitHub):

1. Abre el PR → pestaña **Files changed**.
2. Recorre esta checklist:
   - ☐ El PR menciona los **RF/RN** que implementa (y el caso de prueba de Iñaki si aplica).
   - ☐ **Sin secretos**: no hay `.env`, claves de Stripe/Gemini/Supabase, ni evidencias reales.
   - ☐ No se subieron `node_modules/`, respaldos ni APKs.
   - ☐ Si toca `supabase/`: las tablas nuevas tienen **RLS** (ARQ-04).
   - ☐ Si toca `backend/`: validación de rol y propiedad (RNF-02), paginación 20 (RNF-10).
   - ☐ Mensajes de error comprensibles (RNF-09).
3. Si algo falla: escribe el comentario, **Request changes** y regresa la tarjeta a "En progreso".
4. Si está bien: **Approve → Merge** (usa **Squash and merge** para historial limpio).
5. Mueve la tarjeta del tablero a **Hecho**.

> Tip: para probar localmente antes de aprobar:
> ```bash
> git fetch origin
> git checkout develop && git pull
> git checkout -b prueba-pr origin/feature/RF-XX-...
> # probar la parte que toca (backend: npm install && npm test)
> git checkout develop && git branch -D prueba-pr
> ```

### Merge de etapa: `develop → main`
Al cerrar cada etapa del plan de trabajo:
1. PR de `develop` hacia `main` con resumen de lo entregado.
2. Verifica que la app/pruebas pasen localmente.
3. Aprueba y haz merge. Esa versión queda como **entregable**.

---

## C. Rutina semanal (~30 min)

| Día | Tarea |
|---|---|
| Lunes | Revisar tablero: ¿qué avanzó? ¿qué está bloqueado? Dar seguimiento a dependencias (Jeshua → Luis Ángel → Jorge; Iñaki siempre en paralelo). |
| Constante | Revisar y aprobar PRs en cuanto entren (no acumular). |
| Viernes | Confirmar que Jeshua hizo el **respaldo manual** de la BD fuera del repo (RNF-11). |
| Viernes | Verificación anti-secretos: revisar commits de la semana; en el repo nadie debe subir `.env` ni claves. |
| Según agenda | Sesión de revisión del SRS con los asesores: registrar observaciones en `docs/actas/` y agendar la siguiente versión del documento. |

## D. Documentación a tu cargo

- `docs/matriz_trazabilidad.md` — actualízala cada vez que se apruebe un PR: enlaza RF ↔ RN ↔ caso de prueba ↔ PR.
- `docs/actas/` — minuta breve por sesión con asesores (fecha, asistentes, observaciones, acuerdos).
- `docs/decisiones.md` — decisiones técnicas importantes (ej. "usaremos X por costo cero").
- Mantener vigente la política de **costo cero**: si alguien propone un servicio de pago, se sustituye u omite (ARQ-06/ARQ-08).

## E. Entrega final

1. Matriz de trazabilidad completa (todas las filas con PR y caso de prueba).
2. Casos de prueba con **esperado vs. obtenido** en `docs/pruebas/`.
3. Prueba de restauración del respaldo hecha (RNF-11).
4. Tabla de firmas del SRS completada y presentada a los asesores.
