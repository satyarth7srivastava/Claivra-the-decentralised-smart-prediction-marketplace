import { NextRequest, NextResponse } from "next/server";

import connect from "@/config/connect";
import Quizes from "@/models/Quizes";

async function POST(request: NextRequest) {
    try {
        await connect();
        const {quizeID, status} = await request.json();
        const quizzes = await Quizes.findOne({ quizeID : quizeID });
        //updating the status of the quiz
        if(quizzes){
            quizzes.approvalStatus = status;
            await quizzes.save();
        }
        return NextResponse.json(quizzes, { status: 200 });
    } catch (error) {
        console.error("Error Updating quize Status:", error);
        return NextResponse.json({ error: "Error Updating quize Status" }, { status: 500 });
    }
}


export { POST };