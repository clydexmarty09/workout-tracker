import { getLoggedInUserId } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const userId = await getLoggedInUserId();
    if (!userId) {
      return NextResponse.json({ error: "Not autheticated" }, { status: 401 });
    }

    const res = await db.query(
      `SELECT * FROM workouts WHERE user_id = $1
      ORDER BY created_at DESC`,
      [userId],
    );

    return NextResponse.json(res.rows);
  } catch (error) {
    console.error("Failed to fetch workout", error);

    return NextResponse.json(
      { error: "Failed to fetch workout" },
      { status: 500 },
    );
  }
}
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, label, exerciseIds } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Workout name required" },
        { status: 400 },
      );
    }

    if (!Array.isArray(exerciseIds)) {
      return NextResponse.json(
        { error: "ExercisesIds must be an array" },
        { status: 400 },
      );
    }

    const userId = await getLoggedInUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // insert workout
    const result = await db.query(
      `INSERT INTO workouts (user_id, name, label)
            VALUES ($1, $2, $3)
            RETURNING *`, // after inserting, give the full row back
      [userId, name, label || null],
    );

    const workout = result.rows[0];
    const workoutId = workout.id;

    // insert linked exercises
    for (const exerciseId of exerciseIds) {
      await db.query(
        `INSERT INTO workout_exercises (workout_id, exercise_id)
        VALUES ($1, $2)`,
        [workoutId, exerciseId],
      );
    }

    return NextResponse.json(workout, { status: 201 });
  } catch (error) {
    console.error("Cannot create workout", error);
    return NextResponse.json(
      { error: "Failed to create workout" },
      { status: 500 },
    );
  }
}
