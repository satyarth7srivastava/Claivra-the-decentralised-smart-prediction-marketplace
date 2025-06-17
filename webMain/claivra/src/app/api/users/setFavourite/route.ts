import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import connect from "@/config/connect";
import User from "@/models/User";

export async function POST(req: NextRequest) {
  await connect();
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.decode(token) as JwtPayload;
    if(!decoded){
        console.log("No user id obtained");
    }
    const body = await req.json();
    const { quizID } = body;

    if (!quizID) {
      return NextResponse.json({ message: "Missing quizID" }, { status: 400 });
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const alreadyFavourited = user.favourites.includes(quizID);

    if (alreadyFavourited) {
      // Remove quizID from favourites
      user.favourites.pull(quizID);
    } else {
      // Add quizID to favourites
      user.favourites.push(quizID);
    }

    await user.save();

    return NextResponse.json({
      message: alreadyFavourited ? "Removed from favourites" : "Added to favourites",
      updated: true,
      isFavourite: !alreadyFavourited,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
