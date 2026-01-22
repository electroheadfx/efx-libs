/**
 * Option Builder Utility
 *
 * Builds ECharts options from chart section configurations.
 */

import type { EChartsOption } from 'echarts'
import type { EfxChartSectionConfig, EfxTitleOption, SectionCoordMap } from '../types'
import { parsePadding } from './paddingParser'
import {
  type ContainerSize,
  coordsToPercentages,
  coordsToPercentagesWithGap,
  type GapConfig,
} from './templateParser'

/**
 * ECharts MediaUnit type for responsive media queries
 */
export interface EfxMediaUnit {
  query?: {
    minWidth?: number
    maxWidth?: number
    minHeight?: number
    maxHeight?: number
    minAspectRatio?: number
    maxAspectRatio?: number
  }
  option: Record<string, unknown>
}

/**
 * Default reserved height for title area (in pixels)
 */
const DEFAULT_TITLE_RESERVED_HEIGHT = 30

/**
 * Estimated title text height in pixels
 */
const TITLE_TEXT_HEIGHT = 20

/**
 * Default internal grid padding (in pixels)
 */
const DEFAULT_GRID_PADDING = 10

/**
 * Build title configuration from title prop
 */
function buildTitle(
  title: EfxTitleOption | undefined
): { text: string; subtext?: string; textStyle: object } | undefined {
  if (!title) return undefined

  if (typeof title === 'string') {
    return {
      text: title,
      textStyle: { color: '#aaa', fontSize: 14 },
    }
  }

  return {
    text: title.text,
    subtext: title.subtext,
    textStyle: {
      fontSize: title.textStyle?.fontSize ?? 14,
      color: title.textStyle?.color ?? '#aaa',
      fontWeight: title.textStyle?.fontWeight ?? 'normal',
    },
  }
}

/**
 * Build grid configuration for a section
 */
function buildGrid(
  sectionId: string,
  props: EfxChartSectionConfig,
  padding:
    | { top: number; right: number; bottom: number; left: number }
    | undefined,
  hasTitle: boolean,
  gap?: GapConfig
): object {
  const topPadding =
    padding?.top ??
    (hasTitle ? DEFAULT_TITLE_RESERVED_HEIGHT + 20 : DEFAULT_GRID_PADDING)
  const bottomPadding = padding?.bottom ?? DEFAULT_GRID_PADDING
  const leftPadding = padding?.left ?? DEFAULT_GRID_PADDING
  const rightPadding = padding?.right ?? DEFAULT_GRID_PADDING

  const gapX = gap?.x ?? 0
  const gapY = gap?.y ?? 0
  const outerTop = gapY > 0 ? gapY / 2 : 20
  const outerBottom = gapY > 0 ? gapY / 2 : 20
  const outerLeft = gapX > 0 ? gapX / 2 : 20
  const outerRight = gapX > 0 ? gapX / 2 : 20

  return {
    id: sectionId,
    coordinateSystem: 'matrix',
    tooltip: {
      trigger: 'axis',
      ...(props.axisPointer && { axisPointer: props.axisPointer }),
    },
    top: topPadding,
    bottom: bottomPadding,
    left: leftPadding,
    right: rightPadding,
    outerBounds: {
      top: outerTop,
      bottom: outerBottom,
      left: outerLeft,
      right: outerRight,
    },
    ...(props.backgroundColor && { backgroundColor: props.backgroundColor }),
    ...(props.borderColor && { borderColor: props.borderColor }),
    ...(props.borderWidth && { borderWidth: props.borderWidth }),
    ...((props.backgroundColor || props.borderColor) && { show: true }),
  }
}

/**
 * Build xAxis configuration
 */
function buildXAxis(
  sectionId: string,
  props: EfxChartSectionConfig,
  invertAxis: boolean
): object {
  const axis = invertAxis ? props.yAxis : props.xAxis

  return {
    id: sectionId,
    gridId: sectionId,
    type: axis?.type ?? 'category',
    data: axis?.data,
    name: axis?.name,
    nameLocation: axis?.nameLocation,
    inverse: axis?.inverse,
    min: axis?.min,
    max: axis?.max,
    splitNumber: axis?.splitNumber,
    splitLine: axis?.splitLine ?? { show: false },
    axisLine: axis?.axisLine ?? { lineStyle: { color: '#666' } },
    axisLabel: {
      show: axis?.axisLabel?.show ?? true,
      hideOverlap: axis?.axisLabel?.hideOverlap ?? true,
      rotate: axis?.axisLabel?.rotate,
      formatter: axis?.axisLabel?.formatter,
    },
    axisTick: axis?.axisTick,
    ...(axis?.axisPointer && { axisPointer: axis.axisPointer }),
  }
}

/**
 * Build yAxis configuration
 */
function buildYAxis(
  sectionId: string,
  props: EfxChartSectionConfig,
  invertAxis: boolean
): object {
  const axis = invertAxis ? props.xAxis : props.yAxis

  return {
    id: sectionId,
    gridId: sectionId,
    type: axis?.type ?? 'value',
    data: axis?.data,
    name: axis?.name,
    nameLocation: axis?.nameLocation,
    inverse: axis?.inverse,
    min: axis?.min,
    max: axis?.max,
    splitNumber: axis?.splitNumber,
    splitLine: axis?.splitLine ?? { show: false },
    axisLine: axis?.axisLine ?? { lineStyle: { color: '#666' } },
    axisLabel: {
      show: axis?.axisLabel?.show ?? true,
      hideOverlap: axis?.axisLabel?.hideOverlap ?? true,
      rotate: axis?.axisLabel?.rotate,
      formatter: axis?.axisLabel?.formatter,
    },
    axisTick: axis?.axisTick,
    ...(axis?.axisPointer && { axisPointer: axis.axisPointer }),
  }
}

/**
 * Transform data for chart type
 */
function transformData(data: unknown, chartType: string | undefined): unknown {
  if (!data || !Array.isArray(data)) return data

  if (chartType === 'line' || chartType === 'bar' || chartType === 'area') {
    if (
      data.length > 0 &&
      typeof data[0] === 'object' &&
      data[0] !== null &&
      'value' in data[0]
    ) {
      return data.map((d: { value: unknown }) => d.value)
    }
  }

  return data
}

/**
 * Build series configuration
 */
function buildSeries(sectionId: string, props: EfxChartSectionConfig): object {
  const transformedData = transformData(props.data, props.type)

  const baseConfig = {
    id: sectionId,
    xAxisId: sectionId,
    yAxisId: sectionId,
    data: transformedData,
    animation: props.animation ?? true,
    animationDuration: props.animationDuration ?? 1000,
    animationEasing: props.animationEasing ?? 'cubicOut',
    emphasis: props.emphasis,
    ...props.series,
  }

  switch (props.type) {
    case 'line':
      return {
        type: 'line',
        smooth: props.series?.smooth ?? false,
        symbol: props.series?.symbol ?? 'circle',
        symbolSize: props.series?.symbolSize ?? 4,
        lineStyle: props.series?.lineStyle,
        areaStyle: props.series?.areaStyle,
        ...baseConfig,
      }

    case 'bar':
      return {
        type: 'bar',
        barWidth: props.series?.barWidth,
        barMaxWidth: props.series?.barMaxWidth,
        barGap: props.series?.barGap,
        itemStyle: props.series?.itemStyle,
        ...baseConfig,
      }

    case 'scatter':
      return {
        type: 'scatter',
        symbol: props.series?.symbol ?? 'circle',
        symbolSize: props.series?.symbolSize ?? 10,
        itemStyle: props.series?.itemStyle,
        ...baseConfig,
      }

    case 'area':
      return {
        type: 'line',
        smooth: props.series?.smooth ?? false,
        symbol: props.series?.symbol ?? 'none',
        areaStyle: props.series?.areaStyle ?? { opacity: 0.5 },
        lineStyle: props.series?.lineStyle,
        ...baseConfig,
      }

    case 'pie': {
      return {
        type: 'pie',
        id: sectionId,
        center: props.series?.center ?? ['50%', '50%'],
        radius: props.series?.radius ?? '60%',
        roseType: props.series?.roseType,
        itemStyle: props.series?.itemStyle,
        label: props.series?.label,
        data: props.data,
        animation: props.animation ?? true,
        emphasis: props.emphasis,
      }
    }

    default:
      return {
        type: props.type ?? 'line',
        ...baseConfig,
      }
  }
}

/**
 * Build complete ECharts option from chart sections and layout
 */
export function buildEChartsOption(
  sections: EfxChartSectionConfig[],
  sectionCoordMap: SectionCoordMap,
  columns: number,
  rows: number,
  gap?: GapConfig,
  containerSize?: ContainerSize,
  _sectionLoadingStates?: Record<string, boolean>
): EChartsOption {
  const hasGap = gap && (gap.x > 0 || gap.y > 0)
  const hasContainerSize =
    containerSize && containerSize.width > 0 && containerSize.height > 0

  const percentages =
    hasGap && hasContainerSize
      ? coordsToPercentagesWithGap(
        sectionCoordMap,
        columns,
        rows,
        gap,
        containerSize
      )
      : coordsToPercentages(sectionCoordMap, columns, rows)

  const grids: object[] = []
  const xAxes: object[] = []
  const yAxes: object[] = []
  const series: object[] = []
  const titles: object[] = []

  for (const section of sections) {
    const sectionPercentages = percentages[section.section]

    if (!sectionPercentages) continue

    const invertAxis = section.invertAxis ?? false
    const padding = parsePadding(section.padding)
    const hasTitle = !!section.title

    grids.push(buildGrid(section.section, section, padding, hasTitle, gap))

    const sectionTitle = buildTitle(section.title)
    if (sectionTitle) {
      const sectionPadding = parsePadding(section.padding)
      const hasChart = !!section.type

      let titleTop: number
      if (!hasChart) {
        titleTop = 15
      } else {
        const titleAreaHeight =
          sectionPadding && sectionPadding.top > 0
            ? sectionPadding.top
            : DEFAULT_TITLE_RESERVED_HEIGHT
        titleTop = Math.max(5, (titleAreaHeight - TITLE_TEXT_HEIGHT) / 2)
      }

      titles.push({
        ...sectionTitle,
        id: `title_${section.section}`,
        coordinateSystem: 'matrix',
        left: 'center',
        top: titleTop,
        textStyle: sectionTitle.textStyle,
      })
    }

    if (section.type) {
      const xAxis = buildXAxis(section.section, section, invertAxis)
      const yAxis = buildYAxis(section.section, section, invertAxis)

      xAxes.push(xAxis)
      yAxes.push(yAxis)

      const seriesConfig = buildSeries(section.section, section)
      series.push(seriesConfig)
    }
  }

  const matrixConfig = {
    x: { show: false, data: [] },
    y: { show: false, data: [] },
    body: { itemStyle: { borderColor: 'none' } },
    backgroundStyle: { borderColor: 'none' },
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  }

  const option: EChartsOption = {
    backgroundColor: 'transparent',
    matrix: matrixConfig,
    title: titles,
    grid: grids,
    xAxis: xAxes,
    yAxis: yAxes,
    series,
    tooltip: {},
  } as EChartsOption

  return option
}

/**
 * Build media query definitions for responsive layouts
 */
export function buildMediaDefinitions(
  mobileLayout: {
    sectionCoordMap: SectionCoordMap
    columns: number
    rows: number
  },
  desktopLayout: {
    sectionCoordMap: SectionCoordMap
    columns: number
    rows: number
  },
  sections: EfxChartSectionConfig[],
  mobileMaxWidth = 500,
  _gap?: GapConfig,
  _containerSize?: ContainerSize
): EfxMediaUnit[] {
  const buildGridCoords = (sectionCoordMap: SectionCoordMap) =>
    sections
      .filter((section) => sectionCoordMap[section.section])
      .map((section) => ({
        id: section.section,
        coord: sectionCoordMap[section.section],
      }))

  const buildTitleCoords = (sectionCoordMap: SectionCoordMap) =>
    sections
      .filter((s) => s.title && sectionCoordMap[s.section])
      .map((section) => ({
        id: `title_${section.section}`,
        coord: sectionCoordMap[section.section],
      }))

  return [
    {
      query: { maxWidth: mobileMaxWidth },
      option: {
        matrix: {
          x: { data: Array(mobileLayout.columns).fill(null) },
          y: { data: Array(mobileLayout.rows).fill(null) },
        },
        grid: buildGridCoords(mobileLayout.sectionCoordMap),
        title: buildTitleCoords(mobileLayout.sectionCoordMap),
      },
    },
    {
      option: {
        matrix: {
          x: { data: Array(desktopLayout.columns).fill(null) },
          y: { data: Array(desktopLayout.rows).fill(null) },
        },
        grid: buildGridCoords(desktopLayout.sectionCoordMap),
        title: buildTitleCoords(desktopLayout.sectionCoordMap),
      },
    },
  ]
}
