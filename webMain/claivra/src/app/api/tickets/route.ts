import { NextRequest, NextResponse } from "next/server";
import connect from "@/config/connect";
import Tickets from "@/models/Tickets";


async function POST(req: NextRequest){
    try{
        await connect();
        const body = await req.json();
        console.log("Received request body:", body);
        

    }catch(err : any){
        console.error("Error in POST /api/tickets:", err);
        return NextResponse.json({ error: "Failed to create ticket" }, { status: 500 });
    }
}