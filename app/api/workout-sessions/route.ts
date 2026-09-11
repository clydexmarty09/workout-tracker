// this file is responsible for handling workout sessions
// user picks a workout
// backend creates a new session row
// backend copies the workout's exercises into the session
// frontend gets the new session back
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
      `SELECT id FROM workouts
        WHERE id = $1 AND user_id = $2`,
      [workoutId, userId],
    );

    // check whether the query found zero matching workout rows
    if (workoutCheck.rows.length === 0) {
      return NextResponse.json({ error: "Workout not found" }, { status: 404 });
    }

    // create the actual session
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

export async function GET(request: Request) {
  try {
    const userId = await getLoggedInUserId();

    if (!userId) {
      return NextResponse.json({ error: "Unaauthenticated" }, { status: 401 });
    }

    const res = await db.query(
      `
      SELECT *
      FROM workout_sessions
      WHERE user_id = $1
        AND status = 'in_progress'
      ORDER BY created_at DESC`,
      [userId],
    );

    return NextResponse.json(res.rows, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Cannot fetch workout sessions" },
      { status: 500 },
    );
  }
}
