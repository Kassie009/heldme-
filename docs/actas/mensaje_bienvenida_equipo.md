# Mensaje de arranque para el equipo (enviado por WhatsApp/grupo)

> Copia para referencia histórica. Enviado al equipo el 20-11-2026.

---

📢 **¡Arrancamos HeldMe!** 🚀

Ya está listo el repositorio: https://github.com/Kassie009/heldme-

**1️⃣ Acepten la invitación** (les llegó correo de GitHub) y luego en su PC:

```
git clone https://github.com/Kassie009/heldme-.git
cd heldme-
git checkout develop          // siempre trabajan desde develop
git checkout -b feature/RF-XX-lo-que-hagan
```
*(reemplacen RF-XX por el requerimiento en el que trabajen, ej. `feature/RF-01-registro`)*

**2️⃣ Qué le toca a cada quien** (carpetas ya creadas con README de instrucciones):

- **Jeshua** → `supabase/` — empieza con la migración `001_perfiles.sql` (trae el checklist
  de tablas y recordatorios de RLS). Lee `supabase/README.md`.
- **Luis Ángel** → `backend/` — revisa `backend/src/index.js` y los READMEs de `routes/`,
  `middlewares/`, `services/`. Primero auth y middlewares.
- **Jorge** → `mobile/` y `admin-web/` — lee los READMEs de ambas carpetas; mientras el
  backend no esté, trabaja con datos simulados.
- **Iñaki** → `docs/pruebas/` — usa la `plantilla_caso_prueba.md` y empieza con los casos
  de RF-01 a RF-08 desde los criterios de aceptación del SRS.
- Todos: antes de programar, leer `docs/SRS_v3.3.pdf` (mínimo secciones 2.3 y 3.1) y
  `docs/endpoints-esquema.pdf`.

**3️⃣ Reglas de oro**
- ❌ Nada directo a `main` — está protegida, GitHub lo bloquea.
- ✅ Todo por **Pull Request** hacia `develop`, mencionando el RF/RN que implementa.
- ✅ Kassandra revisa y aprueba cada PR (y lo marca en Trello en "En revisión").
- ❌ **Jamás** subir `.env`, claves ni evidencias (ARQ-03).
- Los listados devuelven máximo 20 elementos (RNF-10); todos los importes son Stripe
  Test Mode.

**4️⃣ Documentos clave** (carpeta `docs/` del repo):
- `SRS_v3.3.pdf` — qué hay que construir.
- `endpoints-esquema.pdf` — endpoints y esquema de BD.
- `matriz_trazabilidad.md` — se llena entre todos.
