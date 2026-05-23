import { Navigate, Outlet, useLocation } from 'react-router';
import { useAuth } from '../../contexts/AuthContext/useAuth';
import { TaskContextProvider } from '../../contexts/TaskContext/TaskContextProvider';
import styles from './styles.module.css';

/**
 * Layout que exige JWT válido e envolve o Pomodoro com `TaskContextProvider`.
 */
export function ProtectedRouteShell() {
  const { isBootstrapping, isAuthenticated } = useAuth();
  const location = useLocation();

  if (isBootstrapping) {
    return (
      <div className={styles.bootWrap} role='status' aria-live='polite'>
        <p className={styles.bootText}>Carregando sessão…</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to='/login/' replace state={{ from: location }} />;
  }

  return (
    <TaskContextProvider>
      <Outlet />
    </TaskContextProvider>
  );
}
