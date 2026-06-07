const pool = require('../config/db'); // Asegúrate de que esta ruta coincida con donde guardaste el archivo db.js anterior
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// ■■ REGISTRO DE USUARIO ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
const register = async (req, res) => {
  // Extraemos tanto 'security_pin' como 'pin' para evitar caídas si cambia en el frontend
  const { name, email, password, security_pin, pin } = req.body;
  
  try {
    // Seleccionamos la variable que contenga el valor del PIN
    const rawPin = security_pin !== undefined ? security_pin : pin;

    // Validar rigurosamente transformando a String y limpiando espacios
    if (!rawPin || !/^\d{4}$/.test(rawPin.toString().trim())) {
      return res.status(400).json({ 
        message: 'El filtro de seguridad debe ser estrictamente un código de 4 dígitos numéricos.' 
      });
    }

    const cleanPin = rawPin.toString().trim();
    const normalizedEmail = email.toLowerCase().trim();

    // Verificar si el email ya existe
    const userExists = await pool.query(
      'SELECT id FROM users WHERE email = $1', 
      [normalizedEmail]
    );
    
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: 'El email ya está registrado.' });
    }

    // Encriptar la contraseña (10 = nivel de seguridad / salt rounds)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Encriptar el PIN de seguridad limpio y validado
    const hashedPin = await bcrypt.hash(cleanPin, 10);

    // Insertar el usuario incluyendo el security_pin en la base de datos
    const result = await pool.query(
      'INSERT INTO users (name, email, password, security_pin) VALUES ($1, $2, $3, $4) RETURNING id, name, email',
      [name, normalizedEmail, hashedPassword, hashedPin]
    );

    return res.status(201).json({
      message: 'Usuario registrado exitosamente. Guarde bien su PIN de 4 dígitos.',
      user: result.rows[0]
    });

  } catch (error) {
    console.error('❌ Error en el proceso de Registro:', error.message);
    return res.status(500).json({ message: 'Error del servidor.', error: error.message });
  }
};

// ■■ INICIO DE SESIÓN ■■■■■■■■■■■■■■■■■■■■■■■■■■Sign In■■■■■■■■■■■■■■■■■■■■■■■■■■
const login = async (req, res) => {
  const { email, password } = req.body;
  
  try {
    // Normalizar email a minúsculas
    const normalizedEmail = email.toLowerCase().trim();

    // Buscar el usuario por email
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1', 
      [normalizedEmail]
    );
    
    if (result.rows.length === 0) {
      return res.status(400).json({ message: 'Credenciales incorrectas.' });
    }

    const user = result.rows[0];

    // Comparar la contraseña ingresada con el hash guardado en la BD
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: 'Credenciales incorrectas.' });
    }

    // FILTRO DE SEGURIDAD INTERMEDIO:
    // Detenemos la entrega del token JWT. Solicitamos al frontend pasar a la pantalla del PIN.
    return res.json({
      message: 'Credenciales válidas. Introduzca su filtro de seguridad para continuar.',
      requirePin: true,
      email: user.email
    });

  } catch (error) {
    console.error('❌ Error en el proceso de Login:', error.message);
    return res.status(500).json({ message: 'Error del servidor.', error: error.message });
  }
};

// ■■ VERIFICACIÓN DEL FILTRO DE SEGURIDAD ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
const verifyPin = async (req, res) => {
  const { email, pin } = req.body;

  try {
    if (!pin) {
      return res.status(400).json({ message: 'El PIN de seguridad es requerido.' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [normalizedEmail]);

    if (result.rows.length === 0) {
      return res.status(400).json({ message: 'Sesión inválida o expirada.' });
    }

    const user = result.rows[0];

    // Verificar si el PIN ingresado coincide con el de la base de datos (tratado como string)
    const validPin = await bcrypt.compare(pin.toString().trim(), user.security_pin);
    if (!validPin) {
      return res.status(401).json({ message: 'Filtro de seguridad incorrecto. Acceso denegado.' });
    }

    // Salvador y Blindaje: Si no encuentra JWT_SECRET en el .env, usa una firma alternativa temporal
    const secretKey = process.env.JWT_SECRET || 'secret_key_alternativa_taskflow_2026';

    // Generar token JWT válido por 24 horas tras pasar el filtro de seguridad
    const token = jwt.sign(
      { id: user.id, email: user.email },
      secretKey,
      { expiresIn: '24h' }
    );

    return res.json({
      message: 'Inicio de sesión exitoso.',
      token,
      user: { id: user.id, name: user.name, email: user.email }
    });

  } catch (error) {
    console.error('❌ Error en la verificación de PIN:', error.message);
    return res.status(500).json({ message: 'Error del servidor.', error: error.message });
  }
};

// ■■ RECUPERACIÓN AUTÓNOMA DE CONTRASEÑA ■■■■■■■■■■■■■■■■■■■■■■■./auth/login■■■■■■■
const recoverPassword = async (req, res) => {
  const { email, pin, newPassword } = req.body;

  try {
    if (!email || !pin || !newPassword) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios para restablecer el acceso.' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Buscar si el usuario existe por email
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [normalizedEmail]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'El correo electrónico no se encuentra registrado.' });
    }

    const user = result.rows[0];

    // Validar el PIN de seguridad histórico asignado por el usuario (tratado como string)
    const validPin = await bcrypt.compare(pin.toString().trim(), user.security_pin);
    if (!validPin) {
      return res.status(401).json({ message: 'El código o PIN de seguridad es incorrecto. No se puede autorizar el cambio.' });
    }

    // Encriptar la nueva contraseña provista
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Actualizar la contraseña en la base de datos limpia
    await pool.query(
      'UPDATE users SET password = $1 WHERE id = $2',
      [hashedNewPassword, user.id]
    );

    return res.json({
      message: 'Contraseña actualizada con éxito de forma autónoma. Ya puede iniciar sesión.'
    });

  } catch (error) {
    console.error('❌ Error en el proceso de Recuperación autónoma:', error.message);
    return res.status(500).json({ message: 'Error del servidor.', error: error.message });
  }
};

module.exports = { register, login, verifyPin, recoverPassword };