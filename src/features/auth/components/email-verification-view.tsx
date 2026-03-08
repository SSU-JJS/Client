import { useState } from "react";
import { CheckCheck, LoaderCircle, MailCheck, RotateCcw } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
	Field,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { AuthShell } from "@/features/auth/components/auth-shell";
import {
	hasValidationErrors,
	validateVerifyEmailForm,
} from "@/features/auth/lib/validation";
import {
	useResendEmailVerificationMutation,
	useVerifyEmailMutation,
} from "@/features/auth/hooks/use-auth-queries";
import { getApiErrorMessage } from "@/lib/api/client";

export function EmailVerificationView() {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const defaultEmail = searchParams.get("email") ?? "";
	const [form, setForm] = useState({
		email: defaultEmail,
		token: "",
	});
	const [touched, setTouched] = useState({
		email: Boolean(defaultEmail),
		token: false,
	});
	const verifyMutation = useVerifyEmailMutation();
	const resendMutation = useResendEmailVerificationMutation();
	const errors = validateVerifyEmailForm(form);
	const isVerifyDisabled =
		verifyMutation.isPending || hasValidationErrors(errors);
	const isResendDisabled = resendMutation.isPending || Boolean(errors.email);

	function markTouched(field: keyof typeof touched) {
		setTouched((current) => ({
			...current,
			[field]: true,
		}));
	}

	async function handleVerify(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();

		setTouched({
			email: true,
			token: true,
		});

		if (hasValidationErrors(errors)) {
			return;
		}

		await verifyMutation.mutateAsync(form);
		navigate("/me");
	}

	return (
		<AuthShell
			badge="Verify"
			description="가입을 마무리하려면 이메일로 받은 인증 정보를 입력해 계정을 활성화해 주세요."
			title="이제 계정을 활성화할 차례입니다"
		>
			<form
				className="flex flex-col gap-6"
				onSubmit={(event) => void handleVerify(event)}
			>
				<FieldGroup>
					<Field data-invalid={Boolean(touched.email && errors.email)}>
						<FieldLabel htmlFor="verify-email">인증 대상 이메일</FieldLabel>
						<Input
							aria-invalid={Boolean(touched.email && errors.email)}
							id="verify-email"
							onBlur={() => markTouched("email")}
							onChange={(event) => {
								markTouched("email");
								setForm((current) => ({
									...current,
									email: event.target.value,
								}));
							}}
							required
							type="email"
							value={form.email}
						/>
						{touched.email && errors.email ? (
							<FieldError>{errors.email}</FieldError>
						) : null}
					</Field>

					<Field data-invalid={Boolean(touched.token && errors.token)}>
						<FieldLabel htmlFor="verify-token">인증 토큰</FieldLabel>
						<Input
							aria-invalid={Boolean(touched.token && errors.token)}
							id="verify-token"
							onBlur={() => markTouched("token")}
							onChange={(event) => {
								markTouched("token");
								setForm((current) => ({
									...current,
									token: event.target.value,
								}));
							}}
							placeholder="메일로 받은 토큰을 입력하세요"
							required
							value={form.token}
						/>
						{touched.token && errors.token ? (
							<FieldError>{errors.token}</FieldError>
						) : (
							<FieldDescription>
								이메일에 포함된 인증 정보를 그대로 입력해 주세요.
							</FieldDescription>
						)}
					</Field>
				</FieldGroup>

				{verifyMutation.error ? (
					<FieldError>{getApiErrorMessage(verifyMutation.error)}</FieldError>
				) : null}

				<div className="flex flex-col gap-3">
					<Button disabled={isVerifyDisabled} size="lg" type="submit">
						{verifyMutation.isPending ? (
							<LoaderCircle className="animate-spin" data-icon="inline-start" />
						) : (
							<CheckCheck data-icon="inline-start" />
						)}
						이메일 인증 완료
					</Button>

					<Button
						disabled={isResendDisabled}
						onClick={() => {
							markTouched("email");

							if (errors.email) {
								return;
							}

							resendMutation.mutate({ email: form.email });
						}}
						type="button"
						variant="outline"
					>
						{resendMutation.isPending ? (
							<LoaderCircle className="animate-spin" data-icon="inline-start" />
						) : (
							<RotateCcw data-icon="inline-start" />
						)}
						인증 메일 재전송
					</Button>
				</div>
			</form>

			{resendMutation.isSuccess ? (
				<div className="mt-6 rounded-2xl border border-primary/25 bg-primary/10 p-4 text-sm leading-6 text-primary">
					<MailCheck className="mr-2 inline-flex align-text-bottom" />
					{form.email} 주소로 인증 메일을 다시 보냈습니다.
				</div>
			) : null}

			<div className="mt-6 flex flex-col gap-2 text-sm">
				<p className="text-muted-foreground">
					입력한 이메일 주소가 다르다면 회원가입 화면으로 돌아가 다시 진행해
					주세요.
				</p>
				<div className="flex flex-wrap items-center gap-4">
					<Button asChild className="h-auto px-0" variant="link">
						<Link to="/signup">회원가입으로 돌아가기</Link>
					</Button>
					<Button asChild className="h-auto px-0" variant="link">
						<Link to="/login">로그인으로 이동</Link>
					</Button>
				</div>
			</div>
		</AuthShell>
	);
}
