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
      { error: "Cannot create workout" },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const userId = await getLoggedInUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    }

    /*
        pull information from both workouts and exercise table. Label them as w and e 
        rename columns to avoid confusing duplicates 
        On the first join, connect workouts to the join table. Find rows where workout id matches the join tables workout id
        Use lEFT JOIN so that even empty workouts get linked. 
        On second JOIN, connect the join table to the actual exercises to find the actual exercise names. This is because first JOIN only connects by ID 
        */
    const res = await db.query(
      `SELECT 
            w.id AS workout_id,
            w.name AS workout_name,
            w.label AS workout_label,
            e.id AS exercise_id,
            e.name AS exercise_name
            FROM workouts w
            LEFT JOIN workout_exercises we
                ON w.id = we.workout_id
            LEFT JOIN exercises e
                ON we.exercise_id = e.id
            WHERE w.user_id = $1
            ORDER BY w.created_at DESC`,
      [userId],
    );

    // map a set of properties to a specific type: in this case, any
    // syntax: Record<Keys, type>
    // make an empty object to store grouped workouts
    // we use an object map to make lookup more direct, instead of an array where we have to iterate through the entire thing
    const workoutsMap: Record<string, any> = {};

    for (const row of res.rows) {
      const workoutId = row.workout_id; // get the workout id : the key on the object map

      if (!workoutsMap[workoutId]) {
        // check if workout already exists, if not, create one
        workoutsMap[workoutId] = {
          id: row.workout_id,
          name: row.workout_name,
          label: row.workout_label,
          exercises: [],
        };
      }

      if (row.exercise_id) {
        // check if row actually has an exercise
        workoutsMap[workoutId].exercises.push({
          // push the exercises into the correct workout
          id: row.exercise_id,
          name: row.exercise_name,
        });
      }
    }

    // workoutsMap is an object keyed by workout IDs
    // object.values takes the values from the object and returns them as an array
    return NextResponse.json(Object.values(workoutsMap));
  } catch {
    return NextResponse.json(
      { error: "Cannot retrieve workouts" },
      { status: 500 },
    );
  }
}
