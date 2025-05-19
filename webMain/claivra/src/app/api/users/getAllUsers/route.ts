import { NextRequest, NextResponse } from "next/server";

import connect from "@/config/connect";
import User from "@/models/User";

async function GET(request: NextRequest) {
    try {
        await connect();
        const users = await User.find({});
        return NextResponse.json(users, { status: 200 });
    } catch (error) {
        console.error("Error fetching users:", error);
        return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
    }
}


export { GET };