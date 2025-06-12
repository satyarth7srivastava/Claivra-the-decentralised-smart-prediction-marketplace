import { NextResponse, NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {

    // Check if the request is for the admin path
    // if (request.nextUrl.pathname.startsWith('/admin')) {
    //     // Check if the user is authenticated
    //     const token = request.cookies.get('token');
    //     const role = jwt.decode(token?.value || '') as { role?: string };
    //     if (!token) {
    //         // If not authenticated, redirect to the login page
    //         return NextResponse.redirect(new URL('/login', request.url));
    //     }
    //     if (role?.role !== 'admin') {
    //         // If authenticated but not an admin, redirect to the home page
    //         return NextResponse.redirect(new URL('/', request.url));
    //     }

    //     // If authenticated or not an admin path, continue with the request
    //     return NextResponse.next();
    // }
    return NextResponse.next();
}

export const config = {
    matcher: [
        '/admin'
    ]
}

