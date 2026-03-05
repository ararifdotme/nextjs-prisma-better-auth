"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SignInPage() {
	const router = useRouter();
	const [error, setError] = useState<string | null>(null);
	const [successMessage, setSuccessMessage] = useState<string | null>(null);
	const [email, setEmail] = useState("");
	const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isResending, setIsResending] = useState(false);
	const session = authClient.useSession();

	useEffect(() => {
		if (session.isPending === false && session.data?.user) {
			return router.push("/dashboard");
		}
	}, [session, router]);

	async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
		e.preventDefault();
		setIsSubmitting(true);
		setError(null);
		setSuccessMessage(null);
		setUnverifiedEmail(null);

		const formData = new FormData(e.currentTarget);
		const inputEmail = formData.get("email") as string;

		try {
			await authClient.signIn.email({
				email: inputEmail,
				password: formData.get("password") as string,
				rememberMe: true,
				fetchOptions: {
					onSuccess: () => {
						router.push("/dashboard");
					},
					onError: ({ error }) => {
						const message = error.message || "Something went wrong.";
						if (/email.*not.*verified|not verified/i.test(message)) {
							setUnverifiedEmail(inputEmail);
							setSuccessMessage("Your email is not verified. Please check your inbox for verification.");
							return;
						}

						setError(message);
					},
				},
			});
		} finally {
			setIsSubmitting(false);
		}
	}

	async function handleResendVerificationEmail() {
		if (!unverifiedEmail) return;

		setIsResending(true);
		setError(null);

		try {
			await authClient.sendVerificationEmail({
				email: unverifiedEmail,
				callbackURL: `${window.location.origin}/dashboard`,
			});
			setSuccessMessage("Verification email resent. Please check your inbox.");
		} catch {
			setError("Failed to resend verification email. Please try again.");
		}

		setIsResending(false);
	}

	return (
		<main className="flex min-h-screen items-center justify-center px-4 py-10">
			<Card className="w-full max-w-md">
				<CardHeader className="text-center">
					<CardTitle className="text-2xl">Welcome back</CardTitle>
					<CardDescription>Sign in with your email and password to continue.</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit} className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								name="email"
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								placeholder="you@example.com"
								required
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="password">Password</Label>
							<Input id="password" name="password" type="password" placeholder="••••••••" required />
						</div>

						{error && (
							<div aria-live="polite" className="text-sm text-destructive">
								{error}
							</div>
						)}

						{successMessage && (
							<div aria-live="polite" className="rounded-md border bg-muted p-3 text-sm text-muted-foreground">
								<div>{successMessage}</div>
								{unverifiedEmail && (
									<div className="mt-2 text-xs">
										Didn&apos;t get the email?{" "}
										<Button
											type="button"
											variant="link"
											size="sm"
											onClick={handleResendVerificationEmail}
											disabled={isResending}
											className="h-auto px-0"
										>
											{isResending ? "Resending..." : "Resend verification email"}
										</Button>
									</div>
								)}
							</div>
						)}

						<div className="text-right">
							<Link href="/forgot-password" className="text-sm text-primary hover:underline">
								Forgot password?
							</Link>
						</div>

						<Button type="submit" disabled={isSubmitting} className="w-full">
							{isSubmitting ? "Signing in..." : "Sign In"}
						</Button>

						<div className="text-center text-sm text-muted-foreground">
							Don&apos;t have an account?{" "}
							<Link href="/sign-up" className="text-primary hover:underline">
								Sign up
							</Link>
						</div>
					</form>
				</CardContent>
			</Card>
		</main>
	);
}
