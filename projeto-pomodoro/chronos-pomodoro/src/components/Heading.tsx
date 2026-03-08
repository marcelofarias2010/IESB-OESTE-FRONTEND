import styles from './Heading.module.css';

export function Heading(props) {
  return <h1 className={styles.heading}>{props.children}</h1>;
}
