import { NextResponse } from 'next/server'

const PUBLIC_ROUTES = ['/', '/login', '/sign-up']
const AUTH_REQUIRED_PREFIXES = ['/categories', '/dashboard', '/stats']

export function proxy(request) {
  const { pathname } = request.nextUrl
  const hasSession = Boolean(
    request.cookies.get('__session')?.value || request.cookies.get('session')?.value
  )

  const isPublicRoute = PUBLIC_ROUTES.includes(pathname)
  const needsAuth = AUTH_REQUIRED_PREFIXES.some((prefix) => pathname.startsWith(prefix))

  if (needsAuth && !hasSession) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (hasSession && (pathname === '/login' || pathname === '/sign-up')) {
    return NextResponse.redirect(new URL('/categories', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
}
