"use client";

import { ReactNode, useState } from "react";

import { Navbar } from "@/components/dashboard/navbar";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

interface LayoutProps {
	children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
	const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
	const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

	return (
		<div className="min-h-screen bg-muted/40">
			<aside
				className={cn(
					"fixed inset-y-0 left-0 z-30 hidden border-r transition-[width] duration-200 lg:block",
					isSidebarCollapsed ? "w-18" : "w-64"
				)}
			>
				<Sidebar collapsed={isSidebarCollapsed} />
			</aside>

			<Sheet open={isMobileSidebarOpen} onOpenChange={setIsMobileSidebarOpen}>
				<SheetContent side="left" className="w-72 p-0 sm:w-80" showCloseButton={false}>
					<SheetTitle className="sr-only">Navigation menu</SheetTitle>
					<Sidebar onNavigate={() => setIsMobileSidebarOpen(false)} />
				</SheetContent>
			</Sheet>

			<div className={cn("transition-[padding-left] duration-200", isSidebarCollapsed ? "lg:pl-18" : "lg:pl-64")}>
				<Navbar
					isSidebarCollapsed={isSidebarCollapsed}
					onDesktopSidebarToggle={() => setIsSidebarCollapsed((previous) => !previous)}
					onMobileSidebarOpen={() => setIsMobileSidebarOpen(true)}
				/>
				<main className="min-h-screen px-4 pt-20 pb-6 md:px-6">{children}</main>
			</div>
		</div>
	);
}
