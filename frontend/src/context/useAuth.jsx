import { useContext } from 'react'; // CORREGIDO: Ahora useContext está definido e importado
import { AuthContext } from './AuthContext'; // Importamos el contexto que tiene los datos reales

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('❌ useAuth debe ser utilizado dentro de un AuthProvider');
  }
  return context;
};