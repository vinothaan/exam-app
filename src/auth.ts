import NextAuth from "next-auth"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { db } from "./db"
import Credentials from "next-auth/providers/credentials"
import { users } from "./db/schema"
import { eq } from "drizzle-orm"
import bcrypt from "bcryptjs"

export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: DrizzleAdapter(db) as any,
    secret: process.env.AUTH_SECRET || "7f37475355609f783267598c25576082467598c25576082467598c255760824", // Fallback for dev if env fails
    providers: [
        Credentials({
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            authorize: async (credentials) => {
                if (!credentials?.email || !credentials?.password) {
                    return null
                }

                const email = credentials.email as string;
                const password = credentials.password as string;

                const user = await db.query.users.findFirst({
                    where: eq(users.email, email),
                });

                if (!user || !user.password) {
                    return null
                }

                const passwordsMatch = await bcrypt.compare(
                    password,
                    user.password
                )

                if (!passwordsMatch) {
                    return null
                }

                return user
            },
        }),
    ],
    session: {
        strategy: "jwt",
    },
    callbacks: {
        jwt({ token, user }) {
            if (user) {
                token.role = user.role
                token.id = user.id || ""
            }
            return token
        },
        session({ session, token }) {
            if (session.user && token.role) {
                session.user.role = token.role;
                session.user.id = token.id;
            }
            return session
        },
    },
    pages: {
        signIn: "/auth/login",
    },
})
