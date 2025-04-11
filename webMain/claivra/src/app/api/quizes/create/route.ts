import { NextRequest, NextResponse } from "next/server";

import connect from "@/config/connect";
import Quizes from "@/models/Quizes";
import { toNumber } from "ethers";

async function POST(request: NextRequest) {
    const body = await request.json();
    console.log("Received request body:", body);
    const { quizeName, quizeDescription, minBetAmt, maxBetAmt, quizeOptions, Address } = body;
    //getting number of quizes in database
    const quizCount = await Quizes.countDocuments({});
    //creating quizID
    const quizID = quizCount + 1;

    try {
        await connect();
        console.log("Connected to database");
        console.log("Creating quiz with ID:", quizID);
        console.log("Quiz Name:", quizeName);
        console.log("Quiz Description:", quizeDescription);
        console.log("Minimum Bet Amount:", minBetAmt);
        console.log("Maximum Bet Amount:", maxBetAmt);
        console.log("Address:", Address);
        const newQuiz = new Quizes({
            quizeID: quizID,
            quizeName: quizeName,
            quizeDescription: quizeDescription,
            minBetAmt: toNumber(minBetAmt),
            maxBetAmt: toNumber(maxBetAmt),
            quizeOptions: quizeOptions.map((option: any, index: number) => ({
                optionID: index + 1,
                optionText: option.optionText,
            })),
            owner: Address
        })
        await newQuiz.save();
        console.log("Quiz created successfully:", newQuiz);
        return NextResponse.json({ message: "Quiz created successfully", quizID: quizID }, { status: 200 });
    } catch (error) {
        console.error("Error creating quiz:", error);
        return NextResponse.json({ error: "Failed to create quiz" }, { status: 500 });
    }
}

export { POST };