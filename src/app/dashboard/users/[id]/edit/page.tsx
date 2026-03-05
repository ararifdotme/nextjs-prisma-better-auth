import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import prisma from "@/lib/prisma";

interface EditUserPageProps {
	params: Promise<{ id: string }>;
}

async function updateUserAction(userId: string, formData: FormData) {
	"use server";

	const name = formData.get("name")?.toString().trim() || "";
	const email = formData.get("email")?.toString().trim() || "";
	const emailVerified = formData.get("emailVerified") === "on";

	if (!name || !email) return;

	await prisma.user.update({
		where: { id: userId },
		data: {
			name,
			email,
			emailVerified,
		},
	});

	revalidatePath("/dashboard/users");
	redirect("/dashboard/users");
}

export default async function EditUserPage({ params }: EditUserPageProps) {
	const { id } = await params;

	const user = await prisma.user.findUnique({
		where: { id },
		select: {
			id: true,
			name: true,
			email: true,
			emailVerified: true,
		},
	});

	if (!user) notFound();

	const formAction = updateUserAction.bind(null, user.id);

	return (
		<section className="mx-auto w-full max-w-2xl">
			<Card>
				<CardHeader>
					<CardTitle>Edit User</CardTitle>
					<CardDescription>Update user details and save changes.</CardDescription>
				</CardHeader>
				<CardContent>
					<form action={formAction} className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="name">Name</Label>
							<Input id="name" name="name" defaultValue={user.name} required />
						</div>

						<div className="space-y-2">
							<Label htmlFor="email">Email</Label>
							<Input id="email" name="email" type="email" defaultValue={user.email} required />
						</div>

						<label className="flex items-center gap-2 text-sm">
							<input type="checkbox" name="emailVerified" defaultChecked={user.emailVerified} className="h-4 w-4 rounded border-input" />
							Email verified
						</label>

						<div className="flex items-center justify-end gap-2 pt-2">
							<Button asChild variant="outline">
								<Link href="/dashboard/users">Cancel</Link>
							</Button>
							<Button type="submit">Save changes</Button>
						</div>
					</form>
				</CardContent>
			</Card>
		</section>
	);
}
