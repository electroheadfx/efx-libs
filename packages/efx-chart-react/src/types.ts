/**
 * EfxChart React Type Definitions
 *
 * React-specific props and types that extend the core types.
 */

import type { CSSProperties, ReactNode } from 'react'
import type {
  ECharts,
  EfxChartSectionConfig,
  EfxEventHandler,
  EfxLayoutTemplate,
} from '@efx/chart-core'

// ============================================================================
// Component Props Types
// ============================================================================

/**
 * EfxChart component props (React-specific)
 */
export interface EfxChartProps<TSection extends string = string>
  extends EfxChartSectionConfig {
  /** Section ID - must match a section name in the layout template */
  section: TSection

  /** React element injection (rendered as DOM overlay) */
  children?: ReactNode
}

/**
 * EfxChartsLayout component props (React-specific)
 */
export interface EfxChartsLayoutProps<
  TTemplate extends EfxLayoutTemplate = EfxLayoutTemplate,
> {
  /** Layout template (ASCII-based) */
  template: TTemplate

  /** Sidebar position for templates with sidebar sections */
  sidebarPosition?: 'left' | 'right'

  // ===== GAP SPACING =====

  /** Uniform gap between all sections in pixels */
  gap?: number

  /** Horizontal gap between columns in pixels (overrides gap for x-axis) */
  gapX?: number

  /** Vertical gap between rows in pixels (overrides gap for y-axis) */
  gapY?: number

  /** Custom breakpoints for responsive behavior */
  breakpoints?: {
    mobile?: { maxWidth: number }
    tablet?: { minWidth: number; maxWidth: number }
  }

  /** Container styling */
  className?: string
  style?: CSSProperties

  /** EfxChart children */
  children: ReactNode

  // ===== EVENT HANDLING =====

  /** Callback when chart instance is ready */
  onChartReady?: (instance: ECharts) => void

  /** Event handlers - same API as echarts-for-react onEvents */
  onEvents?: Record<string, EfxEventHandler>

  // ===== RENDERING OPTIONS =====

  /** Renderer type */
  renderer?: 'canvas' | 'svg'

  /** Theme name (must be registered with echarts.registerTheme) */
  theme?: string

  // ===== STREAMING OPTIONS =====

  /** Loading strategy for chart sections */
  loadingStrategy?: 'simple' | 'streaming'

  /** Loading state for each section (streaming mode only) */
  sectionLoadingStates?: Record<string, boolean>

  /** Spinner size for loading indicators (streaming mode only) */
  spinnerSize?: 'xs' | 'sm' | 'md' | 'lg'
}

// ============================================================================
// Hook Types
// ============================================================================

/**
 * Options for useEChartsInstance hook
 */
export interface UseEChartsOptions {
  /** ECharts option configuration */
  option: import('echarts').EChartsOption
  /** Event handlers (same API as echarts-for-react onEvents) */
  events?: Record<string, EfxEventHandler>
  /** Callback when chart instance is ready */
  onReady?: (chart: ECharts) => void
  /** Theme name (must be registered with echarts.registerTheme) */
  theme?: string
  /** Renderer type */
  renderer?: 'canvas' | 'svg'
  /** Whether to auto-resize on container size change */
  autoResize?: boolean
}

/**
 * Return type for useEChartsInstance hook
 */
export interface UseEChartsReturn {
  /** Get the ECharts instance */
  getEchartsInstance: () => ECharts | null
  /** Ref to the ECharts instance */
  instanceRef: React.MutableRefObject<ECharts | null>
}
