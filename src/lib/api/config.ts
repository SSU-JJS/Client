const apiMode = import.meta.env.VITE_API_MODE === "real" ? "real" : "mock";
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim() || "/api";

export const apiConfig = {
	baseUrl: apiBaseUrl,
	mode: apiMode,
	useMocks: apiMode === "mock",
};
