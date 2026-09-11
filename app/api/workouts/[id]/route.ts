// this one is responsible for deleting and updating workouts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getLoggedInUserId } from "@/lib/auth";

// context: { params: Promise<{ id: string }>} gives the dynamic route parameter
// if url is /api/workouts/123 then const { id } await context.params = 123
// this is because the we are already in a dynamic route file
export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const userId = await getLoggedInUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    }

    const { id } = await context.params; // extract dynamic route param from URL

    // run the delete query
    // only delete workout if the workout id matches
    // prevents injection of malicious SQL
    // after deleting the row, give thr deleted row back
    const res = await db.query(
      `DELETE FROM workouts
            WHERE id = $1 AND user_id = $2
            RETURNING *`,
      [id, userId],
    );

    // check if anything was deleted
    if (res.rows.length === 0) {
      return NextResponse.json({ error: "Delete failed" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Cannot delete workout" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const userId = await getLoggedInUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unautheticated" }, { status: 401 });
    }

    const { name, label } = await request.json();
    const { id } = await context.params;

    const res = await db.query(
      `UPDATE workouts
      SET name = $1, label = $2
      WHERE id = $3
      AND user_id = $4
      RETURNING *`,
      [name, label, id, userId],
    );

    if (res.rows.length === 0) {
      return NextResponse.json({ error: "Update failed" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Cannot update workout" },
      { status: 404 },
    );
  }
}
