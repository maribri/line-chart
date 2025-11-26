import { Select } from '../../ui/Select';
import type { Timeframe } from '../../../types';
import styles from './TimeframeToggle.module.scss';

interface TimeframeToggleProps {
  value: Timeframe;
  onChange: (timeframe: Timeframe) => void;
}

export function TimeframeToggle({ value, onChange }: TimeframeToggleProps) {
  return (
    <div className={styles.toggle}>
      <Select
        value={value}
        onChange={next => onChange(next as Timeframe)}
      >
        <option value="day">Day</option>
        <option value="week">Week</option>
      </Select>
    </div>
  );
}
