import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes/index.js'; // Ajusta la ruta a tu archivo de rutas

dotenv.config();

const app = express();

// ✅ Configuración CORS personalizada
const allowedOrigins = [
  'https://proye-front-production2.up.railway.app',
  'http://localhost:3000'
];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');

  // ✅ Responde a las solicitudes preflight directamente
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  next();
});

app.use(express.json());

// ✅ Tus rutas
app.use('/api', routes);

// Ruta raíz opcional
app.get('/', (req, res) => {
  res.send('Backend funcionando correctamente 🚀');
});

// Puerto Railway o local
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`✅ Servidor backend corriendo en el puerto ${PORT}`);
});
