import NextAuth from 'next-auth'

import authConfig from './config/auth.config'
import { apiAuthPrefix, authRoutes, DEFAULT_SIGN_IN_REDIRECT, privateRoutes } from './constants/route'

const { auth } = NextAuth(authConfig)

export default auth(req => {
  const { nextUrl } = req
  const isSignedIn = !!req.auth

  const isApiAuthRoutes = nextUrl.pathname.startsWith(apiAuthPrefix)
  const isPrivateRoute = privateRoutes.includes(nextUrl.pathname)
  const isAuthRoute = authRoutes.includes(nextUrl.pathname)

  if (isApiAuthRoutes) return

  if (isAuthRoute && isSignedIn) {
    return Response.redirect(new URL(DEFAULT_SIGN_IN_REDIRECT, nextUrl))
  }

  if (!isSignedIn && isPrivateRoute) {
    return Response.redirect(new URL('/signin', nextUrl))
  }
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)'
  ]
}
