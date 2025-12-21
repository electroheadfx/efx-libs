// Chart type definitions
import type { EChartsOption } from 'echarts';
import type { CSSProperties, ReactNode } from 'react';

// Supported chart types
export type ChartType =
  | 'line'
  | 'bar'
  | 'pie'
  | 'scatter'
  | 'radar'
  | 'heatmap'
  | 'treemap'
  | 'sunburst'
  | 'boxplot'
  | 'violin'
  | 'lineRange'
  | 'barRange'
  | 'contour'
  | 'stage'
  | 'segmentedDoughnut'
  | 'liquidFill';

// Base chart props
export interface BaseChartProps {
  className?: string;
  style?: CSSProperties;
  title?: string;
  loading?: boolean;
  notMerge?: boolean;
  lazyUpdate?: boolean;
  onChartReady?: (instance: unknown) => void;
}

// Chart container props
export interface ChartContainerProps extends BaseChartProps {
  option: EChartsOption;
  children?: ReactNode;
}

// Time series data point
export interface TimeSeriesDataPoint {
  date: string | Date;
  value: number;
  [key: string]: string | number | Date | undefined;
}

// Categorical data point
export interface CategoricalDataPoint {
  category: string;
  value: number;
  [key: string]: string | number | undefined;
}

// Numerical pair (for scatter plots)
export interface NumericalPairDataPoint {
  x: number;
  y: number;
  [key: string]: string | number | undefined;
}

// Hierarchical data (for treemaps, sunburst)
export interface HierarchicalDataPoint {
  name: string;
  value?: number;
  children?: HierarchicalDataPoint[];
  [key: string]: string | number | HierarchicalDataPoint[] | undefined;
}

// Multi-dimensional data (for radar)
export interface MultiDimensionalDataPoint {
  name: string;
  values: number[];
  [key: string]: string | number[] | undefined;
}

// Chart data union type
export type ChartData =
  | TimeSeriesDataPoint[]
  | CategoricalDataPoint[]
  | NumericalPairDataPoint[]
  | HierarchicalDataPoint[]
  | MultiDimensionalDataPoint[]
  | number[]
  | number[][];

// Line chart props
export interface LineChartProps extends BaseChartProps {
  data: TimeSeriesDataPoint[] | CategoricalDataPoint[];
  xField?: string;
  yField?: string;
  smooth?: boolean;
  areaStyle?: boolean;
}

// Bar chart props
export interface BarChartProps extends BaseChartProps {
  data: CategoricalDataPoint[];
  categoryField?: string;
  valueField?: string;
  horizontal?: boolean;
}

// Pie chart props
export interface PieChartProps extends BaseChartProps {
  data: CategoricalDataPoint[];
  categoryField?: string;
  valueField?: string;
  donut?: boolean;
  donutRadius?: [string | number, string | number];
}

// Scatter chart props
export interface ScatterChartProps extends BaseChartProps {
  data: NumericalPairDataPoint[];
  xField?: string;
  yField?: string;
  sizeField?: string;
  colorField?: string;
}

// Violin chart props (custom series)
export interface ViolinChartProps extends BaseChartProps {
  data: number[][];
  categories: string[];
}

// Line range chart props (custom series)
export interface LineRangeChartProps extends BaseChartProps {
  data: Array<{ x: number | string; yLow: number; yHigh: number }>;
  xField?: string;
}

// Bar range chart props (custom series)
export interface BarRangeChartProps extends BaseChartProps {
  data: Array<{ category: string; min: number; max: number }>;
}

// Gauge/Liquid fill props
export interface LiquidFillChartProps extends BaseChartProps {
  value: number;
  max?: number;
  color?: string;
}
