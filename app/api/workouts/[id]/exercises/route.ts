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

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const userId = await getLoggedInUserId();
    if (!userId) {
      // check if user is logged in
      return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    }

    const { id } = await context.params; // get workout id link
    const { exerciseId } = await request.json(); // get exercise id link

    if (!exerciseId) {
      return NextResponse.json(
        { error: "Exercise ID required" },
        { status: 400 },
      );
    }

    const workoutCheck = await db.query(
      // check if current workout exists
      `SELECT id FROM workouts
      WHERE id = $1 AND user_id = $2`,
      [id, userId],
    );

    if (workoutCheck.rows.length === 0) {
      return NextResponse.json({ error: "Workout not found" }, { status: 404 });
    }

    const exerciseCheck = await db.query(
      // check if exercises exists before adding
      `SELECT id from exercises
      WHERE id = $1 AND user_id = $2`,
      [exerciseId, userId],
    );

    if (exerciseCheck.rows.length === 0) {
      return NextResponse.json(
        { error: "Exercise not found" },
        { status: 404 },
      );
    }

    const duplicateCheck = await db.query(
      // check if exercise to be added already exists in the workout
      `SELECT exercise_id FROM workout_exercises
      WHERE workout_id = $1 AND exercise_id = $2`,
      [id, exerciseId],
    );

    if (duplicateCheck.rows.length > 0) {
      return NextResponse.json(
        { error: "Exercise is already in this workout" },
        { status: 409 },
      );
    }

    const res = await db.query(
      // successfully insert the exercise
      `INSERT INTO workout_exercises (workout_id, exercise_id)
      VALUES ($1, $2)
      RETURNING *`,
      [id, exerciseId],
    );

    return NextResponse.json(res.rows[0], { status: 201 });
  } catch {
    return NextResponse.json({ error: "Cannot add exercise" }, { status: 500 });
  }
}
