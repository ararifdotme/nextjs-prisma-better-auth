"use client";

import { Bell, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { SidebarToggle } from "./sidebar-toggle";
import { UserNav } from "./user-nav";

export interface NavbarProps {
	isSidebarCollapsed: boolean;
	onDesktopSidebarToggle: () => void;
	onMobileSidebarOpen: () => void;
}

export function Navbar({ isSidebarCollapsed, onDesktopSidebarToggle, onMobileSidebarOpen }: NavbarProps) {
	return (
		<header
			className={cn(
				"fixed top-0 right-0 left-0 z-40 h-16 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80",
				isSidebarCollapsed ? "lg:left-18" : "lg:left-64"
			)}
		>
			<div className="flex h-full items-center gap-3 px-4 md:px-6">
				<div className="flex items-center gap-2">
					<SidebarToggle mobile className="lg:hidden" onClick={onMobileSidebarOpen} />
					<SidebarToggle collapsed={isSidebarCollapsed} className="hidden lg:inline-flex" onClick={onDesktopSidebarToggle} />
				</div>

				<div className="flex-1">
					<div className="relative mx-auto w-full max-w-md">
						<Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
						<Input placeholder="Search" className="pl-9" />
					</div>
				</div>

				<div className="flex items-center gap-1 md:gap-2">
					<Button variant="ghost" size="icon">
						<Bell className="size-4" />
						<span className="sr-only">Notifications</span>
					</Button>
					<Separator orientation="vertical" className="hidden h-6 sm:block" />
					<UserNav />
				</div>
			</div>
		</header>
	);
}
