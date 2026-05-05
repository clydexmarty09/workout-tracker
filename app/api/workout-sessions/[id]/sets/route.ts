import { NextResponse } from "next/server";
import { getLoggedInUserId } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const userId = await getLoggedInUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    }

    const body = await request.json();
    const { id: sessionId } = await params;
    const { exerciseId, setNumber, repNumber, weightLbs } = body;

    if (!exerciseId || !setNumber || !repNumber || !weightLbs) {
      return NextResponse.json(
        { error: "Missing set fields" },
        { status: 400 },
      );
    }
  } catch {
    return NextResponse.json({ error: "Cannot update sets" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const userId = await getLoggedInUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    }

    const res = await db.query(
      `SELECT *
            FROM session_sets ss`,
    );
  } catch {
    return NextResponse.json({ error: "Cannot fetch sets" }, { status: 500 });
  }
}
