import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';

const RecoverPassword = () => {
  const [form, setForm] = useState({ email: '', pin: '', newPassword: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validación preventiva del PIN de 4 dígitos en el cliente
    if (!/^\d{4}$/.test(form.pin)) {
      setError('El PIN de seguridad debe ser estrictamente de 4 números.');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        email: form.email.toLowerCase().trim(),
        pin: form.pin,
        newPassword: form.newPassword
      };

      // Petición directa al backend protegido
      const { data } = await API.post('/auth/recover-password', payload);
      
      setSuccess(data.message || 'Contraseña restaurada con éxito.');
      
      // Redirigir al login después de 3 segundos para que alcancen a leer el éxito
      setTimeout(() => {
        navigate('/login');
      }, 3000);

    } catch (err) {
      console.error('❌ Error en la recuperación de acceso:', err);
      setError(err.response?.data?.message || 'No se pudo verificar el PIN o el correo. Intente de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>TaskFlow</h1>
        <h2>Restablecer Contraseña</h2>

        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message" style={{ color: '#10b981', backgroundColor: 'rgba(16, 185, 129, 0.1)', padding: '10px', borderRadius: '8px', textAlign: 'center', fontSize: '13px' }}>{success}</p>}

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Correo electrónico registrado"
            value={form.email}
            onChange={handleChange}
            disabled={loading || success}
            required
          />
          
          <input
            type="password"
            name="pin"
            maxLength="4"
            placeholder="PIN de Seguridad (4 dígitos)"
            value={form.pin}
            onChange={handleChange}
            disabled={loading || success}
            style={{ textAlign: 'center', letterSpacing: '6px' }}
            required
          />

          <input
            type="password"
            name="newPassword"
            placeholder="Nueva contraseña de acceso"
            value={form.newPassword}
            onChange={handleChange}
            disabled={loading || success}
            required
          />

          <button type="submit" disabled={loading || success}>
            {loading ? 'Validando Llave...' : 'Actualizar Contraseña'}
          </button>
        </form>

        <p className="auth-switch" style={{ marginTop: '20px', fontSize: '13px' }}>
          <Link to="/login" style={{ textDecoration: 'none' }}>← Volver al Inicio de Sesión</Link>
        </p>
      </div>
    </div>
  );
};

export default RecoverPassword;