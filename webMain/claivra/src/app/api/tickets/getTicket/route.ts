import connect from "@/config/connect";
import Quizes from "@/models/Quizes";
import Tickets from "@/models/Tickets";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request : NextRequest){
    try{
        await connect();
        const {email} = await request.json();
        const userTickets = await Tickets.find({email : email});
        const result = await Promise.all(
            userTickets.map(async (ticket) => {
                const quiz = await Quizes.findOne({
                    quizID : ticket.quizID
                });
                // console.log(ticket.quizID)
                return {
                    quizID : ticket.quizID ,
                    quizName : quiz?.quizName || "",
                    option : quiz.quizOptions?.[ticket.betOption]?.optionText || "N/A",
                    betAmount : ticket.betAmount,
                    winAmount : ticket.winAmount, 
                    isWithdrawn  : ticket.isWithdrawn, 
                    createdAt : ticket.createdAt,
                };
            })
        );
        return NextResponse.json(result , {status : 200});
    }catch(error){
        console.error("Error fetching user tickets:", error);
        return NextResponse.json({ error: "Failed to fetch user tickets" }, { status: 500 });
    }
}