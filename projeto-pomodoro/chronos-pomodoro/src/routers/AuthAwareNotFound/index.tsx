import { Navigate } from 'react-router';
import { useAuth } from '../../contexts/AuthContext/useAuth';
import { NotFound } from '../../pages/NotFound';

/**
 * Rotas desconhecidas: visitantes vão ao login; usuários logados veem 404.
 */
export function AuthAwareNotFound() {
  const { isBootstrapping, isAuthenticated } = useAuth();

  if (isBootstrapping) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to='/login/' replace />;
  }

  return <NotFound />;
}
