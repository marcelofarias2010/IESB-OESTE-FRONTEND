import { useEffect } from 'react';
import styles from './authPages.module.css';

type AuthPageShellProps = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
};

/**
 * Layout comum das telas de autenticação (tema e fundo).
 */
export function AuthPageShell({ title, subtitle, children }: AuthPageShellProps) {
  useEffect(() => {
    const theme = (localStorage.getItem('theme') as 'dark' | 'light') || 'dark';
    document.documentElement.setAttribute('data-theme', theme);
  }, []);

  return (
    <div className={styles.shell}>
      <div className={styles.card}>
        <h1 className={styles.title}>{title}</h1>
        {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}
        {children}
      </div>
    </div>
  );
}
