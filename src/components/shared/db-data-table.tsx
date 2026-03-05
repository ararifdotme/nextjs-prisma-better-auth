"use client";

import * as React from "react";
import Link from "next/link";
import { Edit, MoreVertical, Trash2 } from "lucide-react";
import type { ColumnDef, PaginationState, SortingState } from "@tanstack/react-table";

import { DataTable } from "@/components/shared/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ActionLinks {
	editHref?: string;
	deleteHref?: string;
}

export interface DbColumnConfig {
	key: string;
	label: string;
	sortable?: boolean;
	searchable?: boolean;
	asBadge?: boolean;
	badgeVariantMap?: Record<string, "default" | "secondary" | "destructive" | "outline">;
}

interface DbDataTableProps {
	tableName: string;
	columnsConfig: DbColumnConfig[];
	getActionLinks?: (row: Record<string, unknown>) => ActionLinks;
	mapRow?: (row: Record<string, unknown>) => Record<string, unknown>;
	searchPlaceholder?: string;
}

export function DbDataTable({
	tableName,
	columnsConfig,
	getActionLinks,
	mapRow,
	searchPlaceholder,
}: DbDataTableProps) {
	const [rows, setRows] = React.useState<Record<string, unknown>[]>([]);
	const [totalRows, setTotalRows] = React.useState(0);
	const [error, setError] = React.useState<string | null>(null);
	const [pagination, setPagination] = React.useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [globalFilter, setGlobalFilter] = React.useState("");
	const [debouncedGlobalFilter, setDebouncedGlobalFilter] = React.useState("");

	const sortableKeys = React.useMemo(
		() => new Set(columnsConfig.filter((column) => column.sortable).map((column) => column.key)),
		[columnsConfig]
	);

	const queryColumns = React.useMemo(() => {
		const base = new Set(["id", ...columnsConfig.map((column) => column.key)]);
		return Array.from(base).join(",");
	}, [columnsConfig]);

	const searchableColumns = React.useMemo(
		() => columnsConfig.filter((column) => column.searchable).map((column) => column.key).join(","),
		[columnsConfig]
	);

	const fetchRows = React.useCallback(async () => {
		setError(null);

		try {
			const activeSort = sorting[0];
			const activeSortKey = activeSort?.id;
			const sortBy = activeSortKey && sortableKeys.has(activeSortKey) ? activeSortKey : "";
			const sortOrder = activeSort?.desc ? "desc" : "asc";

			const params = new URLSearchParams({
				table: tableName,
				columns: queryColumns,
				page: String(pagination.pageIndex + 1),
				pageSize: String(pagination.pageSize),
			});

			if (sortBy) {
				params.set("sortBy", sortBy);
				params.set("sortOrder", sortOrder);
			}

			const searchValue = debouncedGlobalFilter.trim();
			if (searchValue && searchableColumns) {
				params.set("search", searchValue);
				params.set("searchable", searchableColumns);
			}

			const response = await fetch(`/api/data-table?${params.toString()}`);
			if (!response.ok) {
				const payload = (await response.json()) as { error?: string };
				throw new Error(payload.error || "Failed to fetch table rows.");
			}

			const payload = (await response.json()) as {
				rows: Record<string, unknown>[];
				totalRows: number;
			};

			const mappedRows = mapRow ? payload.rows.map((row) => mapRow(row)) : payload.rows;
			setRows(mappedRows);
			setTotalRows(payload.totalRows);
		} catch (caughtError) {
			const message = caughtError instanceof Error ? caughtError.message : "Unknown error.";
			setError(message);
		} finally {
			// no-op
		}
	}, [debouncedGlobalFilter, mapRow, pagination.pageIndex, pagination.pageSize, queryColumns, searchableColumns, sortableKeys, sorting, tableName]);

	React.useEffect(() => {
		const timeoutId = window.setTimeout(() => {
			setDebouncedGlobalFilter(globalFilter);
		}, 400);

		return () => window.clearTimeout(timeoutId);
	}, [globalFilter]);

	React.useEffect(() => {
		setPagination((previous) => ({
			...previous,
			pageIndex: 0,
		}));
	}, [globalFilter]);

	React.useEffect(() => {
		void fetchRows();
	}, [fetchRows]);

	const columns = React.useMemo<ColumnDef<Record<string, unknown>>[]>(() => {
		const dynamicColumns: ColumnDef<Record<string, unknown>>[] = columnsConfig.map((column) => ({
			accessorKey: column.key,
			header: column.label,
			enableSorting: Boolean(column.sortable),
			cell: ({ row }) => {
				const rawValue = row.original[column.key];
				const textValue = rawValue == null ? "-" : String(rawValue);

				if (!column.asBadge) {
					return <span className="text-sm">{textValue}</span>;
				}

				const variant = column.badgeVariantMap?.[textValue] ?? "secondary";
				return <Badge variant={variant}>{textValue}</Badge>;
			},
		}));

		return [
			{
				id: "select",
				header: ({ table }) => (
					<Checkbox
						checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
						onCheckedChange={(value) => table.toggleAllPageRowsSelected(Boolean(value))}
						aria-label="Select all"
					/>
				),
				cell: ({ row }) => (
					<Checkbox
						checked={row.getIsSelected()}
						onCheckedChange={(value) => row.toggleSelected(Boolean(value))}
						aria-label="Select row"
					/>
				),
				enableSorting: false,
				enableHiding: false,
			},
			...dynamicColumns,
			{
				id: "actions",
				header: "Actions",
				enableSorting: false,
				cell: ({ row }) => {
					const links = getActionLinks?.(row.original);
					if (!links?.editHref && !links?.deleteHref) return null;

					return (
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="ghost" size="icon" className="size-8">
									<MoreVertical className="size-4" />
									<span className="sr-only">Open actions</span>
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end" className="w-40">
								{links.editHref ? (
									<DropdownMenuItem asChild>
										<Link href={links.editHref}>
											<Edit className="size-4" />
											<span>Edit</span>
										</Link>
									</DropdownMenuItem>
								) : null}
								{links.deleteHref ? (
									<DropdownMenuItem asChild variant="destructive">
										<Link href={links.deleteHref}>
											<Trash2 className="size-4" />
											<span>Delete</span>
										</Link>
									</DropdownMenuItem>
								) : null}
							</DropdownMenuContent>
						</DropdownMenu>
					);
				},
			},
		];
	}, [columnsConfig, getActionLinks]);

	if (error) {
		return <div className="rounded-md border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">{error}</div>;
	}

	return (
		<DataTable
			columns={columns}
			data={rows}
			getRowId={(row) => String(row.id)}
			searchPlaceholder={searchPlaceholder}
			onDeleteSelected={(ids) => console.log("Bulk delete IDs:", ids)}
			globalFilter={globalFilter}
			onGlobalFilterChange={setGlobalFilter}
			manualPagination
			manualSorting
			manualFiltering
			pagination={pagination}
			onPaginationChange={setPagination}
			sorting={sorting}
			onSortingChange={setSorting}
			pageCount={Math.max(1, Math.ceil(totalRows / pagination.pageSize))}
			rowCount={totalRows}
		/>
	);
}
