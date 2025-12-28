/**
 * Utils Exports
 */

export { parsePadding, paddingToGridPosition } from "./paddingParser"

export {
  parseTemplateToLayout,
  parseLayoutTemplate,
  mirrorLayoutHorizontally,
  coordsToPercentages,
  coordsToPercentagesWithGap,
  type GapConfig,
  type ContainerSize,
} from "./templateParser"

export {
  buildEChartsOption,
  buildMediaDefinitions,
  type EfxMediaUnit,
} from "./optionBuilder"

export {
  generateTimeSeriesData,
  generateCategoryData,
  generateScatterData,
  generatePieData,
  generateMultiSeriesData,
  generateCandlestickData,
} from "./dataGenerators"
