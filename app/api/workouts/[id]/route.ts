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
            WHERE id = $1 AND user_id = $2`,
      [id, userId],
    );

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Cannot delete data" }, { status: 500 });
  }
}
