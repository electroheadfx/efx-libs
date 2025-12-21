'use client';

import { useId, useEffect, useRef } from 'react';
import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';
import { useAppTheme } from '@/providers/ThemeProvider';
import type { EChartsInstance } from '@/types/theme.types';
import type { MatrixChartProps, MatrixSection, MediaDefinition } from '@/types/matrixLayout.types';

/**
 * MatrixChart - Combines multiple chart sections into a single ECharts instance
 * using the matrix coordinate system for layout.
 */
export function MatrixChart({
  sections,
  mediaDefinitions,
  className = '',
  style,
  onChartReady,
}: MatrixChartProps) {
  const chartId = useId();
  const { echartsTheme, registerChart, unregisterChart } = useAppTheme();
  const chartRef = useRef<ReactECharts | null>(null);

  // Build combined option from sections
  const option = buildMatrixOption(sections, mediaDefinitions);

  // Register/unregister chart with theme provider
  useEffect(() => {
    const instance = chartRef.current?.getEchartsInstance();
    if (instance) {
      registerChart(chartId, instance as unknown as EChartsInstance);
      onChartReady?.(instance);
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
      className={className}
      style={{ height: '100%', width: '100%', ...style }}
    />
  );
}

/**
 * Build combined ECharts option from sections and media definitions
 */
function buildMatrixOption(
  sections: MatrixSection[],
  mediaDefinitions: MediaDefinition[]
): EChartsOption {
  // Collect all components from sections
  const grids: unknown[] = [];
  const xAxes: unknown[] = [];
  const yAxes: unknown[] = [];
  const series: unknown[] = [];
  const titles: unknown[] = [];

  for (const section of sections) {
    const opt = section.option;

    // Add section-specific options with matrix coordinateSystem
    if (opt.grid) {
      const gridArr = Array.isArray(opt.grid) ? opt.grid : [opt.grid];
      grids.push(
        ...gridArr.map((g) => ({
          ...g,
          coordinateSystem: 'matrix',
          id: `${section.id}_grid`,
        }))
      );
    }

    if (opt.xAxis) {
      const xArr = Array.isArray(opt.xAxis) ? opt.xAxis : [opt.xAxis];
      xAxes.push(
        ...xArr.map((x) => ({
          ...x,
          gridId: `${section.id}_grid`,
        }))
      );
    }

    if (opt.yAxis) {
      const yArr = Array.isArray(opt.yAxis) ? opt.yAxis : [opt.yAxis];
      yAxes.push(
        ...yArr.map((y) => ({
          ...y,
          gridId: `${section.id}_grid`,
        }))
      );
    }

    if (opt.series) {
      const seriesArr = Array.isArray(opt.series) ? opt.series : [opt.series];
      series.push(...seriesArr);
    }

    if (opt.title) {
      const titleArr = Array.isArray(opt.title) ? opt.title : [opt.title];
      titles.push(
        ...titleArr.map((t) => ({
          ...t,
          coordinateSystem: 'matrix',
        }))
      );
    }
  }

  // Build media definitions for responsive layout
  const media = mediaDefinitions.map((def) => ({
    query: def.query,
    option: {
      matrix: def.matrix,
      sectionCoordMap: def.sectionCoordMap,
    },
  }));

  return {
    tooltip: { trigger: 'axis' },
    grid: grids,
    xAxis: xAxes,
    yAxis: yAxes,
    series: series,
    title: titles,
    media,
  } as EChartsOption;
}
