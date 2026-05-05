import { NextResponse } from "next/server";
import { getLoggedInUserId } from "@/lib/auth";
import { db } from "@/lib/db";
import { requestToBodyStream } from "next/dist/server/body-streams";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const userId = await getLoggedInUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    }

    const body = await request.json();
    const { id: sessionId } = await params;
    const { exerciseId, setNumber, repNumber, weightLbs } = body;

    if (!exerciseId || !setNumber || !repNumber || !weightLbs) {
      return NextResponse.json(
        { error: "Missing set fields" },
        { status: 400 },
      );
    }

    const sessionCheck = await db.query(
      `SELECT id
        FROM workout_sessions
        WHERE id = $1 AND user_id = $2`,
      [sessionId, userId],
    );

    if (sessionCheck.rows.length === 0) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    const res = await db.query(
      `INSERT INTO session_sets (session_id, exercise_id, set_number, weight_lbs, reps)
        VALUES ($1, $2, $3, $4, $5)`,
      [sessionId, exerciseId, setNumber, weightLbs, repNumber],
    );

    return NextResponse.json(res.rows[0], { status: 201 });
  } catch {
    return NextResponse.json({ error: "Cannot update sets" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const userId = await getLoggedInUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    }

    const res = await db.query(
      `SELECT *
            FROM session_sets ss`,
    );
  } catch {
    return NextResponse.json({ error: "Cannot fetch sets" }, { status: 500 });
  }
}
