import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { App } from "@/App";
import { bootstrapApiMocks } from "@/lib/api/bootstrap";
import "@/index.css";

const queryClient = new QueryClient();
const rootElement = document.getElementById("root");

if (!rootElement) {
	throw new Error("Root element not found");
}

const appRootElement = rootElement;

function renderApp() {
	createRoot(appRootElement).render(
		<StrictMode>
			<QueryClientProvider client={queryClient}>
				<App />
			</QueryClientProvider>
		</StrictMode>,
	);
}

void bootstrapApiMocks()
	.catch((error: unknown) => {
		console.error("Failed to start API mocks", error);
	})
	.finally(() => {
		renderApp();
	});
