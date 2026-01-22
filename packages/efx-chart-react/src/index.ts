/**
 * @efx/chart-react
 *
 * React components for EfxChart - ECharts-based multi-chart dashboards.
 */

// ============================================================================
// Main Components
// ============================================================================

import { EfxChart } from './EfxChart'
import type { EfxChartProps } from './types'
import type { EfxLayoutTemplate, ExtractSections } from '@efxlab/chart-core'

export { EfxChart, extractChartProps, isEfxChart } from './EfxChart'
export { EfxChartsLayout } from './EfxChartsLayout'

// ============================================================================
// Type-Safe Chart Factory
// ============================================================================

/**
 * Create a typed EfxChart component for a specific template.
 * This enables TypeScript autocomplete for section names.
 *
 * @example
 * ```tsx
 * const EfxChart = createTypedChart(FINANCE_LAYOUT)
 *
 * <EfxChartsLayout template={FINANCE_LAYOUT}>
 *   <EfxChart section="header" />  // ← Autocomplete: "header" | "sidebar" | "main" | "footer"
 * </EfxChartsLayout>
 * ```
 */
export function createTypedChart<T extends EfxLayoutTemplate>(_template: T) {
  return EfxChart as React.FC<EfxChartProps<ExtractSections<T>>>
}

// ============================================================================
// Types (React-specific)
// ============================================================================

export type {
  EfxChartProps,
  EfxChartsLayoutProps,
  UseEChartsOptions,
  UseEChartsReturn,
} from './types'

// ============================================================================
// Core Hooks & Renderer
// ============================================================================

export {
  type EChartsCoreOption,
  EChartsRenderer,
  type EChartsRendererProps,
  type EChartsType,
  echarts,
  useAutoResize,
  useEChartsInstance,
  type UseEChartsInstanceOptions,
  type UseEChartsInstanceReturn,
  useResizeObserver,
} from './core'

// ============================================================================
// Streaming Hooks
// ============================================================================

export {
  type PlaceholderConfig,
  type PlaceholderOptions,
  type PlaceholderType,
  type UseStreamingDataOptions,
  type UseStreamingDataReturn,
  useStreamingData,
} from './hooks'

// ============================================================================
// Re-export core types and utilities
// ============================================================================

export {
  // Templates
  ANALYTICS_LAYOUT,
  COMPARISON_LAYOUT,
  DASHBOARD_LAYOUT,
  EFX_CHART_TEMPLATES,
  type EfxChartTemplateName,
  FINANCE_LAYOUT,
  GRID_2X2_LAYOUT,
  MONITORING_LAYOUT,
  type SectionId,
  // Types
  type ECharts,
  type EChartsEventParams,
  type EChartsOption,
  type EfxAxisOption,
  type EfxChartSectionConfig,
  type EfxChartType,
  type EfxEmphasisOption,
  type EfxEventHandler,
  type EfxLayoutTemplate,
  type EfxPadding,
  type EfxParsedPadding,
  type EfxSeriesOption,
  type EfxTitleOption,
  type ExtractSections,
  type MatrixCoord,
  type ParsedLayout,
  type SectionCoordMap,
  type SectionCoordValue,
  // Utilities
  buildEChartsOption,
  buildMediaDefinitions,
  type ContainerSize,
  coordsToPercentages,
  coordsToPercentagesWithGap,
  type EfxMediaUnit,
  type GapConfig,
  generateCandlestickData,
  generateCategoryData,
  generateMultiSeriesData,
  generatePieData,
  generateScatterData,
  generateTimeSeriesData,
  mirrorLayoutHorizontally,
  paddingToGridPosition,
  parsePadding,
  parseLayoutTemplate,
  parseTemplateToLayout,
} from '@efxlab/chart-core'
