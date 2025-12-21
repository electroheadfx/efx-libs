// useMediaQuery hook for responsive breakpoint detection
import { useEffect, useState } from "react";

export function useMediaQuery(query: string): boolean {
	const [matches, setMatches] = useState(false);

	useEffect(() => {
		if (typeof window === "undefined") return;

		const mediaQuery = window.matchMedia(query);

		// Set initial value
		setMatches(mediaQuery.matches);

		// Listen for changes
		const handler = (event: MediaQueryListEvent) => {
			setMatches(event.matches);
		};

		mediaQuery.addEventListener("change", handler);
		return () => mediaQuery.removeEventListener("change", handler);
	}, [query]);

	return matches;
}

// Preset breakpoint hooks
export function useIsMobile(): boolean {
	return useMediaQuery("(max-width: 639px)");
}

export function useIsTablet(): boolean {
	return useMediaQuery("(min-width: 640px) and (max-width: 1023px)");
}

export function useIsDesktop(): boolean {
	return useMediaQuery("(min-width: 1024px)");
}

// Breakpoint-based hook
export type Breakpoint = "mobile" | "tablet" | "desktop";

export function useBreakpoint(): Breakpoint {
	const isMobile = useIsMobile();
	const isTablet = useIsTablet();

	if (isMobile) return "mobile";
	if (isTablet) return "tablet";
	return "desktop";
}
