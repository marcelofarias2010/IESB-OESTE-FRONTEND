import { randomBytes } from 'crypto';
import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../lib/prisma.js';
import { signAccessToken } from '../lib/jwt.js';
import { requireAuth } from '../middleware/auth.middleware.js';

export const authRouter = Router();

const SALT_ROUNDS = 10;
const PASSWORD_MIN = 6;
const RESET_TTL_MS = 60 * 60 * 1000;

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function publicUser(user: { id: string; email: string; name: string | null }) {
  return { id: user.id, email: user.email, name: user.name };
}

/**
 * Cadastro de novo usuário e criação de configurações padrão.
 */
authRouter.post('/register', async (req, res) => {
  const { email, password, name } = req.body as {
    email?: string;
    password?: string;
    name?: string;
  };

  const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
  const pwd = typeof password === 'string' ? password : '';

  if (!isValidEmail(normalizedEmail)) {
    return res.status(400).json({ message: 'E-mail inválido' });
  }
  if (pwd.length < PASSWORD_MIN) {
    return res
      .status(400)
      .json({ message: `Senha deve ter pelo menos ${PASSWORD_MIN} caracteres` });
  }

  const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  if (existing) {
    return res.status(409).json({ message: 'E-mail já cadastrado' });
  }

  const passwordHash = await bcrypt.hash(pwd, SALT_ROUNDS);
  const displayName = typeof name === 'string' && name.trim() ? name.trim() : null;

  const user = await prisma.user.create({
    data: {
      email: normalizedEmail,
      name: displayName,
      passwordHash,
      settings: {
        create: { workTime: 25, shortBreakTime: 5, longBreakTime: 15 },
      },
    },
  });

  const token = signAccessToken(user.id);
  return res.status(201).json({ token, user: publicUser(user) });
});

/**
 * Login com e-mail e senha; retorna JWT.
 */
authRouter.post('/login', async (req, res) => {
  const { email, password } = req.body as { email?: string; password?: string };
  const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
  const pwd = typeof password === 'string' ? password : '';

  if (!normalizedEmail || !pwd) {
    return res.status(400).json({ message: 'E-mail e senha são obrigatórios' });
  }

  const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  if (!user) {
    return res.status(401).json({ message: 'Credenciais inválidas' });
  }

  const ok = await bcrypt.compare(pwd, user.passwordHash);
  if (!ok) {
    return res.status(401).json({ message: 'Credenciais inválidas' });
  }

  const token = signAccessToken(user.id);
  return res.json({ token, user: publicUser(user) });
});

/**
 * Retorna o usuário atual a partir do Bearer token.
 */
authRouter.get('/me', requireAuth, async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.userId! },
    select: { id: true, email: true, name: true },
  });
  if (!user) {
    return res.status(401).json({ message: 'Usuário não encontrado' });
  }
  return res.json({ user });
});

/**
 * Solicita recuperação de senha; em desenvolvimento pode devolver o token na resposta.
 */
authRouter.post('/forgot-password', async (req, res) => {
  const { email } = req.body as { email?: string };
  const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';

  const generic = {
    message:
      'Se existir uma conta com este e-mail, você receberá instruções para redefinir a senha.',
  };

  if (!isValidEmail(normalizedEmail)) {
    return res.status(400).json({ message: 'E-mail inválido' });
  }

  const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  if (!user) {
    return res.json(generic);
  }

  const resetToken = randomBytes(32).toString('hex');
  const resetTokenExpires = new Date(Date.now() + RESET_TTL_MS);

  await prisma.user.update({
    where: { id: user.id },
    data: { resetToken, resetTokenExpires },
  });

  const isDev = process.env.NODE_ENV !== 'production';
  if (isDev) {
    return res.json({
      ...generic,
      devResetToken: resetToken,
      devHint:
        'Ambiente de desenvolvimento: use devResetToken na tela de redefinir senha ou envie no corpo da requisição.',
    });
  }

  return res.json(generic);
});

/**
 * Redefine a senha usando o token recebido no fluxo de esqueci a senha.
 */
authRouter.post('/reset-password', async (req, res) => {
  const { token, newPassword } = req.body as { token?: string; newPassword?: string };
  const t = typeof token === 'string' ? token.trim() : '';
  const pwd = typeof newPassword === 'string' ? newPassword : '';

  if (!t) {
    return res.status(400).json({ message: 'Token obrigatório' });
  }
  if (pwd.length < PASSWORD_MIN) {
    return res
      .status(400)
      .json({ message: `Nova senha deve ter pelo menos ${PASSWORD_MIN} caracteres` });
  }

  const user = await prisma.user.findFirst({
    where: {
      resetToken: t,
      resetTokenExpires: { gt: new Date() },
    },
  });

  if (!user) {
    return res.status(400).json({ message: 'Token inválido ou expirado' });
  }

  const passwordHash = await bcrypt.hash(pwd, SALT_ROUNDS);
  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordHash,
      resetToken: null,
      resetTokenExpires: null,
    },
  });

  return res.json({ message: 'Senha alterada com sucesso' });
});

/**
 * Troca de senha autenticado (opcional utilidade).
 */
authRouter.post('/change-password', requireAuth, async (req, res) => {
  const { currentPassword, newPassword } = req.body as {
    currentPassword?: string;
    newPassword?: string;
  };
  const cur = typeof currentPassword === 'string' ? currentPassword : '';
  const pwd = typeof newPassword === 'string' ? newPassword : '';

  if (!cur || pwd.length < PASSWORD_MIN) {
    return res.status(400).json({ message: 'Dados inválidos' });
  }

  const user = await prisma.user.findUnique({ where: { id: req.userId! } });
  if (!user) {
    return res.status(404).json({ message: 'Usuário não encontrado' });
  }

  const ok = await bcrypt.compare(cur, user.passwordHash);
  if (!ok) {
    return res.status(401).json({ message: 'Senha atual incorreta' });
  }

  const passwordHash = await bcrypt.hash(pwd, SALT_ROUNDS);
  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash },
  });

  return res.json({ message: 'Senha alterada com sucesso' });
});
