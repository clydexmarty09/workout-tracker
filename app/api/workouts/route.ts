import { getLoggedInUserId } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, label } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Workout name required" },
        { status: 400 },
      );
    }

    const userId = await getLoggedInUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await db.query(
      `INSERT INTO workouts (user_id, name, label)
            VALUES ($1, $2, $3)
            RETURNING *`, // after inserting, give the full row back
      [userId, name, label || null],
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error("Cannot create workout", error);
    return NextResponse.json(
      { error: "Failed to create workout" },
      { status: 500 },
    );
  }
}
