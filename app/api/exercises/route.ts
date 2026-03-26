import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(reques: Request) {
  try {
  } catch (error) {
    console.error("Exercise searc error", error);
    return NextResponse.json(
      { error: "Failed to fetch exercises" },
      { status: 500 },
    );
  }
}
