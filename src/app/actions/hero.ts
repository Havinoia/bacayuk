"use server";

import { db } from "@/db";
import { heroes } from "@/db/schema";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export async function updateHeroRole(role: string) {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session?.user) {
        return { error: "Kamu harus login dulu ya!" };
    }

    try {
        // UPSERT: Create if not exists, update if exists
        await db.insert(heroes)
            .values({ 
                userId: session.user.id, 
                role 
            })
            .onConflictDoUpdate({
                target: heroes.userId,
                set: { role, updatedAt: new Date() }
            });

        revalidatePath("/dashboard");
        return { success: true };
    } catch (error) {
        console.error("Gagal ganti role:", error);
        return { error: "Aduh, ada gangguan sihir. Coba lagi nanti ya!" };
    }
}
