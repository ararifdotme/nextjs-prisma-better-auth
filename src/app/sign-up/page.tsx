"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SignUpPage() {
	const router = useRouter();
	const [error, setError] = useState<string | null>(null);
	const [successMessage, setSuccessMessage] = useState<string | null>(null);
	const [pendingVerificationEmail, setPendingVerificationEmail] = useState<string | null>(null);
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

		const formElement = e.currentTarget;
		const formData = new FormData(formElement);
		const email = formData.get("email") as string;

		try {
			await authClient.signUp.email({
				name: formData.get("name") as string,
				email,
				password: formData.get("password") as string,
				fetchOptions: {
					onSuccess: () => {
						formElement.reset();
						setPendingVerificationEmail(email);
						setSuccessMessage("Registration successful. Please verify your email before signing in.");
					},
					onError: ({ error }) => {
						setError(error.message || "Something went wrong.");
					},
				},
			});
		} finally {
			setIsSubmitting(false);
		}
	}

	async function handleResendVerificationEmail() {
		if (!pendingVerificationEmail) return;

		setIsResending(true);
		setError(null);

		try {
			await authClient.sendVerificationEmail({
				email: pendingVerificationEmail,
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
					<CardTitle className="text-2xl">Create account</CardTitle>
					<CardDescription>Sign up with your details to get started.</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit} className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="name">Full Name</Label>
							<Input id="name" name="name" placeholder="John Doe" required />
						</div>

						<div className="space-y-2">
							<Label htmlFor="email">Email</Label>
							<Input id="email" name="email" type="email" placeholder="you@example.com" required />
						</div>

						<div className="space-y-2">
							<Label htmlFor="password">Password</Label>
							<Input id="password" name="password" type="password" placeholder="••••••••" required minLength={8} />
						</div>

						{successMessage && (
							<div aria-live="polite" className="rounded-md border bg-muted p-3 text-sm text-muted-foreground">
								<div>{successMessage}</div>
								{pendingVerificationEmail && (
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

						{error && (
							<div aria-live="polite" className="text-sm text-destructive">
								{error}
							</div>
						)}

						<Button type="submit" disabled={isSubmitting} className="w-full">
							{isSubmitting ? "Creating..." : "Create Account"}
						</Button>

						<div className="text-center text-sm text-muted-foreground">
							Already have an account?{" "}
							<Link href="/sign-in" className="text-primary hover:underline">
								Sign in
							</Link>
						</div>
					</form>
				</CardContent>
			</Card>
		</main>
	);
}
