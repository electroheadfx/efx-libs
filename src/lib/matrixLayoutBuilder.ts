// Matrix layout builder - converts simple templates to ECharts mediaDefinitions
import type {
	MatrixCoord,
	MediaDefinition,
	SectionCoordValue,
	SimpleMatrixLayout,
	TemplateCell,
} from "@/types/matrixLayout.types";

/**
 * Parse ASCII grid template into cell definitions.
 *
 * Template format:
 * ```
 * | header  | header  |
 * | sidebar | main    |
 * | footer  | footer  |
 * ```
 */
function parseTemplate(template: string): {
	rows: number;
	cols: number;
	cells: Map<string, TemplateCell>;
} {
	const lines = template
		.trim()
		.split("\n")
		.map((line) => line.trim())
		.filter((line) => line.length > 0);

	const grid: string[][] = lines.map((line) =>
		line
			.split("|")
			.map((cell) => cell.trim())
			.filter((cell) => cell.length > 0),
	);

	const rows = grid.length;
	const cols = Math.max(...grid.map((row) => row.length));

	// Find spans for each section
	const cells = new Map<string, TemplateCell>();
	const visited = new Set<string>();

	for (let row = 0; row < rows; row++) {
		for (let col = 0; col < cols; col++) {
			const sectionId = grid[row]?.[col];
			if (!sectionId || visited.has(`${row},${col}`)) continue;

			// Find span extents
			let rowSpan = 1;
			let colSpan = 1;

			// Check column span
			while (col + colSpan < cols && grid[row][col + colSpan] === sectionId) {
				colSpan++;
			}

			// Check row span
			while (row + rowSpan < rows) {
				let fullRow = true;
				for (let c = col; c < col + colSpan; c++) {
					if (grid[row + rowSpan]?.[c] !== sectionId) {
						fullRow = false;
						break;
					}
				}
				if (!fullRow) break;
				rowSpan++;
			}

			// Mark cells as visited
			for (let r = row; r < row + rowSpan; r++) {
				for (let c = col; c < col + colSpan; c++) {
					visited.add(`${r},${c}`);
				}
			}

			// Store cell info (only first occurrence)
			if (!cells.has(sectionId)) {
				cells.set(sectionId, { sectionId, row, col, rowSpan, colSpan });
			}
		}
	}

	return { rows, cols, cells };
}

/**
 * Convert simple layout config to ECharts mediaDefinitions.
 */
export function buildMediaDefinitions(
	layout: SimpleMatrixLayout,
): MediaDefinition[] {
	const mediaDefinitions: MediaDefinition[] = [];

	// Sort breakpoints: specific queries first, default last
	const sortedBreakpoints = Object.entries(layout.breakpoints).sort(
		([, a], [, b]) => {
			const aHasQuery = a.minWidth != null || a.maxWidth != null;
			const bHasQuery = b.minWidth != null || b.maxWidth != null;
			if (aHasQuery && !bHasQuery) return -1;
			if (!aHasQuery && bHasQuery) return 1;
			return 0;
		},
	);

	for (const [_name, config] of sortedBreakpoints) {
		const { rows, cols, cells } = parseTemplate(config.template);

		// Build query
		const query: { minWidth?: number; maxWidth?: number } | undefined =
			config.minWidth != null || config.maxWidth != null
				? { minWidth: config.minWidth, maxWidth: config.maxWidth }
				: undefined;

		// Build sectionCoordMap
		const sectionCoordMap: Record<string, SectionCoordValue> = {};

		for (const [sectionId, cell] of cells) {
			const colCoord: MatrixCoord =
				cell.colSpan === 1 ? cell.col : [cell.col, cell.col + cell.colSpan - 1];
			const rowCoord: MatrixCoord =
				cell.rowSpan === 1 ? cell.row : [cell.row, cell.row + cell.rowSpan - 1];

			sectionCoordMap[sectionId] = [colCoord, rowCoord];
		}

		mediaDefinitions.push({
			query,
			matrix: {
				x: { data: Array(cols).fill(null) },
				y: { data: Array(rows).fill(null) },
			},
			sectionCoordMap,
		});
	}

	return mediaDefinitions;
}
