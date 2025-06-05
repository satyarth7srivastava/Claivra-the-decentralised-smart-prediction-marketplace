import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { getServerSession } from "next-auth";
import { NEXT_AUTH_CONFIG } from "@/app/lib/auth";
import connect from "@/config/connect";
import User from "@/models/User";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(NEXT_AUTH_CONFIG);
    if (session?.user) {
      await connect();
      const email = session.user.email;
      const user = await User.findOne({
        email: email,
      })
      if (!user) {
        return NextResponse.json({ isAuthenticated: false }, { status: 200 });
      }
      const isWalletConnected = (user.walletID !== "")? true : false;
      console.log("User found:", user);
      console.log("Is wallet connected:", isWalletConnected);
      return NextResponse.json({ isAuthenticated: true, isWalletConnected: isWalletConnected });
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
    //getting user id from token
    const decodedToken = jwt.decode(token) as { userId: string };
    if (!decodedToken || !decodedToken.userId) {
      return NextResponse.json({ isAuthenticated: false }, { status: 200 });
    }
    const user = await User.findById(decodedToken.userId);
    if (!user) {
      return NextResponse.json({ isAuthenticated: false }, { status: 200 });
    }
    const isWalletConnected = (user.walletID !== "")? true : false;
    return NextResponse.json({ isAuthenticated: true, isWalletConnected: isWalletConnected });
  } catch (error) {
    console.error("JWT Verification Error:", error);
    return NextResponse.json({ isAuthenticated: false }, { status: 401 });
  }
}
