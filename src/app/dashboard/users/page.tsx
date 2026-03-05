"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DbDataTable } from "@/components/shared/db-data-table";

export default function UsersPage() {
	return (
		<section className="space-y-6">
			<Card>
				<CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<div className="space-y-1">
						<CardTitle>Users</CardTitle>
						<CardDescription>WordPress-style user management table with selection and actions.</CardDescription>
					</div>
					<Button asChild>
						<Link href="/sign-up">Add user</Link>
					</Button>
				</CardHeader>
				<CardContent>
					<DbDataTable
						tableName="user"
						columnsConfig={[
							{ key: "name", label: "Name", sortable: true, searchable: true },
							{ key: "email", label: "Email", sortable: true, searchable: true },
							{
								key: "emailVerified",
								label: "Status",
								sortable: true,
								asBadge: true,
								badgeVariantMap: {
									Active: "secondary",
									Suspended: "destructive",
								},
							},
						]}
						mapRow={(row) => ({
							...row,
							emailVerified: row.emailVerified ? "Active" : "Suspended",
						})}
						getActionLinks={(row) => ({
							editHref: `/dashboard/users/${String(row.id)}/edit`,
							deleteHref: `/dashboard/users/${String(row.id)}/delete`,
						})}
						searchPlaceholder="Search users by name or email..."
					/>
				</CardContent>
			</Card>
		</section>
	);
}
