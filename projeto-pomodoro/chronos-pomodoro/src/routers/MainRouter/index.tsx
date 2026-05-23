import { BrowserRouter, Route, Routes, useLocation } from 'react-router';
import { useEffect } from 'react';
import { AboutPomodoro } from '../../pages/AboutPomodoro';
import { ForgotPasswordPage } from '../../pages/Auth/ForgotPasswordPage';
import { LoginPage } from '../../pages/Auth/LoginPage';
import { RegisterPage } from '../../pages/Auth/RegisterPage';
import { ResetPasswordPage } from '../../pages/Auth/ResetPasswordPage';
import { History } from '../../pages/History';
import { Home } from '../../pages/Home';
import { Settings } from '../../pages/Settings';
import { AuthAwareNotFound } from '../AuthAwareNotFound';
import { GuestOnlyLayout } from '../GuestOnlyLayout';
import { ProtectedRouteShell } from '../ProtectedRouteShell';
import { RootRedirect } from '../RootRedirect';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);

  return null;
}

export function MainRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<RootRedirect />} />

        <Route element={<GuestOnlyLayout />}>
          <Route path='/login/' element={<LoginPage />} />
          <Route path='/register/' element={<RegisterPage />} />
          <Route path='/forgot-password/' element={<ForgotPasswordPage />} />
          <Route path='/reset-password/' element={<ResetPasswordPage />} />
        </Route>

        <Route element={<ProtectedRouteShell />}>
          <Route path='/home/' element={<Home />} />
          <Route path='/history/' element={<History />} />
          <Route path='/settings/' element={<Settings />} />
          <Route path='/about-pomodoro/' element={<AboutPomodoro />} />
          <Route path='*' element={<AuthAwareNotFound />} />
        </Route>
      </Routes>
      <ScrollToTop />
    </BrowserRouter>
  );
}
