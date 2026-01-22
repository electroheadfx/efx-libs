/**
 * EfxLayout - Standalone Layout System
 *
 * A flexible CSS Grid-based layout system that can be used independently
 * of the EfxChart charting components. Provides template-based layouts
 * with support for named grid areas and responsive designs.
 */

export { EfxGrid } from "./EfxGrid";
// Layout components
export {
	EfxLayout,
	LayoutItem,
	type LayoutPadding,
	type LayoutTemplate,
} from "./EfxLayout";
export {
	EfxResponsiveLayout,
	type ResponsiveTemplates,
} from "./EfxResponsiveLayout";

// Layout presets
export {
	LAYOUT_PRESETS,
	type LayoutPresetName,
	RESPONSIVE_LAYOUTS,
} from "./layoutPresets";
