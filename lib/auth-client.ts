import { createAuthClient } from "better-auth/client";
export const authClient = createAuthClient({
    baseURL: "http://localhost:3000"
});

export type Session = typeof authClient.$Infer.Session

export const signIn = async () => {
    const data = await authClient.signIn.social({
        provider: "google"
    })
    console.log(data)
}
