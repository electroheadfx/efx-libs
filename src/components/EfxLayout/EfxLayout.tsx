"use client";

import type { CSSProperties, ReactNode } from "react";

export interface LayoutPadding {
	top?: number | string;
	right?: number | string;
	bottom?: number | string;
	left?: number | string;
}

export interface LayoutTemplate {
	areas: string;
	columns?: string[];
	rows?: string[];
	gap?: number | string;
	padding?: LayoutPadding | number | string;
}

interface EfxLayoutProps {
	template: LayoutTemplate;
	children: ReactNode;
	className?: string;
	style?: CSSProperties;
	/** Fill remaining viewport height */
	fillViewport?: boolean;
	/** Offset from viewport height (e.g., header height) */
	viewportOffset?: number | string;
}

interface LayoutItemProps {
	area: string;
	children: ReactNode;
	className?: string;
	style?: CSSProperties;
}

// Helper to normalize padding value
function normalizePadding(value: number | string | undefined): string {
	if (value === undefined) return "0";
	return typeof value === "number" ? `${value}px` : value;
}

// Helper to build padding string from LayoutPadding
function buildPaddingStyle(
	padding: LayoutPadding | number | string | undefined,
): string {
	if (padding === undefined) return "0";

	if (typeof padding === "number") {
		return `${padding}px`;
	}

	if (typeof padding === "string") {
		return padding;
	}

	// Object form: { top, right, bottom, left }
	const top = normalizePadding(padding.top);
	const right = normalizePadding(padding.right);
	const bottom = normalizePadding(padding.bottom);
	const left = normalizePadding(padding.left);

	return `${top} ${right} ${bottom} ${left}`;
}

/**
 * EfxLayout - CSS Grid-based layout component
 *
 * Provides a flexible grid layout system using CSS Grid template areas.
 * Can be used independently of EfxChart components.
 */
export function EfxLayout({
	template,
	children,
	className = "",
	style,
	fillViewport = false,
	viewportOffset,
}: EfxLayoutProps) {
	const offsetValue = viewportOffset
		? typeof viewportOffset === "number"
			? `${viewportOffset}px`
			: viewportOffset
		: "0px";

	const gridStyle: CSSProperties = {
		display: "grid",
		gridTemplateAreas: template.areas,
		gridTemplateColumns: template.columns?.join(" ") ?? "1fr",
		gridTemplateRows: template.rows?.join(" ") ?? "auto",
		gap:
			typeof template.gap === "number"
				? `${template.gap}px`
				: (template.gap ?? "16px"),
		padding: buildPaddingStyle(template.padding),
		// Only set height when fillViewport is true, otherwise let className control it
		...(fillViewport && {
			height: `calc(100vh - ${offsetValue})`,
			minHeight: `calc(100vh - ${offsetValue})`,
		}),
		...style,
	};

	return (
		<div style={gridStyle} className={className}>
			{children}
		</div>
	);
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
	className = "",
	style,
}: LayoutItemProps) {
	return (
		<div
			style={{ gridArea: area, minHeight: 0, minWidth: 0, ...style }}
			className={className}
		>
			{children}
		</div>
	);
}
