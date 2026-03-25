import { HistoryIcon, HouseIcon, SettingsIcon, SunIcon, MoonIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import styles from './styles.module.css';

export function Menu() {
  // Estado para saber se está dark ou light
  const [isDark, setIsDark] = useState(true);

  function toggleTheme() {
    setIsDark(!isDark);
    // Adiciona ou remove a classe 'light-theme' do <body>
    document.body.classList.toggle('light-theme');
  }

  return (
    <nav className={styles.menu}>
      <a className={styles.menuLink} href='#'><HouseIcon /></a>
      <a className={styles.menuLink} href='#'><HistoryIcon /></a>
      <a className={styles.menuLink} href='#'><SettingsIcon /></a>

      {/* Botão que troca o tema */}
      <button className={styles.menuLink} onClick={toggleTheme} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}>
        {isDark ? <SunIcon /> : <MoonIcon />}
      </button>
    </nav>
  );
}