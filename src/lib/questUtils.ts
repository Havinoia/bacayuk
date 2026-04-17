import { db } from "@/db";
import { quests, userQuests, heroes } from "@/db/schema";
import { eq, and, sql, lte, gte } from "drizzle-orm";

/**
 * Checks if a user needs new daily quests and assigns them if so.
 * This should be called on the Dashboard or Quests page.
 */
export async function ensureDailyQuests(userId: string) {
    // 1. Check if user already has quests assigned today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingQuests = await db.query.userQuests.findMany({
        where: and(
            eq(userQuests.userId, userId),
            gte(userQuests.assignedAt, today)
        ),
        with: {
            quest: true
        }
    });

    // If they have quests from today, we are done
    if (existingQuests.length > 0) return existingQuests;

    // 2. Clear old daily quests if any (prevents clutter)
    // We only delete 'isDaily' quests that were assigned before today
    const oldDailyQuests = await db.query.userQuests.findMany({
        where: and(
            eq(userQuests.userId, userId),
            lte(userQuests.assignedAt, today)
        ),
        with: {
            quest: true
        }
    });

    const idsToDelete = oldDailyQuests
        .filter(uq => uq.quest?.isDaily)
        .map(uq => uq.id);

    if (idsToDelete.length > 0) {
        // Simple loop to delete as drizzle might not support 'in' easily for every dialect in this setup
        for (const id of idsToDelete) {
            await db.delete(userQuests).where(eq(userQuests.id, id));
        }
    }

    // 3. Fetch pool of daily quests
    const dailyPool = await db.query.quests.findMany({
        where: eq(quests.isDaily, true)
    });

    if (dailyPool.length === 0) return [];

    // 4. Randomly pick 3 (or less if pool is small)
    const shuffled = [...dailyPool].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 3);

    // 5. Assign to user
    const newAssignments = [];
    for (const q of selected) {
        const [assigned] = await db.insert(userQuests).values({
            userId,
            questId: q.id,
            assignedAt: new Date(),
            currentValue: 0,
            isCompleted: false,
        }).returning();
        
        // Add the quest details for the return value
        newAssignments.push({ ...assigned, quest: q });
    }

    return newAssignments;
}

/**
 * Updates quest progress and awards points if completed.
 */
export async function updateQuestProgress(userId: string, type: string, amount: number = 1) {
    const activeQuests = await db.query.userQuests.findMany({
        where: and(
            eq(userQuests.userId, userId),
            eq(userQuests.isCompleted, false)
        ),
        with: {
            quest: true
        }
    });

    const relevantQuests = activeQuests.filter(uq => uq.quest?.type === type);

    for (const uq of relevantQuests) {
        if (!uq.quest) continue;

        const newValue = uq.currentValue + amount;
        const isNowCompleted = newValue >= uq.quest.targetValue;

        await db.update(userQuests)
            .set({ 
                currentValue: Math.min(newValue, uq.quest.targetValue),
                isCompleted: isNowCompleted,
                completedAt: isNowCompleted ? new Date() : null,
                lastUpdated: new Date()
            })
            .where(eq(userQuests.id, uq.id));

        if (isNowCompleted) {
            // Award Points and XP to Hero
            const hero = await db.query.heroes.findFirst({
                where: eq(heroes.userId, userId)
            });

            if (hero) {
                await db.update(heroes)
                    .set({
                        points: hero.points + uq.quest.pointsReward,
                        xp: hero.xp + uq.quest.xpReward,
                        updatedAt: new Date()
                    })
                    .where(eq(heroes.userId, userId));
            } else {
                // If hero doesn't exist, create one
                await db.insert(heroes).values({
                    userId,
                    points: uq.quest.pointsReward,
                    xp: uq.quest.xpReward,
                });
            }
        }
    }
}
