import { NextRequest, NextResponse } from "next/server";
import connect from '@/config/connect';
import User from '@/models/User';
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';

async function POST(req: NextRequest): Promise<NextResponse> {
    const body = await req.json();
    const { email, password, walletAddress } = body;

    // Metamask login: if walletAddress is provided, skip username/password
    if (walletAddress) {
        try {
            await connect();
            const user = await User.findOne({ walletID: walletAddress });

            if (!user) {
                return NextResponse.json({
                    message: "No user found with this wallet address"
                }, { status: 401 });
            }

            const token = jwt.sign(
                { userId: user._id },
                process.env.JWT_SECRET!,
                { expiresIn: '7d' }
            );

            const response = NextResponse.json({
                status: "success",
                message: "Login successful (wallet)",
                data: {
                    _id: user._id,
                    username: user.username,
                    email: user.email,
                    role: user.role,
                    fullName: user.fullName,
                    walletID: user.walletID,
                }
            });

            response.cookies.set('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: "strict",
                maxAge: 60 * 60 * 24 * 7,
            });

            return response;
        } catch (error) {
            console.log(error);
            return NextResponse.json({ message: "Wallet login failed" }, { status: 500 });
        }
    }

    // Username/password login (default)
    if (!email || !password) {
        return NextResponse.json({
            message: "Enter both username and password"
        }, { status: 400 });
    }

    try {
        await connect();
        const user = await User.findOne({ email });

        if (!user) {
            return NextResponse.json({
                message: "Invalid username or password"
            }, { status: 401 });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return NextResponse.json({
                message: "Invalid username or password"
            }, { status: 401 });
        }

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET!,
            { expiresIn: '7d' }
        );

        const response = NextResponse.json({
            status: "success",
            message: "Login successful",
            data: {
                _id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                fullName: user.fullName,
                walletID: user.walletID,
            }
        });

        response.cookies.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: "strict",
            maxAge: 60 * 60 * 24 * 7,
        });

        return response;

    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "POST request to /api/login failed" }, { status: 500 });
    }
}

export { POST };