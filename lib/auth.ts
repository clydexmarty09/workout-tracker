import { cookies } from "next/headers";
import { db } from "@/lib/db";

type SessionRow = {
  user_id: string;
};

export async function getLoggedInUserId() {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("sessionId")?.value;

    if (!sessionId) {
      return null;
    }

    const res = await db.query<SessionRow>(
      `SELECT user_id
        FROM sessions
        WHERE id = $1 AND expires_at > NOW()
        LIMIT 1`,
      [sessionId],
    );

    const sessionRows = res.rows;

    if (sessionRows.length === 0) {
      return null;
    }

    return sessionRows[0].user_id;
  } catch (error) {
    console.error("Error in getting user id", error);
    return null;
  }
}
