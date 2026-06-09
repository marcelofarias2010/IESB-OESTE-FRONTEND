import { BrowserRouter, Route, Routes, useLocation, Navigate } from 'react-router-dom';
import { useEffect } from 'react';

import { Home } from '../../pages/Home';
import { History } from '../../pages/History';
import { Settings } from '../../pages/Settings';
import { AboutPomodoro } from '../../pages/AboutPomodoro';
import { NotFound } from '../../pages/NotFound';
import { Login } from '../../pages/Login';
import { Register } from '../../pages/Register';
import { ForgotPassword } from '../../pages/ForgotPassword';
import { ResetPassword } from '../../pages/ResetPassword';
import { useAuth } from '../../contexts/AuthContext';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);
  return null;
}

// Protege rotas: redireciona para /login se não autenticado
function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <p style={{ textAlign: 'center', marginTop: 40 }}>Carregando...</p>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return <>{children}</>;
}

// Redireciona para /home se já autenticado (não deixa voltar ao login)
function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <p style={{ textAlign: 'center', marginTop: 40 }}>Carregando...</p>;
  if (isAuthenticated) return <Navigate to="/home" replace />;

  return <>{children}</>;
}

export function MainRouter() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* redireciona raiz para login */}
        <Route path='/' element={<Navigate to="/login" />} />

        {/* rotas públicas */}
        <Route path='/login' element={<PublicRoute><Login /></PublicRoute>} />
        <Route path='/register' element={<PublicRoute><Register /></PublicRoute>} />
        <Route path='/forgot-password' element={<PublicRoute><ForgotPassword /></PublicRoute>} />
        <Route path='/reset-password' element={<PublicRoute><ResetPassword /></PublicRoute>} />

        {/* rotas protegidas */}
        <Route path='/home' element={<PrivateRoute><Home /></PrivateRoute>} />
        <Route path='/history' element={<PrivateRoute><History /></PrivateRoute>} />
        <Route path='/settings' element={<PrivateRoute><Settings /></PrivateRoute>} />
        <Route path='/about-pomodoro' element={<PrivateRoute><AboutPomodoro /></PrivateRoute>} />

        <Route path='*' element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
