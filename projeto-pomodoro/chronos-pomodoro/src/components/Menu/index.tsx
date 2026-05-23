import {
  HistoryIcon,
  HouseIcon,
  LogOutIcon,
  MoonIcon,
  SettingsIcon,
  SunIcon,
} from 'lucide-react';
import styles from './styles.module.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { RouterLink } from '../RouterLink';
import { useAuth } from '../../contexts/AuthContext/useAuth';

type AvailableThemes = 'dark' | 'light';

export function Menu() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [theme, setTheme] = useState<AvailableThemes>(() => {
    const storageTheme =
      (localStorage.getItem('theme') as AvailableThemes) || 'dark';
    return storageTheme;
  });

  const nextThemeIcon = {
    dark: <SunIcon />,
    light: <MoonIcon />,
  };

  function handleThemeChange(
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
  ) {
    event.preventDefault();

    setTheme(prevTheme => {
      const nextTheme = prevTheme === 'dark' ? 'light' : 'dark';
      return nextTheme;
    });
  }

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  function handleLogout(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    logout();
    navigate('/login/', { replace: true });
  }

  return (
    <nav className={styles.menu}>
      <RouterLink
        className={styles.menuLink}
        href='/home/'
        aria-label='Ir para a Home'
        title='Ir para a Home'
      >
        <HouseIcon />
      </RouterLink>

      <RouterLink
        className={styles.menuLink}
        href='/history/'
        aria-label='Ver Histórico'
        title='Ver Histórico'
      >
        <HistoryIcon />
      </RouterLink>

      <RouterLink
        className={styles.menuLink}
        href='/settings/'
        aria-label='Configurações'
        title='Configurações'
      >
        <SettingsIcon />
      </RouterLink>

      <a
        className={styles.menuLink}
        href='#'
        aria-label='Mudar Tema'
        title='Mudar Tema'
        onClick={handleThemeChange}
      >
        {nextThemeIcon[theme]}
      </a>

      <button
        type='button'
        className={styles.menuLink}
        aria-label='Sair da conta'
        title='Sair da conta'
        onClick={handleLogout}
      >
        <LogOutIcon />
      </button>
    </nav>
  );
}
