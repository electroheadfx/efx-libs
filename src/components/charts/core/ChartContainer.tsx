'use client';

import { useId, useEffect, useRef } from 'react';
import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';
import type { CSSProperties } from 'react';
import { useAppTheme } from '@/providers/ThemeProvider';
import type { EChartsInstance } from '@/types/theme.types';

interface ChartContainerProps {
  option: EChartsOption;
  className?: string;
  style?: CSSProperties;
  notMerge?: boolean;
  lazyUpdate?: boolean;
  loading?: boolean;
  onChartReady?: (instance: EChartsInstance) => void;
}

export function ChartContainer({
  option,
  className = '',
  style,
  notMerge = false,
  lazyUpdate = true,
  loading = false,
  onChartReady,
}: ChartContainerProps) {
  const chartId = useId();
  const { echartsTheme, registerChart, unregisterChart } = useAppTheme();
  const chartRef = useRef<ReactECharts | null>(null);

  // Register/unregister chart with theme provider
  useEffect(() => {
    const instance = chartRef.current?.getEchartsInstance();
    if (instance) {
      registerChart(chartId, instance as unknown as EChartsInstance);
      onChartReady?.(instance as unknown as EChartsInstance);
    }

    return () => {
      unregisterChart(chartId);
    };
  }, [chartId, registerChart, unregisterChart, onChartReady]);

  return (
    <ReactECharts
      ref={chartRef}
      option={option}
      theme={echartsTheme}
      notMerge={notMerge}
      lazyUpdate={lazyUpdate}
      showLoading={loading}
      className={className}
      style={{ height: '100%', width: '100%', ...style }}
    />
  );
}
