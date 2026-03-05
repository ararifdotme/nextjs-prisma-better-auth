"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import { ChevronRight, FileText, LayoutDashboard, MessageSquare, Settings, Users } from "lucide-react";

import { cn } from "@/lib/utils";

interface SidebarSubItem {
	title: string;
	href: string;
}

interface SidebarNavItem {
	title: string;
	href: string;
	icon: LucideIcon;
	submenu?: SidebarSubItem[];
}

const navigationItems: SidebarNavItem[] = [
	{ title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
	{
		title: "Users",
		href: "/dashboard/users",
		icon: Users,
		submenu: [
			{ title: "All Users", href: "/dashboard/users" },
			{ title: "Add New", href: "/dashboard/users/new" },
		],
	},
	{
		title: "Settings",
		href: "/dashboard/settings",
		icon: Settings,
		submenu: [
			{ title: "General", href: "/dashboard/settings" },
			{ title: "Profile", href: "/dashboard/settings/profile" },
		],
	},
];

export interface SidebarProps {
	collapsed?: boolean;
	className?: string;
	onNavigate?: () => void;
}

export function Sidebar({ collapsed = false, className, onNavigate }: SidebarProps) {
	const pathname = usePathname();
	const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

	const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

	const toggleMenu = (href: string) => {
		setOpenMenus((current) => ({
			...current,
			[href]: !current[href],
		}));
	};

	return (
		<aside className={cn("flex h-full flex-col border-r bg-sidebar text-sidebar-foreground", collapsed ? "w-18" : "w-64", className)}>
			<div className="flex h-16 items-center border-b px-4">
				<Link
					href="/dashboard"
					onClick={onNavigate}
					className={cn("inline-flex items-center gap-2 font-semibold", collapsed ? "justify-center w-full" : "")}
				>
					<LayoutDashboard className="size-5" />
					{!collapsed && <span>WP Admin</span>}
				</Link>
			</div>

			<div className="flex-1 overflow-y-auto p-2">
				<nav className="space-y-1">
					{navigationItems.map((item) => {
						const Icon = item.icon;
						const active = isActive(item.href);
						const hasSubmenu = Boolean(item.submenu?.length);
						const isOpen = openMenus[item.href] ?? active;

						return (
							<div key={item.href} className="space-y-1">
								{hasSubmenu && !collapsed ? (
									<button
										type="button"
										onClick={() => toggleMenu(item.href)}
										className={cn(
											"group flex h-10 w-full items-center rounded-md px-3 text-sm font-medium transition-colors",
											active
												? "bg-sidebar-accent text-sidebar-accent-foreground"
												: "text-sidebar-foreground/80 hover:bg-sidebar-accent/70 hover:text-sidebar-accent-foreground",
										)}
									>
										<Icon className="size-4 shrink-0" />
										<span className="ml-2 truncate">{item.title}</span>
										<ChevronRight className={cn("ml-auto size-4 opacity-60 transition-transform", isOpen && "rotate-90")} />
									</button>
								) : (
									<Link
										href={item.href}
										onClick={onNavigate}
										className={cn(
											"group flex h-10 items-center rounded-md px-3 text-sm font-medium transition-colors",
											active
												? "bg-sidebar-accent text-sidebar-accent-foreground"
												: "text-sidebar-foreground/80 hover:bg-sidebar-accent/70 hover:text-sidebar-accent-foreground",
											collapsed ? "justify-center px-0" : "",
										)}
									>
										<Icon className="size-4 shrink-0" />
										{!collapsed && <span className="ml-2 truncate">{item.title}</span>}
									</Link>
								)}

								{hasSubmenu && !collapsed && isOpen ? (
									<div className="ml-6 space-y-1 border-l border-sidebar-border/70 pl-3">
										{item.submenu?.map((subItem) => {
											const subItemActive = isActive(subItem.href);

											return (
												<Link
													key={subItem.href}
													href={subItem.href}
													onClick={onNavigate}
													className={cn(
														"flex h-8 items-center rounded-md px-2 text-sm transition-colors",
														subItemActive
															? "bg-sidebar-accent text-sidebar-accent-foreground"
															: "text-sidebar-foreground/80 hover:bg-sidebar-accent/70 hover:text-sidebar-accent-foreground",
													)}
												>
													{subItem.title}
												</Link>
											);
										})}
									</div>
								) : null}
							</div>
						);
					})}
				</nav>
			</div>
		</aside>
	);
}
