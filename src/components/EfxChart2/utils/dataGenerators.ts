/**
 * Data Generators Utility
 *
 * Sample data generation utilities for demo and testing.
 */

/**
 * Generate time series data points
 *
 * @param count - Number of data points
 * @param startDate - Start date (default: 100 days ago)
 * @returns Array of [timestamp, value] pairs
 */
export function generateTimeSeriesData(
	count: number,
	startDate?: Date,
): [number, number][] {
	const data: [number, number][] = [];
	const start = startDate ?? new Date(Date.now() - count * 24 * 60 * 60 * 1000);
	let value = 100 + Math.random() * 50;

	for (let i = 0; i < count; i++) {
		const timestamp = start.getTime() + i * 24 * 60 * 60 * 1000;
		// Random walk with trend
		value += (Math.random() - 0.48) * 10;
		value = Math.max(10, value); // Keep positive
		data.push([timestamp, Math.round(value * 100) / 100]);
	}

	return data;
}

/**
 * Generate categorical data with labels
 *
 * @param count - Number of categories
 * @param labels - Optional custom labels
 * @returns Array of { name, value } objects
 */
export function generateCategoryData(
	count: number,
	labels?: string[],
): { name: string; value: number }[] {
	const defaultLabels = [
		"Category A",
		"Category B",
		"Category C",
		"Category D",
		"Category E",
		"Category F",
		"Category G",
		"Category H",
		"Category I",
		"Category J",
	];

	const data: { name: string; value: number }[] = [];

	for (let i = 0; i < count; i++) {
		data.push({
			name: labels?.[i] ?? defaultLabels[i % defaultLabels.length],
			value: Math.round(Math.random() * 1000),
		});
	}

	return data;
}

/**
 * Generate scatter plot data
 *
 * @param count - Number of data points
 * @returns Array of [x, y] pairs
 */
export function generateScatterData(count: number): [number, number][] {
	const data: [number, number][] = [];

	for (let i = 0; i < count; i++) {
		// Create clustered data with some randomness
		const cluster = Math.floor(Math.random() * 3);
		const baseX = cluster * 30 + 20;
		const baseY = cluster * 20 + 30;

		data.push([
			baseX + (Math.random() - 0.5) * 20,
			baseY + (Math.random() - 0.5) * 15,
		]);
	}

	return data;
}

/**
 * Generate pie chart data
 *
 * @param count - Number of slices
 * @param labels - Optional custom labels
 * @returns Array of { name, value } objects for pie charts
 */
export function generatePieData(
	count: number,
	labels?: string[],
): { name: string; value: number }[] {
	const defaultLabels = [
		"Direct",
		"Email",
		"Affiliate",
		"Video Ads",
		"Search Engine",
		"Social",
		"Other",
	];

	const data: { name: string; value: number }[] = [];
	let remaining = 100;

	for (let i = 0; i < count; i++) {
		const isLast = i === count - 1;
		const value = isLast
			? remaining
			: Math.round(Math.random() * (remaining / (count - i)));

		remaining -= value;

		data.push({
			name: labels?.[i] ?? defaultLabels[i % defaultLabels.length],
			value: Math.max(1, value),
		});
	}

	return data;
}

/**
 * Generate multi-series time data
 *
 * @param seriesCount - Number of series
 * @param pointCount - Number of points per series
 * @returns Object with categories and series data
 */
export function generateMultiSeriesData(
	seriesCount: number,
	pointCount: number,
): {
	categories: string[];
	series: { name: string; data: number[] }[];
} {
	const categories: string[] = [];
	const series: { name: string; data: number[] }[] = [];

	// Generate categories (months)
	const months = [
		"Jan",
		"Feb",
		"Mar",
		"Apr",
		"May",
		"Jun",
		"Jul",
		"Aug",
		"Sep",
		"Oct",
		"Nov",
		"Dec",
	];
	for (let i = 0; i < pointCount; i++) {
		categories.push(months[i % 12]);
	}

	// Generate series data
	const seriesNames = [
		"Series A",
		"Series B",
		"Series C",
		"Series D",
		"Series E",
	];
	for (let s = 0; s < seriesCount; s++) {
		const data: number[] = [];
		let value = 50 + Math.random() * 50;

		for (let i = 0; i < pointCount; i++) {
			value += (Math.random() - 0.5) * 20;
			value = Math.max(10, Math.min(200, value));
			data.push(Math.round(value));
		}

		series.push({
			name: seriesNames[s % seriesNames.length],
			data,
		});
	}

	return { categories, series };
}

/**
 * Generate random OHLC (candlestick) data
 *
 * @param count - Number of data points
 * @returns Array of [open, close, low, high] values
 */
export function generateCandlestickData(
	count: number,
): [number, number, number, number][] {
	const data: [number, number, number, number][] = [];
	let basePrice = 100;

	for (let i = 0; i < count; i++) {
		const change = (Math.random() - 0.5) * 10;
		const open = basePrice;
		const close = basePrice + change;
		const high = Math.max(open, close) + Math.random() * 3;
		const low = Math.min(open, close) - Math.random() * 3;

		data.push([
			Math.round(open * 100) / 100,
			Math.round(close * 100) / 100,
			Math.round(low * 100) / 100,
			Math.round(high * 100) / 100,
		]);

		basePrice = close;
	}

	return data;
}
