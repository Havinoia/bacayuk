"use server";

import { db } from "@/db";
import { storyPins, storyPageFavorites } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

/**
 * Updates the pinned page for a user in a story.
 * Only one page can be pinned per user per story.
 */
export async function togglePagePin(userId: string, storyId: number, pageNumber: number) {
    if (!userId) throw new Error("User not authenticated");

    // Find existing pin
    const existing = await db.query.storyPins.findFirst({
        where: and(
            eq(storyPins.userId, userId),
            eq(storyPins.storyId, storyId)
        )
    });

    if (existing) {
        if (existing.pageNumber === pageNumber) {
            // Toggle off if clicking the same page
            await db.delete(storyPins).where(eq(storyPins.id, existing.id));
        } else {
            // Update to new page
            await db.update(storyPins)
                .set({ pageNumber, updatedAt: new Date() })
                .where(eq(storyPins.id, existing.id));
        }
    } else {
        // Create new pin
        await db.insert(storyPins).values({
            userId,
            storyId,
            pageNumber
        });
    }

    revalidatePath(`/story/[slug]`, "page");
    return { success: true };
}

/**
 * Toggles a page as favorite for a user.
 * Multiple pages can be favorited per story.
 */
export async function togglePageFavorite(userId: string, storyId: number, pageNumber: number) {
    if (!userId) throw new Error("User not authenticated");

    // Check if already favorited
    const existing = await db.query.storyPageFavorites.findFirst({
        where: and(
            eq(storyPageFavorites.userId, userId),
            eq(storyPageFavorites.storyId, storyId),
            eq(storyPageFavorites.pageNumber, pageNumber)
        )
    });

    if (existing) {
        // Remove favorite
        await db.delete(storyPageFavorites).where(eq(storyPageFavorites.id, existing.id));
    } else {
        // Add favorite
        await db.insert(storyPageFavorites).values({
            userId,
            storyId,
            pageNumber
        });
    }

    revalidatePath(`/story/[slug]`, "page");
    return { success: true };
}
