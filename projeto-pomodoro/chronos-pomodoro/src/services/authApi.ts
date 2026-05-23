import { AUTH_TOKEN_STORAGE_KEY } from './authConstants';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333';

export type AuthUser = {
  id: string;
  email: string;
  name: string | null;
};

type LoginRegisterResponse = {
  token: string;
  user: AuthUser;
};

type MeResponse = {
  user: AuthUser;
};

/**
 * Lê o token salvo após login.
 */
export function getStoredAuthToken(): string | null {
  return localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
}

/**
 * Persiste o token JWT.
 */
export function persistAuthToken(token: string) {
  localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
}

/**
 * Remove o token JWT.
 */
export function clearAuthToken() {
  localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
}

async function parseErrorMessage(response: Response): Promise<string> {
  const text = await response.text();
  if (!text) return `Erro ${response.status}`;
  try {
    const data = JSON.parse(text) as { message?: string };
    return typeof data.message === 'string' ? data.message : text;
  } catch {
    return text;
  }
}

async function authJson<T>(path: string, options?: RequestInit): Promise<T> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options?.headers,
  };

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error(await parseErrorMessage(response));
  }

  if (response.status === 204) return undefined as T;

  return (await response.json()) as T;
}

/**
 * Autentica com e-mail e senha.
 */
export async function loginRequest(email: string, password: string) {
  return authJson<LoginRegisterResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

/**
 * Registra novo usuário na API.
 */
export async function registerRequest(
  email: string,
  password: string,
  name?: string,
) {
  return authJson<LoginRegisterResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password, name: name || undefined }),
  });
}

/**
 * Obtém o perfil atual com Bearer token.
 */
export async function fetchMe(token: string) {
  return authJson<MeResponse>('/auth/me', {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export type ForgotPasswordResponse = {
  message: string;
  devResetToken?: string;
  devHint?: string;
};

/**
 * Solicita fluxo de recuperação de senha.
 */
export async function forgotPasswordRequest(email: string) {
  return authJson<ForgotPasswordResponse>('/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

/**
 * Redefine senha com token enviado por e-mail (ou retornado em dev).
 */
export async function resetPasswordRequest(token: string, newPassword: string) {
  return authJson<{ message: string }>('/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify({ token, newPassword }),
  });
}
