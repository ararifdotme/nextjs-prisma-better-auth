"use client";
"use no memo";

import * as React from "react";
import { ArrowUpDown, Search } from "lucide-react";
import {
	ColumnDef,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
	type OnChangeFn,
	type PaginationState,
	type RowSelectionState,
	type SortingState,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
	searchPlaceholder?: string;
	getRowId: (row: TData) => string;
	onDeleteSelected?: (ids: string[]) => void;
	globalFilter?: string;
	onGlobalFilterChange?: OnChangeFn<string>;
	pagination?: PaginationState;
	onPaginationChange?: OnChangeFn<PaginationState>;
	sorting?: SortingState;
	onSortingChange?: OnChangeFn<SortingState>;
	manualPagination?: boolean;
	manualSorting?: boolean;
	manualFiltering?: boolean;
	pageCount?: number;
	rowCount?: number;
}

export function DataTable<TData, TValue>({
	columns,
	data,
	searchPlaceholder = "Search...",
	getRowId,
	onDeleteSelected,
	globalFilter,
	onGlobalFilterChange,
	pagination,
	onPaginationChange,
	sorting,
	onSortingChange,
	manualPagination = false,
	manualSorting = false,
	manualFiltering = false,
	pageCount,
	rowCount,
}: DataTableProps<TData, TValue>) {
	const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
	const [internalGlobalFilter, setInternalGlobalFilter] = React.useState("");
	const [internalPagination, setInternalPagination] = React.useState<PaginationState>({
		pageIndex: 0,
		pageSize: 5,
	});
	const [internalSorting, setInternalSorting] = React.useState<SortingState>([]);

	const activeGlobalFilter = globalFilter ?? internalGlobalFilter;
	const activePagination = pagination ?? internalPagination;
	const activeSorting = sorting ?? internalSorting;

	const table = useReactTable({
		data,
		columns,
		state: {
			rowSelection,
			globalFilter: activeGlobalFilter,
			pagination: activePagination,
			sorting: activeSorting,
		},
		enableRowSelection: true,
		enableSorting: true,
		onRowSelectionChange: setRowSelection,
		onGlobalFilterChange: onGlobalFilterChange ?? setInternalGlobalFilter,
		onPaginationChange: onPaginationChange ?? setInternalPagination,
		onSortingChange: onSortingChange ?? setInternalSorting,
		manualPagination,
		manualSorting,
		manualFiltering,
		pageCount,
		rowCount,
		getRowId: (originalRow) => getRowId(originalRow),
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		globalFilterFn: (row, _columnId, filterValue) => {
			const value = String(filterValue ?? "").trim().toLowerCase();
			if (!value) return true;

			return Object.values(row.original as Record<string, unknown>).some((cellValue) =>
				String(cellValue ?? "")
					.toLowerCase()
					.includes(value)
			);
		},
	});

	const selectedIds = table
		.getSelectedRowModel()
		.rows.map((row) => getRowId(row.original));

	const handleDeleteSelected = () => {
		if (selectedIds.length === 0) return;
		if (onDeleteSelected) {
			onDeleteSelected(selectedIds);
			return;
		}
		console.log("Delete selected IDs:", selectedIds);
	};

	return (
		<div className="space-y-4">
			<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<div className="relative w-full max-w-sm">
					<Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
					<Input
						value={activeGlobalFilter}
						onChange={(event) => table.setGlobalFilter(event.target.value)}
						placeholder={searchPlaceholder}
						className="w-full pl-9"
					/>
				</div>
				{selectedIds.length > 0 ? (
					<Button variant="destructive" onClick={handleDeleteSelected}>
						Delete Selected ({selectedIds.length})
					</Button>
				) : null}
			</div>

			<div className="rounded-md border bg-background">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => (
									<TableHead key={header.id}>
										{header.isPlaceholder ? null : (
											<div className="flex items-center gap-2">
												{flexRender(header.column.columnDef.header, header.getContext())}
												{header.column.getCanSort() ? (
													<button
														type="button"
														onClick={header.column.getToggleSortingHandler()}
														className="inline-flex items-center text-muted-foreground hover:text-foreground"
													>
														<ArrowUpDown className="size-3.5" />
														<span className="sr-only">Sort</span>
													</button>
												) : null}
											</div>
										)}
									</TableHead>
								))}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
											{flexRender(cell.column.columnDef.cell, cell.getContext())}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
									No results found.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>

			<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<div className="text-sm text-muted-foreground">
					Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount() || 1}
					{typeof rowCount === "number" ? ` - ${rowCount} total rows` : ""}
				</div>
				<div className="flex flex-wrap items-center gap-2">
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="outline" size="sm">
								Rows: {table.getState().pagination.pageSize}
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							{[5, 10, 20, 50].map((size) => (
								<DropdownMenuItem key={size} onClick={() => table.setPageSize(size)}>
									{size} rows
								</DropdownMenuItem>
							))}
						</DropdownMenuContent>
					</DropdownMenu>
					<Button
						variant="outline"
						size="sm"
						onClick={() => table.previousPage()}
						disabled={!table.getCanPreviousPage()}
					>
						Previous
					</Button>
					{table.getPageOptions().map((page) => {
						const isActive = page === table.getState().pagination.pageIndex;
						return (
							<Button
								key={page}
								variant={isActive ? "default" : "outline"}
								size="sm"
								onClick={() => table.setPageIndex(page)}
								className={cn("min-w-9", isActive && "pointer-events-none")}
							>
								{page + 1}
							</Button>
						);
					})}
					<Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
						Next
					</Button>
				</div>
			</div>
		</div>
	);
}
