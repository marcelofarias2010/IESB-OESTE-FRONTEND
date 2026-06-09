import {
  HistoryIcon,
  HouseIcon,
  MoonIcon,
  SettingsIcon,
  SunIcon,
  LogOutIcon,
} from 'lucide-react';
import styles from './styles.module.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RouterLink } from '../RouterLink';
import { useAuth } from '../../contexts/AuthContext';

type AvailableThemes = 'dark' | 'light';

export function Menu() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [theme, setTheme] = useState<AvailableThemes>(() => {
    return (localStorage.getItem('theme') as AvailableThemes) || 'dark';
  });

  const nextThemeIcon = {
    dark: <SunIcon />,
    light: <MoonIcon />,
  };

  function handleThemeChange(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  }

  function handleLogout(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    logout();
    navigate('/login');
  }

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <nav className={styles.menu}>
      {user && (
        <span className={styles.welcome} title={`Logado como ${user.email}`}>
          Olá, {user.name.split(' ')[0]}!
        </span>
      )}

      <RouterLink
        className={styles.menuLink}
        href='/'
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

      <a
        className={styles.menuLink}
        href='#'
        aria-label='Sair'
        title='Sair'
        onClick={handleLogout}
      >
        <LogOutIcon />
      </a>
    </nav>
  );
}
