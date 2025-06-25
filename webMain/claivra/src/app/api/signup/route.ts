import { NextRequest, NextResponse } from "next/server";
import connect from '@/config/connect';
import User from '@/models/User';
import { stat } from "fs";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';


const validateEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    return emailRegex.test(email);
};

const validatePassword = (password: string) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password); //commenting for testing
};

async function POST(req: NextRequest): Promise<NextResponse> {
    const { fullName, email, password, role, wallerAddress } = await req.json();

    if (!fullName || !email || !password || !role || !wallerAddress) {
        return NextResponse.json({
            message: "Enter all credentials"
        })
    }

    if (!validateEmail(email)) {
        return NextResponse.json({
            message: "Enter a valid email address"
        })
    }

    if (!validatePassword(password)) {
        return NextResponse.json({
            message: "Enter a valid password"
        })
    }

    try {
        await connect();
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return NextResponse.json({
                message: "This email id already exists."
            })
        }

        const baseUsername = fullName.replace(/\s+/g, "").toLowerCase();
        const randomSuffix = Math.floor(1000 + Math.random() * 9000); // Random 4-digit number
        const username = `${baseUsername}${randomSuffix}`;

        const salt = await bcrypt.genSalt(10);
        const hashPassword = bcrypt.hashSync(password, salt);

        const newUser = await User.create({
            email,
            fullName,
            username,
            password: hashPassword,
            role,
            walletID: wallerAddress.toLowerCase(),
        });
        newUser.save();

        console.log(newUser);

        const token = jwt.sign(
            {
                userId: newUser._id,
                role: newUser.role,
            },
            process.env.JWT_SECRET!,
            { expiresIn: '7d' }
        );

        const response = NextResponse.json({
            status: "success",
            message: "User created successfully",
            data: newUser
        });

        response.cookies.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: "strict",
            maxAge: 60 * 60 * 24 * 7,
        })

        console.log(response);

        return response;

    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "POST request to /api/signup failed" });
    }
}

export { POST }