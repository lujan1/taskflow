import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import RecoverPassword from './pages/RecoverPassword';

// ■■ COMPONENTE DE RUTA PROTEGIDA (PrivateRoute) ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
const PrivateRoute = ({ children }) => {
  const { token, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontFamily: 'sans-serif',
        backgroundColor: '#f4f6f9'
      }}>
        <h3>Validando credenciales de acceso...</h3>
      </div>
    );
  }

  return token ? children : <Navigate to="/login" replace />;
};

// ■■ COMPONENTE DE RUTA PÚBLICA (PublicRoute) ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
const PublicRoute = ({ children }) => {
  const { token, loading } = useAuth();

  if (loading) return null;

  return !token ? children : <Navigate to="/dashboard" replace />;
};

// ■■ COMPONENTE MAESTRO (App) ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Ruta raíz redirige condicionalmente al Login */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Rutas Públicas de Control de Acceso */}
          <Route path="/login" element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } />
          
          <Route path="/register" element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          } />

          <Route path="/recover-password" element={
            <PublicRoute>
              <RecoverPassword />
            </PublicRoute>
          } />

          {/* Rutas Privadas Protegidas (El Navbar ya se maneja dentro de Dashboard) */}
          <Route path="/dashboard" element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } />

          {/* Capturador universal */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;