/**
 * EfxLayout - Standalone Layout System
 * 
 * A flexible CSS Grid-based layout system that can be used independently
 * of the EfxChart charting components. Provides template-based layouts
 * with support for named grid areas and responsive designs.
 */

// Layout components
export { EfxLayout, LayoutItem, type LayoutTemplate, type LayoutPadding } from "./EfxLayout"
export { EfxGrid } from "./EfxGrid"
export { EfxResponsiveLayout, type ResponsiveTemplates } from "./EfxResponsiveLayout"

// Layout presets
export { LAYOUT_PRESETS, RESPONSIVE_LAYOUTS, type LayoutPresetName } from "./layoutPresets"
