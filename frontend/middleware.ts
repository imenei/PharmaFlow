import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  if (pathname === '/login') {
    return NextResponse.redirect(new URL('/auth/signin', req.url))
  }

  const accessToken = req.cookies.get('pharma_access_token')?.value
  const role = req.cookies.get('pharma_role')?.value
  const status = req.cookies.get('pharma_status')?.value

  const isProtected =
    pathname.startsWith('/admin') ||
    pathname.startsWith('/pharmacist') ||
    pathname.startsWith('/supplier')

  if (isProtected && !accessToken) {
    return NextResponse.redirect(new URL('/auth/signin', req.url))
  }

  if (pathname.startsWith('/admin') && role !== 'admin') {
    return NextResponse.redirect(new URL('/unauthorized', req.url))
  }

  if (pathname.startsWith('/supplier') && role !== 'supplier') {
    return NextResponse.redirect(new URL('/unauthorized', req.url))
  }

  if (pathname.startsWith('/pharmacist') && role !== 'pharmacist') {
    return NextResponse.redirect(new URL('/unauthorized', req.url))
  }

  if (
    (pathname.startsWith('/supplier') || pathname.startsWith('/pharmacist')) &&
    role !== 'admin' &&
    status &&
    status !== 'approved'
  ) {
    return NextResponse.redirect(new URL('/waiting-approval', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/login', '/admin/:path*', '/pharmacist/:path*', '/supplier/:path*'],
}
