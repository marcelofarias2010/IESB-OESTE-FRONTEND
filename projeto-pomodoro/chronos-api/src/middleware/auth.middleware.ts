import type { RequestHandler } from 'express';
import { verifyAccessToken } from '../lib/jwt.js';

/**
 * Middleware que exige `Authorization: Bearer <token>` válido e define `req.userId`.
 */
export const requireAuth: RequestHandler = (req, res, next) => {
  const header = req.headers.authorization;
  const token =
    typeof header === 'string' && header.startsWith('Bearer ')
      ? header.slice(7).trim()
      : null;

  if (!token) {
    return res.status(401).json({ message: 'Não autenticado' });
  }

  const userId = verifyAccessToken(token);
  if (!userId) {
    return res.status(401).json({ message: 'Token inválido ou expirado' });
  }

  req.userId = userId;
  return next();
};
