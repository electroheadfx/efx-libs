"use client";

import type { CSSProperties, ReactNode } from "react";
import { useBreakpoint } from "@/hooks/useMediaQuery";
import type { LayoutPadding, LayoutTemplate } from "./DashboardLayout";

export interface ResponsiveTemplates {
	desktop: LayoutTemplate;
	mobile: LayoutTemplate;
	tablet?: LayoutTemplate;
}

interface ResponsiveDashboardLayoutProps {
	templates: ResponsiveTemplates;
	children: ReactNode;
	className?: string;
	style?: CSSProperties;
	/** Fill remaining viewport height */
	fillViewport?: boolean;
	/** Offset from viewport height (e.g., header height) - can be responsive */
	viewportOffset?: number | string | { desktop?: string; mobile?: string };
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

export function ResponsiveDashboardLayout({
	templates,
	children,
	className = "",
	style,
	fillViewport = false,
	viewportOffset,
}: ResponsiveDashboardLayoutProps) {
	const breakpoint = useBreakpoint();

	// Select appropriate template based on breakpoint
	const template =
		breakpoint === "mobile"
			? templates.mobile
			: breakpoint === "tablet"
				? (templates.tablet ?? templates.desktop)
				: templates.desktop;

	// Get appropriate offset
	const getOffset = (): string => {
		if (!viewportOffset) return "0px";

		if (
			typeof viewportOffset === "string" ||
			typeof viewportOffset === "number"
		) {
			return typeof viewportOffset === "number"
				? `${viewportOffset}px`
				: viewportOffset;
		}

		// Responsive offset object
		if (breakpoint === "mobile") {
			return viewportOffset.mobile ?? viewportOffset.desktop ?? "0px";
		}
		return viewportOffset.desktop ?? "0px";
	};

	const offsetValue = getOffset();

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
		height: "100%", // Always set height to 100% of parent
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

// Re-export LayoutItem from DashboardLayout for convenience
export { LayoutItem } from "./DashboardLayout";
