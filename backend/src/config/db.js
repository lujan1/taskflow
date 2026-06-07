const { Pool } = require('pg');
require('dotenv').config();

// Pool de conexiones a PostgreSQL usando variables de entorno
const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
});

// Alerta de diagnóstico: Nos avisa en la terminal si la conexión fue exitosa
pool.on('connect', () => {
    console.log('⚡ Conexión exitosa a la base de datos PostgreSQL');
});

// Alerta de diagnóstico: Evita que el servidor se caiga si la BD falla inesperadamente
pool.on('error', (err) => {
    console.error('❌ Error inesperado en el pool de PostgreSQL:', err.message);
});

module.exports = pool;