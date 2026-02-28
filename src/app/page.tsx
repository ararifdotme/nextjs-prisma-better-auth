import Link from "next/link";

export default function Home() {
	return (
		<main className="min-h-screen bg-linear-to-br from-sky-200 via-indigo-200 to-fuchsia-200 text-slate-900">
			<div className="mx-auto flex w-full max-w-6xl flex-col px-4 py-6 sm:px-6 lg:px-8">
				<header className="rounded-2xl border border-white/70 bg-white/75 px-4 py-3 shadow-sm backdrop-blur-sm sm:px-6">
					<nav className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<div className="flex h-9 w-9 items-center justify-center rounded-lg bg-linear-to-r from-indigo-500 via-violet-500 to-fuchsia-500 text-sm font-bold text-white">
								NB
							</div>
							<div>
								<p className="text-sm font-semibold tracking-tight">Next Starter</p>
								<p className="text-xs text-slate-600">Next.js + Prisma + Better Auth</p>
							</div>
						</div>

						<div className="flex items-center gap-2">
							<Link
								href="/sign-in"
								className="rounded-lg border border-indigo-200/80 bg-white/70 px-4 py-2 text-sm font-medium text-indigo-700 transition-colors hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-800"
							>
								Sign In
							</Link>
							<Link
								href="/sign-up"
								className="rounded-lg bg-linear-to-r from-indigo-500 via-violet-500 to-fuchsia-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:from-indigo-600 hover:via-violet-600 hover:to-fuchsia-600"
							>
								Sign Up
							</Link>
						</div>
					</nav>
				</header>

				<section className="mt-12 rounded-3xl border border-white/70 bg-white/75 p-8 shadow-xl backdrop-blur-sm sm:mt-16 sm:p-12">
					<div className="mx-auto max-w-3xl text-center">
						<p className="mb-3 text-sm font-medium text-violet-700">Boilerplate / Starter</p>
						<h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Ship your SaaS foundation faster</h1>
						<p className="mt-4 text-base text-slate-600 sm:text-lg">
							A clean starter powered by Next.js, Prisma, and Better Auth so you can focus on product features, not setup.
						</p>

						<div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
							<Link
								href="/sign-up"
								className="w-full rounded-lg bg-linear-to-r from-indigo-500 via-violet-500 to-fuchsia-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:from-indigo-600 hover:via-violet-600 hover:to-fuchsia-600 sm:w-auto"
							>
								Get Started
							</Link>
							<Link
								href="/sign-in"
								className="w-full rounded-lg border border-indigo-200/80 bg-linear-to-r from-sky-50 via-white to-indigo-50 px-5 py-2.5 text-sm font-semibold text-indigo-700 transition-colors hover:border-indigo-300 hover:from-sky-100 hover:via-indigo-50 hover:to-indigo-100 hover:text-indigo-800 sm:w-auto"
							>
								Sign In
							</Link>
						</div>

						<div className="mt-8 grid gap-3 text-left sm:grid-cols-3">
							<div className="rounded-xl bg-white/70 px-4 py-3 text-sm text-slate-700">Next.js App Router setup</div>
							<div className="rounded-xl bg-white/70 px-4 py-3 text-sm text-slate-700">Prisma ORM and schema ready</div>
							<div className="rounded-xl bg-white/70 px-4 py-3 text-sm text-slate-700">Better Auth flow prepared</div>
						</div>
					</div>
				</section>
			</div>
		</main>
	);
}
