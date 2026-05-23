import { Navigate, Outlet } from 'react-router';
import { useAuth } from '../../contexts/AuthContext/useAuth';
import styles from './styles.module.css';

/**
 * Rotas públicas de autenticação: redireciona para a home se já estiver logado.
 */
export function GuestOnlyLayout() {
  const { isBootstrapping, isAuthenticated } = useAuth();

  if (isBootstrapping) {
    return (
      <div className={styles.bootWrap} role='status' aria-live='polite'>
        <p className={styles.bootText}>Carregando…</p>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to='/home/' replace />;
  }

  return <Outlet />;
}
