import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { NEXT_AUTH_CONFIG } from "@/app/lib/auth";
import connect from "@/config/connect";
import User from "@/models/User";

export async function GET(req: NextRequest) {
  try {
    await connect();
    const session = await getServerSession(NEXT_AUTH_CONFIG);
    console.log("Session Data:", session);

    if (!session?.user) {
       console.error("No session found or user is not authenticated");
       return NextResponse.json({ success: false, message: "User not authenticated" });
    }

    const { email, name } = session.user;
    console.log(email, name);

    let user = await User.findOne({ email });

    if (!user) {
      const baseUsername = name.replace(/\s+/g, "").toLowerCase();
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const newUsername = `${baseUsername}${randomSuffix}`;

      user = new User({ email, fullName: name, username: newUsername });
      await user.save();
      console.log("New user created:", user);
    } else {
      console.log("User already exists:", user);
    }

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error("Error during Google Sign-In:", error);
    return NextResponse.json({ success: false, message: "Error processing request" });
  }
}
