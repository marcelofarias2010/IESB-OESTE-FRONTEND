import { createContext } from 'react';
import type { AuthUser } from '../../services/authApi';

export type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isBootstrapping: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextValue | null>(null);
