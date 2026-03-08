export const previewAuth = {
	email: "preview@matchqueue.dev",
	password: "matchqueue123!",
	verificationToken: "MATCHQUEUE-2026",
};

export function getProfileFallback(value: string) {
	const cleanedValue = value.trim();

	if (!cleanedValue) {
		return "MQ";
	}

	return cleanedValue
		.split(/[\s@._-]+/)
		.filter(Boolean)
		.slice(0, 2)
		.map((part) => part[0]?.toUpperCase() ?? "")
		.join("");
}
