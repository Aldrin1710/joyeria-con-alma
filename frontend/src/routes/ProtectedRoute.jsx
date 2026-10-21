import { Navigate } from 'react-router-dom';
import { useAuth } from '../features/auth/hooks/useAuth.js';
import Loader from '../components/ui/Loader.jsx';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <Loader message="Verificando sesión..." padding="6rem 0" />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login-joyeria" replace />;
  }

  return children;
}
