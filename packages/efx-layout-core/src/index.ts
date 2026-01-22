/**
 * @efxlab/layout-core
 *
 * Framework-agnostic core types, utilities, and presets for the EfxLayout system.
 */

// Types
export type {
  Breakpoint,
  LayoutPadding,
  LayoutTemplate,
  ResponsiveColumns,
  ResponsiveTemplates,
} from './types'

// Utilities
export {
  buildPaddingStyle,
  normalizeGap,
  normalizePadding,
  normalizeSize,
} from './utils'

// Presets
export {
  LAYOUT_PRESETS,
  type LayoutPresetName,
  RESPONSIVE_LAYOUTS,
  type ResponsiveLayoutName,
} from './presets'
