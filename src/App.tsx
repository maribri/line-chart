import { useRef } from 'react';
import { Chart } from './components/Chart';
import { LineChart } from './components/LineChart';
import { VariationSelector } from './components/Controls/VariationSelector';
import { TimeframeToggle } from './components/Controls/TimeframeToggle';
import { LineStyleSelector } from './components/Controls/LineStyleSelector';
import { ThemeToggle } from './components/Controls/ThemeToggle';
import { ZoomControls } from './components/Controls/ZoomControls';
import { ExportButton } from './components/Controls/ExportButton';
import { useChartData } from './hooks/useChartData';
import { useAppState } from './hooks/useAppState';
import rawData from '../data.json';
import type { RawData } from './types';
import styles from './App.module.scss';

const data = rawData as RawData;

function App() {
  const chartContainerRef = useRef<HTMLDivElement>(null);

  const {
    selectedVariations,
    toggleVariation,
    setSelectedVariationsBatch,
    timeframe,
    setTimeframe,
    lineStyle,
    setLineStyle,
    theme,
    setTheme,
    zoomDomain,
    setZoomDomain,
    resetZoom,
  } = useAppState();

  const { data: chartData, xDomain, yDomain, fullXDomain } = useChartData({
    rawData: data,
    timeframe,
    selectedVariations,
    zoomDomain,
  });

  return (
    <div className={styles.app}>
      <header className={styles.app__header}>
        <h1 className={styles.app__title}>A/B Test Conversion Rate</h1>
        <ThemeToggle value={theme} onChange={setTheme} />
      </header>

      <main className={styles.app__main}>
        <div className={styles.app__controls}>
          <div className={styles['app__controls-left']}>
            <VariationSelector
              selectedVariations={selectedVariations}
              onToggleVariation={toggleVariation}
              onSetVariations={setSelectedVariationsBatch}
            />
            <TimeframeToggle value={timeframe} onChange={setTimeframe} />
          </div>

          <div className={styles['app__controls-right']}>
            <LineStyleSelector value={lineStyle} onChange={setLineStyle} />
            
            <ExportButton 
              chartRef={chartContainerRef}
              filename="ab-test-conversion-rate"
            />
            
            <ZoomControls
              zoomDomain={zoomDomain}
              fullDomain={fullXDomain}
              onZoomChange={setZoomDomain}
              onResetZoom={resetZoom}
            />
          </div>
        </div>

        <div className={styles.app__chart} ref={chartContainerRef}>
          <Chart>
            {(dimensions) => (
              <LineChart
                data={chartData}
                dimensions={dimensions}
                lineStyle={lineStyle}
                xDomain={xDomain}
                yDomain={yDomain}
                timeframe={timeframe}
              />
            )}
          </Chart>
        </div>
      </main>
    </div>
  );
}

export default App;