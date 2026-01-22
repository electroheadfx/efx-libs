'use client'

import type { CSSProperties, ReactNode } from 'react'
import type { LayoutPadding, LayoutTemplate } from '@efx/layout-core'
import { buildPaddingStyle, normalizeGap } from '@efx/layout-core'

export interface EfxLayoutProps {
  /** Layout template configuration */
  template: LayoutTemplate
  /** Child elements */
  children: ReactNode
  /** Additional CSS class */
  className?: string
  /** Additional inline styles */
  style?: CSSProperties
  /** Fill remaining viewport height */
  fillViewport?: boolean
  /** Offset from viewport height (e.g., header height) */
  viewportOffset?: number | string
}

export interface LayoutItemProps {
  /** Grid area name to place this item */
  area: string
  /** Child elements */
  children: ReactNode
  /** Additional CSS class */
  className?: string
  /** Additional inline styles */
  style?: CSSProperties
}

/**
 * EfxLayout - CSS Grid-based layout component
 *
 * Provides a flexible grid layout system using CSS Grid template areas.
 * Can be used independently of EfxChart components.
 *
 * @example
 * ```tsx
 * <EfxLayout
 *   template={{
 *     areas: '"header header" "sidebar main" "footer footer"',
 *     columns: ['200px', '1fr'],
 *     rows: ['60px', '1fr', '40px'],
 *     gap: 16
 *   }}
 * >
 *   <LayoutItem area="header">Header</LayoutItem>
 *   <LayoutItem area="sidebar">Sidebar</LayoutItem>
 *   <LayoutItem area="main">Main Content</LayoutItem>
 *   <LayoutItem area="footer">Footer</LayoutItem>
 * </EfxLayout>
 * ```
 */
export function EfxLayout({
  template,
  children,
  className = '',
  style,
  fillViewport = false,
  viewportOffset,
}: EfxLayoutProps) {
  const offsetValue = viewportOffset
    ? typeof viewportOffset === 'number'
      ? `${viewportOffset}px`
      : viewportOffset
    : '0px'

  const gridStyle: CSSProperties = {
    display: 'grid',
    gridTemplateAreas: template.areas,
    gridTemplateColumns: template.columns?.join(' ') ?? '1fr',
    gridTemplateRows: template.rows?.join(' ') ?? 'auto',
    gap: normalizeGap(template.gap),
    padding: buildPaddingStyle(template.padding),
    // Only set height when fillViewport is true, otherwise let className control it
    ...(fillViewport && {
      height: `calc(100vh - ${offsetValue})`,
      minHeight: `calc(100vh - ${offsetValue})`,
    }),
    ...style,
  }

  return (
    <div style={gridStyle} className={className}>
      {children}
    </div>
  )
}

/**
 * LayoutItem - Grid area item wrapper
 *
 * Places children in a specific grid area defined in the parent EfxLayout template.
 *
 * IMPORTANT: minHeight: 0 and minWidth: 0 are required for grid children
 * to allow shrinking below their content's intrinsic size in both directions.
 */
export function LayoutItem({
  area,
  children,
  className = '',
  style,
}: LayoutItemProps) {
  return (
    <div
      style={{ gridArea: area, minHeight: 0, minWidth: 0, ...style }}
      className={className}
    >
      {children}
    </div>
  )
}

// Re-export types for convenience
export type { LayoutPadding, LayoutTemplate }
