import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [pin, setPin] = useState(''); // Guarda el código de 4 dígitos
  const [showPinField, setShowPinField] = useState(false); // Controla el cambio de pantalla del paso 2
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Bloqueo de envíos múltiples
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Manejador del Paso 1: Validar Email y Contraseña tradicionales
  const handleSubmitCredentials = async (e) => {
    e.preventDefault();
    setError('');

    // Validación local básica preventiva
    if (!form.email.trim() || !form.password) {
      setError('Por favor, completa todos los campos.');
      return;
    }

    setLoading(true);

    try {
      // Normalizamos el email a minúsculas para coincidir exactamente con la base de datos de PostgreSQL
      const payload = {
        email: form.email.toLowerCase().trim(),
        password: form.password
      };

      // Petición HTTP directa al backend a través del cliente de Axios unificado
      const { data } = await API.post('/auth/login', payload);
      
      // FILTRO DE SEGURIDAD INTERMEDIO: Si el backend exige el código secreto de 4 dígitos
      if (data.requirePin) {
        setShowPinField(true);
      } else {
        // Fallback en caso de que un administrador entre de forma directa sin PIN
        login(data.user, data.token);
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('❌ Error durante el inicio de sesión:', err);
      setError(err.response?.data?.message || 'Credenciales incorrectas o error de conexión con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  // Manejador del Paso 2: Validar el Filtro de Seguridad (PIN de 4 dígitos)
  const handleSubmitPin = async (e) => {
    e.preventDefault();
    setError('');

    if (!/^\d{4}$/.test(pin)) {
      setError('El filtro de seguridad debe ser estrictamente de 4 números.');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        email: form.email.toLowerCase().trim(),
        pin: pin
      };

      // Petición al endpoint del filtro secundario que creamos en el backend
      const { data } = await API.post('/auth/verify-pin', payload);

      // Inyección de la sesión definitiva en el AuthContext (guarda token y datos del usuario)
      login(data.user, data.token);
      
      // Redirección directa y limpia al tablero de control (Dashboard)
      navigate('/dashboard');
    } catch (err) {
      console.error('❌ Error en filtro de seguridad:', err);
      setError(err.response?.data?.message || 'Filtro de seguridad incorrecto. Intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>TaskFlow</h1>
        
        {/* Renderizado condicional del título según el paso en el que se encuentre */}
        <h2>{!showPinField ? 'Iniciar Sesión' : 'Filtro de Seguridad'}</h2>
        
        {error && <p className="error-message">{error}</p>}
        
        {/* PASO 1: Formulario tradicional de email y contraseña */}
        {!showPinField ? (
          <form onSubmit={handleSubmitCredentials}>
            <input
              type="email"
              name="email"
              placeholder="Correo electrónico"
              value={form.email}
              onChange={handleChange}
              disabled={loading}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Contraseña"
              value={form.password}
              onChange={handleChange}
              disabled={loading}
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? 'Verificando...' : 'Entrar'}
            </button>
          </form>
        ) : (
          /* PASO 2: Formulario dinámico del Filtro de Seguridad de 4 dígitos */
          <form onSubmit={handleSubmitPin}>
            <p style={{ fontSize: '13px', color: '#646e82', textAlign: 'center', marginBottom: '15px' }}>
              Introduzca su código de seguridad de 4 dígitos para autorizar el acceso a su cuenta.
            </p>
            <input
              type="password"
              name="pin"
              maxLength="4"
              placeholder="••••"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              disabled={loading}
              required
              style={{ textAlign: 'center', letterSpacing: '8px', fontSize: '20px' }}
            />
            <button type="submit" disabled={loading}>
              {loading ? 'Validando PIN...' : 'Confirmar Acceso'}
            </button>
            <button 
              type="button" 
              onClick={() => setShowPinField(false)} 
              disabled={loading}
              style={{ backgroundColor: 'transparent', border: 'none', color: '#646e82', marginTop: '10px', cursor: 'pointer', fontSize: '13px' }}
            >
              ← Volver atrás
            </button>
          </form>
        )}
        
        {/* Enlaces inferiores de navegación y recuperación */}
        <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '14px' }}>
          <p className="auth-switch" style={{ marginBottom: '8px' }}>
            ¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link>
          </p>
          <p>
            <Link to="/recover-password" style={{ color: '#ffc832', textDecoration: 'none', fontSize: '13px' }}>
              ¿Olvidó su contraseña?
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;