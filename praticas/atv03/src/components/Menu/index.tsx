import styles from './styles.module.css'

export function Menu() {
  return (
    <nav className={styles.menu}>
      <a href="#">Home</a>
      <a href="#">Histórico</a>
      <a href="#">Configurações</a>
    </nav>
  )
}