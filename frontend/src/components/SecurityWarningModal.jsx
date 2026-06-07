import { useState } from 'react';

// ◄ CORREGIDO: Ahora es una exportación nombrada explícita (coincide con las llaves de Dashboard)
export const SecurityWarningModal = () => {
  const [isOpen, setIsOpen] = useState(() => {
    const hasAccepted = sessionStorage.getItem('taskflow_terms_accepted');
    return !hasAccepted;
  });

  const handleAccept = () => {
    sessionStorage.setItem('taskflow_terms_accepted', 'true');
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(6, 7, 13, 0.85)', backdropFilter: 'blur(8px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999, padding: '20px', boxSizing: 'border-box' }}>
      <div style={{ backgroundColor: '#ffffff', color: '#1e2338', maxWidth: '460px', width: '100%', padding: '30px', borderRadius: '16px', boxShadow: '0 20px 40px rgba(0,0,0,0.3)', fontFamily: 'sans-serif' }}>
        
        <h3 style={{ color: '#ef4444', marginTop: 0, fontSize: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          ⚠️ Entorno de Pruebas Controlado
        </h3>
        
        <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#4a5568' }}>
          Bienvenido a <strong>TaskFlow</strong>. Al ser una plataforma en fase de desarrollo y optimización, agradecemos cumplir con las siguientes directrices:
        </p>

        <ul style={{ fontSize: '13px', color: '#4a5568', paddingLeft: '20px', lineHeight: '1.8' }}>
          <li><strong>Seguridad:</strong> Queda estrictamente prohibido registrar contraseñas reales de uso personal. Utilice credenciales ficticias.</li>
          <li><strong>Recuperación Autónoma:</strong> Recuerde que el PIN de 4 dígitos creado es su única llave de restauración de contraseñas.</li>
          <li><strong>Licenciamiento y Comercialización:</strong> Este software está disponible para alquiler, adaptación corporativa o adquisición total de derechos comerciales.</li>
        </ul>

        <div style={{ margin: '20px 0', padding: '12px', backgroundColor: '#f7fafc', borderRadius: '8px', borderLeft: '4px solid #3182ce', fontSize: '13px', color: '#2d3748' }}>
          <strong>Contacto del Desarrollador Principal / SEO:</strong><br />
          📧 <a href="mailto:daniellujan123489@gmail.com" style={{ color: '#3182ce', fontWeight: 'bold', textDecoration: 'none' }}>daniellujan123489@gmail.com</a>
        </div>

        <button 
          onClick={handleAccept}
          style={{ width: '100%', padding: '12px', backgroundColor: '#3182ce', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer', transition: 'background 0.2s' }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#2b6cb0'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#3182ce'}
        >
          Entendido, Aceptar y Continuar
        </button>
      </div>
    </div>
  );
};