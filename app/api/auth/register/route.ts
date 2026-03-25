import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { user, email, pw } = body;

    if (!user || !email || !pw) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 },
      );
    }

    const uid = crypto.randomUUID();
    const pw_hash = await bcrypt.hash(pw, 10);

    await db.query(
      `INSERT INTO users (id, username, email, password_hash)
        VALUES ($1, $2, $3, $4)`,
      [uid, user, email, pw_hash],
    );

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error("REGISTRATION ERROR", error);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
