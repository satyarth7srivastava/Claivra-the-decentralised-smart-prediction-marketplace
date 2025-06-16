import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connect from "./config/connect";

type Role = "Admin" | "Buyer" | "Organizer";

const protectedRoutes: Record<string, Role[]> = {
  "/admin": ["Admin"],
  "/buyer": ["Buyer", "Admin", "Organizer"],
  "/organizer-dashboard": ["Organizer"],
  "/" : ["Admin", "Buyer", "Organizer"],
  "/event" : ["Admin", "Buyer", "Organizer"],
  "/login" : ["Admin", "Buyer", "Organizer"],
  "/signup" : ["Admin", "Buyer", "Organizer"],
};

interface JwtPayload {
  role: Role;
  [key: string]: any;
}

export function middleware(req: NextRequest) {
    const token = req.cookies.get("token")?.value;
    console.log("SECRET:", process.env.JWT_SECRET);

    console.log("Token : "+token);

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    // const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    const decoded = jwt.decode(token) as JwtPayload;
    console.log("Decoded:", decoded);

    console.log("Role :"+ decoded.role );
    if (!decoded.role) {
        return NextResponse.redirect(new URL("/login", req.url));
    }
    

    const userRole = (decoded.role.charAt(0).toUpperCase() + decoded.role.slice(1).toLowerCase()) as Role;

    const pathname = req.nextUrl.pathname;

    for (const path of Object.keys(protectedRoutes)) {
      if (pathname.startsWith(path)) {
        const allowedRoles = protectedRoutes[path];
        if (!allowedRoles.includes(userRole)) {
          return NextResponse.redirect(new URL("/", req.url));
        }
      }
    }

    return NextResponse.next();
  } catch (error) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: ["/admin/:path*", "/buyer/:path*", "/organizer-dashboard/:path*"],
};
