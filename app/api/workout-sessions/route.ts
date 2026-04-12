// this file is responsible for handling workout sessions
import { db } from "@/lib/db";
import { getLoggedInUserId } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const userId = await getLoggedInUserId();
    const body = await request.json();
    const { workoutId } = body;
    if (!userId) {
      return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    }

    if (!workoutId) {
      return NextResponse.json(
        { error: "Workout ID required" },
        { status: 400 },
      );
    }

    // validation check - check for ownership
    const workoutCheck = await db.query(
      `SELECT * FROM workouts
        WHERE id = $1 AND user_id = $2`,
      [workoutId, userId],
    );

    if (workoutCheck.rows.length === 0) {
      return NextResponse.json({ error: "Workout not found" }, { status: 404 });
    }

    const res = await db.query(
      `INSERT INTO workout_sessions (user_id, workout_id)
            VALUES($1, $2)
            RETURNING *`,
      [userId, workoutId],
    );

    return NextResponse.json(res.rows[0], { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Cannot start workout session" },
      { status: 500 },
    );
  }
}
