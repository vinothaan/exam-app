import { auth } from "@/auth"

export default auth((req) => {
    const isLoggedIn = !!req.auth
    const isAuthPage = req.nextUrl.pathname.startsWith('/auth')
    const isDashboard = req.nextUrl.pathname.startsWith('/dashboard')

    if (isDashboard && !isLoggedIn) {
        return Response.redirect(new URL('/auth/login', req.nextUrl))
    }

    if (isAuthPage && isLoggedIn) {
        return Response.redirect(new URL('/dashboard', req.nextUrl))
    }
})

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
