/**
 * Utils Exports
 */

export {
  generateCandlestickData,
  generateCategoryData,
  generateMultiSeriesData,
  generatePieData,
  generateScatterData,
  generateTimeSeriesData,
} from './dataGenerators'

export {
  buildEChartsOption,
  buildMediaDefinitions,
  type EfxMediaUnit,
} from './optionBuilder'

export { paddingToGridPosition, parsePadding } from './paddingParser'

export {
  type ContainerSize,
  coordsToPercentages,
  coordsToPercentagesWithGap,
  type GapConfig,
  mirrorLayoutHorizontally,
  parseLayoutTemplate,
  parseTemplateToLayout,
} from './templateParser'
