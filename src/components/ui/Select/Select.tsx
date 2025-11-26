import type { ReactNode } from 'react';
import IconChevron from '../../../assets/icon-chevron.svg?react';
import styles from './Select.module.scss';

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
  className?: string;
}

export function Select({ value, onChange, children, className }: SelectProps) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className={`${styles.select} ${className || ''}`}>
      <div className={styles['select__control-wrapper']}>
        <select
          value={value}
          onChange={handleChange}
          className={styles.select__control}
        >
          {children}
        </select>
        <IconChevron className={styles.select__chevron} aria-hidden="true" />
      </div>
    </div>
  );
}
