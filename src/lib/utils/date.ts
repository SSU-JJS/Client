const dateTimeFormatter = new Intl.DateTimeFormat("ko-KR", {
	dateStyle: "medium",
	timeStyle: "short",
});

export function formatDateTime(value: string | null) {
	if (!value) {
		return "아직 없음";
	}

	const date = new Date(value);

	if (Number.isNaN(date.getTime())) {
		return value;
	}

	return dateTimeFormatter.format(date);
}
