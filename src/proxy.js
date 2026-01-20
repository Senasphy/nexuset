import { NextResponse } from 'next/server'

const publicRoutes = ['/login', '/sign-up']

export function proxy(request){

  const { pathname }= request.nextUrl;
  const session = request.cookies.get('session_token')?.value
  const isPublicRoute = publicRoutes.includes(pathname)

  if (!session && !isPublicRoute){
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if( session && isPublicRoute && pathname != "/"){
    return NextResponse.redirect(new URL('categories', request.url))
  }
  return NextResponse.next();

  }


//Matcher: This ensures middleware doesn't run on static files/images
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
  
  


