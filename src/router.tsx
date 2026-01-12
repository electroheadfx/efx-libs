import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import {
	GlobalPendingComponent,
	GlobalErrorComponent,
} from "./components/route-states";

export const getRouter = () => {
	const router = createRouter({
		routeTree,
		scrollRestoration: true,

		defaultPendingComponent: GlobalPendingComponent,
		defaultErrorComponent: GlobalErrorComponent,

		defaultPreloadStaleTime: 30_000,
		defaultStaleTime: 10_000,
		defaultGcTime: 5 * 60_000,

		defaultPendingMs: 500,
		defaultPendingMinMs: 300,
	});

	return router;
};
