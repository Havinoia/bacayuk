import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg", // Use "pg" for PostgreSQL
    }),
    emailAndPassword: {
        enabled: true,
    },
    session: {
        expiresIn: 30 * 60, // 30 minutes
        updateAge: 5 * 60,  // refresh every 5 minutes if active
    },
});
