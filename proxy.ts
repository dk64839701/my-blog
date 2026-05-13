import { NextRequest, NextResponse } from 'next/server';
import { verifySession, SESSION_COOKIE } from '@/lib/auth';

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;

  if (path === '/admin/login') return NextResponse.next();

  const sessionValue = request.cookies.get(SESSION_COOKIE)?.value;
  if (!sessionValue) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  const email = await verifySession(sessionValue);
  if (!email) {
    const response = NextResponse.redirect(new URL('/admin/login', request.url));
    response.cookies.delete(SESSION_COOKIE);
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
