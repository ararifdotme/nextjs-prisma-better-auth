import { NextResponse } from "next/server";

import prisma from "@/lib/prisma";

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);

	const table = searchParams.get("table")?.trim();
	const page = Number(searchParams.get("page") ?? "1");
	const pageSize = Number(searchParams.get("pageSize") ?? "10");
	const sortBy = searchParams.get("sortBy")?.trim();
	const sortOrderRaw = searchParams.get("sortOrder")?.trim().toLowerCase();
	const sortOrder = sortOrderRaw === "desc" ? "desc" : "asc";
	const columnsParam = searchParams.get("columns")?.trim();
	const search = searchParams.get("search")?.trim() ?? "";
	const searchableParam = searchParams.get("searchable")?.trim() ?? "";

	if (!table) {
		return NextResponse.json({ error: "Missing table parameter." }, { status: 400 });
	}

	const columns = columnsParam ? columnsParam.split(",").map((column) => column.trim()).filter(Boolean) : [];
	const searchableColumns = searchableParam
		? searchableParam.split(",").map((column) => column.trim()).filter(Boolean)
		: [];

	if (!columns.includes("id")) columns.push("id");

	const prismaClient = prisma as unknown as Record<string, {
		findMany: (args: Record<string, unknown>) => Promise<Record<string, unknown>[]>;
		count: (args?: Record<string, unknown>) => Promise<number>;
	}>;

	const model = prismaClient[table];
	if (!model?.findMany || !model?.count) {
		return NextResponse.json({ error: `Invalid table '${table}'.` }, { status: 400 });
	}

	const safePage = Number.isFinite(page) && page > 0 ? page : 1;
	const safePageSize = Number.isFinite(pageSize) && pageSize > 0 ? pageSize : 10;
	const skip = (safePage - 1) * safePageSize;

	const select = columns.reduce<Record<string, boolean>>((accumulator, column) => {
		accumulator[column] = true;
		return accumulator;
	}, {});

	const orderBy = sortBy ? ({ [sortBy]: sortOrder } as Record<string, "asc" | "desc">) : undefined;

	const where = search && searchableColumns.length > 0
		? {
				OR: searchableColumns.map((column) => ({
					[column]: {
						contains: search,
					},
				})),
			}
		: undefined;

	const [totalRows, rows] = await Promise.all([
		model.count({ ...(where ? { where } : {}) }),
		model.findMany({
			skip,
			take: safePageSize,
			select,
			...(where ? { where } : {}),
			...(orderBy ? { orderBy } : {}),
		}),
	]);

	return NextResponse.json({
		rows,
		totalRows,
		page: safePage,
		pageSize: safePageSize,
	});
}
