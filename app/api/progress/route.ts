import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getLoggedInUserId } from "@/lib/auth";

export async function GET() {
  try {
    const userId = await getLoggedInUserId();

    if (!userId) {
      return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    }

    const res = await db.query(
      `SELECT
            e.id AS exercise_id,
            e.name AS exercise_name,
            
            ss.id AS set_id, 
            ss.set_number,
            ss.weight_lbs , 
            ss.reps, 
            ss.created_at, 
            
            ws.id AS session_id, 
            ws.completed_at, 
            
            w.id AS workout_id, 
            w.name AS workout_name
            FROM session_sets ss
            
            JOIN exercises e
                ON ss.exercise_id = e.id

            JOIN workout_sessions ws 
                ON ss.session_id = ws.id

            JOIN workouts w 
                ON ws.workout_id = w.id

            WHERE ws.user_id = $1
                AND ws.status = 'completed'
            ORDER BY e.name ASC, ss.created_at DESC`,
      [userId],
    );

    return NextResponse.json(res.rows, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Cannot fetch progress" },
      { status: 500 },
    );
  }
}
