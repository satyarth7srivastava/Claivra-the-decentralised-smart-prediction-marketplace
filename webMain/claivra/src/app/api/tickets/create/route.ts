import { NextRequest, NextResponse } from "next/server";
import connect from "@/config/connect";
import Tickets from "@/models/Tickets";
import User from "@/models/User";


async function POST(req: NextRequest){
    try{
        await connect();
        const body = await req.json();
        console.log("Received request body:", body);
        const {
            ticketID,
            quizID,
            walletID,
            betId,
            betAmount,
            winning
        } = await body;
        if (!ticketID || !quizID || !walletID) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }
        const user = await User.findOne({walletID: walletID});
        if (!user) {
            console.error("User not found for walletID:", walletID);
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
        user.tickets.push(ticketID);
        await user.save();
        const ticket = new Tickets({
            ticketID: ticketID,
            quizID: quizID,
            ownerAddress: walletID,
            betAmount: betAmount,
            betOption: betId,
            winAmount: winning
        })

        await ticket.save();

        return NextResponse.json({ message: "Ticket created successfully" }, { status: 201 });
        

    }catch(err : any){
        console.error("Error in POST /api/tickets:", err);
        return NextResponse.json({ error: "Failed to create ticket" }, { status: 500 });
    }
}

export { POST };