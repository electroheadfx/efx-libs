/**
 * Server Actions for EfxCharts Data Generation
 *
 * Generates time-based series data on the server side for SSR
 */

import { createServerFn } from "@tanstack/react-start";

/**
 * Type for time-series chart data
 * Tuple of [date-string, value] or [value, date-string] for inverted data
 */
export type TimeSeriesDataPoint = [string | number, string | number];

/**
 * Type for the complete EfxCharts finance data structure
 */
export interface EfxChartsFinanceData {
	header: TimeSeriesDataPoint[];
	sidebar: TimeSeriesDataPoint[];
	main: TimeSeriesDataPoint[];
	footer: TimeSeriesDataPoint[];
}

/**
 * Generate time-based series data matching the finance.js pattern
 * @param dayCount - Number of days to generate
 * @param inverseXY - Whether to swap X and Y values
 * @param seed - Seed for random number generation
 */
function generateSingleSeriesData(
	dayCount: number,
	inverseXY: boolean,
	seed: number,
): TimeSeriesDataPoint[] {
	const dayStart = new Date("2025-05-05T00:00:00.000Z");
	const timeStart = dayStart.getTime();
	const sevenDay = 7 * 1000 * 3600 * 24;
	const seriesData: TimeSeriesDataPoint[] = [];

	let localSeed = seed;
	const seededRandom = () => {
		const x = Math.sin(localSeed++) * 10000;
		return x - Math.floor(x);
	};

	let lastVal = Math.round(seededRandom() * 300);
	let turnCount: number | null = null;
	let sign = -1;

	for (let idx = 0; idx < dayCount; idx++) {
		if (turnCount === null || idx >= turnCount) {
			turnCount =
				idx + Math.round((dayCount / 4) * ((seededRandom() - 0.5) * 0.1));
			sign = -sign;
		}
		const deltaMag = 50;
		const delta = Math.round(
			seededRandom() * deltaMag - deltaMag / 2 + (sign * deltaMag) / 3,
		);
		lastVal += delta;
		const val = Math.max(0, lastVal);
		const xTime = timeStart + idx * sevenDay;
		const date = new Date(xTime);
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, "0");
		const day = String(date.getDate()).padStart(2, "0");
		const dataXVal = `${year}-${month}-${day}`;
		const item: TimeSeriesDataPoint = [dataXVal, val];
		if (inverseXY) {
			item.reverse();
		}
		seriesData.push(item);
	}
	return seriesData;
}

/**
 * Server function to generate EfxCharts finance data
 * This runs on the server and returns all four data sections
 * Supports request cancellation via AbortSignal
 */
export const getEfxChartsData = createServerFn({ method: "GET" })
	.inputValidator((data: { seed: number }) => data)
	.handler(async ({ data, context }): Promise<EfxChartsFinanceData> => {
		const { seed } = data;
		const signal = (context as unknown as { signal: AbortSignal }).signal;

		// Validate seed is a valid number
		if (typeof seed !== "number" || Number.isNaN(seed)) {
			throw new Error("Seed must be a valid number");
		}

		// Check if request was cancelled before starting work
		if (signal?.aborted) {
			throw new Error("Request cancelled");
		}

		// Simulate network delay (1s in dev, 0s in production)
		const DEMO_DELAY = import.meta.env.DEV ? 1000 : 0;
		await new Promise((resolve, reject) => {
			const timeout = setTimeout(resolve, DEMO_DELAY);

			// Cancel timeout if request is aborted
			signal?.addEventListener("abort", () => {
				clearTimeout(timeout);
				reject(new Error("Request cancelled"));
			});
		});

		// Check again after delay
		if (signal?.aborted) {
			throw new Error("Request cancelled");
		}

		// Generate all four data sections with different seed offsets
		const financeData: EfxChartsFinanceData = {
			header: generateSingleSeriesData(100, false, seed),
			sidebar: generateSingleSeriesData(10, true, seed + 100),
			main: generateSingleSeriesData(100, false, seed + 200),
			footer: generateSingleSeriesData(10, false, seed + 300),
		};

		return financeData;
	});
