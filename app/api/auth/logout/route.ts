import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/lib/db";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("sessionId")?.value;

    const success = NextResponse.json({ success: true });

    if (sessionId) {
      await db.query(
        `DELETE FROM sessions
                WHERE id = $1`,
        [sessionId],
      );
    }

    success.cookies.delete("sessionId");

    return success;
  } catch {
    return NextResponse.json({ error: "Logout Failed" }, { status: 500 });
  }
}
