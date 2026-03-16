import { NextResponse } from 'next/server'

const publicRoutes = ['/login', '/sign-up']

export function proxy(request){
  // Bypassing all authentication redirects
  return NextResponse.next()

  /*
  const session = request.cookies.get('session')?.value

  // If trying to access categories without a session, redirect to login
  if (!session && request.nextUrl.pathname.startsWith('/categories')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // If user IS logged in, don't let them go to the login page
  if (session && request.nextUrl.pathname === '/login') {
    return NextResponse.redirect(new URL('/categories', request.url))
  }

  return NextResponse.next()
  */
}


//Matcher: This ensures middleware doesn't run on static files/images
export const config = {

 matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
}
