import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Public routes
  const publicRoutes = ['/', '/about', '/faq', '/contact', '/login', '/signup', '/forgot-password'];
  
  // API routes that don't need authentication (except deposit APIs)
  const publicApiRoutes = ['/api/auth/login', '/api/auth/register', '/api/auth/forgot-password'];
  
  // Check if it's a public route
  const isPublicRoute = publicRoutes.some(route => path === route);
  const isPublicApi = publicApiRoutes.some(route => path.startsWith(route));
  
  // Protect all /api/deposit routes
  const isDepositApi = path.startsWith('/api/deposit');
  
  // Check for token
  const token = request.cookies.get('token')?.value;
  const isAuthenticated = !!token;

  // If trying to access deposit API without token
  if (isDepositApi && !isAuthenticated) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  // If trying to access protected route without token
  if (!isPublicRoute && !isPublicApi && !isAuthenticated) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/api/deposit/:path*',
    '/dashboard/:path*',
    '/admin/:path*',
    '/login',
    '/signup',
  ],
};