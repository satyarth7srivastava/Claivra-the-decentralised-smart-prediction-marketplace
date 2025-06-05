import { NextRequest, NextResponse } from "next/server";
import connect from "@/config/connect";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { NEXT_AUTH_CONFIG } from "@/app/lib/auth";


const POST = async (req : NextRequest) => {
    try {
        const session = await getServerSession(NEXT_AUTH_CONFIG);
        if (!session?.user) {
            console.error("No session found or user is not authenticated");
            return NextResponse.json({ success: false, message: "User not authenticated" }, { status: 401 });
        }
        await connect();
        const { email } = session.user;
        const { walletID } = await req.json();

        if (!walletID) {
            return NextResponse.json({ success: false, message: "Wallet ID is required" }, { status: 400 });
        }

        let user = await User.findOne({
            email: email,
        });
        if (!user) {
            console.error("User not found in the database");
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }
        user.walletID = walletID;
        await user.save();
        console.log("Wallet ID updated successfully for user:", user);
        return NextResponse.json({ success: true, message: "Wallet ID updated successfully" }, { status: 200 });
    } catch (
    error: any
    ) {
        console.error("Error in Wallet Connect API:", error);
        return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
    }
} 

export { POST };