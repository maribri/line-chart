import type { ReactNode } from 'react';
import styles from './Button.module.scss';

interface ButtonProps {
  onClick?: () => void;
  children: ReactNode;
  variant?: 'primary' | 'ghost';
  active?: boolean;
  disabled?: boolean;
  className?: string;
  title?: string;
}

export function Button({
  onClick,
  children,
  variant = 'primary',
  active = false,
  disabled = false,
  className = '',
  title,
}: ButtonProps) {
  const classNames = [
    styles.button,
    styles[`button--${variant}`],
    active && styles['button--active'],
    disabled && styles['button--disabled'],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type="button"
      onClick={onClick}
      className={classNames}
      disabled={disabled}
      title={title}
    >
      {children}
    </button>
  );
}

