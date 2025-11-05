import { NextRequest, NextResponse } from "next/server";
import { auth } from "./lib/auth";
import { getCurrentUser } from "./server/users";

export async function middleware(request: NextRequest) {
  const currentUser = await getCurrentUser()

  if (!currentUser) return NextResponse.redirect(new URL("/login", request.url));

  if (request.nextUrl.pathname.includes('events')) {
    const a = await auth.api.userHasPermission({ body: { userId: currentUser.id, permission: { events: ['view-events'] } } })

    if (a) { }
    else {
      return NextResponse.redirect(new URL('/'))
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|login|signup|forgot-password|reset-password|_next/static|_next/image).*)'],
};