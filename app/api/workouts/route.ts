import { getLoggedInUserId } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const userId = await getLoggedInUserId();
    if (!userId) {
      return NextResponse.json({ error: "Not autheticated" }, { status: 401 });
    }

    // get workouts and linked exercises
    // get all workouts from the logged in user, and get the exercises linked to each workout
    const res = await db.query(
      `SELECT
        workouts.id AS workout_id,  
        workouts.name AS workout_name, 
        workouts.label AS workout_label, 
        exercises.id AS exercise_id, 
        exercises.name AS exercise_name
        FROM workouts  
        LEFT JOIN workout_exercises
          ON workouts.id = workout_exercises.workout_id
        LEFT JOIN exercises
          ON workout_exercises.exercise_id = exercises.id
        WHERE workouts.user_id = $1
        ORDER BY workouts.created_at DESC`,
      [userId],
    );

    // a Record is a built-in TypeScript type: an object with keys and values
    // Record<KEY_TYPE, VALUE_TYPE>
    const workoutsMap: Record<string, any> = {}; // create an empty object: container for workouts

    for (const row of res.rows) {
      // loop through every SQL row in an array
      const workoutId = row.workout_id;

      if (!workoutsMap[workoutId]) {
        // if there isn't already a value at this key
        workoutsMap[workoutId] = {
          id: row.workout_id,
          name: row.workout_name,
          label: row.workout_label,
          exercises: [], // this is empty because the moment we create the workout object, we are just setiing up the container
        };
      }

      if (row.exercise_id !== null) {
        // check whether the current row actually has an exercise
        workoutsMap[workoutId].exercises.push({
          // point at []: add a new item at the end of the array
          id: row.exercise_id,
          name: row.exercise_name,
        });
      }
    }

    return NextResponse.json(Object.values(workoutsMap)); // Object.values takes the just the values of object and puts them into array
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
