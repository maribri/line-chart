import { useEffect, useMemo, useRef, useState } from 'react';
import { VARIATIONS } from '../../../constants';
import IconChevron from '../../../assets/icon-chevron.svg?react';
import styles from './VariationSelector.module.scss';

interface VariationSelectorProps {
  selectedVariations: Set<string>;
  onToggleVariation: (variationId: string) => void;
  onSetVariations: (next: Set<string>) => void;
}

export function VariationSelector({
  selectedVariations,
  onToggleVariation,
  onSetVariations,
}: VariationSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const allSelected = selectedVariations.size === VARIATIONS.length;
  const summaryLabel = useMemo(() => {
    if (allSelected) return 'All variations selected';
    const selectedNames = VARIATIONS.filter(v => selectedVariations.has(v.id)).map(v => v.name);
    if (selectedNames.length <= 2) {
      return selectedNames.join(', ');
    }
    return `${selectedNames.length} variations selected`;
  }, [allSelected, selectedVariations]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'Escape') {
      setIsOpen(false);
    }
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setIsOpen(prev => !prev);
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setIsOpen(true);
    }
  };

  const handleToggle = (variationId: string) => {
    if (selectedVariations.size === 1 && selectedVariations.has(variationId)) {
      return;
    }
    onToggleVariation(variationId);
  };

  const handleSelectAll = () => {
    if (allSelected) return;
    const next = new Set(VARIATIONS.map(variation => variation.id));
    onSetVariations(next);
    setIsOpen(false);
  };

  return (
    <div className={styles.selector} ref={containerRef}>
      <button
        id="variation-select"
        type="button"
        className={styles.selector__control}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label="Select variations"
        onClick={() => setIsOpen(prev => !prev)}
        onKeyDown={handleKeyDown}
      >
        <span className={styles.selector__value}>{summaryLabel}</span>
        <IconChevron className={styles.selector__chevron} aria-hidden="true" />
      </button>

      {isOpen && (
        <div className={styles.selector__dropdown}>
          <button
            type="button"
            className={`${styles.selector__option} ${styles['selector__option--action']}`}
            onClick={handleSelectAll}
            disabled={allSelected}
          >
            Select all variations
          </button>

          <ul className={styles.selector__options} role="listbox" aria-multiselectable="true">
            {VARIATIONS.map(variation => {
              const isSelected = selectedVariations.has(variation.id);
              const isLastSelected = selectedVariations.size === 1 && isSelected;

              return (
                <li key={variation.id}>
                  <button
                    type="button"
                    className={`${styles.selector__option} ${
                      isSelected ? styles['selector__option--selected'] : ''
                    }`}
                    onClick={() => handleToggle(variation.id)}
                    disabled={isLastSelected}
                  >
                    <span
                      className={styles.selector__swatch}
                      style={{ backgroundColor: variation.color }}
                      aria-hidden
                    />
                    <span className={styles.selector__name}>{variation.name}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

