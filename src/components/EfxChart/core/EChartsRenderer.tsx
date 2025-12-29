/**
 * EChartsRenderer Component
 *
 * SSR-safe ECharts renderer component.
 * This component should be lazy-loaded for SSR compatibility.
 */

import { useMemo, useRef } from "react";
import {
	type UseEChartsInstanceOptions,
	useEChartsInstance,
} from "./useEChartsInstance";

export interface EChartsRendererProps
	extends Omit<UseEChartsInstanceOptions, "option"> {
	/** ECharts option configuration */
	option: UseEChartsInstanceOptions["option"];
	/** Container className */
	className?: string;
	/** Container style */
	style?: React.CSSProperties;
	/** Container width (default: 100%) */
	width?: string | number;
	/** Container height (default: 100%) */
	height?: string | number;
}

/**
 * ECharts renderer component - renders a single ECharts instance
 *
 * @example
 * ```tsx
 * const LazyEChartsRenderer = React.lazy(() =>
 *   import('./core/EChartsRenderer').then(m => ({ default: m.EChartsRenderer }))
 * );
 *
 * <Suspense fallback={<div>Loading...</div>}>
 *   <LazyEChartsRenderer option={chartOption} />
 * </Suspense>
 * ```
 */
export function EChartsRenderer({
	option,
	events,
	onReady,
	theme,
	renderer = "canvas",
	autoResize = true,
	className,
	style,
	width = "100%",
	height = "100%",
}: EChartsRendererProps) {
	const containerRef = useRef<HTMLDivElement>(null);

	const containerStyle = useMemo(
		() => ({
			width: typeof width === "number" ? `${width}px` : width,
			height: typeof height === "number" ? `${height}px` : height,
			...style,
		}),
		[width, height, style],
	);

	useEChartsInstance(containerRef, {
		option,
		events,
		onReady,
		theme,
		renderer,
		autoResize,
	});

	return (
		<div ref={containerRef} className={className} style={containerStyle} />
	);
}

export default EChartsRenderer;
