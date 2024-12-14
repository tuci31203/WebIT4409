import NextAuth from 'next-auth'

import {
  apiAuthPrefix,
  apiUploadthingPrefix,
  authRoutes,
  DEFAULT_SIGN_IN_REDIRECT,
  publicRoutes
} from '@/constants/route'

import authConfig from './config/auth.config'

const { auth } = NextAuth(authConfig)

export default auth(req => {
  const { nextUrl } = req
  const isSignedIn = !!req.auth

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix)
  const isApiUploadthingRoute = nextUrl.pathname.startsWith(apiUploadthingPrefix)
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname)
  const isAuthRoute = authRoutes.includes(nextUrl.pathname)

  if (isApiAuthRoute || isApiUploadthingRoute) {
    return
  }

  if (isAuthRoute) {
    if (isSignedIn) {
      return Response.redirect(new URL(DEFAULT_SIGN_IN_REDIRECT, nextUrl))
    }
    return
  }

  if (!isSignedIn && !isPublicRoute) {
    let callbackUrl = nextUrl.pathname
    if (nextUrl.search) {
      callbackUrl += nextUrl.search
    }

    const encodedCallbackUrl = encodeURIComponent(callbackUrl)
    return Response.redirect(new URL(`/signin?callbackUrl=${encodedCallbackUrl}`, nextUrl))
  }

  return
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)'
  ]
}
