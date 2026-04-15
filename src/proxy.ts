import { NextResponse, type NextRequest } from "next/server";

export default async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // 1. Direct Dashboard Access: Redirect from root to /dashboard
    if (pathname === "/") {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico).*)",
    ],
};
