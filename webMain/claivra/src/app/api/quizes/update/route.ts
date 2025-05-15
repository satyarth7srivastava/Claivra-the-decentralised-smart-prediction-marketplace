// /app/api/quizes/update/route.ts
import { NextRequest, NextResponse } from "next/server";
import connect from "@/config/connect";
import Quizes from "@/models/Quizes";

export async function PUT(request: NextRequest) {
  try {
    await connect();

    const {
      _id,
      quizName,
      quizDescription,
      minBetAmt,
      maxBetAmt,
      quizOptions,
      owner,
    } = await request.json();

    const updatedQuiz = await Quizes.findByIdAndUpdate(
      _id, 
      {
        quizName,
        quizDescription,
        minBetAmt,
        maxBetAmt,
        quizOptions,
        owner,
      },
      { new: true } 
    );

    if (!updatedQuiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    return NextResponse.json(updatedQuiz, { status: 200 });
  } catch (error) {
    console.error("Error updating quiz:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
