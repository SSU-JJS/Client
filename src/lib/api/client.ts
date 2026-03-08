import { apiConfig } from "@/lib/api/config";
import type { ApiErrorResponse } from "@/lib/types/api";

interface ApiRequestOptions extends Omit<RequestInit, "body"> {
	body?: BodyInit | null;
	json?: unknown;
}

export class ApiError extends Error {
	code?: string;
	fieldErrors?: Record<string, string[]>;
	status: number;

	constructor(status: number, payload: ApiErrorResponse) {
		super(payload.message);

		this.name = "ApiError";
		this.status = status;
		this.code = payload.code;
		this.fieldErrors = payload.fieldErrors;
	}
}

export async function apiRequest<T>(
	path: string,
	{ body, json, headers, ...init }: ApiRequestOptions = {},
) {
	const response = await fetch(`${apiConfig.baseUrl}${path}`, {
		...init,
		body: body ?? (json ? JSON.stringify(json) : undefined),
		headers: {
			Accept: "application/json",
			...(json && !body ? { "Content-Type": "application/json" } : {}),
			...headers,
		},
	});
	const text = await response.text();
	const data = text ? safeJsonParse(text) : null;

	if (!response.ok) {
		const payload = isApiErrorResponse(data)
			? data
			: { message: "요청 처리 중 오류가 발생했습니다." };
		throw new ApiError(response.status, payload);
	}

	return data as T;
}

export function getApiErrorMessage(
	error: unknown,
	fallbackMessage = "요청 처리 중 오류가 발생했습니다.",
) {
	if (error instanceof ApiError) {
		return error.message;
	}

	if (error instanceof Error) {
		return error.message;
	}

	return fallbackMessage;
}

function safeJsonParse(value: string): unknown {
	try {
		return JSON.parse(value);
	} catch {
		return null;
	}
}

function isApiErrorResponse(value: unknown): value is ApiErrorResponse {
	if (typeof value !== "object" || value === null) {
		return false;
	}

	const candidate = value as Partial<ApiErrorResponse>;
	return typeof candidate.message === "string";
}
