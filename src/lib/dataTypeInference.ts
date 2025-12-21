// Data type inference engine

import type { ChartType } from "@/types/chart.types";
import type {
	ColumnInfo,
	ColumnType,
	InferenceResult,
} from "@/types/data.types";

const SAMPLE_SIZE = 100;

/**
 * Detect column type from values
 */
function detectColumnType(values: unknown[]): ColumnType {
	const validValues = values.filter((v) => v != null);
	if (validValues.length === 0) return "mixed";

	const types = new Map<string, number>();

	for (const value of validValues) {
		if (typeof value === "number") {
			types.set("number", (types.get("number") ?? 0) + 1);
		} else if (typeof value === "boolean") {
			types.set("boolean", (types.get("boolean") ?? 0) + 1);
		} else if (typeof value === "string") {
			// Check if it's a date string
			if (isDateString(value)) {
				types.set("date", (types.get("date") ?? 0) + 1);
			} else if (!Number.isNaN(Number(value)) && value.trim() !== "") {
				types.set("number", (types.get("number") ?? 0) + 1);
			} else {
				types.set("string", (types.get("string") ?? 0) + 1);
			}
		} else if (value instanceof Date) {
			types.set("date", (types.get("date") ?? 0) + 1);
		}
	}

	// Find dominant type (>80% threshold)
	const total = validValues.length;
	for (const [type, count] of types) {
		if (count / total >= 0.8) {
			return type as ColumnType;
		}
	}

	return "mixed";
}

/**
 * Check if string is a date
 */
function isDateString(value: string): boolean {
	// Common date patterns
	const patterns = [
		/^\d{4}-\d{2}-\d{2}/, // ISO format
		/^\d{2}\/\d{2}\/\d{4}/, // US format
		/^\d{2}-\d{2}-\d{4}/, // EU format
		/^\d{13}$/, // Unix timestamp ms
		/^\d{10}$/, // Unix timestamp s
	];

	return patterns.some((p) => p.test(value));
}

/**
 * Analyze columns in data
 */
function analyzeColumns(data: Record<string, unknown>[]): ColumnInfo[] {
	if (data.length === 0) return [];

	const sample = data.slice(0, SAMPLE_SIZE);
	const keys = Object.keys(sample[0] ?? {});

	return keys.map((name) => {
		const values = sample.map((row) => row[name]);
		const type = detectColumnType(values);
		const uniqueValues = new Set(values.filter((v) => v != null));

		return {
			name,
			type,
			sampleValues: values.slice(0, 5),
			nullCount: values.filter((v) => v == null).length,
			uniqueCount: uniqueValues.size,
		};
	});
}

/**
 * Infer data type from data structure
 */
export function inferDataType(data: unknown[]): InferenceResult {
	if (!Array.isArray(data) || data.length === 0) {
		return {
			dataType: "unknown",
			confidence: 0,
			suggestedChartTypes: [],
			columns: [],
		};
	}

	const firstItem = data[0];

	// Check for array of numbers (distribution)
	if (typeof firstItem === "number") {
		return {
			dataType: "distribution",
			confidence: 0.95,
			suggestedChartTypes: ["bar", "line"],
			columns: [],
		};
	}

	// Check for nested arrays (multi-dimensional/violin data)
	if (Array.isArray(firstItem)) {
		return {
			dataType: "multi-dimensional",
			confidence: 0.9,
			suggestedChartTypes: ["violin", "radar"],
			columns: [],
		};
	}

	// Object array - analyze columns
	if (typeof firstItem === "object" && firstItem !== null) {
		const columns = analyzeColumns(data as Record<string, unknown>[]);

		// Check for hierarchical (has children)
		const hasChildren = columns.some((c) => c.name === "children");
		if (hasChildren) {
			return {
				dataType: "hierarchical",
				confidence: 0.95,
				suggestedChartTypes: ["treemap", "sunburst"],
				columns,
			};
		}

		// Count column types
		const dateColumns = columns.filter((c) => c.type === "date");
		const numericColumns = columns.filter((c) => c.type === "number");
		const stringColumns = columns.filter((c) => c.type === "string");

		// Time series: has date column and numeric values
		if (dateColumns.length >= 1 && numericColumns.length >= 1) {
			return {
				dataType: "time-series",
				confidence: 0.9,
				suggestedChartTypes: ["line", "bar"],
				columns,
				xAxisKey: dateColumns[0].name,
				yAxisKey: numericColumns[0].name,
				seriesKeys: numericColumns.map((c) => c.name),
			};
		}

		// Numerical pair: exactly 2 numeric columns
		if (numericColumns.length >= 2 && stringColumns.length === 0) {
			return {
				dataType: "numerical-pair",
				confidence: 0.85,
				suggestedChartTypes: ["scatter"],
				columns,
				xAxisKey: numericColumns[0].name,
				yAxisKey: numericColumns[1].name,
			};
		}

		// Categorical: string + numeric
		if (stringColumns.length >= 1 && numericColumns.length >= 1) {
			return {
				dataType: "categorical",
				confidence: 0.85,
				suggestedChartTypes: ["bar", "pie"],
				columns,
				xAxisKey: stringColumns[0].name,
				yAxisKey: numericColumns[0].name,
			};
		}

		// Multi-dimensional: multiple numeric columns
		if (numericColumns.length >= 3) {
			return {
				dataType: "multi-dimensional",
				confidence: 0.75,
				suggestedChartTypes: ["radar"],
				columns,
				seriesKeys: numericColumns.map((c) => c.name),
			};
		}
	}

	return {
		dataType: "unknown",
		confidence: 0,
		suggestedChartTypes: [],
		columns: [],
	};
}

/**
 * Get chart type suggestions based on data
 */
export function suggestChartTypes(data: unknown[]): ChartType[] {
	const inference = inferDataType(data);
	return inference.suggestedChartTypes;
}
