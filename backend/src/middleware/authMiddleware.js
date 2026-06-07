const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    // Obtener el token del encabezado Authorization
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Extrae el "Token" de "Bearer Token"

    // Si no se envía un token en la petición
    if (!token) {
        return res.status(401).json({ message: 'Acceso denegado. Token requerido.' });
    }

    try {
        // Blindaje de consistencia: Si no encuentra JWT_SECRET en el .env, usa la misma clave alternativa
        const secretKey = process.env.JWT_SECRET || 'secret_key_alternativa_taskflow_2026';

        // Verificar y Decodificar el token con la clave correspondiente
        const decoded = jwt.verify(token, secretKey);
        
        // Guarda los datos decodificados del usuario (id, email) en el objeto request (req)
        req.user = decoded; 
        
        // Continuar con el siguiente middleware o controlador de la ruta
        return next(); 
        
    } catch (error) {
        console.error('❌ Error de validación de token en authMiddleware:', error.message);
        return res.status(403).json({ message: 'Token inválido o expirado.' });
    }
};

module.exports = authMiddleware;