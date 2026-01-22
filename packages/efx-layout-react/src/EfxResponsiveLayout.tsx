'use client'

import type { CSSProperties, ReactNode } from 'react'
import type { ResponsiveTemplates } from '@efxlab/layout-core'
import { buildPaddingStyle, normalizeGap } from '@efxlab/layout-core'
import { useBreakpoint } from './useMediaQuery'

export interface EfxResponsiveLayoutProps {
  /** Responsive templates for different breakpoints */
  templates: ResponsiveTemplates
  /** Child elements */
  children: ReactNode
  /** Additional CSS class */
  className?: string
  /** Additional inline styles */
  style?: CSSProperties
  /** Fill remaining viewport height */
  fillViewport?: boolean
  /** Offset from viewport height - can be responsive */
  viewportOffset?: number | string | { desktop?: string; mobile?: string }
}

/**
 * EfxResponsiveLayout - Responsive CSS Grid layout component
 *
 * Automatically switches between mobile, tablet, and desktop templates
 * based on viewport breakpoints.
 *
 * @example
 * ```tsx
 * <EfxResponsiveLayout
 *   templates={{
 *     mobile: { areas: '"header" "main" "footer"', columns: ['1fr'] },
 *     desktop: { areas: '"header header" "sidebar main" "footer footer"', columns: ['200px', '1fr'] }
 *   }}
 * >
 *   <LayoutItem area="header">Header</LayoutItem>
 *   <LayoutItem area="sidebar">Sidebar</LayoutItem>
 *   <LayoutItem area="main">Main</LayoutItem>
 *   <LayoutItem area="footer">Footer</LayoutItem>
 * </EfxResponsiveLayout>
 * ```
 */
export function EfxResponsiveLayout({
  templates,
  children,
  className = '',
  style,
  fillViewport = false,
  viewportOffset,
}: EfxResponsiveLayoutProps) {
  const breakpoint = useBreakpoint()

  // Select appropriate template based on breakpoint
  const template =
    breakpoint === 'mobile'
      ? templates.mobile
      : breakpoint === 'tablet'
      ? templates.tablet ?? templates.desktop
      : templates.desktop

  // Get appropriate offset
  const getOffset = (): string => {
    if (!viewportOffset) return '0px'

    if (
      typeof viewportOffset === 'string' ||
      typeof viewportOffset === 'number'
    ) {
      return typeof viewportOffset === 'number'
        ? `${viewportOffset}px`
        : viewportOffset
    }

    // Responsive offset object
    if (breakpoint === 'mobile') {
      return viewportOffset.mobile ?? viewportOffset.desktop ?? '0px'
    }
    return viewportOffset.desktop ?? '0px'
  }

  const offsetValue = getOffset()

  const gridStyle: CSSProperties = {
    display: 'grid',
    gridTemplateAreas: template.areas,
    gridTemplateColumns: template.columns?.join(' ') ?? '1fr',
    gridTemplateRows: template.rows?.join(' ') ?? 'auto',
    gap: normalizeGap(template.gap),
    padding: buildPaddingStyle(template.padding),
    height: '100%',
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

// Re-export types for convenience
export type { ResponsiveTemplates }
