import { NextRequest, NextResponse } from "next/server";
import connect from '@/db/connect';
import User from '@/db/models/User';
import { stat } from "fs";

async function POST(req: NextRequest, res: NextResponse) {
    const body = await req.json();
    //sending data to mongodb
    try {
        await connect();
        const user = await User.create({
            email: body.email,
            username: body.fullName,
            password: body.password
        });
        console.log(user);
        user.save();
        return NextResponse.json({status: "success", message: "User created successfully", data: user});
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "POST request to /api/signup failed" });
    }
}

export {
    POST
}