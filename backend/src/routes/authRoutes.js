const router = require('express').Router();
const authController = require('../controllers/authController');

// Validación de seguridad para asegurar que todos los controladores se importaron correctamente
if (!authController || !authController.register || !authController.login || !authController.verifyPin || !authController.recoverPassword) {
    throw new Error('❌ Error crítico: Las funciones de autenticación o seguridad no se encontraron en authController.js');
}

const { register, login, verifyPin, recoverPassword } = authController;

// ■■ RUTAS DE AUTENTICACIÓN (Prefijo base: /api/auth) ■■■■■■■■■■■■■■■■■■■■■■■■■■■■

// POST /api/auth/register -> Registra un nuevo usuario con su PIN
router.post('/register', register); 

// POST /api/auth/login -> Valida credenciales básicas (Paso 1)
router.post('/login', login); 

// POST /api/auth/verify-pin -> Valida el PIN de 4 dígitos y entrega el JWT (Paso 2)
router.post('/verify-pin', verifyPin); 

// POST /api/auth/recover-password -> Restablece la contraseña de forma autónoma usando el PIN
router.post('/recover-password', recoverPassword); 

module.exports = router;