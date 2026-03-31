import { db } from "@/lib/db";
import { getLoggedInUserId } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const userId = await getLoggedInUserId();
    if (!userId) {
      return NextResponse.json({ error: "Not Authenticated" }, { status: 401 });
    }

    const result = await db.query(
      `DELETE FROM workouts
            WHERE id = $1 AND user_id = $2
            RETURNING *`,
      [id, userId],
    );

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Cannot delete data" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const userId = await getLoggedInUserId();
    const body = await request.json();
    const { name, label } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Workout name required" },
        { status: 400 },
      );
    }

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await db.query(
      `UPDATE workouts
            SET name = $1, label = $2
            WHERE id = $3 AND user_id = $4
            RETURNING *`,
      [name, label || null, id, userId],
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Workout not found" }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch {
    return NextResponse.json({ error: "Cannot update data" }, { status: 500 });
  }
}
