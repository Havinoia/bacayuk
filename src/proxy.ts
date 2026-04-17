import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const sessionCookie = request.cookies.get("better-auth.session_token") || 
                         request.cookies.get("__secure-better-auth.session_token");

    // 1. Root Access: Redirect from root to /dashboard ONLY if a session exists
    // This allows guests to see the landing page (src/app/page.tsx)
    if (pathname === "/" && sessionCookie) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico).*)",
    ],
};
