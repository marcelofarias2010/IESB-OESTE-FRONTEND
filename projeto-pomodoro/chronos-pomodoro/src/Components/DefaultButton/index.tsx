import styles from './styles.module.css';

type DefaultButtonProps = {
  icon: React.ReactNode; // Aceita componentes, texto, HTML, etc.
  color?: 'green' | 'red'; // Union Type: Só aceita essas duas strings
} & React.ComponentProps<'button'>; // Herda as propriedades nativas de um botão (onClick, disabled, etc)

export function DefaultButton({
  icon,
  color = 'green', // Valor padrão: se ninguém enviar a cor, será verde!
  ...props
}: DefaultButtonProps) {
  return (
    <>
      {/* A Mágica do CSS Modules Dinâmico:
        Usamos colchetes styles[color] para acessar a classe CSS de forma dinâmica.
        Se color for 'red', o React lê: styles['red'] e aplica a classe .red do CSS!
      */}
      <button className={`${styles.button} ${styles[color]}`} {...props}>
        {icon}
      </button>
    </>
  );
}