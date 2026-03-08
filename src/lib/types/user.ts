export interface UserProfile {
	createdAt: string;
	email: string;
	emailVerified: boolean;
	id: string;
	nickname: string;
	profileImageUrl: string | null;
	verifiedAt: string | null;
}

export interface CurrentUserResponse {
	user: UserProfile;
}

export interface UpdateCurrentUserRequest {
	nickname: string;
	profileImage: File | null;
}

export interface UpdateCurrentUserResponse {
	user: UserProfile;
}
