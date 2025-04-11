import { NextRequest, NextResponse } from "next/server";

import connect from "@/config/connect";
import Quizes from "@/models/Quizes";

async function POST(request: NextRequest) {
    try {
        await connect();
        const {walletAddress} = await request.json();
        const quizzes = await Quizes.find({ owner : walletAddress });
        return NextResponse.json(quizzes, { status: 200 });
    } catch (error) {
        console.error("Error fetching quizzes:", error);
        return NextResponse.json({ error: "Failed to fetch quizzes" }, { status: 500 });
    }
}


export { POST };