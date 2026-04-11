"use server";

import { db } from "@/db";
import { readingProgress } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function toggleStoryCompletion(userId: string, storyId: number) {
    if (!userId) throw new Error("User not authenticated");

    // Check if progress already exists
    const existing = await db.query.readingProgress.findFirst({
        where: and(
            eq(readingProgress.userId, userId),
            eq(readingProgress.storyId, storyId)
        )
    });

    if (existing) {
        // Delete if already exists (toggle off)
        await db.delete(readingProgress).where(
            and(
                eq(readingProgress.userId, userId),
                eq(readingProgress.storyId, storyId)
            )
        );
    } else {
        // Insert new progress
        await db.insert(readingProgress).values({
            userId,
            storyId
        });
    }

    // Revalidate paths to update UI
    revalidatePath("/dashboard");
    revalidatePath(`/story/[slug]`, "page");
}
