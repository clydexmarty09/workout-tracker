import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getLoggedInUserId } from "@/lib/auth";

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const userId = await getLoggedInUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    }

    const { id } = await context.params;
    const { exerciseId } = await request.json(); // read exercise id from request.json()

    if (!exerciseId) {
      // validate
      return NextResponse.json(
        { error: "Missing exercises id" },
        { status: 400 },
      );
    }

    // check if workout belongs to the user
    const workoutCheck = await db.query(
      `SELECT id
            FROM workouts
            WHERE id = $1
            AND user_id = $2`,
      [id, userId],
    );

    if (workoutCheck.rows.length === 0) {
      return NextResponse.json({ error: "Workout not found" }, { status: 404 });
    }

    const res = await db.query(
      `DELETE FROM workout_exercises
            WHERE workout_id = $1
            AND exercise_id = $2
            RETURNING *`,
      [id, exerciseId],
    );

    if (res.rows.length === 0) {
      return NextResponse.json({ error: "Delete failed" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Cannot delete exercise" },
      { status: 500 },
    );
  }
}
