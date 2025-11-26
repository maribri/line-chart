import { useCallback, useState, type RefObject } from 'react';
import { toPng } from 'html-to-image';
import { Button } from '../../ui/Button';
import IconExport from '../../../assets/icon-export.svg?react';
import styles from './ExportButton.module.scss';

interface ExportButtonProps {
  chartRef: RefObject<HTMLDivElement | null>;
  filename?: string;
}

export function ExportButton({ chartRef, filename }: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleExport = useCallback(async () => {
    const chartElement = chartRef.current;
    if (!chartElement) {
      console.error('Chart element not found');
      setError('Chart not found');
      return;
    }

    setIsExporting(true);
    setError(null);

    try {
      const dataUrl = await toPng(chartElement, {
        quality: 1.0,
        pixelRatio: 2,
        backgroundColor: getComputedStyle(document.documentElement)
          .getPropertyValue('--color-background')
          .trim() || '#ffffff',
        skipFonts: true,
        filter: (node: HTMLElement) => {
          const className = node.className || '';
          if (typeof className === 'string' && className.includes('tooltip')) {
            return false;
          }
          if (node.getAttribute && node.getAttribute('data-exclude-export') === 'true') {
            return false;
          }
          return true;
        },
      });

      const link = document.createElement('a');
      
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
      link.download = filename || `chart-export-${timestamp}.png`;
      
      link.href = dataUrl;
      
      document.body.appendChild(link);
      link.click();
      
      document.body.removeChild(link);
      
      console.log('Chart exported successfully');
    } catch (err) {
      console.error('Failed to export chart:', err);
      setError('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  }, [chartRef, filename]);

  return (
    <>
      <Button
        onClick={handleExport}
        disabled={isExporting}
        title={isExporting ? "Exporting..." : "Export chart as PNG"}
        aria-label="Export chart"
        className={styles['export-button']}
      >
        {isExporting ? (
          <svg 
            className={styles.exportButton__spinner} 
            width="16" 
            height="16" 
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle 
              cx="8" 
              cy="8" 
              r="6" 
              strokeDasharray="28"
              strokeLinecap="round"
            />
          </svg>
        ) : (
          <IconExport />
        )}
      </Button>
      
      {error && (
        <p className={styles.exportButton__error} role="alert">
          {error}
        </p>
      )}
    </>
  );
}