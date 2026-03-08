import { apiRequest } from "@/lib/api/client";
import type { CreateUserRequest, CreateUserResponse } from "@/lib/types/auth";
import type {
	CurrentUserResponse,
	UpdateCurrentUserRequest,
	UpdateCurrentUserResponse,
} from "@/lib/types/user";

export function createUser(payload: CreateUserRequest) {
	const formData = new FormData();

	formData.append("email", payload.email);
	formData.append("password", payload.password);
	formData.append("nickname", payload.nickname);

	if (payload.profileImage) {
		formData.append("profileImage", payload.profileImage);
	}

	return apiRequest<CreateUserResponse>("/users", {
		body: formData,
		method: "POST",
	});
}

export function getCurrentUser() {
	return apiRequest<CurrentUserResponse>("/users/me");
}

export function updateCurrentUser(payload: UpdateCurrentUserRequest) {
	const formData = new FormData();

	formData.append("nickname", payload.nickname);

	if (payload.profileImage) {
		formData.append("profileImage", payload.profileImage);
	}

	return apiRequest<UpdateCurrentUserResponse>("/users/me", {
		body: formData,
		method: "PATCH",
	});
}

export function deleteCurrentUser() {
	return apiRequest<void>("/users/me", {
		method: "DELETE",
	});
}
