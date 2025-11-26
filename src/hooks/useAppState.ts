import { useState, useEffect, useCallback } from 'react';
import type { Timeframe, LineStyle, Theme } from '../types';
import {
  STORAGE_KEY_THEME,
  STORAGE_KEY_SELECTED_VARIATIONS,
  STORAGE_KEY_TIMEFRAME,
  STORAGE_KEY_LINE_STYLE,
} from '../constants';
import { VARIATIONS } from '../constants';

function getStoredValue<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function getSystemTheme(): Theme {
  if (typeof window === 'undefined') return 'light';
  
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

export function useAppState() {
  const [selectedVariations, setSelectedVariations] = useState<Set<string>>(() => {
    const stored = getStoredValue<string[]>(
      STORAGE_KEY_SELECTED_VARIATIONS,
      VARIATIONS.map(v => v.id)
    );
    return new Set(stored);
  });

  const [timeframeState, setTimeframeState] = useState<Timeframe>(() =>
    getStoredValue<Timeframe>(STORAGE_KEY_TIMEFRAME, 'day')
  );

  const [lineStyle, setLineStyle] = useState<LineStyle>(() =>
    getStoredValue<LineStyle>(STORAGE_KEY_LINE_STYLE, 'smooth')
  );

  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'light';
    const stored = window.localStorage.getItem(STORAGE_KEY_THEME);
    return stored ? (stored as Theme) : getSystemTheme();
  });

  const [zoomDomain, setZoomDomain] = useState<[Date, Date] | null>(null);

  const setSelectedVariationsBatch = useCallback((next: Set<string>) => {
    setSelectedVariations(new Set(next));
    setZoomDomain(null);
  }, []);

  const handleSetTimeframe = useCallback((next: Timeframe) => {
    setTimeframeState(next);
    setZoomDomain(null);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(
      STORAGE_KEY_SELECTED_VARIATIONS,
      JSON.stringify(Array.from(selectedVariations))
    );
  }, [selectedVariations]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY_TIMEFRAME, JSON.stringify(timeframeState));
  }, [timeframeState]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY_LINE_STYLE, JSON.stringify(lineStyle));
  }, [lineStyle]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY_THEME, theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleVariation = useCallback((variationId: string) => {
    setSelectedVariations(prev => {
      const next = new Set(prev);
      if (next.has(variationId)) {
        if (next.size <= 1) {
          return prev;
        }
        next.delete(variationId);
      } else {
        next.add(variationId);
      }
      setZoomDomain(null);
      return next;
    });
  }, []);

  const resetZoom = useCallback(() => {
    setZoomDomain(null);
  }, []);

  return {
    selectedVariations,
    toggleVariation,
    setSelectedVariationsBatch,
    timeframe: timeframeState,
    setTimeframe: handleSetTimeframe,
    lineStyle,
    setLineStyle,
    theme,
    setTheme,
    zoomDomain,
    setZoomDomain,
    resetZoom,
  };
}