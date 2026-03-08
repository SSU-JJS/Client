import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { login, resendEmailVerification, verifyEmail } from "@/lib/api/auth";
import {
	createUser,
	deleteCurrentUser,
	getCurrentUser,
	updateCurrentUser,
} from "@/lib/api/users";
import type {
	CreateUserRequest,
	LoginRequest,
	ResendEmailVerificationRequest,
	VerifyEmailRequest,
} from "@/lib/types/auth";
import type { UpdateCurrentUserRequest, UserProfile } from "@/lib/types/user";

const authQueryKeys = {
	currentUser: ["users", "me"] as const,
};

export function useCurrentUserQuery() {
	return useQuery({
		queryFn: async () => {
			const response = await getCurrentUser();
			return response.user;
		},
		queryKey: authQueryKeys.currentUser,
	});
}

export function useLoginMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (payload: LoginRequest) => login(payload),
		onSuccess: (response) => {
			queryClient.setQueryData<UserProfile>(
				authQueryKeys.currentUser,
				response.user,
			);
		},
	});
}

export function useSignupMutation() {
	return useMutation({
		mutationFn: (payload: CreateUserRequest) => createUser(payload),
	});
}

export function useVerifyEmailMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (payload: VerifyEmailRequest) => verifyEmail(payload),
		onSuccess: (response) => {
			queryClient.setQueryData<UserProfile>(
				authQueryKeys.currentUser,
				response.user,
			);
		},
	});
}

export function useResendEmailVerificationMutation() {
	return useMutation({
		mutationFn: (payload: ResendEmailVerificationRequest) =>
			resendEmailVerification(payload),
	});
}

export function useUpdateCurrentUserMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (payload: UpdateCurrentUserRequest) =>
			updateCurrentUser(payload),
		onSuccess: (response) => {
			queryClient.setQueryData<UserProfile>(
				authQueryKeys.currentUser,
				response.user,
			);
		},
	});
}

export function useDeleteCurrentUserMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: () => deleteCurrentUser(),
		onSuccess: () => {
			queryClient.removeQueries({
				queryKey: authQueryKeys.currentUser,
			});
		},
	});
}
