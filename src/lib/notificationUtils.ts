"use server";

import { db } from "@/db";
import { notifications, storyPins, stories } from "@/db/schema";
import { eq, and, desc, gte, lt } from "drizzle-orm";

/**
 * Generates inactivity reminders if the user hasn't continued a story for 5+ hours.
 * Call this on the Dashboard or Layout load.
 */
export async function generateInactivityReminders(userId: string) {
    // 1. Get the latest pin for each story the user has read
    const userPins = await db.query.storyPins.findMany({
        where: eq(storyPins.userId, userId),
        with: {
            story: true
        },
        orderBy: [desc(storyPins.updatedAt)]
    });

    const now = new Date();
    const FIVE_HOURS_MS = 5 * 60 * 60 * 1000;

    for (const pin of userPins) {
        if (!pin.story) continue;

        const timeSinceActivity = now.getTime() - pin.updatedAt.getTime();

        if (timeSinceActivity > FIVE_HOURS_MS) {
            // Check if we already sent a reminder for THIS story in the last 24 hours
            const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
            
            const existingNotification = await db.query.notifications.findFirst({
                where: and(
                    eq(notifications.userId, userId),
                    eq(notifications.type, "REMINDER"),
                    eq(notifications.link, `/dashboard/story/${pin.story.slug}?p=${pin.pageNumber}`),
                    gte(notifications.createdAt, yesterday)
                )
            });

            if (!existingNotification) {
                await db.insert(notifications).values({
                    userId,
                    title: "Lanjutkan Petualanganmu! ✨",
                    message: `Sudah lebih dari 5 jam sejak kamu membaca "${pin.story.title}". Ayo baca lagi!`,
                    type: "REMINDER",
                    link: `/dashboard/story/${pin.story.slug}?p=${pin.pageNumber}`,
                });
            }
        }
    }
}

/**
 * Fetches recent notifications for a user.
 */
export async function getNotifications(userId: string, limit = 10) {
    return await db.query.notifications.findMany({
        where: eq(notifications.userId, userId),
        orderBy: [desc(notifications.createdAt)],
        limit
    });
}

/**
 * Server Action to mark a notification as read.
 */
export async function markAsRead(notificationId: number) {
    await db.update(notifications)
        .set({ isRead: true })
        .where(eq(notifications.id, notificationId));
}

/**
 * Server Action to mark all notifications as read.
 */
export async function markAllAsRead(userId: string) {
    await db.update(notifications)
        .set({ isRead: true })
        .where(eq(notifications.userId, userId));
}
