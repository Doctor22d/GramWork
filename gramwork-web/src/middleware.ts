import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

function parseJwt(token: string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    return null;
  }
}

export default function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  const publicPaths = ['/login', '/register', '/forgot-password', '/reset-password', '/verify-otp'];
  const isPublicPath = pathname === '/' || publicPaths.some(path => pathname.startsWith(path));

  // If the user is not authenticated and trying to access a protected route
  if (!token && !isPublicPath) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If the user is authenticated and trying to access login/signup pages
  if (token && isPublicPath) {
    const payload = parseJwt(token);
    const role = payload?.role?.toLowerCase() || payload?.authorities?.[0]?.authority?.replace('ROLE_', '')?.toLowerCase();
    
    if (role === 'admin') {
      return NextResponse.redirect(new URL('/admin', request.url));
    } else if (role === 'employer') {
      return NextResponse.redirect(new URL('/employer', request.url));
    } else if (role === 'worker') {
      return NextResponse.redirect(new URL('/worker', request.url));
    }
    
    // If the token is invalid or from another localhost app, just let them see the public page.
    return NextResponse.next();
  }

  // Route protection by role
  if (token && !isPublicPath) {
    const payload = parseJwt(token);
    const role = payload?.role?.toLowerCase() || payload?.authorities?.[0]?.authority?.replace('ROLE_', '')?.toLowerCase();
    
    if (pathname.startsWith('/admin') && role !== 'admin') {
      return NextResponse.redirect(new URL(`/${role}`, request.url));
    }
    if (pathname.startsWith('/employer') && role !== 'employer') {
      return NextResponse.redirect(new URL(`/${role}`, request.url));
    }
    if (pathname.startsWith('/worker') && role !== 'worker') {
      return NextResponse.redirect(new URL(`/${role}`, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
