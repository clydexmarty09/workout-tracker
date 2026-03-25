import bcrypt from "bcrypt";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { login, pw } = body;

    if (!login || !pw) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 400 },
      );
    }

    const res = await db.query(
      `SELECT id, username, email, password_hash
            FROM users
            WHERE username = ? or email = ?
            LIMIT 1`,
      [login],
    );
    const user = res.rows[0];

    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials." },
        { status: 401 },
      );
    }

    const isValid = await bcrypt.compare(pw, user.password_hash);

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid credentials." },
        { status: 401 },
      );
    }

    return NextResponse.json({ ok: true, userId: user.id });
  } catch (error) {
    console.error("LOGIN ERROR", error);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
