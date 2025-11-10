import { PrismaClient } from "@prisma/client";
import {betterAuth} from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

const prisma = new PrismaClient();

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql"
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
    }


})