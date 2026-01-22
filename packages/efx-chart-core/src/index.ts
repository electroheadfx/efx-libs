/**
 * @efx/chart-core
 *
 * Framework-agnostic core types, utilities, and templates for the EfxChart system.
 */

// ============================================================================
// Types
// ============================================================================

export type {
  ECharts,
  EChartsEventParams,
  EChartsOption,
  EfxAxisOption,
  EfxChartSectionConfig,
  EfxChartType,
  EfxEmphasisOption,
  EfxEventHandler,
  EfxLayoutTemplate,
  EfxPadding,
  EfxParsedPadding,
  EfxSeriesOption,
  EfxTitleOption,
  ExtractSections,
  MatrixCoord,
  ParsedLayout,
  SectionCoordMap,
  SectionCoordValue,
} from './types'

// ============================================================================
// Templates
// ============================================================================

export {
  ANALYTICS_LAYOUT,
  COMPARISON_LAYOUT,
  DASHBOARD_LAYOUT,
  EFX_CHART_TEMPLATES,
  type EfxChartTemplateName,
  FINANCE_LAYOUT,
  GRID_2X2_LAYOUT,
  MONITORING_LAYOUT,
  type SectionId,
} from './templates'

// ============================================================================
// Utilities
// ============================================================================

export {
  // Option building
  buildEChartsOption,
  buildMediaDefinitions,
  type ContainerSize,
  coordsToPercentages,
  coordsToPercentagesWithGap,
  type EfxMediaUnit,
  type GapConfig,
  // Data generators
  generateCandlestickData,
  generateCategoryData,
  generateMultiSeriesData,
  generatePieData,
  generateScatterData,
  generateTimeSeriesData,
  // Layout utilities
  mirrorLayoutHorizontally,
  // Padding parsing
  paddingToGridPosition,
  parsePadding,
  // Template parsing
  parseLayoutTemplate,
  parseTemplateToLayout,
} from './utils'
