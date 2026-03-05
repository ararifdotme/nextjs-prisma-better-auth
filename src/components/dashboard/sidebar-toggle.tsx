"use client";

import * as React from "react";
import { Menu, PanelLeftClose, PanelLeftOpen } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface SidebarToggleProps extends React.ComponentProps<typeof Button> {
	collapsed?: boolean;
	mobile?: boolean;
}

export function SidebarToggle({ collapsed, mobile = false, className, ...props }: SidebarToggleProps) {
	const Icon = mobile ? Menu : collapsed ? PanelLeftOpen : PanelLeftClose;

	return (
		<Button variant="ghost" size="icon" className={cn("size-9", className)} {...props}>
			<Icon className="size-4" />
			<span className="sr-only">Toggle sidebar</span>
		</Button>
	);
}
