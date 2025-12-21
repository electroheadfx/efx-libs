// Custom series registration for ECharts
import * as echarts from 'echarts';

// Import custom series installers (default exports)
import violinInstaller from '@echarts-x/custom-violin';
import contourInstaller from '@echarts-x/custom-contour';
import barRangeInstaller from '@echarts-x/custom-bar-range';
import lineRangeInstaller from '@echarts-x/custom-line-range';
import stageInstaller from '@echarts-x/custom-stage';
import segmentedDoughnutInstaller from '@echarts-x/custom-segmented-doughnut';
import liquidFillInstaller from '@echarts-x/custom-liquid-fill';

let registered = false;

/**
 * Register all custom series with ECharts.
 * Call this once at app startup.
 */
export function registerCustomSeries(): void {
  if (registered) return;

  try {
    echarts.use(violinInstaller);
    echarts.use(contourInstaller);
    echarts.use(barRangeInstaller);
    echarts.use(lineRangeInstaller);
    echarts.use(stageInstaller);
    echarts.use(segmentedDoughnutInstaller);
    echarts.use(liquidFillInstaller);
    registered = true;
    console.log('ECharts custom series registered successfully');
  } catch (error) {
    console.warn('Failed to register some custom series:', error);
  }
}

// Available custom series types
export const CUSTOM_SERIES_TYPES = [
  'violin',
  'contour',
  'barRange',
  'lineRange',
  'stage',
  'segmentedDoughnut',
  'liquidFill',
] as const;

export type CustomSeriesType = (typeof CUSTOM_SERIES_TYPES)[number];
