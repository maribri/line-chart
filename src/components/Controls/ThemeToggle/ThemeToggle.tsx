import { Button } from '../../ui/Button';
import type { Theme } from '../../../types';
import styles from './ThemeToggle.module.scss';

interface ThemeToggleProps {
  value: Theme;
  onChange: (theme: Theme) => void;
}

export function ThemeToggle({ value, onChange }: ThemeToggleProps) {
  const handleToggle = () => {
    onChange(value === 'light' ? 'dark' : 'light');
  };

  return (
    <div className={styles.toggle}>
      <Button
        onClick={handleToggle}
        variant="ghost"
        title={`Switch to ${value === 'light' ? 'dark' : 'light'} mode`}
        className={styles.toggle__button}
      >
        {value === 'light' ? '🌙' : '☀️'}
      </Button>
    </div>
  );
}

