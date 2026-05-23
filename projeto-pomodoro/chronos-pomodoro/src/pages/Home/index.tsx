import { useEffect, useMemo } from 'react';
import { Container } from '../../components/Container';
import { CountDown } from '../../components/CountDown';
import { MainForm } from '../../components/MainForm';
import { useAuth } from '../../contexts/AuthContext/useAuth';
import type { AuthUser } from '../../services/authApi';
import { MainTemplate } from '../../templates/MainTemplate';
import styles from './styles.module.css';

/**
 * Retorna saudação conforme o horário local (Bom dia / Boa tarde / Boa noite).
 */
function getTimeOfDayGreeting(): string {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'Bom dia';
  if (hour >= 12 && hour < 18) return 'Boa tarde';
  return 'Boa noite';
}

/**
 * Nome amigável para exibição: nome cadastrado ou parte local do e-mail.
 */
function getDisplayName(user: AuthUser): string {
  const trimmed = user.name?.trim();
  if (trimmed) return trimmed;
  const local = user.email.split('@')[0];
  return local || user.email;
}

export function Home() {
  const { user } = useAuth();

  const welcomeLine = useMemo(() => {
    if (!user) return null;
    return `${getTimeOfDayGreeting()}! Seja Bem-vindo(a), ${getDisplayName(user)}.`;
  }, [user]);

  useEffect(() => {
    document.title = 'Chronos Pomodoro';
  }, []);

  return (
    <MainTemplate>
      {welcomeLine ? (
        <Container>
          <p className={styles.welcome} role='status'>
            {welcomeLine}
          </p>
        </Container>
      ) : null}

      <Container>
        <CountDown />
      </Container>

      <Container>
        <MainForm />
      </Container>
    </MainTemplate>
  );
}
