import { MailIcon } from 'lucide-react';
import { useState } from 'react';
import { DefaultButton } from '../../components/DefaultButton';
import { DefaultInput } from '../../components/DefaultInput';
import { RouterLink } from '../../components/RouterLink';
import { showMessage } from '../../adapters/showMessage';
import { forgotPasswordRequest } from '../../services/authApi';
import { AuthPageShell } from './AuthPageShell';
import styles from './authPages.module.css';

/**
 * Solicita token de recuperação; em desenvolvimento a API pode retornar `devResetToken`.
 */
export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [devToken, setDevToken] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    showMessage.dismiss();
    setDevToken(null);

    const trimmed = email.trim().toLowerCase();
    if (!trimmed) {
      showMessage.error('Informe o e-mail');
      return;
    }

    setSubmitting(true);
    try {
      const res = await forgotPasswordRequest(trimmed);
      showMessage.info(res.message);
      if (res.devResetToken) {
        setDevToken(res.devResetToken);
      }
    } catch (err) {
      showMessage.error(err instanceof Error ? err.message : 'Falha na solicitação');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthPageShell
      title='Recuperar senha'
      subtitle='Enviaremos instruções se o e-mail estiver cadastrado. Em desenvolvimento, a API pode exibir o token abaixo.'
    >
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <DefaultInput
          id='forgot-email'
          labelText='E-mail'
          type='email'
          autoComplete='email'
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <div className={styles.actions}>
          <DefaultButton
            type='submit'
            icon={<MailIcon size={20} />}
            disabled={submitting}
            aria-busy={submitting}
          />
        </div>
      </form>
      {devToken ? (
        <div className={styles.devBox}>
          <span className={styles.devLabel}>Token (somente desenvolvimento)</span>
          {devToken}
        </div>
      ) : null}
      <nav className={styles.links} aria-label='Links de autenticação'>
        <RouterLink className={styles.link} href='/login/'>
          Voltar ao login
        </RouterLink>
        <RouterLink className={styles.link} href='/reset-password/'>
          Já tenho um token — redefinir senha
        </RouterLink>
      </nav>
    </AuthPageShell>
  );
}
