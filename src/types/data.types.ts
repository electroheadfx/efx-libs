// Data type inference types

export type DataType =
	| "time-series"
	| "categorical"
	| "numerical-pair"
	| "hierarchical"
	| "multi-dimensional"
	| "distribution"
	| "unknown";

export type ColumnType = "string" | "number" | "date" | "boolean" | "mixed";

export interface ColumnInfo {
	name: string;
	type: ColumnType;
	sampleValues: unknown[];
	nullCount: number;
	uniqueCount: number;
}

export interface InferenceResult {
	dataType: DataType;
	confidence: number;
	suggestedChartTypes: import("./chart.types").ChartType[];
	columns: ColumnInfo[];
	xAxisKey?: string;
	yAxisKey?: string;
	seriesKeys?: string[];
	dateFormat?: string;
}

// Date pattern detection
export interface DatePattern {
	pattern: RegExp;
	format: string;
	name: string;
}

export const DATE_PATTERNS: DatePattern[] = [
	{
		pattern: /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/,
		format: "ISO",
		name: "ISO 8601",
	},
	{ pattern: /^\d{4}-\d{2}-\d{2}$/, format: "YYYY-MM-DD", name: "Date only" },
	{ pattern: /^\d{2}\/\d{2}\/\d{4}$/, format: "MM/DD/YYYY", name: "US date" },
	{ pattern: /^\d{2}-\d{2}-\d{4}$/, format: "DD-MM-YYYY", name: "EU date" },
	{ pattern: /^\d{13}$/, format: "timestamp-ms", name: "Unix timestamp (ms)" },
	{ pattern: /^\d{10}$/, format: "timestamp-s", name: "Unix timestamp (s)" },
];
