"use client";

import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { useEffect } from "react";

export default function DashboardPage() {
	const router = useRouter();
	const { data: session, isPending } = authClient.useSession();

	useEffect(() => {
		if (!isPending && !session?.user) {
			router.push("/sign-in");
		}
	}, [isPending, session, router]);

	if (isPending) return <p className="text-center mt-8 text-white">Loading...</p>;
	if (!session?.user) return <p className="text-center mt-8 text-white">Redirecting...</p>;

	const { user } = session;

	return (
		<section className="mx-auto mt-6 max-w-xl rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
			<h1 className="text-2xl font-bold">Dashboard</h1>
			<p>Welcome, {user.name || "User"}!</p>
			<p>Email: {user.email}</p>
			<button onClick={() => authClient.signOut()} className="mt-4 w-full rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground hover:bg-primary/90">
				Sign out
			</button>
		</section>
	);
}
