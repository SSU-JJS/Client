import type { UserProfile } from "@/lib/types/user";

export interface LoginRequest {
	email: string;
	password: string;
}

export interface SessionPayload {
	accessToken: string;
	expiresAt: string;
	refreshToken: string;
	tokenType: "Bearer";
}

export type VerificationDeliveryStatus = "queued" | "sent" | "throttled";

export interface VerificationDelivery {
	deliveryStatus: VerificationDeliveryStatus;
	email: string;
	resendAfterSeconds: number;
}

export interface LoginResponse {
	session: SessionPayload;
	user: UserProfile;
}

export interface CreateUserRequest {
	email: string;
	nickname: string;
	password: string;
	profileImage: File | null;
}

export interface CreateUserResponse {
	user: UserProfile;
	verification: VerificationDelivery;
}

export interface ResendEmailVerificationRequest {
	email: string;
}

export interface ResendEmailVerificationResponse {
	deliveryStatus: VerificationDeliveryStatus;
	email: string;
	resendAfterSeconds: number;
}

export interface VerifyEmailRequest {
	email: string;
	token: string;
}

export interface VerifyEmailResponse {
	user: UserProfile;
	verifiedAt: string | null;
}
