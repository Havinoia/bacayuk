"use server";

import { db } from "@/db";
import { savedStories } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export async function toggleBookmark(storyId: number) {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session?.user) {
    throw new Error("Anda harus masuk untuk menyimpan cerita.");
  }

  const userId = session.user.id;

  const existing = await db.query.savedStories.findFirst({
    where: and(
      eq(savedStories.userId, userId),
      eq(savedStories.storyId, storyId)
    )
  });

  if (existing) {
    await db.delete(savedStories).where(eq(savedStories.id, existing.id));
  } else {
    await db.insert(savedStories).values({
      userId,
      storyId,
    });
  }

  revalidatePath("/dashboard/collections");
  revalidatePath("/dashboard");
  return { success: true, isSaved: !existing };
}

export async function getUserBookmarks() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session?.user) return [];

  const bookmarks = await db.query.savedStories.findMany({
    where: eq(savedStories.userId, session.user.id)
  });

  return bookmarks.map(b => b.storyId);
}
