import styles from './styles.module.css'
import React from 'react'

type Props = {
  id: string
  labelText: string
} & React.ComponentProps<'input'>

export function DefaultInput({ id, labelText, ...rest }: Props) {
  return (
    <>
      <label htmlFor={id}>{labelText}</label>
      <input className={styles.input} id={id} {...rest} />
    </>
  )
}