import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET && process.env.NODE_ENV !== 'test') {
  console.warn('[auth] JWT_SECRET não definido; defina no .env para produção.');
}

const secretOrFallback = JWT_SECRET || 'dev-only-change-me';

/**
 * Gera token JWT para o usuário informado.
 */
export function signAccessToken(userId: string): string {
  return jwt.sign({ sub: userId }, secretOrFallback, { expiresIn: '7d' });
}

/**
 * Valida token e retorna o `sub` (userId) ou null.
 */
export function verifyAccessToken(token: string): string | null {
  try {
    const decoded = jwt.verify(token, secretOrFallback) as jwt.JwtPayload;
    const sub = decoded.sub;
    return typeof sub === 'string' ? sub : null;
  } catch {
    return null;
  }
}
