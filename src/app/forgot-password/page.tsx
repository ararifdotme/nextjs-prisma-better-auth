"use client";

import { useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

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
		<main className="min-h-screen bg-linear-to-br from-sky-200 via-indigo-200 to-fuchsia-200 flex items-center justify-center px-4 py-10 text-slate-900">
			<section className="w-full max-w-md rounded-2xl border border-white/70 bg-white/75 p-6 shadow-xl backdrop-blur-sm sm:p-8">
				<div className="mb-6 space-y-2 text-center">
					<h1 className="text-3xl font-semibold tracking-tight">Forgot password</h1>
					<p className="text-sm text-slate-600">Enter your email to receive a reset link.</p>
				</div>

				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="space-y-2">
						<label htmlFor="email" className="text-sm font-medium text-slate-700">
							Email
						</label>
						<input
							id="email"
							name="email"
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder="you@example.com"
							required
							className="w-full rounded-lg border border-indigo-200 bg-white/90 px-3 py-2.5 text-sm outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-200"
						/>
					</div>

					{message && (
						<div aria-live="polite" className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
							{message}
						</div>
					)}
					{error && (
						<div aria-live="polite" className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
							{error}
						</div>
					)}

					<button
						type="submit"
						disabled={isSubmitting}
						className={`w-full rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition-colors ${
							isSubmitting
								? "bg-linear-to-r from-indigo-400 via-violet-400 to-fuchsia-400 opacity-70 cursor-not-allowed"
								: "bg-linear-to-r from-indigo-500 via-violet-500 to-fuchsia-500 hover:from-indigo-600 hover:via-violet-600 hover:to-fuchsia-600 cursor-pointer"
						}`}
					>
						{isSubmitting ? "Sending..." : "Send reset link"}
					</button>
				</form>

				<p className="mt-6 text-center text-sm text-slate-600">
					Back to{" "}
					<Link href="/sign-in" className="font-semibold text-violet-700 transition-colors hover:text-violet-800">
						Sign in
					</Link>
				</p>
			</section>
		</main>
	);
}
