// this file takes care of one specific excercise attached to specific workouts
import { db } from "@/lib/db";
import { getLoggedInUserId } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string; exerciseId: string }> },
) {
  try {
    const userId = await getLoggedInUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unautheticated" }, { status: 401 });
    }

    const { id, exerciseId } = await params;

    // make sure the workout belongs to the logged-in user
    const check = await db.query(
      `SELECT id
            FROM workouts
            WHERE id = $1 AND user_id = $2
            LIMIT 1`,
      [id, userId],
    );

    // delete the workout exercise link
    await db.query(
      `DELETE FROM workout_exercises
            WHERE workout_id = $1 AND exercise_id = $2`,
      [id, exerciseId],
    );

    return NextResponse.json({ message: "Exercise removed" });
  } catch {
    return NextResponse.json(
      { error: "Cannot delete exercise" },
      { status: 500 },
    );
  }
}
