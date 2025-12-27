/**
 * Utils Exports
 */

export { parsePadding, paddingToGridPosition } from "./paddingParser"

export {
  parseTemplateToLayout,
  parseLayoutTemplate,
  mirrorLayoutHorizontally,
  coordsToPercentages,
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
