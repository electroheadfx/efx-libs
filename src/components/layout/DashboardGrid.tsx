"use client";

import { Children, type ReactNode } from "react";

interface DashboardGridProps {
	children: ReactNode;
	columns?: number | { sm?: number; md?: number; lg?: number };
	gap?: number | string;
	rowHeight?: number | string;
	fillHeight?: boolean; // When true, uses 1fr rows to fill container
	className?: string;
}

export function DashboardGrid({
	children,
	columns = 2,
	gap = 16,
	rowHeight = "auto",
	fillHeight = false,
	className = "",
}: DashboardGridProps) {
	// Build responsive grid classes
	let gridCols: string;
	if (typeof columns === "number") {
		gridCols = `repeat(${columns}, minmax(0, 1fr))`;
	} else {
		// Use CSS custom properties for responsive columns
		gridCols = `repeat(var(--grid-cols, ${
			columns.lg ?? columns.md ?? columns.sm ?? 2
		}), minmax(0, 1fr))`;
	}

	const responsiveStyles =
		typeof columns === "object"
			? {
					"--grid-cols-sm": columns.sm ?? 1,
					"--grid-cols-md": columns.md ?? 2,
					"--grid-cols-lg": columns.lg ?? 3,
				}
			: {};

	// Calculate number of rows for fillHeight mode
	const childCount = Children.count(children);
	const numCols =
		typeof columns === "number"
			? columns
			: (columns.lg ?? columns.md ?? columns.sm ?? 2);
	const numRows = Math.ceil(childCount / numCols);

	// Determine row template
	let gridRowTemplate: string;
	if (fillHeight) {
		// Use 1fr for each row to fill the container
		gridRowTemplate = `repeat(${numRows}, minmax(0, 1fr))`;
	} else {
		gridRowTemplate =
			typeof rowHeight === "number" ? `${rowHeight}px` : rowHeight;
	}

	return (
		<div
			className={`grid ${fillHeight ? "h-full" : ""} ${className}`}
			style={
				{
					display: "grid",
					gridTemplateColumns: gridCols,
					gap: typeof gap === "number" ? `${gap}px` : gap,
					...(fillHeight
						? { gridTemplateRows: gridRowTemplate }
						: { gridAutoRows: gridRowTemplate }),
					...responsiveStyles,
				} as React.CSSProperties
			}
		>
			{Children.map(children, (child) => (
				<div className="min-h-0 h-full">{child}</div>
			))}
		</div>
	);
}
