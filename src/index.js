// ✅ /src/index.js – Versión definitiva (CORS fix + Railway + OPTIONS global)

require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const clientRoutes = require('./routes/clientRoutes');
const visitRoutes = require('./routes/visitRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const reportRoutes = require('./routes/reportRoutes');

const app = express();

// --- CONFIGURACIÓN DE CORS ---
const allowedOrigins = [
  'https://proye-front-production2.up.railway.app',
  'http://localhost:3000'
];

// CORS como middleware GLOBAL antes de todo
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // ✅ Responder manualmente las peticiones OPTIONS (preflight)
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// --- MIDDLEWARES GLOBALES ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- RUTAS DE LA API ---
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'API running on Railway 🚀' });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/visits', visitRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/reports', reportRoutes);

// --- RUTA 404 ---
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl
  });
});

// --- INICIAR SERVIDOR ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Backend corriendo en puerto ${PORT}`);
  console.log(`🌍 CORS permitido para: ${allowedOrigins.join(', ')}`);
});
