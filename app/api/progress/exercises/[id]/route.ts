import { db } from "@/lib/db";
import { getLoggedInUserId } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // get the logged in user
    const userId = await getLoggedInUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    }

    // get exercises id from URL
    const { id: exerciseId } = await params;

    // fetch this user's sets for that exercise
    const res = await db.query(
      `SELECT
          ss.id,
          ss.exercise_id,
          ss.set_number,
          ss.weight_lbs,
          ss.reps,
          ss.created_at,
          ws.id AS session_id, 
          w.name AS workout_name
      FROM session_sets ss 
      JOIN workout_sessions ws 
          ON ss.session_id = ws.id
      JOIN workouts w 
          ON ws.workout_id = w.id
      WHERE ss.exercise_id = $1
          AND ws.user_id = $2
      ORDER BY ss.created_at DESC`,
      [exerciseId, userId],
    );

    // return the sets
    return NextResponse.json(res.rows, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Cannot fetch exercise progress" },
      { status: 500 },
    );
  }

  // handle errors
}
