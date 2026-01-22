'use client'

import { Children, type CSSProperties, type ReactNode } from 'react'
import type { ResponsiveColumns } from '@efxlab/layout-core'

export interface EfxGridProps {
  /** Child elements */
  children: ReactNode
  /** Number of columns (fixed or responsive) */
  columns?: number | ResponsiveColumns
  /** Gap between grid cells */
  gap?: number | string
  /** Height of each row */
  rowHeight?: number | string
  /** Fill available height with equal rows */
  fillHeight?: boolean
  /** Additional CSS class */
  className?: string
  /** Additional inline styles */
  style?: CSSProperties
}

/**
 * EfxGrid - Simple auto-layout grid component
 *
 * Provides a simple grid layout with equal-sized columns.
 * Can be used independently of EfxChart components.
 *
 * @example
 * ```tsx
 * <EfxGrid columns={3} gap={16}>
 *   <div>Item 1</div>
 *   <div>Item 2</div>
 *   <div>Item 3</div>
 * </EfxGrid>
 * ```
 */
export function EfxGrid({
  children,
  columns = 2,
  gap = 16,
  rowHeight = 'auto',
  fillHeight = false,
  className = '',
  style,
}: EfxGridProps) {
  // Build responsive grid classes
  let gridCols: string
  if (typeof columns === 'number') {
    gridCols = `repeat(${columns}, minmax(0, 1fr))`
  } else {
    gridCols = `repeat(var(--grid-cols, ${
      columns.lg ?? columns.md ?? columns.sm ?? 2
    }), minmax(0, 1fr))`
  }

  const responsiveStyles =
    typeof columns === 'object'
      ? ({
          '--grid-cols-sm': columns.sm ?? 1,
          '--grid-cols-md': columns.md ?? 2,
          '--grid-cols-lg': columns.lg ?? 3,
        } as CSSProperties)
      : {}

  // Calculate number of rows for fillHeight mode
  const childCount = Children.count(children)
  const numCols =
    typeof columns === 'number'
      ? columns
      : columns.lg ?? columns.md ?? columns.sm ?? 2
  const numRows = Math.ceil(childCount / numCols)

  // Determine row template
  let gridRowTemplate: string
  if (fillHeight) {
    gridRowTemplate = `repeat(${numRows}, minmax(0, 1fr))`
  } else {
    gridRowTemplate =
      typeof rowHeight === 'number' ? `${rowHeight}px` : rowHeight
  }

  const gridStyle: CSSProperties = {
    display: 'grid',
    gridTemplateColumns: gridCols,
    gap: typeof gap === 'number' ? `${gap}px` : gap,
    ...(fillHeight
      ? { gridTemplateRows: gridRowTemplate, height: '100%' }
      : { gridAutoRows: gridRowTemplate }),
    ...responsiveStyles,
    ...style,
  }

  return (
    <div className={className} style={gridStyle}>
      {Children.map(children, (child) => (
        <div style={{ minHeight: 0, height: '100%' }}>{child}</div>
      ))}
    </div>
  )
}
