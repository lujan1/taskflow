import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', pin: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Bloqueo de envíos múltiples
  const navigate = useNavigate();

  const handleChange = (e) => {
    // Si es el campo del PIN, restringimos que solo acepte números y máximo 4 caracteres
    if (e.target.name === 'pin') {
      const value = e.target.value.replace(/\D/g, '').slice(0, 4);
      setForm({ ...form, pin: value });
      return;
    }
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // 1. Validación local básica preventiva
    if (!form.name.trim() || !form.email.trim() || !form.password || !form.pin) {
      setError('Por favor, completa todos los campos obligatorios.');
      return;
    }

    // 2. Validación estricta del formato del PIN de seguridad
    if (!/^\d{4}$/.test(form.pin)) {
      setError('El PIN de seguridad debe ser estrictamente de 4 números.');
      return;
    }

    setLoading(true);

    try {
      // Normalizamos el payload para enviarlo limpio al backend
      const payload = {
        name: form.name.trim(),
        email: form.email.toLowerCase().trim(),
        password: form.password,
        pin: form.pin // Enviamos la llave de seguridad de 4 dígitos
      };

      // Petición HTTP POST al endpoint de registro del backend
      await API.post('/auth/register', payload);
      
      // Si el registro es exitoso, lo redirigimos directo al Login para que estrene su cuenta
      navigate('/login');
    } catch (err) {
      console.error('❌ Error durante el registro de usuario:', err);
      // Captura el mensaje específico del backend (ej: "El correo ya está registrado")
      setError(err.response?.data?.message || 'Error al crear la cuenta. Intente de nuevo más tarde.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>TaskFlow</h1>
        <h2>Crear Cuenta</h2>
        
        {error && <p className="error-message">{error}</p>}
        
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Nombre completo"
            value={form.name}
            onChange={handleChange}
            disabled={loading}
            required
          />
          
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
            placeholder="Contraseña de acceso"
            value={form.password}
            onChange={handleChange}
            disabled={loading}
            required
          />

          {/* NUEVO: Campo crítico del Filtro de Seguridad de 2 pasos */}
          <div style={{ marginTop: '5px' }}>
            <input
              type="password"
              name="pin"
              maxLength="4"
              placeholder="Definir PIN de Seguridad (4 dígitos)"
              value={form.pin}
              onChange={handleChange}
              disabled={loading}
              style={{ textAlign: 'center', letterSpacing: form.pin ? '8px' : 'normal' }}
              required
            />
            <p style={{ fontSize: '11px', color: '#707993', margin: '5px 0 0 5px', lineHeight: '1.3' }}>
              * Este PIN numérico será obligatorio para autorizar tus inicios de sesión y recuperar tu contraseña de manera autónoma.
            </p>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Creando cuenta...' : 'Registrarse'}
          </button>
        </form>
        
        <p className="auth-switch">
          ¿Ya tienes una cuenta? <Link to="/login">Inicia sesión aquí</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;