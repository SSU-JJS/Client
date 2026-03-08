import { apiConfig } from "@/lib/api/config";

export async function bootstrapApiMocks() {
	if (!apiConfig.useMocks || typeof window === "undefined") {
		return;
	}

	const { worker } = await import("@/lib/api/mocks/browser");

	await worker.start({
		onUnhandledRequest: "bypass",
	});
}
