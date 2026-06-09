const BASE_URL = 'http://localhost:3333';

function getToken(): string | null {
  return localStorage.getItem('token');
}

function authHeaders() {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${getToken()}`,
  };
}

// ─── AUTH ────────────────────────────────────────────────────────────────────

export type AuthUser = { id: string; name: string; email: string };
export type AuthResponse = { token: string; user: AuthUser };

export async function apiRegister(name: string, email: string, password: string): Promise<AuthResponse> {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Erro ao criar conta');
  return data;
}

export async function apiLogin(email: string, password: string): Promise<AuthResponse> {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Erro ao fazer login');
  return data;
}

export async function apiForgotPassword(email: string): Promise<{ message: string; resetToken?: string }> {
  const res = await fetch(`${BASE_URL}/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Erro ao solicitar recuperação');
  return data;
}

export async function apiResetPassword(token: string, newPassword: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/auth/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, newPassword }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Erro ao redefinir senha');
}

// ─── SETTINGS ────────────────────────────────────────────────────────────────

export type ApiSettings = { id: number; workTime: number; shortBreakTime: number; longBreakTime: number };

export async function fetchSettings(): Promise<ApiSettings> {
  const res = await fetch(`${BASE_URL}/settings`, { headers: authHeaders() });
  if (!res.ok) throw new Error('Erro ao buscar configurações');
  return res.json();
}

export async function saveSettings(data: { workTime: number; shortBreakTime: number; longBreakTime: number }): Promise<ApiSettings> {
  const res = await fetch(`${BASE_URL}/settings`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Erro ao salvar configurações');
  return res.json();
}

// ─── TASKS ───────────────────────────────────────────────────────────────────

export type ApiTask = {
  id: string; name: string; duration: number;
  type: 'workTime' | 'shortBreakTime' | 'longBreakTime';
  startDate: string; completeDate: string | null; interruptDate: string | null;
};

export async function fetchTasks(): Promise<ApiTask[]> {
  const res = await fetch(`${BASE_URL}/tasks`, { headers: authHeaders() });
  if (!res.ok) throw new Error('Erro ao buscar tarefas');
  return res.json();
}

export async function createTask(data: { id: string; name: string; duration: number; type: string; startDate: string }): Promise<ApiTask> {
  const res = await fetch(`${BASE_URL}/tasks`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Erro ao criar tarefa');
  return res.json();
}

export async function completeTask(taskId: string): Promise<ApiTask> {
  const res = await fetch(`${BASE_URL}/tasks/${taskId}/complete`, {
    method: 'PATCH',
    headers: authHeaders(),
    body: JSON.stringify({ completeDate: new Date().toISOString() }),
  });
  if (!res.ok) throw new Error('Erro ao concluir tarefa');
  return res.json();
}

export async function interruptTask(taskId: string): Promise<ApiTask> {
  const res = await fetch(`${BASE_URL}/tasks/${taskId}/interrupt`, {
    method: 'PATCH',
    headers: authHeaders(),
    body: JSON.stringify({ interruptDate: new Date().toISOString() }),
  });
  if (!res.ok) throw new Error('Erro ao interromper tarefa');
  return res.json();
}

export async function clearTasks(): Promise<void> {
  const res = await fetch(`${BASE_URL}/tasks`, { method: 'DELETE', headers: authHeaders() });
  if (!res.ok) throw new Error('Erro ao limpar histórico');
}
