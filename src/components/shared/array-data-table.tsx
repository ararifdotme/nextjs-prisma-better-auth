"use client";

import type { ColumnDef } from "@tanstack/react-table";

import { DataTable } from "@/components/shared/data-table";

interface ArrayDataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
	getRowId: (row: TData) => string;
	searchPlaceholder?: string;
}

export function ArrayDataTable<TData, TValue>({
	columns,
	data,
	getRowId,
	searchPlaceholder,
}: ArrayDataTableProps<TData, TValue>) {
	return (
		<DataTable
			columns={columns}
			data={data}
			getRowId={getRowId}
			searchPlaceholder={searchPlaceholder}
			onDeleteSelected={(ids) => console.log("Bulk delete IDs:", ids)}
		/>
	);
}
