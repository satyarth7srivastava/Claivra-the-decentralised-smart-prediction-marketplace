import { NextRequest, NextResponse } from "next/server";
import connect from "@/config/connect";
import Quizes from "@/models/Quizes";
import { toNumber } from "ethers";
import { v4 as uuidv4 } from 'uuid';

// Interface for quiz options
interface QuizOption {
    optionID: number;
    optionText: string;
    totalBet: number;
}
// Interface for quiz data
interface QuizData {
    quizID: string;
    quizName: string;
    quizDescription: string;
    minBetAmt: number;
    maxBetAmt: number;
    quizOptions: QuizOption[];
    owner: string;
}

async function POST(request: NextRequest) {
    try {
        await connect();
        const body = await request.json();
        console.log("Received request body:", body);

        // Use quizName and quizDescription (not quizeName/quizeDescription)
        const { quizName, quizDescription, minBetAmt, maxBetAmt, quizOptions, Address } = body;

        const quizID = Date.now().toString();;
        console.log("Creating quiz with ID:", quizID);

        const newQuiz = new Quizes({
            quizID: quizID,
            quizName: quizName,
            quizDescription: quizDescription,
            minBetAmt: toNumber(minBetAmt),
            maxBetAmt: toNumber(maxBetAmt),
            quizOptions: Array.isArray(quizOptions) ? quizOptions.map((option: any, index: number) => ({
                optionID: index + 1,
                optionText: option.optionText,
                totalBet: 0,
            })) : [],
            owner: Address,
        });
        await newQuiz.save();
        console.log("Quiz created successfully:", newQuiz);
        return NextResponse.json({ message: "Quiz created successfully", quizID: quizID }, { status: 200 });
    } catch (error) {
        console.log("Error creating quiz:", error);
        return NextResponse.json({ error: "Failed to create quiz" }, { status: 500 });
    }
}

export { POST };