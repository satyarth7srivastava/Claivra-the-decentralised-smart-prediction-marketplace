import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

type Role = "Admin" | "Buyer" | "Organizer";

const protectedRoutes: Record<string, Role[]> = {
  "/admin": ["Admin"],
  "/buyer": ["Buyer"],
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

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    const userRole = decoded.role;

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
