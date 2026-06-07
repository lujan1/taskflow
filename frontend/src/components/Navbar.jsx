import { useState, useEffect } from 'react';
import '../styles/navbar.css';

const Navbar = ({ onToggleSidebar }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [langDropdown, setLangDropdown] = useState(false);

  // Reloj en tiempo real (se actualiza cada segundo)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  // Formateadores de fecha y hora
  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'short' });
  };

  return (
    <nav className="top-navbar" id="tour-step-1">
      {/* 1. LADO IZQUIERDO: Menú Hamburguesa y Logo */}
      <div className="nav-left">
        <button className="hamburger-btn" onClick={onToggleSidebar} title="Abrir menú">
          ☰
        </button>
        <span className="brand-logo">TaskFlow</span>
      </div>

      {/* 2. CENTRO: Reloj Digital en Vivo */}
      <div className="nav-center" id="tour-step-2">
        <div className="live-clock">{formatTime(currentTime)}</div>
      </div>

      {/* 3. LADO DERECHO: Fecha Actual y Selector de Idioma */}
      <div className="nav-right">
        <span className="live-date">{formatDate(currentTime)}</span>
        
        <div className="lang-selector-container">
          <button className="lang-btn" onClick={() => setLangDropdown(!langDropdown)} title="Cambiar idioma">
            🌐 <span>ES</span>
          </button>
          
          {langDropdown && (
            <ul className="lang-dropdown">
              <li onClick={() => { alert('Cambiando a Español...'); setLangDropdown(false); }}>Español</li>
              <li onClick={() => { alert('Switching to English...'); setLangDropdown(false); }}>English</li>
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;