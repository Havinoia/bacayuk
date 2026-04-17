import { auth } from "@/lib/auth";
import { db } from "@/db";
import { quests, userQuests, heroes } from "@/db/schema";
import { eq, and, sql } from "drizzle-orm";
import { headers } from "next/headers";
import { Trophy, Star, Target, Clock, ChevronRight, Zap, Shield, Sword, Heart } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ensureDailyQuests } from "@/lib/questUtils";
import { QuestCountdown } from "@/components/QuestCountdown";

export default async function QuestsPage() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session?.user) {
    redirect("/auth/login");
  }

  // Fetch Daily Quests (Ensures reset logic is applied)
  const userQuestsWithDetails = await ensureDailyQuests(session.user.id);

  // Fetch Hero for stats display
  const hero = await db.query.heroes.findFirst({
      where: eq(heroes.userId, session.user.id)
  });

  return (
    <div className="p-6 md:p-10 space-y-12 relative animate-in fade-in duration-700">
      {/* Background Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(var(--base-color-pinterest-red),0.02),_transparent_70%)]"></div>
        <div className="absolute top-0 left-0 w-full h-full magic-texture opacity-20"></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto space-y-10">
        {/* Header Section */}
        <section className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-black/5 pb-10">
            <div className="space-y-4 text-center md:text-left">
                <div className="inline-flex px-4 py-1.5 rounded-full bg-slate-100 text-slate-500 text-[10px] font-black tracking-[0.2em] uppercase border border-slate-200">
                    Tantangan Harian
                </div>
                <h1 className="text-5xl md:text-7xl font-black font-header tracking-tight text-[var(--base-color-plum-black)]">Misi Harian</h1>
                <div className="flex flex-col gap-3">
                    <p className="text-lg text-[var(--base-color-olive-gray)] font-bold max-w-md">
                        Selesaikan tantangan membaca harian untuk melengkapi koleksi pencapaianmu!
                    </p>
                    <QuestCountdown />
                </div>
            </div>
            <div className="flex gap-4">
                <div className="bg-white px-6 py-4 rounded-3xl border border-black/5 shadow-xl text-center min-w-[140px]">
                    <span className="text-[10px] font-black text-[var(--base-color-olive-gray)] uppercase block mb-1">Poin Aktivitas</span>
                    <span className="text-3xl font-black text-[var(--base-color-pinterest-red)]">
                        {hero?.points || 0}
                    </span>
                </div>
                <div className="bg-white px-6 py-4 rounded-3xl border border-black/5 shadow-xl text-center min-w-[140px]">
                    <span className="text-[10px] font-black text-[var(--base-color-olive-gray)] uppercase block mb-1">Misi Selesai</span>
                    <span className="text-3xl font-black text-emerald-500">
                        {userQuestsWithDetails.filter(uq => uq.isCompleted).length}
                    </span>
                </div>
            </div>
        </section>

        {/* Quests Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {userQuestsWithDetails.map((uq) => {
                const quest = uq.quest;
                if (!quest) return null;
                const progress = Math.min((uq.currentValue / quest.targetValue) * 100, 100);
                const isCompleted = uq.isCompleted;

                return (
                    <div key={uq.id} className={`bg-white p-8 rounded-[2.5rem] border border-black/5 shadow-2xl transition-all hover:scale-[1.02] group relative overflow-hidden ${isCompleted ? 'bg-emerald-50/30 border-emerald-200' : ''}`}>
                        {isCompleted && (
                            <div className="absolute top-0 right-0 p-4">
                                <div className="bg-emerald-500 text-white p-2 rounded-full shadow-lg">
                                    <Trophy size={20} />
                                </div>
                            </div>
                        )}
                        
                        <div className="flex items-start gap-6 relative z-10">
                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 ${
                                quest.type === 'READING' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'
                            }`}>
                                {quest.type === 'READING' ? <Clock size={32} /> : <Target size={32} />}
                            </div>
                            <div className="flex-1 space-y-4">
                                <div>
                                    <h3 className="text-2xl font-black font-header text-[var(--base-color-plum-black)]">{quest.title}</h3>
                                    <p className="text-sm font-bold text-[var(--base-color-olive-gray)]">{quest.description}</p>
                                </div>
                                
                                <div className="space-y-2">
                                    <div className="flex justify-between items-end">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-[var(--base-color-olive-gray)]/50">Progres Misi</span>
                                        <span className={`text-sm font-black ${isCompleted ? 'text-emerald-500' : 'text-[var(--base-color-pinterest-red)]'}`}>
                                            {uq.currentValue} / {quest.targetValue}
                                        </span>
                                    </div>
                                    <div className="h-4 bg-muted rounded-full overflow-hidden border border-black/5 p-1 shadow-inner">
                                        <div 
                                            className={`h-full rounded-full transition-all duration-1000 relative ${isCompleted ? 'bg-emerald-500' : 'bg-[var(--base-color-pinterest-red)]'}`}
                                            style={{ width: `${progress}%` }}
                                        >
                                            <div className="absolute inset-0 shimmer opacity-30" />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-4">
                                    <div className="flex items-center gap-2">
                                        <Star size={18} className="text-amber-500 fill-amber-500" />
                                        <span className="text-sm font-black text-amber-600">Terima {quest.pointsReward} Poin</span>
                                    </div>
                                    <Link 
                                        href={quest.type === 'READING' ? "/dashboard/collections" : "/dashboard"}
                                        className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${
                                            isCompleted 
                                            ? 'bg-emerald-500/10 text-emerald-600 cursor-default' 
                                            : 'bg-[var(--base-color-pinterest-red)] text-white shadow-lg shadow-red-500/20 hover:scale-105 active:scale-95'
                                        }`}
                                    >
                                        {isCompleted ? 'Selesai!' : 'Kejar Sekarang'}
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
      </div>
    </div>
  );
}
