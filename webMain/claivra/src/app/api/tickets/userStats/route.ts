import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connect from "@/config/connect";
import User from "@/models/User";
import Tickets from "@/models/Tickets";

export async function GET(req: NextRequest) {
  try {
    await connect();

    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const email = user.email;
    const tickets = await Tickets.find({ email });

    let volumeTraded = 0;
    let totalProfit = 0;
    const quizSet = new Set();

    tickets.forEach((ticket) => {
      volumeTraded += Number(ticket.betAmount || 0);
      totalProfit += Number(ticket.winAmount || 0);
      if (ticket.quizID) quizSet.add(ticket.quizID);
    });

    return NextResponse.json({
      volumeTraded,
      totalProfit,
      marketsTraded: quizSet.size,
    });
  } catch (error) {
    console.error("Error in userStats API:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
