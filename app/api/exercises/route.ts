import { getLoggedInUserId } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const userId = await getLoggedInUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    }

    const { name } = await request.json();

    if (!name) {
      return NextResponse.json(
        { error: "Exercise name required" },
        { status: 400 },
      );
    }

    const res = await db.query(
      `INSERT INTO exercises (user_id, name)
            VALUES ($1, $2)
            RETURNING * `,
      [userId, name],
    );

    const result = res.rows[0];
    return NextResponse.json(result, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Cannot add exercises" },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const userId = await getLoggedInUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    }

    const res = await db.query(
      `SELECT * 
            FROM exercises
            WHERE user_id = $1`,
      [userId],
    );

    return NextResponse.json(res.rows);
  } catch {
    return NextResponse.json(
      { error: "Cannot retrieve data" },
      { status: 500 },
    );
  }
}
