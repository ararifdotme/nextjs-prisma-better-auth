"use client";

import { LogOut, Settings, User } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface UserNavProps {
	name?: string;
	email?: string;
	avatarUrl?: string;
}

export function UserNav({ name = "Admin User", email = "admin@example.com", avatarUrl }: UserNavProps) {
	const initials = name
		.split(" ")
		.filter(Boolean)
		.slice(0, 2)
		.map((segment) => segment[0]?.toUpperCase())
		.join("");

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" className="relative h-9 w-9 rounded-full p-0">
					<Avatar size="default">
						{avatarUrl ? <AvatarImage src={avatarUrl} alt={name} /> : null}
						<AvatarFallback>{initials || "AU"}</AvatarFallback>
					</Avatar>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-56" align="end" forceMount>
				<DropdownMenuLabel className="font-normal">
					<div className="flex flex-col space-y-1">
						<p className="text-sm leading-none font-medium">{name}</p>
						<p className="text-xs leading-none text-muted-foreground">{email}</p>
					</div>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuItem>
					<User className="size-4" />
					<span>Profile</span>
				</DropdownMenuItem>
				<DropdownMenuItem>
					<Settings className="size-4" />
					<span>Settings</span>
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem variant="destructive">
					<LogOut className="size-4" />
					<span>Log out</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
