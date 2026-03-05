"use client";

import { useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ForgotPasswordPage() {
	const [email, setEmail] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [message, setMessage] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setIsSubmitting(true);
		setError(null);
		setMessage(null);

		try {
			await authClient.requestPasswordReset({
				email,
				redirectTo: `${window.location.origin}/reset-password`,
			});
			setMessage("If this email exists, a password reset link has been sent.");
		} catch {
			setError("Failed to request password reset. Please try again.");
		} finally {
			setIsSubmitting(false);
		}
	}

	return (
		<main className="flex min-h-screen items-center justify-center px-4 py-10">
			<Card className="w-full max-w-md">
				<CardHeader className="text-center">
					<CardTitle className="text-2xl">Forgot password</CardTitle>
					<CardDescription>Enter your email to receive a reset link.</CardDescription>
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

						<Button type="submit" disabled={isSubmitting} className="w-full">
							{isSubmitting ? "Sending..." : "Send reset link"}
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
