import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { getServerSession } from "next-auth";
import { NEXT_AUTH_CONFIG } from "@/app/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(NEXT_AUTH_CONFIG);
    if (session?.user) {
      return NextResponse.json({ isAuthenticated: true });
    }

    const cookie = req.headers.get("cookie");
    const token = cookie
      ?.split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];

    if (!token) {
      return NextResponse.json({ isAuthenticated: false }, { status: 200 });
    }

    jwt.verify(token, process.env.JWT_SECRET!);
    return NextResponse.json({ isAuthenticated: true });
  } catch (error) {
    console.error("JWT Verification Error:", error);
    return NextResponse.json({ isAuthenticated: false }, { status: 401 });
  }
}
