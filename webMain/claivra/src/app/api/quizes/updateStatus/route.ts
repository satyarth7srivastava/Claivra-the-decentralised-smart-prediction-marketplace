import { NextRequest, NextResponse } from "next/server";
import connect from "@/config/connect";
import Quizes from "@/models/Quizes";

async function POST(request: NextRequest) {
    try {
        await connect();
        const { quizID, status } = await request.json();  // Corrected 'quizeID' to 'quizID'

        // Finding the quiz by the correct ID field
        const quiz = await Quizes.findOne({ _id: quizID }); // Ensuring the ID is passed correctly

        if (quiz) {
            quiz.approvalStatus = status;  // Assuming the field is 'approvalStatus' for updating
            await quiz.save();
        }

        return NextResponse.json(quiz, { status: 200 }); // Sending the updated quiz object
    } catch (error) {
        console.error("Error Updating quiz Status:", error);
        return NextResponse.json({ error: "Error Updating quiz Status" }, { status: 500 });
    }
}

export { POST };
