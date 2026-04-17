import { auth } from "@/lib/auth";
import { db } from "@/db";
import { heroes, stories, readingProgress, userQuests } from "@/db/schema";
import { eq, desc, count } from "drizzle-orm";
import { headers } from "next/headers";
import { Clock, Trophy, Target, ChevronRight, Plus, Star } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { MasonryGrid } from "@/components/MasonryGrid";
import { StoryPin } from "@/components/StoryPin";
import { ensureDailyQuests } from "@/lib/questUtils";
import { QuestCountdown } from "@/components/QuestCountdown";

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

  // Fetch all stories for the masonry grid
  const allStories = await db.query.stories.findMany({
    with: { category: true },
    orderBy: [desc(stories.createdAt)],
    limit: 20
  });

  // Fetch Daily Quests (Ensure they are reset if it's a new day)
  const userActiveQuests = await ensureDailyQuests(session.user.id);

  // Fetch Hero Points for display
  const hero = await db.query.heroes.findFirst({
      where: eq(heroes.userId, session.user.id)
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
             Kamu sudah membaca {completedCount} dari {totalStories} cerita. Ayo teruskan membaca!
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link href="/dashboard/collections" className="btn-pin-primary py-4 px-8 text-white text-lg shadow-xl shadow-red-500/20">
                 Mulai Membaca Sekarang
              </Link>
              <Link href="/dashboard/quests" className="btn-pin-secondary py-4 px-8 text-black text-lg">
                 Misi Harian
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

          {/* Right Column: Quests */}
          <div className="w-full lg:w-80 shrink-0 lg:sticky lg:top-24 h-fit space-y-10">
               {/* Misi Harian */}
              <section className="space-y-6 bg-[var(--base-color-warm-wash)] p-6 rounded-[3rem] border border-black/5 shadow-inner">
                  <div className="space-y-2">
                       <h3 className="text-xl font-black text-[var(--base-color-plum-black)] flex items-center justify-between">
                            Misi Harian <Trophy size={22} className="text-amber-500" />
                       </h3>
                       <QuestCountdown />
                  </div>

                  <div className="bg-white p-5 rounded-[2rem] border border-black/5 flex items-center justify-between shadow-sm">
                      <div className="space-y-0.5">
                          <p className="text-[10px] font-black text-[var(--base-color-olive-gray)] uppercase tracking-widest">Poin Aktivitas</p>
                          <p className="text-2xl font-black text-[var(--base-color-pinterest-red)]">{hero?.points || 0}</p>
                      </div>
                      <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-500 shadow-inner">
                          <Star size={20} className="fill-amber-500" />
                      </div>
                  </div>

                  <div className="space-y-3">
                      {userActiveQuests.length === 0 && (
                          <div className="p-8 text-center bg-white/50 rounded-[20px] border border-dashed border-black/10">
                              <p className="text-sm font-bold text-[var(--base-color-olive-gray)]">Belum ada misi hari ini</p>
                          </div>
                      )}
                      {userActiveQuests.map((uq) => {
                          if (!uq.quest) return null;
                          return (
                              <Link key={uq.id} href="/dashboard/quests">
                                  <div className={`p-5 rounded-[2rem] flex items-center gap-4 border transition-all group mb-3 relative overflow-hidden ${uq.isCompleted ? 'bg-emerald-50 border-emerald-100' : 'bg-white border-black/5 hover:border-[var(--base-color-pinterest-red)]/20 shadow-sm'}`}>
                                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${uq.isCompleted ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-50 text-slate-400'}`}>
                                          {uq.quest.type === 'READING' ? <Clock size={24} /> : <Target size={24} />}
                                      </div>
                                      <div className="flex-1 overflow-hidden">
                                          <h5 className="font-black text-[14px] text-[var(--base-color-plum-black)] line-clamp-1 group-hover:text-[var(--base-color-pinterest-red)] transition-colors">{uq.quest.title}</h5>
                                          <div className="flex items-center gap-1.5 mt-0.5">
                                              <Star size={10} className="text-amber-500 fill-amber-500" />
                                              <p className="text-[10px] font-black text-amber-600 uppercase tracking-tighter">+{uq.quest.pointsReward} POOIN</p>
                                          </div>
                                      </div>
                                      {uq.isCompleted ? (
                                           <div className="bg-emerald-500 text-white p-1 rounded-full">
                                               <ChevronRight size={14} />
                                           </div>
                                      ) : (
                                          <ChevronRight size={16} className="text-[var(--base-color-olive-gray)] opacity-0 group-hover:opacity-100 transition-opacity" />
                                      )}
                                  </div>
                              </Link>
                          );
                      })}
                  </div>
                  <Link href="/dashboard/quests" className="btn-pin-secondary w-full py-3 text-[12px] font-black uppercase tracking-widest text-center">
                      Semua Misi →
                  </Link>
              </section>
          </div>
      </div>
    </div>
  );
}
