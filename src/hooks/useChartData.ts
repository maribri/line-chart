import { useMemo } from 'react';
import type { RawData, ChartDataPoint, Timeframe } from '../types';
import { getProcessedData, getConversionRateExtent, getDateExtent } from '../utils/dataTransform';
import { Y_AXIS_PADDING_PERCENT } from '../constants';

interface UseChartDataParams {
  rawData: RawData;
  timeframe: Timeframe;
  selectedVariations: Set<string>;
  zoomDomain?: [Date, Date] | null;
}

interface UseChartDataReturn {
  data: ChartDataPoint[];
  yDomain: [number, number];
  xDomain: [Date, Date];
  fullXDomain: [Date, Date];
}

export function useChartData({
  rawData,
  timeframe,
  selectedVariations,
  zoomDomain = null,
}: UseChartDataParams): UseChartDataReturn {
  const data = useMemo(() => {
    return getProcessedData(rawData, timeframe, selectedVariations);
  }, [rawData, timeframe, selectedVariations]);

  const fullXDomain = useMemo((): [Date, Date] => {
    return getDateExtent(data);
  }, [data]);

  const xDomain = useMemo((): [Date, Date] => {
    const [fullStart, fullEnd] = fullXDomain;

    if (!zoomDomain) {
      return fullXDomain;
    }

    const clampedStart = zoomDomain[0] < fullStart ? fullStart : zoomDomain[0];
    const clampedEnd = zoomDomain[1] > fullEnd ? fullEnd : zoomDomain[1];

    if (clampedStart.getTime() >= clampedEnd.getTime()) {
      return fullXDomain;
    }

    return [clampedStart, clampedEnd];
  }, [zoomDomain, fullXDomain]);

  const visibleData = useMemo(() => {
    const [startDate, endDate] = xDomain;
    return data.filter(d => d.date >= startDate && d.date <= endDate);
  }, [data, xDomain]);

  const yDomain = useMemo((): [number, number] => {
    const [, max] = getConversionRateExtent(visibleData);
    
    const paddedMax = max + (max * Y_AXIS_PADDING_PERCENT);
    
    return [0, paddedMax];
  }, [visibleData]);

  return {
    data: visibleData,
    yDomain,
    xDomain,
    fullXDomain,
  };
}