import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isAdminSession = request.cookies.has('admin_session');

  // If path starts with /admin (excluding /admin/login) and user is not logged in, redirect to login
  if (path.startsWith('/admin') && path !== '/admin/login' && !isAdminSession) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  // If path is /admin/login and user is already logged in, redirect to dashboard
  if (path === '/admin/login' && isAdminSession) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }

  // If path is exactly /admin, redirect appropriately
  if (path === '/admin') {
    if (isAdminSession) {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    } else {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/admin'],
};
