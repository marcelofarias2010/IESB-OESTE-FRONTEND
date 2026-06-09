import { useState } from 'react';
import { Link } from 'react-router-dom';
import { apiForgotPassword } from '../../services/api';
import styles from './styles.module.css';

export function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setResetToken('');

    if (!email) {
      setError('Digite seu email');
      return;
    }

    setIsLoading(true);
    try {
      const data = await apiForgotPassword(email);
      if (data.resetToken) {
        setResetToken(data.resetToken);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao solicitar recuperação');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h1>Recuperar senha</h1>

        {error && <p className={styles.error}>{error}</p>}

        {resetToken ? (
          <div className={styles.tokenBox}>
            <p>Token gerado (use para redefinir a senha):</p>
            <code className={styles.token}>{resetToken}</code>
            <Link to="/reset-password" className={styles.button} style={{ display: 'block', textAlign: 'center', marginTop: 12 }}>
              Redefinir senha
            </Link>
          </div>
        ) : (
          <>
            <input
              type="email"
              placeholder="Digite seu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
            />
            <button type="submit" className={styles.button} disabled={isLoading}>
              {isLoading ? 'Enviando...' : 'Enviar token'}
            </button>
          </>
        )}

        <div className={styles.links}>
          <Link to="/login">Voltar ao login</Link>
        </div>
      </form>
    </div>
  );
}
