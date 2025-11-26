import { useMemo, useState, useCallback, useRef } from 'react';
import { Group } from '@visx/group';
import { AreaClosed, Line, LinePath } from '@visx/shape';
import { scaleTime, scaleLinear } from '@visx/scale';
import { AxisBottom, AxisLeft } from '@visx/axis';
import { GridRows, GridColumns } from '@visx/grid';
import { curveMonotoneX } from '@visx/curve';
import { bisector } from 'd3-array';
import type { ChartDataPoint, ChartDimensions, LineStyle, TooltipAlign, Timeframe } from '../../types';
import { VARIATIONS, Y_AXIS_LABEL_GAP } from '../../constants';
import { ChartTooltip } from '../Tooltip';
import styles from './LineChart.module.scss';

interface LineChartProps {
  data: ChartDataPoint[];
  dimensions: ChartDimensions;
  lineStyle: LineStyle;
  xDomain: [Date, Date];
  yDomain: [number, number];
  timeframe: Timeframe;
}

const bisectDate = bisector<Date, Date>(d => d).center;
const TOOLTIP_SAFE_SPACE = 80;

export function LineChart({
  data,
  dimensions,
  lineStyle,
  xDomain,
  yDomain,
  timeframe,
}: LineChartProps) {
  const { width, height, margin } = dimensions;
  const svgRef = useRef<SVGSVGElement>(null);
  
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [tooltipAlign, setTooltipAlign] = useState<TooltipAlign>('center');

  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const xScale = useMemo(
    () =>
      scaleTime<number>({
        domain: xDomain,
        range: [0, innerWidth],
      }),
    [xDomain, innerWidth]
  );

  const yScale = useMemo(
    () =>
      scaleLinear<number>({
        domain: yDomain,
        range: [innerHeight, 0],
      }),
    [yDomain, innerHeight]
  );

  const dataByVariation = useMemo(() => {
    const grouped = new Map<string, ChartDataPoint[]>();
    
    for (const point of data) {
      if (!grouped.has(point.variationId)) {
        grouped.set(point.variationId, []);
      }
      grouped.get(point.variationId)!.push(point);
    }
    
    for (const points of grouped.values()) {
      points.sort((a, b) => a.date.getTime() - b.date.getTime());
    }
    
    return grouped;
  }, [data]);

  const dataByDate = useMemo(() => {
    const map = new Map<number, ChartDataPoint[]>();
    for (const point of data) {
      const key = point.date.getTime();
      if (!map.has(key)) {
        map.set(key, []);
      }
      map.get(key)!.push(point);
    }
    return map;
  }, [data]);

  const isAreaStyle = lineStyle === 'area';

  const curve = useMemo(() => {
    switch (lineStyle) {
      case 'smooth':
      case 'area':
        return curveMonotoneX;
      case 'line':
      default:
        return undefined;
    }
  }, [lineStyle]);

  const getDate = (d: ChartDataPoint) => d.date;
  const getConversionRate = (d: ChartDataPoint) => d.conversionRate;

  const uniqueDates = useMemo(() => {
    const dates = Array.from(new Set(data.map(d => d.date.getTime())));
    return dates.sort((a, b) => a - b).map(t => new Date(t));
  }, [data]);

  const handleMouseMove = useCallback(
    (event: React.MouseEvent<SVGSVGElement>) => {
      if (!svgRef.current) return;

      const rect = svgRef.current.getBoundingClientRect();
      const x = event.clientX - rect.left - margin.left;
      const y = event.clientY - rect.top;

      if (x < 0 || x > innerWidth || y < margin.top || y > height - margin.bottom) {
        setHoveredDate(null);
        return;
      }

      const dateFromMouse = xScale.invert(x);

      const index = bisectDate(uniqueDates, dateFromMouse);
      let nearestDate = uniqueDates[Math.max(0, Math.min(uniqueDates.length - 1, index))];
      const prevDate = uniqueDates[index - 1];
      const nextDate = uniqueDates[index];
      if (prevDate && nextDate) {
        const diffPrev = Math.abs(dateFromMouse.getTime() - prevDate.getTime());
        const diffNext = Math.abs(nextDate.getTime() - dateFromMouse.getTime());
        nearestDate = diffNext < diffPrev ? nextDate : prevDate;
      }
      setHoveredDate(nearestDate);
      
      const xPos = xScale(nearestDate) + margin.left;
      let align: TooltipAlign = 'center';
      if (xPos < TOOLTIP_SAFE_SPACE) {
        align = 'left';
      } else if (xPos > width - TOOLTIP_SAFE_SPACE) {
        align = 'right';
      }
      setTooltipPosition({ x: xPos, y: margin.top });
      setTooltipAlign(align);
    },
    [xScale, uniqueDates, innerWidth, width, height, margin]
  );

  const handleMouseLeave = useCallback(() => {
    setHoveredDate(null);
  }, []);

  const hoveredData = useMemo(() => {
    if (!hoveredDate) return [];
    return dataByDate.get(hoveredDate.getTime()) ?? [];
  }, [hoveredDate, dataByDate]);

  if (innerWidth <= 0 || innerHeight <= 0) {
    return null;
  }

  return (
    <div className={styles.chart}>
      <svg
        ref={svgRef}
        width={width}
        height={height}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {isAreaStyle && (
          <defs>
            {VARIATIONS.map(variation => (
              <linearGradient
                key={variation.id}
                id={`area-gradient-${variation.id}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor={variation.color} stopOpacity={0.4} />
                <stop offset="100%" stopColor={variation.color} stopOpacity={0.05} />
              </linearGradient>
            ))}
          </defs>
        )}

        <Group left={margin.left} top={margin.top}>
          <GridRows
            scale={yScale}
            width={innerWidth}
            strokeDasharray="3,3"
            stroke="var(--color-grid)"
            strokeOpacity={0.3}
          />
          <GridColumns
            scale={xScale}
            height={innerHeight}
            strokeDasharray="3,3"
            stroke="var(--color-grid)"
            strokeOpacity={0.3}
          />

          {Array.from(dataByVariation.entries()).map(([variationId, points]) => {
            const variation = VARIATIONS.find(v => v.id === variationId);
            if (!variation) return null;

            return (
              <g key={variationId}>
                {isAreaStyle && (
                  <AreaClosed
                    data={points}
                    x={d => xScale(getDate(d)) ?? 0}
                    y={d => yScale(getConversionRate(d)) ?? 0}
                    yScale={yScale}
                    fill={`url(#area-gradient-${variationId})`}
                    stroke="none"
                    curve={curve}
                    className={styles.chart__area}
                  />
                )}

                <LinePath
                  data={points}
                  x={d => xScale(getDate(d)) ?? 0}
                  y={d => yScale(getConversionRate(d)) ?? 0}
                  stroke={variation.color}
                  strokeWidth={2}
                  curve={curve}
                  className={styles.chart__line}
                />
              </g>
            );
          })}

          <AxisBottom
            top={innerHeight}
            scale={xScale}
            tickLength={0}
            stroke="var(--color-axis-line)"
            tickStroke="var(--color-axis-line)"
            tickLabelProps={() => ({
              fill: 'var(--color-axis-text)',
              fontSize: 11,
              textAnchor: 'middle',
              dx: 24,
              dy: 12,
            })}
          />

          <AxisLeft
            scale={yScale}
            tickLength={0}
            stroke="var(--color-axis-line)"
            tickStroke="var(--color-axis-line)"
            tickLabelProps={() => ({
              fill: 'var(--color-axis-text)',
              fontSize: 11,
              textAnchor: 'end',
              dx: -Y_AXIS_LABEL_GAP,
            })}
            tickFormat={(value) => `${value}%`}
          />

          <Line
            from={{ x: innerWidth, y: 0 }}
            to={{ x: innerWidth, y: innerHeight }}
            stroke="var(--color-axis-line)"
            strokeWidth={1}
          />

          <Line
            from={{ x: 0, y: 0 }}
            to={{ x: innerWidth, y: 0 }}
            stroke="var(--color-axis-line)"
            strokeWidth={1}
          />

          {hoveredDate && (
            <Line
              from={{ x: xScale(hoveredDate), y: 0 }}
              to={{ x: xScale(hoveredDate), y: innerHeight }}
              stroke="var(--color-crosshair)"
              strokeWidth={1}
              strokeDasharray="4,4"
              pointerEvents="none"
            />
          )}
        </Group>
      </svg>

      {hoveredDate && hoveredData.length > 0 && (
        <ChartTooltip
          data={hoveredData}
          timeframe={timeframe}
          x={tooltipPosition.x}
          y={tooltipPosition.y}
          align={tooltipAlign}
        />
      )}
    </div>
  );
}

