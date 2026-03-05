"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ResetPasswordPage() {
	const searchParams = useSearchParams();
	const token = useMemo(() => searchParams.get("token"), [searchParams]);
	const callbackError = useMemo(() => searchParams.get("error"), [searchParams]);

	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [message, setMessage] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setError(null);
		setMessage(null);

		if (!token) {
			setError("Invalid or expired reset token.");
			return;
		}

		if (newPassword !== confirmPassword) {
			setError("Passwords do not match.");
			return;
		}

		setIsSubmitting(true);

		try {
			await authClient.resetPassword({
				newPassword,
				token,
			});
			setMessage("Password reset successful. You can now sign in.");
			setNewPassword("");
			setConfirmPassword("");
		} catch {
			setError("Failed to reset password. The link may be invalid or expired.");
		} finally {
			setIsSubmitting(false);
		}
	}

	return (
		<main className="flex min-h-screen items-center justify-center px-4 py-10">
			<Card className="w-full max-w-md">
				<CardHeader className="text-center">
					<CardTitle className="text-2xl">Reset password</CardTitle>
					<CardDescription>Create a new password for your account.</CardDescription>
				</CardHeader>
				<CardContent>
					{callbackError === "INVALID_TOKEN" && (
						<div className="mb-4 rounded-md border bg-muted p-3 text-sm text-muted-foreground">This reset link is invalid or expired.</div>
					)}

					<form onSubmit={handleSubmit} className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="newPassword">New password</Label>
							<Input
								id="newPassword"
								name="newPassword"
								type="password"
								value={newPassword}
								onChange={(e) => setNewPassword(e.target.value)}
								placeholder="••••••••"
								required
								minLength={8}
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="confirmPassword">Confirm password</Label>
							<Input
								id="confirmPassword"
								name="confirmPassword"
								type="password"
								value={confirmPassword}
								onChange={(e) => setConfirmPassword(e.target.value)}
								placeholder="••••••••"
								required
								minLength={8}
							/>
						</div>

						{message && (
							<div aria-live="polite" className="rounded-md border bg-muted p-3 text-sm text-muted-foreground">
								{message}
							</div>
						)}
						{error && (
							<div aria-live="polite" className="text-sm text-destructive">
								{error}
							</div>
						)}

						<Button type="submit" disabled={isSubmitting || !token} className="w-full">
							{isSubmitting ? "Resetting..." : "Reset password"}
						</Button>

						<div className="text-center text-sm text-muted-foreground">
							Back to{" "}
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
