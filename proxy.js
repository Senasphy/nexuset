// middleware.js
import { NextResponse } from 'next/server'

const protectedPaths = [
  '/categories',
  // add more paths you want to protect
]

export function proxy(request) {
  const { pathname } = request.nextUrl

  // Skip if the path doesn't start with any protected path
  const isProtected = protectedPaths.some(path => 
    pathname === path || pathname.startsWith(path + '/')
  )

  if (!isProtected) {
    return NextResponse.next()
  }

  // Check if user has session cookie
  // (you'll set this cookie after successful login/signup)
  const sessionCookie = request.cookies.get('__session')?.value

  if (!sessionCookie) {
    // Redirect to login + remember where they tried to go
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('from', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // If cookie exists → allow access
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/categories/:path*',
    '/dashboard/:path*',
    // Add more patterns if you have more protected routes
    // Example: '/profile/:path*', '/settings/:path*'
  ]
}
