import { createContext, useContext, useState } from 'react';

// 1. Creamos el contexto (Interno del archivo)
const AuthContext = createContext();

// 2. Componente Proveedor que envolverá tu aplicación
export const AuthProvider = ({ children }) => {
  
  // Inicializamos el usuario directamente desde localStorage de forma segura
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (error) {
      console.error('❌ Error parseando el usuario desde localStorage:', error);
      return null;
    }
  });

  // Inicializamos el token directamente desde localStorage
  const [token, setToken] = useState(() => localStorage.getItem('token'));

  // CORREGIDO: Evaluamos la sesión en tiempo de inicialización.
  // Si los datos guardados están bien, 'loading' empieza en false inmediatamente.
  // Si detectamos datos corruptos o inconsistencias al arrancar, limpiamos el localStorage de inmediato.
  const [loading] = useState(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    // Si hay inconsistencia (ej: hay token pero no usuario), borramos el almacenamiento al vuelo
    if ((savedToken && !savedUser) || (!savedToken && savedUser)) {
      console.warn('⚠️ Inconsistencia detectada en el arranque. Limpiando credenciales...');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return false; // No hay nada que cargar, la sesión está vacía y lista
    }
    
    return false; // Todo en orden, no es necesario bloquear el renderizado
  });

  // Guardar token y usuario al iniciar sesión con éxito
  const login = (userData, userToken) => {
    localStorage.setItem('token', userToken);
    localStorage.setItem('user', JSON.stringify(userData));
    setToken(userToken);
    setUser(userData);
  };

  // Limpiar todo el estado local y de almacenamiento al cerrar sesión o expirar token
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {!loading ? children : (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          fontFamily: 'sans-serif',
          backgroundColor: '#f4f6f9',
          color: '#333'
        }}>
          <h2>Cargando TaskFlow...</h2>
        </div>
      )}
    </AuthContext.Provider>
  );
};

// 3. Hook personalizado para usar el contexto de manera directa en componentes
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('❌ useAuth debe ser utilizado dentro de un AuthProvider');
  }
  return context;
};