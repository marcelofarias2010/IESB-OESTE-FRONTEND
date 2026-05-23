import { UserPlusIcon } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { DefaultButton } from '../../components/DefaultButton';
import { DefaultInput } from '../../components/DefaultInput';
import { RouterLink } from '../../components/RouterLink';
import { useAuth } from '../../contexts/AuthContext/useAuth';
import { showMessage } from '../../adapters/showMessage';
import { AuthPageShell } from './AuthPageShell';
import styles from './authPages.module.css';

const PASSWORD_MIN = 6;

/**
 * Tela de cadastro de usuário persistido na API (MySQL via Prisma).
 */
export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
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
    if (password.length < PASSWORD_MIN) {
      showMessage.error(`Senha deve ter pelo menos ${PASSWORD_MIN} caracteres`);
      return;
    }

    setSubmitting(true);
    try {
      await register(trimmedEmail, password, name.trim() || undefined);
      showMessage.success('Conta criada! Faça login com seu e-mail e senha.');
      navigate('/login/', { replace: true });
    } catch (err) {
      showMessage.error(err instanceof Error ? err.message : 'Não foi possível cadastrar');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthPageShell
      title='Criar conta'
      subtitle='Cadastre-se para salvar tarefas e configurações na sua conta.'
    >
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <DefaultInput
          id='register-name'
          labelText='Nome (opcional)'
          type='text'
          autoComplete='name'
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <DefaultInput
          id='register-email'
          labelText='E-mail'
          type='email'
          autoComplete='email'
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <DefaultInput
          id='register-password'
          labelText='Senha'
          type='password'
          autoComplete='new-password'
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <div className={styles.actions}>
          <DefaultButton
            type='submit'
            icon={<UserPlusIcon size={20} />}
            disabled={submitting}
            aria-busy={submitting}
          />
        </div>
      </form>
      <nav className={styles.links} aria-label='Links de autenticação'>
        <RouterLink className={styles.link} href='/login/'>
          Já tenho conta
        </RouterLink>
      </nav>
    </AuthPageShell>
  );
}
