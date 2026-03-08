import { apiRequest } from "@/lib/api/client";
import type {
	LoginRequest,
	LoginResponse,
	ResendEmailVerificationRequest,
	ResendEmailVerificationResponse,
	VerifyEmailRequest,
	VerifyEmailResponse,
} from "@/lib/types/auth";

export function login(payload: LoginRequest) {
	return apiRequest<LoginResponse>("/auth/login", {
		json: payload,
		method: "POST",
	});
}

export function resendEmailVerification(
	payload: ResendEmailVerificationRequest,
) {
	return apiRequest<ResendEmailVerificationResponse>(
		"/auth/email-verifications",
		{
			json: payload,
			method: "POST",
		},
	);
}

export function verifyEmail(payload: VerifyEmailRequest) {
	return apiRequest<VerifyEmailResponse>("/auth/email-verifications/confirm", {
		json: payload,
		method: "POST",
	});
}
