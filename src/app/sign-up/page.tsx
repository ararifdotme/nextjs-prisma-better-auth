"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signUp, useSession } from "@/lib/auth-client";

export default function SignUpPage() {
	const router = useRouter();
	const [error, setError] = useState<string | null>(null);
	const session = useSession();

	useEffect(() => {
		if (session.isPending === false && session.data?.user) {
			return router.push("/dashboard");
		}
	}, [session, router]);

	async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
		e.preventDefault();
		setError(null);

		const formData = new FormData(e.currentTarget);

		await signUp.email({
			name: formData.get("name") as string,
			email: formData.get("email") as string,
			password: formData.get("password") as string,
			fetchOptions: {
				onSuccess: () => {
					router.push("/dashboard");
				},
				onError: ({ error }) => {
					setError(error.message || "Something went wrong.");
				},
			},
		});
	}

	return (
		<main className="min-h-screen bg-linear-to-br from-sky-200 via-indigo-200 to-fuchsia-200 flex items-center justify-center px-4 py-10 text-slate-900">
			<section className="w-full max-w-md rounded-2xl border border-white/70 bg-white/75 p-6 shadow-xl backdrop-blur-sm sm:p-8">
				<div className="mb-6 space-y-2 text-center">
					<h1 className="text-3xl font-semibold tracking-tight">Create account</h1>
					<p className="text-sm text-slate-600">Sign up with your details to get started.</p>
				</div>

				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="space-y-2">
						<label htmlFor="name" className="text-sm font-medium text-slate-700">
							Full Name
						</label>
						<input
							id="name"
							name="name"
							placeholder="John Doe"
							required
							className="w-full rounded-lg border border-indigo-200 bg-white/90 px-3 py-2.5 text-sm outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-200"
						/>
					</div>

					<div className="space-y-2">
						<label htmlFor="email" className="text-sm font-medium text-slate-700">
							Email
						</label>
						<input
							id="email"
							name="email"
							type="email"
							placeholder="you@example.com"
							required
							className="w-full rounded-lg border border-indigo-200 bg-white/90 px-3 py-2.5 text-sm outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-200"
						/>
					</div>

					<div className="space-y-2">
						<label htmlFor="password" className="text-sm font-medium text-slate-700">
							Password
						</label>
						<input
							id="password"
							name="password"
							type="password"
							placeholder="••••••••"
							required
							minLength={8}
							className="w-full rounded-lg border border-indigo-200 bg-white/90 px-3 py-2.5 text-sm outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-200"
						/>
					</div>

					{error && (
						<div aria-live="polite" className="text-sm text-rose-600 text-center">
							{error}
						</div>
					)}

					<button
						type="submit"
						className="w-full rounded-lg bg-linear-to-r from-indigo-500 via-violet-500 to-fuchsia-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:from-indigo-600 hover:via-violet-600 hover:to-fuchsia-600 cursor-pointer"
					>
						Create Account
					</button>
				</form>

				<div className="my-6 flex items-center gap-3 text-xs text-slate-500">
					<div className="h-px flex-1 bg-indigo-200" />
					<span>or continue with</span>
					<div className="h-px flex-1 bg-indigo-200" />
				</div>

				<div className="space-y-2">
					<button
						type="button"
						className="w-full rounded-xl border border-indigo-200/80 bg-linear-to-r from-sky-50 via-white to-indigo-50 px-4 py-2.5 text-sm font-semibold text-indigo-700 shadow-sm transition-colors hover:border-indigo-300 hover:from-sky-100 hover:via-indigo-50 hover:to-indigo-100 hover:text-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-300 cursor-pointer"
					>
						<span className="flex items-center justify-center gap-3">
							<span className="flex h-7 w-7 items-center justify-center rounded-full bg-white ring-1 ring-indigo-100">
								<svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
									<path
										d="M23.49 12.27c0-.79-.07-1.55-.2-2.27H12v4.29h6.44a5.51 5.51 0 0 1-2.39 3.62v3h3.86c2.26-2.08 3.58-5.15 3.58-8.64Z"
										fill="#4285F4"
									/>
									<path
										d="M12 24c3.24 0 5.96-1.07 7.95-2.9l-3.86-3c-1.07.72-2.44 1.14-4.09 1.14-3.15 0-5.82-2.12-6.78-4.98H1.24v3.09A12 12 0 0 0 12 24Z"
										fill="#34A853"
									/>
									<path
										d="M5.22 14.26A7.2 7.2 0 0 1 4.84 12c0-.78.13-1.54.38-2.26V6.65H1.24A12 12 0 0 0 0 12c0 1.94.46 3.78 1.24 5.35l3.98-3.09Z"
										fill="#FBBC05"
									/>
									<path
										d="M12 4.77c1.77 0 3.36.61 4.61 1.8l3.45-3.45C17.95 1.16 15.23 0 12 0A12 12 0 0 0 1.24 6.65l3.98 3.09c.96-2.86 3.63-4.97 6.78-4.97Z"
										fill="#EA4335"
									/>
								</svg>
							</span>
							<span>Continue with Google</span>
						</span>
					</button>
				</div>

				<p className="mt-6 text-center text-sm text-slate-600">
					Already have an account?{" "}
					<Link href="/sign-in" className="font-semibold text-violet-700 transition-colors hover:text-violet-800">
						Sign in
					</Link>
				</p>
			</section>
		</main>
	);
}
