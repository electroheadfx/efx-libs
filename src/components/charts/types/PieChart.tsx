'use client';

import { ChartContainer } from '../core/ChartContainer';
import type { EChartsOption } from 'echarts';
import type { PieChartProps } from '@/types/chart.types';

export function PieChart({
  data,
  categoryField = 'category',
  valueField = 'value',
  donut = false,
  donutRadius = ['40%', '70%'],
  title,
  className,
  style,
  loading,
  onChartReady,
}: PieChartProps) {
  const pieData = data.map((d) => ({
    name: d[categoryField] as string,
    value: d[valueField] as number,
  }));

  const option: EChartsOption = {
    title: title ? { text: title, left: 'center' } : undefined,
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)',
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      top: 'middle',
    },
    series: [
      {
        name: title ?? 'Data',
        type: 'pie',
        radius: donut ? donutRadius : '50%',
        center: ['50%', '50%'],
        data: pieData,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
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
