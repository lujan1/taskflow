const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Importación de enrutadores independientes
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const aiRoutes = require('./routes/aiRoutes'); // 🆕 ¡NUEVO: Importamos el puente de IA!

const app = express();
const PORT = process.env.PORT || 5000;

// ■■ Middlewares globales ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
app.use(cors()); // Permite peticiones cruzadas (CORS) desde tu frontend en React (puerto 5173)
app.use(express.json()); // Habilita la lectura y parseo automático de cuerpos JSON (req.body)

// ■■ Conexión y Registro de Rutas Modulares ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/ai', aiRoutes); // 🆕 ¡NUEVO: Registramos la ruta del motor de Python!

// ■■ Ruta de salud (Health Check) para diagnóstico rápido de estado ■■■■■■■■■■■■■
app.get('/health', (req, res) => {
    return res.json({ status: 'OK', message: 'TaskFlow API corriendo perfectamente.' });
});

// ■■ Middleware de control para capturar rutas / endpoints inexistentes (404) ■■
app.use((req, res) => {
    return res.status(404).json({ message: `La ruta solicitada [${req.method}] ${req.url} no existe en este servidor.` });
});

// ■■ Arrancar el servidor maestro ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
app.listen(PORT, () => {
    console.log(`🚀 Servidor backend corriendo con éxito en: http://localhost:${PORT}`);
});