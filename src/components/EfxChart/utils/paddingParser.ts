/**
 * Padding Parser Utility
 *
 * Parses flexible padding format into normalized padding object.
 */

import type { EfxPadding, EfxParsedPadding } from "../types";

/**
 * Parse flexible padding format into standardized object
 *
 * Supports:
 * - number: All sides equal (e.g., 10)
 * - "10": All sides equal
 * - "20,10": Horizontal (left/right), Vertical (top/bottom)
 * - "10,20,30,40": Top, Right, Bottom, Left (CSS order)
 * - { top?, right?, bottom?, left? }: Explicit object
 *
 * @param padding - Flexible padding input
 * @returns Normalized padding object with all four sides
 */
export function parsePadding(padding?: EfxPadding): EfxParsedPadding {
	// Default padding
	if (padding === undefined || padding === null) {
		return { top: 0, right: 0, bottom: 0, left: 0 };
	}

	// Number: all sides equal
	if (typeof padding === "number") {
		return { top: padding, right: padding, bottom: padding, left: padding };
	}

	// String: parse comma-separated values
	if (typeof padding === "string") {
		const parts = padding
			.split(",")
			.map((p) => Number.parseInt(p.trim(), 10))
			.filter((n) => !Number.isNaN(n));

		if (parts.length === 0) {
			return { top: 0, right: 0, bottom: 0, left: 0 };
		}

		if (parts.length === 1) {
			// "10" → all sides equal
			return {
				top: parts[0],
				right: parts[0],
				bottom: parts[0],
				left: parts[0],
			};
		}

		if (parts.length === 2) {
			// "20,10" → horizontal (left/right), vertical (top/bottom)
			return {
				top: parts[1],
				right: parts[0],
				bottom: parts[1],
				left: parts[0],
			};
		}

		if (parts.length >= 4) {
			// "10,20,30,40" → top, right, bottom, left (CSS order)
			return {
				top: parts[0],
				right: parts[1],
				bottom: parts[2],
				left: parts[3],
			};
		}

		// 3 values: top, horizontal, bottom
		return {
			top: parts[0],
			right: parts[1],
			bottom: parts[2],
			left: parts[1],
		};
	}

	// Object: use provided values with defaults
	const obj = padding as {
		top?: number;
		right?: number;
		bottom?: number;
		left?: number;
	};
	return {
		top: obj.top ?? 0,
		right: obj.right ?? 0,
		bottom: obj.bottom ?? 0,
		left: obj.left ?? 0,
	};
}

/**
 * Convert parsed padding to ECharts grid position values
 *
 * @param padding - Parsed padding object
 * @returns Object with top, right, bottom, left as strings or numbers
 */
export function paddingToGridPosition(padding: EfxParsedPadding): {
	top: number;
	right: number;
	bottom: number;
	left: number;
} {
	return {
		top: padding.top,
		right: padding.right,
		bottom: padding.bottom,
		left: padding.left,
	};
}
