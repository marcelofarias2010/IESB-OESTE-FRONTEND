import { KeyRoundIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { DefaultButton } from '../../components/DefaultButton';
import { DefaultInput } from '../../components/DefaultInput';
import { RouterLink } from '../../components/RouterLink';
import { showMessage } from '../../adapters/showMessage';
import { resetPasswordRequest } from '../../services/authApi';
import { AuthPageShell } from './AuthPageShell';
import styles from './authPages.module.css';

const PASSWORD_MIN = 6;

/**
 * Redefine a senha usando o token (query `token` ou campo manual).
 */
export function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const q = searchParams.get('token');
    if (q) setToken(q);
  }, [searchParams]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    showMessage.dismiss();

    if (!token.trim()) {
      showMessage.error('Informe o token de recuperação');
      return;
    }
    if (newPassword.length < PASSWORD_MIN) {
      showMessage.error(`Senha deve ter pelo menos ${PASSWORD_MIN} caracteres`);
      return;
    }
    if (newPassword !== confirm) {
      showMessage.error('As senhas não conferem');
      return;
    }

    setSubmitting(true);
    try {
      await resetPasswordRequest(token.trim(), newPassword);
      showMessage.success('Senha alterada. Faça login.');
      navigate('/login/', { replace: true });
    } catch (err) {
      showMessage.error(err instanceof Error ? err.message : 'Não foi possível redefinir');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthPageShell
      title='Nova senha'
      subtitle='Cole o token recebido (ou vindo do link) e defina uma nova senha.'
    >
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <DefaultInput
          id='reset-token'
          labelText='Token'
          type='text'
          autoComplete='one-time-code'
          value={token}
          onChange={e => setToken(e.target.value)}
          required
        />
        <DefaultInput
          id='reset-new'
          labelText='Nova senha'
          type='password'
          autoComplete='new-password'
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
          required
        />
        <DefaultInput
          id='reset-confirm'
          labelText='Confirmar senha'
          type='password'
          autoComplete='new-password'
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
          required
        />
        <div className={styles.actions}>
          <DefaultButton
            type='submit'
            icon={<KeyRoundIcon size={20} />}
            disabled={submitting}
            aria-busy={submitting}
          />
        </div>
      </form>
      <nav className={styles.links} aria-label='Links de autenticação'>
        <RouterLink className={styles.link} href='/login/'>
          Voltar ao login
        </RouterLink>
      </nav>
    </AuthPageShell>
  );
}
