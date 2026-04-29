"use server";

import { db } from "@/db";
import { user, heroes } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function updateProfile(userId: string, data: { name?: string; image?: string }) {
    if (!userId) {
        return { success: false, error: "ID Pengguna tidak ditemukan" };
    }

    try {
        // Update user table
        if (data.name !== undefined || data.image !== undefined) {
            const userUpdate: { name?: string; image?: string; updatedAt?: Date } = {};
            if (data.name) userUpdate.name = data.name;
            if (data.image !== undefined) userUpdate.image = data.image;
            userUpdate.updatedAt = new Date();

            await db.update(user)
                .set(userUpdate)
                .where(eq(user.id, userId));
        }


        revalidatePath("/dashboard/profile");
        revalidatePath("/dashboard");
        return { success: true };
    } catch (error) {
        console.error("Failed to update profile:", error);
        return { success: false, error: "Gagal memperbarui profil" };
    }
}
