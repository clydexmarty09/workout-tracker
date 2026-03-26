import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";

    const res = await db.query(
      `SELECT id, name
        FROM exercises
        WHERE name ILIKE $1
        ORDER BY name ASC`,
      [`%${search}%`],
    );

    return NextResponse.json(res.rows);
  } catch (error) {
    console.error("Exercise searc error", error);
    return NextResponse.json(
      { error: "Failed to fetch exercises" },
      { status: 500 },
    );
  }
}
