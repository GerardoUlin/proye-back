// Ruta: /proye-back/src/index.js (Versión Final con CORS funcional en Railway)

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


// --- CONFIGURACIÓN DE CORS CONTROLADA Y FUNCIONAL ---
const allowedOrigins = [
  'https://proye-front-production2.up.railway.app', // 🌐 Frontend desplegado
  'http://localhost:5173' // 💻 Desarrollo local (Vite)
];

app.use(cors({
  origin: function (origin, callback) {
    // Permitir solicitudes sin origen (por ejemplo, desde curl o Postman)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      console.log('✅ CORS permitido para:', origin);
      return callback(null, true);
    }

    console.log('🚫 Bloqueado por CORS:', origin);
    return callback(new Error('CORS no permitido para este origen: ' + origin));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Manejo de preflight requests (requerido para Chrome)
app.options('*', cors());


// --- MIDDLEWARES GLOBALES ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- RUTAS DE LA API ---
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'SkyNet API is running' });
});

app.get('/api', (req, res) => {
  res.json({ message: 'API de SkyNet está funcionando correctamente.' });
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
const PORT = Number(process.env.PORT) || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});
