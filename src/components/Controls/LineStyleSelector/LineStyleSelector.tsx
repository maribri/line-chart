import { Select } from '../../ui/Select';
import type { LineStyle } from '../../../types';
import styles from './LineStyleSelector.module.scss';

interface LineStyleSelectorProps {
  value: LineStyle;
  onChange: (lineStyle: LineStyle) => void;
}

export function LineStyleSelector({ value, onChange }: LineStyleSelectorProps) {
  return (
    <div className={styles.selector}>
      <Select
        value={value}
        onChange={(val) => onChange(val as LineStyle)}
      >
        <option value="line">Line style: line</option>
        <option value="smooth">Line style: smooth</option>
        <option value="area">Line style: area</option>
      </Select>
    </div>
  );
}

