import styles from './Heading.module.css';

// src/components/Heading.tsx

// 1. Criamos o "contrato" do componente
type HeadingProps = {
  // Agora aceitamos texto OU outros componentes JSX!
  children: React.ReactNode;
};

export function Heading({ children }: HeadingProps) {
  return <h1 className={styles.heading}>{children}</h1>;
}