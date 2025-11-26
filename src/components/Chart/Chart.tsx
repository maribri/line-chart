import { useRef, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { ChartDimensions } from '../../types';
import { DEFAULT_MARGIN, CHART_ASPECT_RATIO } from '../../constants';
import styles from './Chart.module.scss';

interface ChartProps {
  children: (dimensions: ChartDimensions) => ReactNode;
}

export function Chart({ children }: ChartProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [width, setWidth] = useState(0);
  
  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setWidth(entry.contentRect.width);
      }
    });
    
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    
    return () => {
      observer.disconnect();
    };
  }, []);
  
  const height = width / CHART_ASPECT_RATIO;
  
  const dimensions: ChartDimensions = {
    width,
    height,
    margin: DEFAULT_MARGIN,
  };
  
  return (
    <div className={styles.container} ref={containerRef}>
      {width > 0 ? children(dimensions) : null}
    </div>
  );
}