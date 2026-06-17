import styles from './styles.module.css'; // <-- Importando o CSS Module

type DefaultInputProps = {
  id: string;
  labelText: string;
} & React.ComponentProps<'input'>;

export function DefaultInput({
  id,
  type,
  labelText,
  ...rest
}: DefaultInputProps) {
  return (
    <>
      <label htmlFor={id}>{labelText}</label>
      {/* Aplicando a classe dinâmica gerada pelo CSS Module */}
      <input className={styles.input} id={id} type={type} {...rest} />
    </>
  );
}