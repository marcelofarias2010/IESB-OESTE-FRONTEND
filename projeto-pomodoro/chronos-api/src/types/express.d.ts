export {};

declare global {
  namespace Express {
    interface Request {
      /** ID do usuário autenticado (JWT `sub`). */
      userId?: string;
    }
  }
}
