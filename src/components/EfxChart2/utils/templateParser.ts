/**
 * Template Parser Utility
 *
 * Parses ASCII pipe-delimited templates into matrix coordinates.
 */

import type {
	EfxLayoutTemplate,
	MatrixCoord,
	ParsedLayout,
	SectionCoordMap,
} from "../types";

/**
 * Parse an ASCII template string into a 2D grid of section names
 *
 * @param template - Pipe-delimited ASCII template string
 * @returns 2D array of section names [row][col]
 */
function parseAsciiTemplate(template: string): string[][] {
	const lines = template
		.trim()
		.split("\n")
		.filter((line) => line.trim().length > 0);

	return lines.map((line) => {
		// Split by | and trim each cell
		const cells = line
			.split("|")
			.map((cell) => cell.trim())
			.filter((cell) => cell.length > 0);
		return cells;
	});
}

/**
 * Find the bounding box of a section in the grid
 *
 * @param grid - 2D array of section names
 * @param sectionId - Section ID to find
 * @returns [minCol, maxCol, minRow, maxRow] or null if not found
 */
function findSectionBounds(
	grid: string[][],
	sectionId: string,
): [number, number, number, number] | null {
	let minCol = Number.POSITIVE_INFINITY;
	let maxCol = Number.NEGATIVE_INFINITY;
	let minRow = Number.POSITIVE_INFINITY;
	let maxRow = Number.NEGATIVE_INFINITY;
	let found = false;

	for (let row = 0; row < grid.length; row++) {
		for (let col = 0; col < grid[row].length; col++) {
			if (grid[row][col] === sectionId) {
				found = true;
				minCol = Math.min(minCol, col);
				maxCol = Math.max(maxCol, col);
				minRow = Math.min(minRow, row);
				maxRow = Math.max(maxRow, row);
			}
		}
	}

	return found ? [minCol, maxCol, minRow, maxRow] : null;
}

/**
 * Convert bounds to matrix coordinate format
 *
 * Single value if start === end, otherwise [start, end] tuple
 */
function boundsToCoord(min: number, max: number): MatrixCoord {
	return min === max ? min : [min, max];
}

/**
 * Parse an ASCII template into layout coordinates
 *
 * @param templateString - Pipe-delimited ASCII template
 * @returns ParsedLayout with columns, rows, and sectionCoordMap
 */
export function parseTemplateToLayout(templateString: string): ParsedLayout {
	const grid = parseAsciiTemplate(templateString);

	if (grid.length === 0) {
		return { columns: 0, rows: 0, sectionCoordMap: {} };
	}

	const rows = grid.length;
	const columns = Math.max(...grid.map((row) => row.length));

	// Find all unique section IDs
	const sectionIds = new Set<string>();
	for (const row of grid) {
		for (const cell of row) {
			sectionIds.add(cell);
		}
	}

	// Build section coordinate map
	const sectionCoordMap: SectionCoordMap = {};

	for (const sectionId of sectionIds) {
		const bounds = findSectionBounds(grid, sectionId);
		if (bounds) {
			const [minCol, maxCol, minRow, maxRow] = bounds;
			sectionCoordMap[sectionId] = [
				boundsToCoord(minCol, maxCol),
				boundsToCoord(minRow, maxRow),
			];
		}
	}

	return { columns, rows, sectionCoordMap };
}

/**
 * Parse a complete layout template for all breakpoints
 *
 * @param template - Layout template with mobile/desktop/tablet strings
 * @returns Object with parsed layouts for each breakpoint
 */
export function parseLayoutTemplate(template: EfxLayoutTemplate): {
	mobile: ParsedLayout;
	desktop: ParsedLayout;
	tablet?: ParsedLayout;
} {
	return {
		mobile: parseTemplateToLayout(template.mobile),
		desktop: parseTemplateToLayout(template.desktop),
		tablet: template.tablet
			? parseTemplateToLayout(template.tablet)
			: undefined,
	};
}

/**
 * Mirror a layout horizontally (for sidebar position switching)
 *
 * @param layout - Original parsed layout
 * @returns New layout with columns mirrored
 */
export function mirrorLayoutHorizontally(layout: ParsedLayout): ParsedLayout {
	const { columns, rows, sectionCoordMap } = layout;

	const mirroredMap: SectionCoordMap = {};

	for (const [sectionId, [colCoord, rowCoord]] of Object.entries(
		sectionCoordMap,
	)) {
		let newColCoord: MatrixCoord;

		if (typeof colCoord === "number") {
			// Single column: mirror it
			newColCoord = columns - 1 - colCoord;
		} else {
			// Range: mirror both ends and swap
			const [start, end] = colCoord;
			newColCoord = [columns - 1 - end, columns - 1 - start];
		}

		mirroredMap[sectionId] = [newColCoord, rowCoord];
	}

	return { columns, rows, sectionCoordMap: mirroredMap };
}

/**
 * Convert section coordinates to percentage-based grid positions
 *
 * @param sectionCoordMap - Map of section IDs to coordinates
 * @param columns - Total number of columns
 * @param rows - Total number of rows
 * @returns Map of section IDs to { left, right, top, bottom } percentages
 */
export function coordsToPercentages(
	sectionCoordMap: SectionCoordMap,
	columns: number,
	rows: number,
): Record<
	string,
	{ left: string; right: string; top: string; bottom: string }
> {
	const result: Record<
		string,
		{ left: string; right: string; top: string; bottom: string }
	> = {};

	for (const [sectionId, [colCoord, rowCoord]] of Object.entries(
		sectionCoordMap,
	)) {
		// Parse column coordinates
		const colStart = typeof colCoord === "number" ? colCoord : colCoord[0];
		const colEnd = typeof colCoord === "number" ? colCoord : colCoord[1];

		// Parse row coordinates
		const rowStart = typeof rowCoord === "number" ? rowCoord : rowCoord[0];
		const rowEnd = typeof rowCoord === "number" ? rowCoord : rowCoord[1];

		// Calculate percentages
		const left = (colStart / columns) * 100;
		const right = ((columns - colEnd - 1) / columns) * 100;
		const top = (rowStart / rows) * 100;
		const bottom = ((rows - rowEnd - 1) / rows) * 100;

		result[sectionId] = {
			left: `${left}%`,
			right: `${right}%`,
			top: `${top}%`,
			bottom: `${bottom}%`,
		};
	}

	return result;
}

/**
 * Gap configuration for grid spacing
 */
export interface GapConfig {
	/** Horizontal gap in pixels */
	x: number;
	/** Vertical gap in pixels */
	y: number;
}

/**
 * Container dimensions for pixel-to-percentage conversion
 */
export interface ContainerSize {
	width: number;
	height: number;
}

/**
 * Convert section coordinates to percentage-based grid positions with gap support
 *
 * Gaps are applied between grid sections (not at edges):
 * - For N columns, there are (N-1) horizontal gaps
 * - For M rows, there are (M-1) vertical gaps
 *
 * @param sectionCoordMap - Map of section IDs to coordinates
 * @param columns - Total number of columns
 * @param rows - Total number of rows
 * @param gap - Gap configuration in pixels
 * @param containerSize - Container dimensions for pixel-to-percentage conversion
 * @returns Map of section IDs to { left, right, top, bottom } percentages
 */
export function coordsToPercentagesWithGap(
	sectionCoordMap: SectionCoordMap,
	columns: number,
	rows: number,
	gap: GapConfig,
	containerSize: ContainerSize,
): Record<
	string,
	{ left: string; right: string; top: string; bottom: string }
> {
	const result: Record<
		string,
		{ left: string; right: string; top: string; bottom: string }
	> = {};

	// Convert pixel gaps to percentages
	const gapXPercent =
		containerSize.width > 0 ? (gap.x / containerSize.width) * 100 : 0;
	const gapYPercent =
		containerSize.height > 0 ? (gap.y / containerSize.height) * 100 : 0;

	// Total gap space
	const totalGapX = (columns - 1) * gapXPercent;
	const totalGapY = (rows - 1) * gapYPercent;

	// Available space after gaps
	const availableWidth = 100 - totalGapX;
	const availableHeight = 100 - totalGapY;

	// Width/height per column/row
	const colWidth = availableWidth / columns;
	const rowHeight = availableHeight / rows;

	for (const [sectionId, [colCoord, rowCoord]] of Object.entries(
		sectionCoordMap,
	)) {
		// Parse column coordinates
		const colStart = typeof colCoord === "number" ? colCoord : colCoord[0];
		const colEnd = typeof colCoord === "number" ? colCoord : colCoord[1];

		// Parse row coordinates
		const rowStart = typeof rowCoord === "number" ? rowCoord : rowCoord[0];
		const rowEnd = typeof rowCoord === "number" ? rowCoord : rowCoord[1];

		// Calculate left position: (columns before * colWidth) + (gaps before * gapX)
		const left = colStart * colWidth + colStart * gapXPercent;

		// Calculate right position: remaining columns + remaining gaps
		const colsAfter = columns - colEnd - 1;
		const right = colsAfter * colWidth + colsAfter * gapXPercent;

		// Calculate top position: (rows before * rowHeight) + (gaps before * gapY)
		const top = rowStart * rowHeight + rowStart * gapYPercent;

		// Calculate bottom position: remaining rows + remaining gaps
		const rowsAfter = rows - rowEnd - 1;
		const bottom = rowsAfter * rowHeight + rowsAfter * gapYPercent;

		result[sectionId] = {
			left: `${left}%`,
			right: `${right}%`,
			top: `${top}%`,
			bottom: `${bottom}%`,
		};
	}

	return result;
}
