import { NextRequest, NextResponse } from "next/server";

import connect from "@/config/connect";
import Quizes from "@/models/Quizes";

async function POST(request: NextRequest) {
    try {
        await connect();
        const {quizID} = await request.json();
        console.log(quizID);
        const quizzes = await Quizes.findOne({ quizID : quizID });
        return NextResponse.json(quizzes, { status: 200 });
    } catch (error) {
        console.error("Error fetching quizzes:", error);
        return NextResponse.json({ error: "Failed to fetch quizzes" }, { status: 500 });
    }
}


export { POST };