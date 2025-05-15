import { NextRequest, NextResponse } from "next/server";
import connect from "@/config/connect";
import Quizes from "@/models/Quizes";
import { toNumber } from "ethers";
import { v4 as uuidv4 } from 'uuid';


async function POST(request: NextRequest) {
    try {
        await connect();
        const body = await request.json();
        console.log("Received request body:", body);
        const { quizName, quizDescription, minBetAmt, maxBetAmt, quizOptions, owner } = body;
        // //getting number of quizes in database
        // const quizCount = await Quizes.countDocuments({});
        // //creating quizID
        // const quizID = quizCount + 1;

        const quizID = uuidv4();
        console.log("Creating quiz with ID:", quizID);
        console.log("Quiz Name:", quizName);
        console.log("Quiz Description:", quizDescription);
        console.log("Minimum Bet Amount:", minBetAmt);
        console.log("Maximum Bet Amount:", maxBetAmt);
        console.log("Address:", owner);
        const newQuiz = new Quizes({
            quizID: quizID,
            quizName: quizName,
            quizDescription: quizDescription,
            minBetAmt: toNumber(minBetAmt),
            maxBetAmt: toNumber(maxBetAmt),
            quizOptions: quizOptions.map((option: any, index: number) => ({
                optionID: index + 1,
                optionText: option.optionText,
                totalBet : 0,
            })),
            owner: owner,    
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