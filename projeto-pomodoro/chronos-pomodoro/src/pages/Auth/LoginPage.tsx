import { LogInIcon } from 'lucide-react';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { DefaultButton } from '../../components/DefaultButton';
import { DefaultInput } from '../../components/DefaultInput';
import { RouterLink } from '../../components/RouterLink';
import { useAuth } from '../../contexts/AuthContext/useAuth';
import { showMessage } from '../../adapters/showMessage';
import { AuthPageShell } from './AuthPageShell';
import styles from './authPages.module.css';

/**
 * Tela de login: valida campos e redireciona após sucesso.
 */
export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from =
    (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ||
    '/home/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    showMessage.dismiss();

    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail || !password) {
      showMessage.error('Preencha e-mail e senha');
      return;
    }

    setSubmitting(true);
    try {
      await login(trimmedEmail, password);
      showMessage.success('Bem-vindo de volta!');
      navigate(from, { replace: true });
    } catch (err) {
      showMessage.error(err instanceof Error ? err.message : 'Falha no login');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthPageShell
      title='Entrar'
      subtitle='Use sua conta para acessar o Chronos Pomodoro.'
    >
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <DefaultInput
          id='login-email'
          labelText='E-mail'
          type='email'
          autoComplete='email'
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <DefaultInput
          id='login-password'
          labelText='Senha'
          type='password'
          autoComplete='current-password'
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <div className={styles.actions}>
          <DefaultButton
            type='submit'
            icon={<LogInIcon size={20} />}
            disabled={submitting}
            aria-busy={submitting}
          />
        </div>
      </form>
      <nav className={styles.links} aria-label='Links de autenticação'>
        <RouterLink className={styles.link} href='/register/'>
          Criar conta
        </RouterLink>
        <RouterLink className={styles.link} href='/forgot-password/'>
          Esqueci minha senha
        </RouterLink>
      </nav>
    </AuthPageShell>
  );
}
