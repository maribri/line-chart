import { startOfWeek, addDays, format } from 'date-fns';
import type { RawData, RawDataPoint, ChartDataPoint, Timeframe } from '../types';
import { VARIATIONS } from '../constants';

export function calculateConversionRate(conversions: number, visits: number): number {
  if (visits === 0) return 0;
  return (conversions / visits) * 100;
}

function transformDataPoint(rawPoint: RawDataPoint): ChartDataPoint[] {
  const date = new Date(rawPoint.date);
  const chartPoints: ChartDataPoint[] = [];

  const variationIds = Object.keys(rawPoint.visits);

  for (const variationId of variationIds) {
    const visits = rawPoint.visits[variationId] || 0;
    const conversions = rawPoint.conversions[variationId] || 0;
    
    if (visits === 0 && conversions === 0) continue;

    const variation = VARIATIONS.find(v => v.id === variationId);
    const variationName = variation?.name || `Variation ${variationId}`;

    chartPoints.push({
      date,
      variationId,
      variationName,
      visits,
      conversions,
      conversionRate: calculateConversionRate(conversions, visits),
    });
  }

  return chartPoints;
}

export function transformRawData(rawData: RawData): ChartDataPoint[] {
  const allPoints: ChartDataPoint[] = [];

  for (const rawPoint of rawData.data) {
    const points = transformDataPoint(rawPoint);
    allPoints.push(...points);
  }

  return allPoints;
}

export function aggregateByWeek(dataPoints: ChartDataPoint[]): ChartDataPoint[] {
  const weekGroups = new Map<string, ChartDataPoint[]>();

  for (const point of dataPoints) {
    const weekStart = startOfWeek(point.date, { weekStartsOn: 1 });
    const key = `${weekStart.getTime()}-${point.variationId}`;

    if (!weekGroups.has(key)) {
      weekGroups.set(key, []);
    }
    weekGroups.get(key)!.push(point);
  }

  const aggregatedPoints: ChartDataPoint[] = [];

  for (const [key, points] of weekGroups.entries()) {
    const totalVisits = points.reduce((sum, p) => sum + p.visits, 0);
    const totalConversions = points.reduce((sum, p) => sum + p.conversions, 0);
    const weekStart = new Date(parseInt(key.split('-')[0]));
    
    const firstPoint = points[0];

    aggregatedPoints.push({
      date: weekStart,
      variationId: firstPoint.variationId,
      variationName: firstPoint.variationName,
      visits: totalVisits,
      conversions: totalConversions,
      conversionRate: calculateConversionRate(totalConversions, totalVisits),
    });
  }

  return aggregatedPoints;
}

export function filterByVariations(
  dataPoints: ChartDataPoint[],
  selectedVariations: Set<string>
): ChartDataPoint[] {
  return dataPoints.filter(point => selectedVariations.has(point.variationId));
}

export function getProcessedData(
  rawData: RawData,
  timeframe: Timeframe,
  selectedVariations: Set<string>
): ChartDataPoint[] {
  let data = transformRawData(rawData);

  if (timeframe === 'week') {
    data = aggregateByWeek(data);
  }

  data = filterByVariations(data, selectedVariations);

  data.sort((a, b) => a.date.getTime() - b.date.getTime());

  return data;
}

export function getConversionRateExtent(dataPoints: ChartDataPoint[]): [number, number] {
  if (dataPoints.length === 0) return [0, 100];

  const rates = dataPoints.map(d => d.conversionRate);
  const min = Math.min(...rates);
  const max = Math.max(...rates);

  return [Math.min(min, 0), max];
}

export function getDateExtent(dataPoints: ChartDataPoint[]): [Date, Date] {
  if (dataPoints.length === 0) {
    const now = new Date();
    return [now, now];
  }

  const dates = dataPoints.map(d => d.date);
  const minDate = new Date(Math.min(...dates.map(d => d.getTime())));
  const maxDate = new Date(Math.max(...dates.map(d => d.getTime())));

  return [minDate, maxDate];
}

export function formatTooltipDate(date: Date, timeframe: Timeframe): string {
  if (timeframe === 'week') {
    const weekEnd = addDays(date, 6);
    return `${format(date, 'MMM d')} - ${format(weekEnd, 'MMM d, yyyy')}`;
  }
  
  return format(date, 'MMM d, yyyy');
}

export function formatConversionRate(rate: number): string {
  return `${rate.toFixed(2)}%`;
}

