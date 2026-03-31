import styles from './styles.module.css'

type Props = {
  icon: React.ReactNode
  color?: 'green' | 'red'
} & React.ComponentProps<'button'>

export function DefaultButton({ icon, color = 'green', ...props }: Props) {
  return (
    <button className={`${styles.button} ${styles[color]}`} {...props}>
      {icon}
    </button>
  )
}