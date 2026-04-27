import { auth } from "@/lib/auth";
import { db } from "@/db";
import { heroes, stories, readingProgress, userQuests, storyPins } from "@/db/schema";
import { eq, desc, count } from "drizzle-orm";
import { headers } from "next/headers";
import { Clock, Trophy, Target, ChevronRight, Plus, Star, Check } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { MasonryGrid } from "@/components/MasonryGrid";
import { StoryPin } from "@/components/StoryPin";
import { ensureDailyQuests } from "@/lib/questUtils";
import { getUserBookmarks } from "@/lib/actions/bookmarkActions";
import { QuestCountdown } from "@/components/QuestCountdown";

import { DashboardClient } from "@/components/DashboardClient";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session?.user) {
    redirect("/auth/login");
  }

  const userName = session.user.name || "Teman";

  // Calculate Reading Progress
  const [totalStoriesResult] = await db.select({ value: count() }).from(stories);
  const totalStories = Number(totalStoriesResult.value);

  const [completedStoriesResult] = await db.select({ value: count() })
    .from(readingProgress)
    .where(eq(readingProgress.userId, session.user.id));
  const completedCount = Number(completedStoriesResult.value);

  // Fetch popular stories for the masonry grid
  const allStories = await db.query.stories.findMany({
    with: { category: true },
    orderBy: [desc(stories.createdAt)],
    limit: 4
  });

  // Fetch Daily Quests (Ensure they are reset if it's a new day)
  const userActiveQuests = await ensureDailyQuests(session.user.id);

  // Fetch bookmarks
  const bookmarkIds = await getUserBookmarks();

  // Fetch Hero Details (For points display)
  const hero = await db.query.heroes.findFirst({
      where: eq(heroes.userId, session.user.id)
  });

  return (
    <DashboardClient 
      userName={userName.split(' ')[0]}
      userImage={session.user.image}
      completedCount={completedCount}
      totalStories={totalStories}
      allStories={allStories}
      userActiveQuests={userActiveQuests}
      heroPoints={hero?.points || 0}
      bookmarkIds={bookmarkIds}
    />
  );
}
