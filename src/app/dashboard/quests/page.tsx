import { auth } from "@/lib/auth";
import { db } from "@/db";
import { quests, userQuests, heroes } from "@/db/schema";
import { eq, and, sql } from "drizzle-orm";
import { headers } from "next/headers";
import { Trophy, Star, Target, Clock, ChevronRight, Zap, Shield, Sword, Heart } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function QuestsPage() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session?.user) {
    redirect("/auth/login");
  }

  // Get Hero current role and stats
  const currentHero = await db.query.heroes.findFirst({
    where: eq(heroes.userId, session.user.id)
  });

  // Fetch all daily quests
  const allDailyQuests = await db.query.quests.findMany({
    where: eq(quests.isDaily, true)
  });

  // Ensure user has userQuests entries for today
  // In a real app, you'd check last_updated to reset progress daily
  // For this demo, we'll just ensure they exist
  for (const quest of allDailyQuests) {
    const existing = await db.query.userQuests.findFirst({
      where: and(
        eq(userQuests.userId, session.user.id),
        eq(userQuests.questId, quest.id)
      )
    });

    if (!existing) {
      await db.insert(userQuests).values({
        userId: session.user.id,
        questId: quest.id,
        currentValue: 0,
        isCompleted: false,
      });
    }
  }

  // Fetch user quests with quest details
  const userQuestsWithDetails = await db.query.userQuests.findMany({
    where: eq(userQuests.userId, session.user.id),
    with: {
      quest: true
    }
  });

  const HERO_THEMES: Record<string, any> = {
    dwarf: { image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDOTiGvsaEbGL427buSXNpEA9JbnClZ_qsV9qfSA0qXzexiP4QV_NwxXiNIKjNlHzxH9FQO5BhNA8OKuo4OnpuEeSMOie04AcG6sxqb1sMU0ySehc6vSrEtAebhVwcrWM7vdNnr37AX0NkiRYSRkTtdGkElWe8bQQvecucsuTvjwuIY3jet5eEZs34_frpf_SUuY4JNeQ-XiNOVZXtQWbA9bK-IxH5zojeFNwg5Zy7eGNlGTDxmQVN63Zaf9i3SUs1HLtGflWqcHeU" },
    peri: { image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA_2wEC4pie8U99I9YqZUNz54P2AX-Dk310IDLspiMmji83Ww9wOhpyx7smTwPSbZjXy2xYNmBe3sW9LlYsDSNoZ-UzfKRXO-dWxy2-m7J-7YREUPPudZHvZCvyX1hQlQtEtosfAB88hVGr1MSmPJXvRtQrx0fQDVe7NhBNeZznFZM-yYMzVxwmPBupRwdZR9XaiUz6IKwv0cWb5-VQucXvmg3S6Xn3RASuHTHVaR4tBZPQmEx8ULGuK2YEPMeuspiiTf-XE1kSE6Q" },
    kesatria: { image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD570WHrUNGLcNAjCuHVJXYCkaQo942CuDUvnNMXbtlrF7GppkdK60DQACodJqIAPATloj8laT0PiQ0700qDepnWQey6DJvRfgluVA1qQXHDizBj8wkZ10upf9DVZMv3lc-zVSjRL62zQSSAW9oqgQHB1VtaDE-nqOLJzH_mP5ma-EoUoVhEVJUdI95P2SdqUxmKa5XgDXVG8zbHVmzYKaxsSRH2SaGCVb607nTuFQqXb1ZmKF6KSZttrlKJlghl4KcurCbX7bnf0E" },
    penyihir: { image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBYWl3Gl4JWe4RgRQXQ_UJ-2St-XgDlTyfOv8_sAvTSKmip0mzJPoD0CfLbP-3OOCQc-n6vFthpcRr2tzKJUykFncreYpT854kiA9jXYLeGxbjoXZzOPNhffE5NaoWwa3zLx2iq_3kVuQJM5m13ZCO_fD0hd-DJH4B6Nf6pJdQVvKtoaRVSXUTa1cKX6vXABCCDM-5ImX3gxC7r5_QeXcl0S_WroNPWbckI3kfg87UpB2OivP0XI3p8LZSgjUK_JhOka3bNKr8Dz-Q" },
    pemanah: { image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCrHvuYdj3bT-78w-oQdPKb1ecnppXOS5KO_JGBDl1C4sdt9zjkRn-6wLcIoLUox55m8NQ3zn_2wB1IMs_l3dhXxenZjekCD7-dKTvra2m3_-N-JURvuDzTDWisgxJ4hULK9KNFklMczPOE_xn3V4SgFTUjjdPavjZlnKq5wuuX2x6yFzq4P-sgOwvebgX-3DymUZtSSh-HQhUViRm2D9wZJ30Plv-8BPMoE8uvUPIq6y-xUxthPLI6Hl_ddTeCSLhzAoKUobnXU2g" },
    default: { image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDHODyCsHDlMDx2PbC4I7Yq8QNtdF2Stxl4uTaJKMovT4hp66dy6or_S2W-qlHho79olQ4EjHtxzXPLigswodaZ-dpBJhAawqej-ABRvCtr89pnrDKhPuA1C3KHJDyaHHQ2LcgD5Okdspysp283KhVaGieHARpZUmHJi4GwEPrj0CrgHORt7RBaeyfoGSwL_UO_kkkBw3KLwN20jliMdWvDA0hKFrcxjsf6zScfolDG4UPLTgwk0hmG83ROkgSikAkjzRoHJ0zuKDE" }
  };

  const activeTheme = (currentHero?.role && HERO_THEMES[currentHero.role.toLowerCase()]) 
    ? HERO_THEMES[currentHero.role.toLowerCase()] 
    : HERO_THEMES.default;

  return (
    <div className="p-6 md:p-10 space-y-12 relative animate-in fade-in duration-700">
      {/* Background Magic Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(16,185,129,0.05),_transparent_70%)]"></div>
        <div className="absolute top-0 left-0 w-full h-full magic-texture opacity-30"></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto space-y-10">
        {/* Header Section */}
        <section className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-black/5 pb-10">
            <div className="space-y-4 text-center md:text-left">
                <div className="inline-flex px-4 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-black tracking-[0.2em] uppercase border border-primary/20">
                    KEDAIN QUEST HARIAN
                </div>
                <h1 className="text-5xl md:text-7xl font-black font-header tracking-tight">Misi Petualang</h1>
                <p className="text-lg text-foreground/40 font-bold max-w-md">
                    Selesaikan tantangan harian untuk mendapatkan XP dan meningkatkan level pahlawanmu!
                </p>
            </div>
            <div className="flex gap-4">
                <div className="glass-panel px-6 py-4 rounded-3xl border border-white/60 shadow-xl text-center min-w-[120px]">
                    <span className="text-[10px] font-black text-foreground/40 uppercase block mb-1">XP Saya</span>
                    <span className="text-3xl font-black text-primary">{currentHero?.xp || 0}</span>
                </div>
                <div className="glass-panel px-6 py-4 rounded-3xl border border-white/60 shadow-xl text-center min-w-[120px] bg-yellow-50/50">
                    <span className="text-[10px] font-black text-amber-600 uppercase block mb-1">Level</span>
                    <span className="text-3xl font-black text-amber-600">{currentHero?.level || 1}</span>
                </div>
            </div>
        </section>

        {/* Quests Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {userQuestsWithDetails.map((uq) => {
                const quest = uq.quest;
                const progress = Math.min((uq.currentValue / quest.targetValue) * 100, 100);
                const isCompleted = uq.isCompleted;

                return (
                    <div key={uq.id} className={`glass-panel p-8 rounded-[2.5rem] border border-white/60 shadow-2xl transition-all hover:scale-[1.02] group relative overflow-hidden ${isCompleted ? 'bg-emerald-50/30 border-emerald-200' : ''}`}>
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
                                    <h3 className="text-2xl font-black font-header">{quest.title}</h3>
                                    <p className="text-sm font-bold text-foreground/40">{quest.description}</p>
                                </div>
                                
                                <div className="space-y-2">
                                    <div className="flex justify-between items-end">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-foreground/30">Progres Misi</span>
                                        <span className={`text-sm font-black ${isCompleted ? 'text-emerald-500' : 'text-primary'}`}>
                                            {uq.currentValue} / {quest.targetValue}
                                        </span>
                                    </div>
                                    <div className="h-4 bg-muted rounded-full overflow-hidden border border-black/5 p-1 shadow-inner">
                                        <div 
                                            className={`h-full rounded-full transition-all duration-1000 relative ${isCompleted ? 'bg-emerald-500' : 'bg-primary'}`}
                                            style={{ width: `${progress}%` }}
                                        >
                                            <div className="absolute inset-0 shimmer opacity-30" />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-4">
                                    <div className="flex items-center gap-2">
                                        <Star size={18} className="text-amber-500 fill-amber-500" />
                                        <span className="text-sm font-black text-amber-600">+{quest.xpReward} XP</span>
                                    </div>
                                    <Link 
                                        href={quest.type === 'READING' ? "/dashboard/collections" : "/dashboard"}
                                        className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${
                                            isCompleted 
                                            ? 'bg-emerald-500/10 text-emerald-600 cursor-default' 
                                            : 'bg-primary text-white shadow-lg shadow-primary/20 hover:scale-105 active:scale-95'
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

        {/* Hero Character Status Recap */}
        <section className="glass-panel p-10 rounded-[3rem] border border-white/60 shadow-2xl magical-glow relative overflow-hidden">
            <div className="absolute -right-20 -bottom-20 opacity-5 rotate-12">
                 <Shield size={300} strokeWidth={1} />
            </div>
            
            <div className="flex flex-col md:flex-row items-center gap-12 relative z-10">
                <div className="relative group">
                    <div className="w-40 h-40 rounded-[2.5rem] border-8 border-primary/20 p-2 shadow-inner bg-white/50 overflow-hidden">
                        <img 
                            src={activeTheme.image} 
                            alt="Hero Avatar" 
                            className="w-full h-full object-cover rounded-[2rem] shadow-xl transform group-hover:scale-110 transition-transform duration-700"
                        />
                    </div>
                    <div className="absolute -bottom-4 -right-4 bg-yellow-400 text-amber-900 px-5 py-2 rounded-2xl text-sm font-black shadow-xl border-4 border-white">
                        LV. {currentHero?.level || 1}
                    </div>
                </div>

                <div className="flex-1 space-y-6 w-full">
                    <div className="text-center md:text-left">
                        <h2 className="text-3xl font-black font-header">{session.user.name}</h2>
                        <p className="text-primary font-black uppercase tracking-widest text-xs italic">
                            The Brave {currentHero?.role || "Apprentice"}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[
                            { label: "HP", icon: Heart, color: "text-red-500", bg: "bg-red-500" },
                            { label: "ATK", icon: Sword, color: "text-blue-500", bg: "bg-blue-500" },
                            { label: "DEF", icon: Shield, color: "text-emerald-500", bg: "bg-emerald-500" },
                            { label: "SPD", icon: Zap, color: "text-amber-500", bg: "bg-amber-500" },
                        ].map((stat) => (
                            <div key={stat.label} className="space-y-2">
                                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-foreground/40">
                                    <stat.icon size={12} className={stat.color} /> {stat.label}
                                </div>
                                <div className="h-2 bg-muted rounded-full overflow-hidden border border-black/5 shadow-inner p-0.5">
                                    <div className={`h-full ${stat.bg} rounded-full w-1/2 opacity-80`} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
      </div>
    </div>
  );
}
