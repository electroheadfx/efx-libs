'use client'

import type { CSSProperties, ReactNode } from 'react'

export interface LayoutPadding {
  top?: number | string
  right?: number | string
  bottom?: number | string
  left?: number | string
}

export interface LayoutTemplate {
  areas: string
  columns?: string[]
  rows?: string[]
  gap?: number | string
  padding?: LayoutPadding | number | string
}

interface DashboardLayoutProps {
  template: LayoutTemplate
  children: ReactNode
  className?: string
  style?: CSSProperties
  /** Fill remaining viewport height */
  fillViewport?: boolean
  /** Offset from viewport height (e.g., header height) */
  viewportOffset?: number | string
}

interface LayoutItemProps {
  area: string
  children: ReactNode
  className?: string
  style?: CSSProperties
}

// Helper to normalize padding value
function normalizePadding(value: number | string | undefined): string {
  if (value === undefined) return '0'
  return typeof value === 'number' ? `${value}px` : value
}

// Helper to build padding string from LayoutPadding
function buildPaddingStyle(
  padding: LayoutPadding | number | string | undefined
): string {
  if (padding === undefined) return '0'

  if (typeof padding === 'number') {
    return `${padding}px`
  }

  if (typeof padding === 'string') {
    return padding
  }

  // Object form: { top, right, bottom, left }
  const top = normalizePadding(padding.top)
  const right = normalizePadding(padding.right)
  const bottom = normalizePadding(padding.bottom)
  const left = normalizePadding(padding.left)

  return `${top} ${right} ${bottom} ${left}`
}

export function DashboardLayout({
  template,
  children,
  className = '',
  style,
  fillViewport = false,
  viewportOffset,
}: DashboardLayoutProps) {
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
    gap:
      typeof template.gap === 'number'
        ? `${template.gap}px`
        : template.gap ?? '16px',
    padding: buildPaddingStyle(template.padding),
    height: '100%', // Always set height to 100% of parent
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

export function LayoutItem({
  area,
  children,
  className = '',
  style,
}: LayoutItemProps) {
  return (
    <div style={{ gridArea: area, ...style }} className={className}>
      {children}
    </div>
  )
}
