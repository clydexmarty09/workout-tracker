import { db } from "@/lib/db";
import { getLoggedInUserId } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const userId = await getLoggedInUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    }

    const { id: sessionId } = await params;

    // start a databse query to fetch the main workout session
    // needs session_id, workout_id, created_at, workout_name, workout_label
    const sessionRes = await db.query(
      `SELECT 
            ws.id AS session_id,
            ws.workout_id, 
            ws.created_at, 
            w.label AS workout_label,
            w.name AS workout_name

        FROM workout_sessions ws 
        JOIN workouts w 
            ON ws.workout_id = w.id
        WHERE ws.id = $1
        AND ws.user_id = $2`,
      [sessionId, userId],
    );

    if (sessionRes.rows.length === 0) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    // run a second query to get the exercises attached to the workout template
    const exercisesRes = await db.query(
      `SELECT
            e.id,
            e.name
            FROM workout_exercises we
            JOIN exercises e
                ON we.exercise_id = e.id
            WHERE we.workout_id = $1
            ORDER by e.name ASC`,
      [sessionRes.rows[0].workout_id],
    );

    return NextResponse.json({
      ...sessionRes.rows[0],
      exercises: exercisesRes.rows,
    });
  } catch {
    return NextResponse.json(
      { error: "Cannot fetch session" },
      { status: 500 },
    );
  }
}
