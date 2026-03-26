import React from 'react';
import styles from './style.module.css';

type DefaultInputProps = {
    id: string;
    labelText?: string;
} & React.ComponentProps<'input'>;

export function DefaultInput({
    id,
    labelText,
    ...rest
}: DefaultInputProps) {
    return (
        <div className={styles.inputWrapper}>
            {labelText && (
                <label className={styles.label} htmlFor={id}>
                    {labelText}
                </label>
            )}

            <input
                className={styles.input}
                id={id}
                {...rest}
            />
        </div>
    );
}