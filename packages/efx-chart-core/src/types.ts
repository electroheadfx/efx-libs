/**
 * EfxChart Core Type Definitions
 *
 * Framework-agnostic TypeScript interfaces for the EfxChart system.
 * Provides full ECharts options exposure through strongly-typed definitions.
 */

import type { ECharts, EChartsOption } from 'echarts'

// ============================================================================
// Event Types
// ============================================================================

/**
 * ECharts event parameters - varies by event type
 */
export interface EChartsEventParams {
  componentType?: string
  seriesType?: string
  seriesIndex?: number
  seriesName?: string
  name?: string
  dataIndex?: number
  data?: unknown
  value?: unknown
  event?: MouseEvent
  [key: string]: unknown
}

/**
 * Event handler signature
 */
export type EfxEventHandler = (
  params: EChartsEventParams,
  chart: ECharts
) => void

// ============================================================================
// Padding Types
// ============================================================================

/**
 * Flexible padding format
 * - number: All sides (e.g., 10)
 * - string: "10" | "20,10" | "10,20,30,40"
 * - object: { top?, right?, bottom?, left? }
 */
export type EfxPadding =
  | number
  | string
  | { top?: number; right?: number; bottom?: number; left?: number }

/**
 * Parsed padding values
 */
export interface EfxParsedPadding {
  top: number
  right: number
  bottom: number
  left: number
}

// ============================================================================
// Axis Types
// ============================================================================

export interface EfxAxisOption {
  type?: 'category' | 'value' | 'time' | 'log'
  data?: (string | number)[]
  name?: string
  nameLocation?: 'start' | 'middle' | 'end'
  inverse?: boolean
  min?: number | 'dataMin'
  max?: number | 'dataMax'
  splitNumber?: number
  splitLine?: {
    show?: boolean
    lineStyle?: { color?: string; type?: 'solid' | 'dashed' }
  }
  axisLine?: { show?: boolean; lineStyle?: { color?: string } }
  axisLabel?: {
    show?: boolean
    hideOverlap?: boolean
    rotate?: number
    formatter?: string | ((value: unknown) => string)
  }
  axisTick?: { show?: boolean }
  axisPointer?: {
    show?: boolean
    type?: 'line' | 'shadow' | 'none'
    label?: { show?: boolean }
  }
  [key: string]: unknown
}

// ============================================================================
// Series Types
// ============================================================================

export interface EfxSeriesOption {
  name?: string
  smooth?: boolean
  symbol?: string | 'none' | 'circle' | 'rect' | 'diamond'
  symbolSize?: number
  stack?: string

  // Line/Area
  areaStyle?: { color?: string; opacity?: number }
  lineStyle?: {
    color?: string
    width?: number
    type?: 'solid' | 'dashed' | 'dotted'
  }

  // All series
  itemStyle?: {
    color?: string
    borderColor?: string
    borderWidth?: number
    borderRadius?: number | [number, number, number, number]
    opacity?: number
  }

  label?: {
    show?: boolean
    position?: 'inside' | 'outside' | 'top' | 'bottom' | 'left' | 'right'
    formatter?: string | ((params: unknown) => string)
    color?: string
    fontSize?: number
  }

  // Pie-specific
  center?: [string | number, string | number]
  radius?: string | number | [string | number, string | number]
  roseType?: 'radius' | 'area'

  // Bar-specific
  barWidth?: number | string
  barMaxWidth?: number | string
  barGap?: string

  [key: string]: unknown
}

// ============================================================================
// Emphasis Types
// ============================================================================

export interface EfxEmphasisOption {
  scale?: boolean
  scaleSize?: number
  focus?: 'none' | 'self' | 'series' | 'adjacency'
  blurScope?: 'coordinateSystem' | 'series' | 'global'
  itemStyle?: EfxSeriesOption['itemStyle']
  label?: EfxSeriesOption['label']
  lineStyle?: EfxSeriesOption['lineStyle']
}

// ============================================================================
// Title Types
// ============================================================================

export type EfxTitleOption =
  | string
  | {
      text: string
      subtext?: string
      textStyle?: { fontSize?: number; color?: string; fontWeight?: string }
    }

// ============================================================================
// Chart Types
// ============================================================================

export type EfxChartType =
  | 'line'
  | 'bar'
  | 'pie'
  | 'scatter'
  | 'area'
  | 'candlestick'
  | 'heatmap'

// ============================================================================
// Layout Template Types
// ============================================================================

/**
 * ASCII-based layout template
 */
export interface EfxLayoutTemplate {
  /** Template name for identification */
  name: string
  /** Section IDs that can be used in this template */
  sections: readonly string[]
  /** Mobile layout (single column, pipe-delimited ASCII) */
  mobile: string
  /** Desktop layout (multi-column, pipe-delimited ASCII) */
  desktop: string
  /** Optional tablet layout */
  tablet?: string
}

/**
 * Matrix coordinate - single index or [start, end] range
 */
export type MatrixCoord = number | [number, number]

/**
 * Section coordinate value - [colCoord, rowCoord]
 */
export type SectionCoordValue = [MatrixCoord, MatrixCoord]

/**
 * Map of section IDs to their coordinates
 */
export type SectionCoordMap = Record<string, SectionCoordValue>

/**
 * Parsed layout for a specific breakpoint
 */
export interface ParsedLayout {
  columns: number
  rows: number
  sectionCoordMap: SectionCoordMap
}

// ============================================================================
// Chart Section Configuration (Framework-agnostic)
// ============================================================================

/**
 * Chart section configuration - framework-agnostic props
 */
export interface EfxChartSectionConfig {
  /** Section ID - must match a section name in the layout template */
  section: string

  /** Section title displayed above the chart */
  title?: EfxTitleOption

  /** Chart type */
  type?: EfxChartType

  /** Chart data */
  data?: unknown[]

  /** X-axis options */
  xAxis?: EfxAxisOption

  /** Y-axis options */
  yAxis?: EfxAxisOption

  /** Swap X/Y axes (for horizontal bar charts) */
  invertAxis?: boolean

  /** Series-specific options (merged with type defaults) */
  series?: Partial<EfxSeriesOption>

  /** Internal chart padding - flexible format */
  padding?: EfxPadding

  /** Background color */
  backgroundColor?: string

  /** Border color */
  borderColor?: string

  /** Border width in pixels */
  borderWidth?: number

  /** Shadow blur radius */
  shadowBlur?: number

  /** Shadow color */
  shadowColor?: string

  /** Shadow X offset */
  shadowOffsetX?: number

  /** Shadow Y offset */
  shadowOffsetY?: number

  /** Emphasis state styling */
  emphasis?: EfxEmphasisOption

  /** Axis pointer (crosshair) configuration */
  axisPointer?: {
    type?: 'line' | 'cross' | 'shadow' | 'none'
    snap?: boolean
    label?: { show?: boolean; precision?: number | 'auto' }
    lineStyle?: {
      color?: string
      width?: number
      type?: 'solid' | 'dashed' | 'dotted'
    }
    shadowStyle?: { color?: string; opacity?: number }
    crosshairStyle?: {
      color?: string
      width?: number
      type?: 'solid' | 'dashed' | 'dotted'
    }
  }

  /** Tooltip configuration */
  tooltip?: {
    show?: boolean
    trigger?: 'item' | 'axis'
    simple?: boolean
    formatter?: string | ((params: unknown) => string)
  }

  /** Animation settings */
  animation?: boolean
  animationType?: 'expansion' | 'scale'
  animationDuration?: number
  animationEasing?: string

  /** Raw ECharts option override (merged last) */
  echartsOption?: Partial<EChartsOption>
}

// ============================================================================
// Re-exports for convenience
// ============================================================================

export type { ECharts, EChartsOption }

// ============================================================================
// Type Utilities
// ============================================================================

/**
 * Extract section IDs from a template as a union type
 */
export type ExtractSections<T extends EfxLayoutTemplate> = T['sections'][number]
