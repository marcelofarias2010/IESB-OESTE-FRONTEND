import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiResetPassword } from '../../services/api';
import styles from './styles.module.css';

export function ResetPassword() {
  const navigate = useNavigate();
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!token || !newPassword) {
      setError('Preencha todos os campos');
      return;
    }
    if (newPassword.length < 6) {
      setError('Senha deve ter no mínimo 6 caracteres');
      return;
    }

    setIsLoading(true);
    try {
      await apiResetPassword(token, newPassword);
      alert('Senha redefinida com sucesso!');
      navigate('/login');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao redefinir senha');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h1>Redefinir senha</h1>

        {error && <p className={styles.error}>{error}</p>}

        <input
          type="text"
          placeholder="Cole o token recebido"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          className={styles.input}
        />
        <input
          type="password"
          placeholder="Nova senha (mín. 6 caracteres)"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className={styles.input}
        />

        <button type="submit" className={styles.button} disabled={isLoading}>
          {isLoading ? 'Salvando...' : 'Redefinir senha'}
        </button>

        <div className={styles.links}>
          <Link to="/login">Voltar ao login</Link>
        </div>
      </form>
    </div>
  );
}
