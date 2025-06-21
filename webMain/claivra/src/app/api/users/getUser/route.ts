// app/api/user-info/route.ts
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connect from "@/config/connect";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { NEXT_AUTH_CONFIG } from "@/app/lib/auth";

export async function GET(req: NextRequest) {
  try {
    await connect();

    const token = req.cookies.get("token")?.value;
    console.log("Token from cookies:", token);

    if (!token) {
      const session = await getServerSession(NEXT_AUTH_CONFIG);

      if (session?.user) {
        const user = await User.findOne({ email: session.user.email }).select("-password");
        if (!user) {
          return NextResponse.json({ message: "User not found" }, { status: 404 });
        }
        let res = NextResponse.json({ data: user }, { status: 200 });
        // add the token to the response cookies
        const jwtToken = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET!, {
          expiresIn: "1d",
        });
        res.cookies.set("token", jwtToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
        });
        return res;
      }

      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ data: user }, { status: 200 });
  } catch (error) {
    console.error("GET /api/user-info error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
