import { useCallback } from 'react';
import { Button } from '../../ui/Button';
import { ZOOM_STEP } from '../../../constants';
import IconMinus from '../../../assets/icon-minus.svg?react';
import IconPlus from '../../../assets/icon-plus.svg?react';
import IconReload from '../../../assets/icon-reload.svg?react';
import styles from './ZoomControls.module.scss';

const MIN_RANGE_MS = 24 * 60 * 60 * 1000;
const SHRINK_FACTOR = 1 - ZOOM_STEP;

const getZoomInDelta = (range: number) => Math.round((range * ZOOM_STEP) / 2);
const getZoomOutDelta = (range: number) => Math.round((range * ZOOM_STEP) / (2 * SHRINK_FACTOR));

interface ZoomControlsProps {
  zoomDomain: [Date, Date] | null;
  fullDomain: [Date, Date];
  onZoomChange: (domain: [Date, Date] | null) => void;
  onResetZoom: () => void;
}

export function ZoomControls({
  zoomDomain,
  fullDomain,
  onZoomChange,
  onResetZoom,
}: ZoomControlsProps) {
  const currentDomain = zoomDomain || fullDomain;
  const [currentStart, currentEnd] = currentDomain;
  const [fullStart, fullEnd] = fullDomain;

  const handleZoomIn = useCallback(() => {
    const range = currentEnd.getTime() - currentStart.getTime();
    const nextRange = range * SHRINK_FACTOR;
    if (nextRange < MIN_RANGE_MS) return;
  
    const delta = getZoomInDelta(range);
    onZoomChange([
      new Date(currentStart.getTime() + delta),
      new Date(currentEnd.getTime() - delta),
    ]);
  }, [currentStart, currentEnd, onZoomChange]);

  const handleZoomOut = useCallback(() => {
    if (!zoomDomain) return;
  
    const range = currentEnd.getTime() - currentStart.getTime();
    const delta = getZoomOutDelta(range);
  
    const proposedStart = new Date(currentStart.getTime() - delta);
    const proposedEnd = new Date(currentEnd.getTime() + delta);
    const clampedStart = new Date(Math.max(proposedStart.getTime(), fullStart.getTime()));
    const clampedEnd = new Date(Math.min(proposedEnd.getTime(), fullEnd.getTime()));
  
    if (clampedStart.getTime() === fullStart.getTime() &&
        clampedEnd.getTime() === fullEnd.getTime()) {
      onResetZoom();
      return;
    }
  
    onZoomChange([clampedStart, clampedEnd]);
  }, [zoomDomain, currentStart, currentEnd, fullStart, fullEnd, onZoomChange, onResetZoom]);

  const canZoomIn = useCallback(() => {
    const range = currentEnd.getTime() - currentStart.getTime();
    return range * SHRINK_FACTOR >= MIN_RANGE_MS;
  }, [currentStart, currentEnd]);

  const isZoomed = zoomDomain !== null;

  return (
    <div className={styles['zoom-controls']}>
      <div className={styles['zoom-controls__group']}>
        <Button
          onClick={handleZoomOut}
          disabled={!isZoomed}
          title="Zoom out"
          aria-label="Zoom out"
        >
          <IconMinus />
        </Button>
  
        <Button
          onClick={handleZoomIn}
          disabled={!canZoomIn()}
          title="Zoom in"
          aria-label="Zoom in"
        >
          <IconPlus />
        </Button>
      </div>
  
      <Button
        onClick={onResetZoom}
        disabled={!isZoomed}
        title="Reset zoom"
        aria-label="Reset zoom"
        variant="ghost"
      >
        <IconReload />
      </Button>
    </div>
  );
}