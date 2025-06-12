import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connect from "@/config/connect";
import Tickets from "@/models/Tickets";
import User from "@/models/User";
import jwt from "jsonwebtoken";


async function POST(req: NextRequest) {
    try {
        await connect();
        const body = await req.json();
        if (!body || typeof body !== 'object') {
            return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
        }
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
        const session = await getServerSession();
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const userEmail = session.user.email;
        if (!userEmail) {
            return NextResponse.json({ error: "User email not found in session" }, { status: 401 });
        }
        const user = await User.findOne({ email: userEmail });
        if (!user) {
            console.error("User not found");
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
        user.tickets.push(ticketID);
        await user.save();
        const ticket = new Tickets({
            email: userEmail,
            ticketID: ticketID,
            quizID: quizID,
            ownerAddress: walletID,
            betAmount: betAmount,
            betOption: betId,
            winAmount: winning
        })

        await ticket.save();

        return NextResponse.json({ message: "Ticket created successfully" }, { status: 201 });


    } catch (err: any) {
        console.error("Error in POST /api/tickets:", err);
        return NextResponse.json({ error: "Failed to create ticket" }, { status: 500 });
    }
}

export { POST };