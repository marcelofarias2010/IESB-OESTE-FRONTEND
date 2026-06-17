import { TimerIcon } from 'lucide-react';
import styles from './styles.module.css';

export function Logo() {
  return (
    <div className={styles.logo}>
      {/* Usamos a tag <a> provisoriamente. No futuro, trocaremos pelo Link do React Router */}
      <a className={styles.logoLink} href='#'>
        <TimerIcon />
        <span>Chronos</span>
      </a>
    </div>
  );
}