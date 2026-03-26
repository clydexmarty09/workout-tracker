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
            WHERE username = $1 OR email = $2
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

    const sessionId = crypto.randomUUID();
    const expires_at = new Date();
    expires_at.setDate(expires_at.getDate() + 7);

    await db.query(
      `INSERT INTO sessions (id, user_id, expires_at)
      VALUES ($1, $2, $3)`,
      [sessionId, user.id, expires_at],
    );

    const response = NextResponse.json({ ok: true, userId: user.id });

    response.cookies.set("sessionId", sessionId, {
      httpOnly: true, // frontend JS cannot read the cookie with document.cookie
      secure: process.env.NODE_ENV === "production", // send over https
      sameSite: "lax", // CSRF protection
      expires: expires_at,
      path: "/", // cookies is available across all app
    });

    return response;
  } catch (error) {
    console.error("LOGIN ERROR", error);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
