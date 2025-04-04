import { NextRequest, NextResponse } from "next/server";
import connect from "@/config/connect";
import Quizes from "@/models/Quizes";


async function POST(req: NextRequest) {
    const body = await req.json();
    const { quizeName, quizeDescription, minBetAmt, maxBetAmt, quizeOptions } = body;
    //logging everything
    console.log("Received data:", body);
    console.log("quizeName:", quizeName);
    console.log("quizeDescription:", quizeDescription);
    console.log("minBetAmt:", minBetAmt);
    console.log("maxBetAmt:", maxBetAmt);
    console.log("quizeOptions:", quizeOptions);
    try {
        await connect();
        const newQuiz = await Quizes.create({
            data: {
                quizeName : quizeName,
                quizeDescription : quizeDescription,
                minBetAmt : minBetAmt,
                maxBetAmt : maxBetAmt,
                quizeOptions: {
                    create: quizeOptions.map((option: any) => ({
                        optionText: option.optionText,
                        totalBet: option.totalBet,
                    })),
                },
            },
        });
        return NextResponse.json(newQuiz, { status: 201 });
    } catch (error) {
        console.error("Error creating quiz:", error);
        return NextResponse.json({ error: "Failed to create quiz" }, { status: 500 });
    }
}

export { POST };