export interface RawVariation {
  id?: number;
  name: string;
}

export interface RawDataPoint {
  date: string;
  visits: Record<string, number>;
  conversions: Record<string, number>;
}

export interface RawData {
  variations: RawVariation[];
  data: RawDataPoint[];
}

export interface ChartDataPoint {
  date: Date;
  variationId: string;
  variationName: string;
  conversionRate: number;
  visits: number;
  conversions: number;
}

export interface Variation {
  id: string;
  name: string;
  color: string;
}

export type Timeframe = 'day' | 'week';
export type LineStyle = 'line' | 'smooth' | 'area';
export type TooltipAlign = 'left' | 'center' | 'right';
export type Theme = 'light' | 'dark';

export interface ChartState {
  selectedVariations: Set<string>;
  timeframe: Timeframe;
  lineStyle: LineStyle;
  theme: Theme;
  hoveredDate: Date | null;
}

export interface ZoomDomain {
  start: Date;
  end: Date;
}

export interface ChartMargin {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface ChartDimensions {
  width: number;
  height: number;
  margin: ChartMargin;
}

