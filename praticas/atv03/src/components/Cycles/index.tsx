import styles from './styles.module.css'

export function Cycles() {
  return (
    <div className={styles.cycles}>
      <span>Ciclos:</span>

      <div className={styles.cycleDots}>
        <span className={`${styles.dot} ${styles.work}`} />
        <span className={`${styles.dot} ${styles.short}`} />
        <span className={`${styles.dot} ${styles.work}`} />
        <span className={`${styles.dot} ${styles.short}`} />
        <span className={`${styles.dot} ${styles.work}`} />
        <span className={`${styles.dot} ${styles.short}`} />
        <span className={`${styles.dot} ${styles.work}`} />
        <span className={`${styles.dot} ${styles.long}`} />
      </div>
    </div>
  )
}