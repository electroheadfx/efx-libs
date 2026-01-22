/**
 * EfxLayout Core Types
 *
 * Framework-agnostic type definitions for the EfxLayout system.
 */

/**
 * Padding configuration for layouts
 */
export interface LayoutPadding {
  top?: number | string
  right?: number | string
  bottom?: number | string
  left?: number | string
}

/**
 * Layout template definition
 */
export interface LayoutTemplate {
  /** CSS Grid template areas string */
  areas: string
  /** Column sizes (e.g., ['1fr', '300px']) */
  columns?: string[]
  /** Row sizes (e.g., ['80px', '1fr', '60px']) */
  rows?: string[]
  /** Gap between grid cells */
  gap?: number | string
  /** Padding around the grid */
  padding?: LayoutPadding | number | string
}

/**
 * Breakpoint names for responsive layouts
 */
export type Breakpoint = 'mobile' | 'tablet' | 'desktop'

/**
 * Responsive templates configuration
 */
export interface ResponsiveTemplates {
  desktop: LayoutTemplate
  mobile: LayoutTemplate
  tablet?: LayoutTemplate
}

/**
 * Grid column configuration for responsive grids
 */
export interface ResponsiveColumns {
  sm?: number
  md?: number
  lg?: number
}
