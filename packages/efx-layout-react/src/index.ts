/**
 * @efx/layout-react
 *
 * React components for EfxLayout - CSS Grid-based dashboard layouts.
 */

// Components
export { EfxLayout, LayoutItem, type EfxLayoutProps, type LayoutItemProps } from './EfxLayout'
export { EfxGrid, type EfxGridProps } from './EfxGrid'
export { EfxResponsiveLayout, type EfxResponsiveLayoutProps } from './EfxResponsiveLayout'

// Hooks
export {
  useBreakpoint,
  useIsDesktop,
  useIsMobile,
  useIsTablet,
  useMediaQuery,
} from './useMediaQuery'

// Re-export core types and utilities for convenience
export {
  // Types
  type Breakpoint,
  type LayoutPadding,
  type LayoutTemplate,
  type ResponsiveColumns,
  type ResponsiveTemplates,
  // Presets
  LAYOUT_PRESETS,
  type LayoutPresetName,
  RESPONSIVE_LAYOUTS,
  type ResponsiveLayoutName,
  // Utilities
  buildPaddingStyle,
  normalizeGap,
  normalizePadding,
  normalizeSize,
} from '@efx/layout-core'
