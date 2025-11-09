// ✅ Ruta: /src/index.js (Versión corregida para Railway y CORS)

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

app.use(cors({
  origin: (origin, callback) => {
    // Si la petición no tiene origen (como Postman) o viene de uno permitido
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`❌ CORS bloqueado para origen: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// --- MANEJO EXPLÍCITO DE OPTIONS (Preflight) ---
app.options('*', cors());

// --- MIDDLEWARES GLOBALES ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- RUTAS DE LA API ---
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'SkyNet API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/visits', visitRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/reports', reportRoutes);

// --- MANEJO DE RUTA 404 ---
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl
  });
});

// --- ARRANQUE DEL SERVIDOR ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Servidor corriendo en el puerto ${PORT}`);
  console.log(`🌍 CORS permitido para: ${allowedOrigins.join(', ')}`);
});
