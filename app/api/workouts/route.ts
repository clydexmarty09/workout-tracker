import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { getLoggedInUserId } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { name, label, exerciseIds } = await request.json();
    const userId = await getLoggedInUserId();

    if (!userId) {
      return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    }

    // check if name is empty, and ensures exerciseId is a proper array with at least one object
    // exerciseId has to be an array because one workout contains multiple exercises
    if (!name || exerciseIds.lenght === 0 || !Array.isArray(exerciseIds)) {
      return NextResponse.json(
        { error: "Name and one exercise is required" },
        { status: 400 },
      );
    }

    // insert one new row into the workouts table
    const workoutRes = await db.query(
      `INSERT INTO workouts (user_id, name, label)
        VALUES ($1, $2, $3)
        RETURNING *`,
      [userId, name, label || null],
    );

    const workout = workoutRes.rows[0];

    // join specific workouts with designated exercises
    // loop over exerciseId array
    for (const exerciseId of exerciseIds) {
      await db.query(
        `INSERT INTO workout_exercises (workout_id, exercise_id)
            VALUES ($1, $2)`,
        [workout.id, exerciseId],
      );
    }

    return NextResponse.json(workout, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Cannot create workouts" },
      { status: 500 },
    );
  }
}
