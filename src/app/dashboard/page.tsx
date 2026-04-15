import { auth } from "@/lib/auth";
import { db } from "@/db";
import { heroes, stories, readingProgress, userQuests } from "@/db/schema";
import { eq, desc, count } from "drizzle-orm";
import { headers } from "next/headers";
import { Clock, Trophy, Target, ChevronRight, Plus } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { MasonryGrid } from "@/components/MasonryGrid";
import { StoryPin } from "@/components/StoryPin";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session?.user) {
    redirect("/auth/login");
  }

  const userName = session.user.name || "Pahlawan";

  // Get Hero current role and stats
  const currentHero = await db.query.heroes.findFirst({
    where: eq(heroes.userId, session.user.id)
  });

  // Calculate Reading Progress
  const [totalStoriesResult] = await db.select({ value: count() }).from(stories);
  const totalStories = Number(totalStoriesResult.value);

  const [completedStoriesResult] = await db.select({ value: count() })
    .from(readingProgress)
    .where(eq(readingProgress.userId, session.user.id));
  const completedCount = Number(completedStoriesResult.value);

  // Fetch all stories for the masonry grid
  const allStories = await db.query.stories.findMany({
    with: { category: true },
    orderBy: [desc(stories.createdAt)],
    limit: 20
  });

  // Fetch Daily Quests
  const userActiveQuests = await db.query.userQuests.findMany({
      where: eq(userQuests.userId, session.user.id),
      with: { quest: true },
      limit: 3
  });

  return (
    <div className="min-h-screen bg-white pb-20">
      
      {/* 1. Pinterest Display Hero */}
      <section className="px-6 py-10 md:py-20 max-w-7xl mx-auto text-center space-y-8 animate-pin-enter">
          <div className="inline-flex px-4 py-1.5 rounded-full bg-[var(--base-color-warm-wash)] text-[12px] font-black tracking-[0.2em] text-[var(--base-color-olive-gray)] uppercase">
            Selamat Datang, {userName.split(' ')[0]}
          </div>
          
          <h1 className="text-4xl md:text-7xl font-black font-header text-[var(--base-color-plum-black)] leading-[0.9] tracking-tighter">
             Temukan <span className="text-[var(--base-color-pinterest-red)]">Inspirasi Cerita</span> <br className="hidden md:block" />
             Ajaib Setiap Hari.
          </h1>

          <p className="text-lg text-[var(--base-color-olive-gray)] max-w-xl mx-auto">
             Kamu sudah membaca {completedCount} dari {totalStories} cerita. Ayo lanjutkan petualanganmu!
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link href="/dashboard/collections" className="btn-pin-primary py-4 px-8 text-white text-lg shadow-xl shadow-red-500/20">
                 Mulai Membaca Sekarang
              </Link>
              <Link href="/dashboard/quests" className="btn-pin-secondary py-4 px-8 text-black text-lg">
                 Lihat Misi Harian
              </Link>
          </div>
      </section>

      {/* 2. Main Content Layout */}
      <div className="px-4 md:px-10 max-w-[2000px] mx-auto flex flex-col lg:flex-row gap-10">
          
          {/* Left Column: Pinterest Grid */}
          <div className="flex-1 space-y-8">
              <div className="flex items-center justify-between border-b border-black/5 pb-4">
                  <h2 className="text-2xl font-black text-[var(--base-color-plum-black)] italic tracking-tight">Jelajahi Dunia Cerita</h2>
                  <Link href="/dashboard/collections" className="text-[12px] font-bold text-[var(--base-color-pinterest-red)] hover:underline flex items-center gap-1">
                      Lihat Semua <ChevronRight size={14} />
                  </Link>
              </div>

              <MasonryGrid>
                  {allStories.length === 0 && (
                      <div className="break-inside-avoid mb-8 col-span-full text-center py-20">
                          <p className="text-[var(--base-color-olive-gray)] font-bold">Belum ada cerita tersedia. Tambahkan cerita melalui database.</p>
                      </div>
                  )}

                  {allStories.map((story) => (
                      <StoryPin 
                        key={story.id} 
                        id={story.id}
                        title={story.title}
                        slug={story.slug}
                        thumbnailUrl={story.thumbnailUrl || ""}
                        author={undefined}
                        category={story.category || { name: "Cerita" }}
                      />
                  ))}
              </MasonryGrid>
          </div>

          {/* Right Column: Profile & Quests */}
          <div className="w-full lg:w-80 shrink-0 lg:sticky lg:top-24 h-fit space-y-10">
              {/* Misi Harian */}
              <section className="space-y-6">
                  <h3 className="text-lg font-bold text-[var(--base-color-plum-black)] flex items-center gap-2">
                       Misi Aktif <Trophy size={18} className="text-amber-500" />
                  </h3>
                  <div className="space-y-3">
                      {userActiveQuests.length === 0 && (
                          <div className="p-8 text-center bg-[var(--base-color-sand-gray)] rounded-[20px]">
                              <p className="text-sm font-bold text-[var(--base-color-olive-gray)]">Belum ada misi aktif</p>
                          </div>
                      )}
                      {userActiveQuests.map((uq) => {
                          if (!uq.quest) return null;
                          return (
                              <Link key={uq.id} href="/dashboard/quests">
                                  <div className="bg-white p-4 rounded-[20px] flex items-center gap-4 border border-black/5 hover:bg-[var(--base-color-sand-gray)] transition-all group mb-3">
                                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${uq.isCompleted ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                                          {uq.quest.type === 'READING' ? <Clock size={20} /> : <Target size={20} />}
                                      </div>
                                      <div className="flex-1 overflow-hidden">
                                          <h5 className="font-bold text-[13px] text-[var(--base-color-plum-black)] line-clamp-1">{uq.quest.title}</h5>
                                          <p className="text-[10px] font-medium text-[var(--base-color-olive-gray)] uppercase">+{uq.quest.xpReward} XP</p>
                                      </div>
                                      <ChevronRight size={16} className="text-[var(--base-color-olive-gray)] opacity-0 group-hover:opacity-100 transition-opacity" />
                                  </div>
                              </Link>
                          );
                      })}
                  </div>
                  <Link href="/dashboard/quests" className="block text-center text-[12px] font-bold text-[var(--base-color-pinterest-red)] hover:underline">
                      Lihat Semua Misi →
                  </Link>
              </section>
          </div>
      </div>
    </div>
  );
}
