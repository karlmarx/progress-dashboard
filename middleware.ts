import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyAuthToken, AUTH_COOKIE } from '@/lib/jwt'

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Allow access to public routes and API status (used by external monitors)
  if (pathname === '/api/status' || pathname === '/favicon.ico' || pathname.startsWith('/_next/')) {
    return NextResponse.next()
  }

  // Check for auth cookie
  const token = request.cookies.get(AUTH_COOKIE)?.value

  if (!token) {
    // Redirect to me.93.fyi login with this URL as next param
    const loginUrl = new URL('https://me.93.fyi/login')
    loginUrl.searchParams.set('next', request.url)
    return NextResponse.redirect(loginUrl)
  }

  // Verify token validity
  const auth = await verifyAuthToken(token)
  if (!auth) {
    // Token expired or invalid, redirect to login
    const loginUrl = new URL('https://me.93.fyi/login')
    loginUrl.searchParams.set('next', request.url)
    return NextResponse.redirect(loginUrl)
  }

  // Token valid, continue
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
