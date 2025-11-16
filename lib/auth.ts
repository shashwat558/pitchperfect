
import {betterAuth} from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "./generated/prisma";
import { nextCookies } from "better-auth/next-js";

const prisma = new PrismaClient();

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "sqlite"
    }),
    emailAndPassword: {
        enabled: true
    },
    socialProviders: {
        google: {
           prompt: "select_account consent",
           accessType: "offline",
           clientId: process.env.GOOGLE_CLIENT_ID!,
           clientSecret: process.env.GOOGLE_CLIENT_SECRET!
        }
    },
    session: {
        expiresIn: 60 * 60 * 24 * 7
    },
    plugins: [nextCookies()],
    advanced: {
        cookiePrefix: 'pitchPerfect'
    }


})

type Session = typeof auth.$Infer.Session;