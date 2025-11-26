import type { ChartMargin, Variation } from '../types';

export const CHART_COLORS = {
  original: '#46464f',
  variationA: '#4142ef',
  variationB: '#ff8346',
  variationC: '#35bdad',
} as const;

export const VARIATIONS: Variation[] = [
  { id: '0', name: 'Original', color: CHART_COLORS.original },
  { id: '10001', name: 'Variation A', color: CHART_COLORS.variationA },
  { id: '10002', name: 'Variation B', color: CHART_COLORS.variationB },
  { id: '10003', name: 'Variation C', color: CHART_COLORS.variationC },
];

export const DEFAULT_MARGIN: ChartMargin = {
  top: 40,
  right: 5,
  bottom: 60,
  left: 46,
};

export const CHART_MIN_WIDTH = 671;
export const CHART_MAX_WIDTH = 1300;
export const CHART_ASPECT_RATIO = 16 / 9;

export const Y_AXIS_PADDING_PERCENT = 0.1;
export const Y_AXIS_LABEL_GAP = 14;

export const TRANSITION_DURATION = 300;
export const THEME_TRANSITION_DURATION = 200;

export const TOOLTIP_OFFSET_X = 10;
export const TOOLTIP_OFFSET_Y = 10;

export const STORAGE_KEY_THEME = 'line-chart-theme';
export const STORAGE_KEY_SELECTED_VARIATIONS = 'line-chart-selected-variations';
export const STORAGE_KEY_TIMEFRAME = 'line-chart-timeframe';
export const STORAGE_KEY_LINE_STYLE = 'line-chart-line-style';

export const ZOOM_STEP = 0.2;
export const STORAGE_KEY_ZOOM = 'line-chart-zoom-domain';