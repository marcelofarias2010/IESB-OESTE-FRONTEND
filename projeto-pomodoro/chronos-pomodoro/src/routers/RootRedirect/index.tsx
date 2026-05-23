import { Navigate } from 'react-router';
import { useAuth } from '../../contexts/AuthContext/useAuth';
import styles from '../GuestOnlyLayout/styles.module.css';

/**
 * Redireciona a raiz para login ou home conforme autenticação.
 */
export function RootRedirect() {
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

  return <Navigate to='/login/' replace />;
}
