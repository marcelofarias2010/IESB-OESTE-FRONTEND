import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  clearAuthToken,
  fetchMe,
  getStoredAuthToken,
  loginRequest,
  persistAuthToken,
  registerRequest,
  type AuthUser,
} from '../../services/authApi';
import { AuthContext } from './AuthContext';

type AuthProviderProps = {
  children: React.ReactNode;
};

/**
 * Provedor de autenticação: restaura sessão via `/auth/me` e expõe login/registro/logout.
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  useEffect(() => {
    const token = getStoredAuthToken();
    if (!token) {
      setUser(null);
      setIsBootstrapping(false);
      return;
    }

    const bearer = token;
    let cancelled = false;

    async function bootstrap() {
      try {
        const { user: me } = await fetchMe(bearer);
        if (!cancelled) setUser(me);
      } catch {
        if (!cancelled) {
          clearAuthToken();
          setUser(null);
        }
      } finally {
        if (!cancelled) setIsBootstrapping(false);
      }
    }

    void bootstrap();

    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { token, user: nextUser } = await loginRequest(email, password);
    persistAuthToken(token);
    setUser(nextUser);
  }, []);

  /**
   * Cria conta na API sem abrir sessão: o usuário deve usar login em seguida.
   */
  const register = useCallback(async (email: string, password: string, name?: string) => {
    await registerRequest(email, password, name);
  }, []);

  const logout = useCallback(() => {
    clearAuthToken();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: user !== null,
      isBootstrapping,
      login,
      register,
      logout,
    }),
    [user, isBootstrapping, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
