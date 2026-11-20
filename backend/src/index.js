/**
 * HeldMe! — API principal (esqueleto inicial)
 * Responsable: Luis Ángel (backend)
 *
 * RNF-01: sesiones JWT con expiración máxima de 1 hora (Supabase Auth).
 * RNF-10: listados con máximo 20 elementos por página.
 * RNF-09: errores con mensajes comprensibles y sin duplicar operaciones.
 */
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' })); // RNF-12: límite de archivos en backend
app.use(morgan('dev'));

// Health check (para Render y para el equipo)
app.get('/api/v1/health', (_req, res) => {
  res.json({ ok: true, service: 'heldme-api', version: 'v1' });
});

// TODO (Luis Ángel): montar routers por módulo conforme a docs/endpoints-esquema.pdf
// app.use('/api/v1/auth', require('./routes/auth'));
// app.use('/api/v1/me', require('./routes/me'));
// app.use('/api/v1/profesionistas', require('./routes/profesionistas'));
// app.use('/api/v1/servicios', require('./routes/servicios'));
// app.use('/api/v1/busqueda', require('./routes/busqueda'));
// app.use('/api/v1/necesidades', require('./routes/necesidades'));
// app.use('/api/v1/cotizaciones', require('./routes/cotizaciones'));
// app.use('/api/v1/contrataciones', require('./routes/contrataciones'));
// app.use('/api/v1/conversaciones', require('./routes/conversaciones'));
// app.use('/api/v1/pagos', require('./routes/pagos'));
// app.use('/api/v1/cursos', require('./routes/cursos'));
// app.use('/api/v1/reportes-inasistencia', require('./routes/reportesInasistencia'));
// app.use('/api/v1/disputas', require('./routes/disputas'));
// app.use('/api/v1/admin', require('./routes/admin'));
// app.use('/api/v1/webhooks', require('./routes/webhooks')); // /webhooks/stripe sin JWT (RF-37)

// Manejador de errores central (RNF-09)
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({
    error: err.message || 'Error interno del servidor',
  });
});

app.listen(PORT, () => {
  console.log(`HeldMe! API escuchando en http://localhost:${PORT}/api/v1`);
});
