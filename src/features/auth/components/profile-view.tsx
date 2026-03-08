import { useEffect, useState } from "react";
import {
	ArrowUpRight,
	Camera,
	LoaderCircle,
	MailCheck,
	RefreshCcw,
	Trash2,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import {
	Field,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { getProfileFallback } from "@/features/auth/constants";
import {
	getDeleteConfirmationError,
	hasValidationErrors,
	validateProfileEditForm,
} from "@/features/auth/lib/validation";
import {
	useCurrentUserQuery,
	useDeleteCurrentUserMutation,
	useUpdateCurrentUserMutation,
} from "@/features/auth/hooks/use-auth-queries";
import { getApiErrorMessage } from "@/lib/api/client";
import { formatDateTime } from "@/lib/utils/date";

export function ProfileView() {
	const navigate = useNavigate();
	const currentUserQuery = useCurrentUserQuery();
	const updateCurrentUserMutation = useUpdateCurrentUserMutation();
	const deleteCurrentUserMutation = useDeleteCurrentUserMutation();
	const [form, setForm] = useState({
		email: "",
		nickname: "",
		profileImage: null as File | null,
	});
	const [touched, setTouched] = useState({
		deleteConfirm: false,
		nickname: false,
		profileImage: false,
	});
	const [deleteConfirmValue, setDeleteConfirmValue] = useState("");
	const [profileImagePreviewUrl, setProfileImagePreviewUrl] = useState<
		string | null
	>(null);

	useEffect(() => {
		if (!currentUserQuery.data) {
			return;
		}

		setForm({
			email: currentUserQuery.data.email,
			nickname: currentUserQuery.data.nickname,
			profileImage: null,
		});
	}, [currentUserQuery.data]);

	useEffect(() => {
		if (!form.profileImage) {
			setProfileImagePreviewUrl(null);
			return;
		}

		const objectUrl = URL.createObjectURL(form.profileImage);
		setProfileImagePreviewUrl(objectUrl);

		return () => {
			URL.revokeObjectURL(objectUrl);
		};
	}, [form.profileImage]);

	const formErrors = validateProfileEditForm({
		nickname: form.nickname,
		profileImage: form.profileImage,
	});
	const deleteConfirmError = getDeleteConfirmationError(deleteConfirmValue);
	const currentUser = currentUserQuery.data;
	const isProfileDirty = currentUser
		? form.nickname.trim() !== currentUser.nickname ||
			form.profileImage !== null
		: false;
	const isProfileSubmitDisabled =
		!isProfileDirty ||
		hasValidationErrors(formErrors) ||
		updateCurrentUserMutation.isPending;
	const isDeleteDisabled =
		deleteCurrentUserMutation.isPending || Boolean(deleteConfirmError);

	function markTouched(field: keyof typeof touched) {
		setTouched((current) => ({
			...current,
			[field]: true,
		}));
	}

	async function handleProfileSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();

		setTouched((current) => ({
			...current,
			nickname: true,
			profileImage: true,
		}));

		if (
			!currentUserQuery.data ||
			hasValidationErrors(formErrors) ||
			!isProfileDirty
		) {
			return;
		}

		await updateCurrentUserMutation.mutateAsync({
			nickname: form.nickname.trim(),
			profileImage: form.profileImage,
		});
	}

	async function handleDeleteSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();

		markTouched("deleteConfirm");

		if (deleteConfirmError) {
			return;
		}

		await deleteCurrentUserMutation.mutateAsync();
		navigate("/", { replace: true });
	}

	return (
		<div className="flex min-h-screen flex-col bg-secondary/20">
			<SiteHeader />
			<main className="flex-1 py-10 md:py-16">
				<Container className="flex flex-col gap-6">
					<section className="overflow-hidden rounded-[2rem] border border-border/60 bg-white p-8 shadow-panel">
						<div className="flex flex-col gap-4">
							<p className="text-sm font-medium uppercase tracking-[0.16em] text-muted-foreground">
								Account settings
							</p>
							<h1 className="font-display text-4xl text-brand-ink md:text-5xl">
								내 계정을 관리하세요
							</h1>
							<p className="max-w-3xl text-base leading-7 text-muted-foreground md:text-lg">
								프로필 정보를 수정하고, 필요하면 계정을 정리할 수 있습니다.
							</p>
						</div>
					</section>

					{currentUserQuery.isLoading ? (
						<Card className="border-border/60 bg-white/90 shadow-soft">
							<CardHeader>
								<CardTitle>내 정보를 불러오는 중입니다</CardTitle>
								<CardDescription>잠시만 기다려 주세요.</CardDescription>
							</CardHeader>
						</Card>
					) : null}

					{currentUserQuery.isError ? (
						<Card className="border-destructive/30 bg-white/90 shadow-soft">
							<CardHeader>
								<CardTitle>내 정보 조회에 실패했습니다</CardTitle>
								<CardDescription>잠시 후 다시 시도해 주세요.</CardDescription>
							</CardHeader>
							<CardContent>
								<Button
									onClick={() => void currentUserQuery.refetch()}
									variant="outline"
								>
									<RefreshCcw data-icon="inline-start" />
									다시 불러오기
								</Button>
							</CardContent>
						</Card>
					) : null}

					{currentUserQuery.data ? (
						<div className="grid gap-6 lg:grid-cols-[1.02fr_0.98fr]">
							<Card className="border-border/60 bg-white/92 shadow-panel">
								<CardHeader className="flex flex-col gap-5">
									<div className="flex flex-col gap-4 md:flex-row md:items-center">
										<Avatar className="size-24 border border-border/70 shadow-soft">
											<AvatarImage
												alt={currentUserQuery.data.nickname}
												src={currentUserQuery.data.profileImageUrl ?? undefined}
											/>
											<AvatarFallback>
												{getProfileFallback(currentUserQuery.data.nickname)}
											</AvatarFallback>
										</Avatar>
										<div className="flex flex-col gap-3">
											<div className="flex flex-wrap items-center gap-2">
												<CardTitle className="font-display text-3xl text-brand-ink">
													{currentUserQuery.data.nickname}
												</CardTitle>
												<span className="rounded-full border border-border/70 bg-secondary/55 px-3 py-1 text-xs font-medium text-muted-foreground">
													{currentUserQuery.data.emailVerified
														? "이메일 인증 완료"
														: "이메일 인증 대기"}
												</span>
											</div>
											<CardDescription className="text-base">
												{currentUserQuery.data.email}
											</CardDescription>
										</div>
									</div>
								</CardHeader>
								<CardContent className="flex flex-col gap-5">
									<div className="grid gap-3 md:grid-cols-2">
										<InfoCard
											label="계정 생성 시각"
											value={formatDateTime(currentUserQuery.data.createdAt)}
										/>
										<InfoCard
											label="인증 완료 시각"
											value={formatDateTime(currentUserQuery.data.verifiedAt)}
										/>
									</div>
									<Separator />
									<div className="flex flex-col gap-3">
										<p className="font-semibold text-brand-ink">빠른 이동</p>
										<div className="flex flex-col gap-3 md:flex-row">
											<Button asChild>
												<Link to="/verify-email">
													<MailCheck data-icon="inline-start" />
													이메일 인증 페이지 열기
												</Link>
											</Button>
											<Button asChild variant="outline">
												<Link to="/">
													<ArrowUpRight data-icon="inline-start" />
													랜딩 페이지 보기
												</Link>
											</Button>
										</div>
									</div>
								</CardContent>
							</Card>

							<div className="flex flex-col gap-6">
								<Card className="border-border/60 bg-white shadow-soft">
									<CardHeader>
										<CardTitle>내 정보 수정</CardTitle>
										<CardDescription>
											이메일은 고정되어 있고, 닉네임과 프로필 이미지만 수정할 수
											있습니다.
										</CardDescription>
									</CardHeader>
									<CardContent>
										<form
											className="flex flex-col gap-5"
											onSubmit={(event) => void handleProfileSubmit(event)}
										>
											<div className="flex items-center gap-4 rounded-2xl border border-border/70 bg-secondary/30 p-4">
												<Avatar className="size-16 border border-border/70">
													<AvatarImage
														alt={form.nickname || "프로필"}
														src={
															profileImagePreviewUrl ??
															currentUserQuery.data.profileImageUrl ??
															undefined
														}
													/>
													<AvatarFallback>
														{getProfileFallback(form.nickname || form.email)}
													</AvatarFallback>
												</Avatar>
												<div className="flex flex-col gap-1">
													<p className="font-semibold text-brand-ink">
														{form.nickname || currentUserQuery.data.nickname}
													</p>
													<p className="text-sm text-muted-foreground">
														변경 사항은 저장 즉시 내 정보에 반영됩니다.
													</p>
												</div>
											</div>

											<FieldGroup>
												<Field>
													<FieldLabel htmlFor="profile-email">
														이메일
													</FieldLabel>
													<Input
														disabled
														id="profile-email"
														type="email"
														value={form.email}
													/>
													<FieldDescription>
														이메일 주소는 변경할 수 없습니다.
													</FieldDescription>
												</Field>

												<Field
													data-invalid={Boolean(
														touched.nickname && formErrors.nickname,
													)}
												>
													<FieldLabel htmlFor="profile-nickname">
														닉네임
													</FieldLabel>
													<Input
														aria-invalid={Boolean(
															touched.nickname && formErrors.nickname,
														)}
														id="profile-nickname"
														maxLength={24}
														onBlur={() => markTouched("nickname")}
														onChange={(event) => {
															markTouched("nickname");
															setForm((current) => ({
																...current,
																nickname: event.target.value,
															}));
														}}
														value={form.nickname}
													/>
													{touched.nickname && formErrors.nickname ? (
														<FieldError>{formErrors.nickname}</FieldError>
													) : (
														<FieldDescription>
															팀원에게 보여질 이름입니다.
														</FieldDescription>
													)}
												</Field>

												<Field
													data-invalid={Boolean(
														touched.profileImage && formErrors.profileImage,
													)}
												>
													<FieldLabel htmlFor="profile-image">
														프로필 이미지
													</FieldLabel>
													<Input
														accept="image/*"
														aria-invalid={Boolean(
															touched.profileImage && formErrors.profileImage,
														)}
														id="profile-image"
														onBlur={() => markTouched("profileImage")}
														onChange={(event) => {
															markTouched("profileImage");
															setForm((current) => ({
																...current,
																profileImage: event.target.files?.[0] ?? null,
															}));
														}}
														type="file"
													/>
													{touched.profileImage && formErrors.profileImage ? (
														<FieldError>{formErrors.profileImage}</FieldError>
													) : (
														<FieldDescription>
															새 이미지를 선택하지 않으면 기존 이미지를
															유지합니다.
														</FieldDescription>
													)}
												</Field>
											</FieldGroup>

											{updateCurrentUserMutation.error ? (
												<FieldError>
													{getApiErrorMessage(updateCurrentUserMutation.error)}
												</FieldError>
											) : null}

											<div className="flex flex-col gap-3">
												<Button
													disabled={isProfileSubmitDisabled}
													type="submit"
												>
													{updateCurrentUserMutation.isPending ? (
														<LoaderCircle
															className="animate-spin"
															data-icon="inline-start"
														/>
													) : (
														<Camera data-icon="inline-start" />
													)}
													변경사항 저장
												</Button>
												{updateCurrentUserMutation.isSuccess ? (
													<p className="text-sm text-muted-foreground">
														내 정보가 업데이트되었습니다.
													</p>
												) : null}
											</div>
										</form>
									</CardContent>
								</Card>

								<Card className="border-destructive/20 bg-white shadow-soft">
									<CardHeader>
										<CardTitle>회원 탈퇴</CardTitle>
										<CardDescription>
											계정을 삭제하면 현재 프로필 정보는 더 이상 유지되지
											않습니다.
										</CardDescription>
									</CardHeader>
									<CardContent>
										<form
											className="flex flex-col gap-4"
											onSubmit={(event) => void handleDeleteSubmit(event)}
										>
											<div className="rounded-2xl border border-destructive/15 bg-destructive/5 p-4 text-sm leading-6 text-muted-foreground">
												탈퇴를 진행하려면 아래 입력창에{" "}
												<strong>회원 탈퇴</strong>를 정확히 입력해 주세요.
											</div>
											<Field
												data-invalid={Boolean(
													touched.deleteConfirm && deleteConfirmError,
												)}
											>
												<FieldLabel htmlFor="delete-account-confirm">
													확인 문구
												</FieldLabel>
												<Input
													aria-invalid={Boolean(
														touched.deleteConfirm && deleteConfirmError,
													)}
													id="delete-account-confirm"
													onBlur={() => markTouched("deleteConfirm")}
													onChange={(event) => {
														markTouched("deleteConfirm");
														setDeleteConfirmValue(event.target.value);
													}}
													placeholder="회원 탈퇴"
													value={deleteConfirmValue}
												/>
												{touched.deleteConfirm && deleteConfirmError ? (
													<FieldError>{deleteConfirmError}</FieldError>
												) : null}
											</Field>

											{deleteCurrentUserMutation.error ? (
												<FieldError>
													{getApiErrorMessage(deleteCurrentUserMutation.error)}
												</FieldError>
											) : null}

											<Button
												disabled={isDeleteDisabled}
												type="submit"
												variant="outline"
											>
												{deleteCurrentUserMutation.isPending ? (
													<LoaderCircle
														className="animate-spin"
														data-icon="inline-start"
													/>
												) : (
													<Trash2 data-icon="inline-start" />
												)}
												회원 탈퇴
											</Button>
										</form>
									</CardContent>
								</Card>
							</div>
						</div>
					) : null}
				</Container>
			</main>
			<SiteFooter />
		</div>
	);
}

interface InfoCardProps {
	label: string;
	value: string;
}

function InfoCard({ label, value }: InfoCardProps) {
	return (
		<div className="rounded-2xl border border-border/60 bg-white/80 px-4 py-3">
			<p className="text-sm text-muted-foreground">{label}</p>
			<p className="mt-2 text-sm font-semibold leading-6 text-brand-ink">
				{value}
			</p>
		</div>
	);
}
