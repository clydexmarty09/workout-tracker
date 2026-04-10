// this file takes care of adding an exercise to a specific workout
import { NextResponse } from "next/server";
import { getLoggedInUserId } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const userId = await getLoggedInUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    const body = await request.json();
    const { exerciseId } = body;

    if (!exerciseId) {
      return NextResponse.json(
        { error: "Invalid exercise ID" },
        { status: 400 },
      );
    }

    const res = await db.query(
      `SELECT * FROM workouts
            WHERE id = $1 AND user_id = $2`,
      [id, userId],
    );

    if (res.rows.length === 0) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 404 });
    }

    const resInsert = await db.query(
      `INSERT INTO workout_exercises (workout_id, exercise_id)
        VALUES ($1, $2)`,
      [id, exerciseId],
    );

    return NextResponse.json({ success: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Cannot add exercise" }, { status: 500 });
  }
}
