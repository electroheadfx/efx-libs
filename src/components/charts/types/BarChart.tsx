'use client';

import { ChartContainer } from '../core/ChartContainer';
import type { EChartsOption } from 'echarts';
import type { BarChartProps } from '@/types/chart.types';

export function BarChart({
  data,
  categoryField = 'category',
  valueField = 'value',
  horizontal = false,
  title,
  className,
  style,
  loading,
  onChartReady,
}: BarChartProps) {
  const categories = data.map((d) => d[categoryField] as string);
  const values = data.map((d) => d[valueField] as number);

  const option: EChartsOption = {
    title: title ? { text: title, left: 'center' } : undefined,
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: horizontal ? 'value' : 'category',
      data: horizontal ? undefined : categories,
    },
    yAxis: {
      type: horizontal ? 'category' : 'value',
      data: horizontal ? categories : undefined,
    },
    series: [
      {
        type: 'bar',
        data: values,
      },
    ],
  };

  return (
    <ChartContainer
      option={option}
      className={className}
      style={style}
      loading={loading}
      onChartReady={onChartReady}
    />
  );
}
