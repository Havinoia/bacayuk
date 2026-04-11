import { auth } from "@/lib/auth";
import { db } from "@/db";
import { heroes, stories, categories, readingProgress } from "@/db/schema";
import { eq, desc, count, and } from "drizzle-orm";
import { headers } from "next/headers";
import { Clock, ChevronRight, Star, Shield, Sword, Heart, Zap, Wand2, Target, Trophy, Users } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import RoleSelection from "@/components/RoleSelection";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session?.user) {
    redirect("/auth/login");
  }

  // Get Hero current role
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

  const readingPercentage = totalStories > 0 ? Math.round((completedCount / totalStories) * 100) : 0;

  // Fetch recent stories
  const recentStories = await db.query.stories.findMany({
    with: { category: true },
    orderBy: [desc(stories.createdAt)],
    limit: 6
  });

  // Check which recent stories are completed
  const storyProgressMap: Record<number, boolean> = {};
  if (recentStories.length > 0) {
      const userProgress = await db.query.readingProgress.findMany({
          where: eq(readingProgress.userId, session.user.id)
      });
      userProgress.forEach(p => {
          storyProgressMap[p.storyId] = true;
      });
  }

  const HERO_THEMES: Record<string, any> = {
    dwarf: {
        gradient: "from-orange-400 to-amber-600",
        shadow: "shadow-orange-200",
        badge: "bg-orange-500",
        icon: "⚒️",
        desc: "Ahli tempa yang tangguh! Yuk buat senjata sakti hari ini.",
        stats: { hp: 75, attack: 65, defense: 85, speed: 25 },
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDOTiGvsaEbGL427buSXNpEA9JbnClZ_qsV9qfSA0qXzexiP4QV_NwxXiNIKjNlHzxH9FQO5BhNA8OKuo4OnpuEeSMOie04AcG6sxqb1sMU0ySehc6vSrEtAebhVwcrWM7vdNnr37AX0NkiRYSRkTtdGkElWe8bQQvecucsuTvjwuIY3jet5eEZs34_frpf_SUuY4JNeQ-XiNOVZXtQWbA9bK-IxH5zojeFNwg5Zy7eGNlGTDxmQVN63Zaf9i3SUs1HLtGflWqcHeU"
    },
    peri: {
        gradient: "from-emerald-400 to-teal-600",
        shadow: "shadow-emerald-200",
        badge: "bg-emerald-500",
        icon: "🧚",
        desc: "Pemilik sihir alam yang indah. Siap menjelajah hutan?",
        stats: { hp: 45, attack: 55, defense: 35, speed: 80 },
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA_2wEC4pie8U99I9YqZUNz54P2AX-Dk310IDLspiMmji83Ww9wOhpyx7smTwPSbZjXy2xYNmBe3sW9LlYsDSNoZ-UzfKRXO-dWxy2-m7J-7YREUPPudZHvZCvyX1hQlQtEtosfAB88hVGr1MSmPJXvRtQrx0fQDVe7NhBNeZznFZM-yYMzVxwmPBupRwdZR9XaiUz6IKwv0cWb5-VQucXvmg3S6Xn3RASuHTHVaR4tBZPQmEx8ULGuK2YEPMeuspiiTf-XE1kSE6Q"
    },
    kesatria: {
        gradient: "from-blue-400 to-indigo-600",
        shadow: "shadow-blue-200",
        badge: "bg-blue-500",
        icon: "⚔️",
        desc: "Pahlawan pemberani! Lindungi kerajaan dengan keberanianmu.",
        stats: { hp: 80, attack: 70, defense: 75, speed: 45 },
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD570WHrUNGLcNAjCuHVJXYCkaQo942CuDUvnNMXbtlrF7GppkdK60DQACodJqIAPATloj8laT0PiQ0700qDepnWQey6DJvRfgluVA1qQXHDizBj8wkZ10upf9DVZMv3lc-zVSjRL62zQSSAW9oqgQHB1VtaDE-nqOLJzH_mP5ma-EoUoVhEVJUdI95P2SdqUxmKa5XgDXVG8zbHVmzYKaxsSRH2SaGCVb607nTuFQqXb1ZmKF6KSZttrlKJlghl4KcurCbX7bnf0E"
    },
    penyihir: {
        gradient: "from-purple-400 to-fuchsia-600",
        shadow: "shadow-purple-200",
        badge: "bg-purple-500",
        icon: "🧙‍♂️",
        desc: "Bijaksana dan sakti. Mantra rahasia apa yang akan kita pelajari?",
        stats: { hp: 40, attack: 85, defense: 25, speed: 50 },
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBYWl3Gl4JWe4RgRQXQ_UJ-2St-XgDlTyfOv8_sAvTSKmip0mzJPoD0CfLbP-3OOCQc-n6vFthpcRr2tzKJUykFncreYpT854kiA9jXYLeGxbjoXZzOPNhffE5NaoWwa3zLx2iq_3kVuQJM5m13ZCO_fD0hd-DJH4B6Nf6pJdQVvKtoaRVSXUTa1cKX6vXABCCDM-5ImX3gxC7r5_QeXcl0S_WroNPWbckI3kfg87UpB2OivP0XI3p8LZSgjUK_JhOka3bNKr8Dz-Q"
    },
    pemanah: {
        gradient: "from-rose-400 to-pink-600",
        shadow: "shadow-rose-200",
        badge: "bg-rose-500",
        icon: "🏹",
        desc: "Fokus dan tepat sasaran! Mari kita bidik masa depan yang cerah.",
        stats: { hp: 55, attack: 75, defense: 45, speed: 75 },
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCrHvuYdj3bT-78w-oQdPKb1ecnppXOS5KO_JGBDl1C4sdt9zjkRn-6wLcIoLUox55m8NQ3zn_2wB1IMs_l3dhXxenZjekCD7-dKTvra2m3_-N-JURvuDzTDWisgxJ4hULK9KNFklMczPOE_xn3V4SgFTUjjdPavjZlnKq5wuuX2x6yFzq4P-sgOwvebgX-3DymUZtSSh-HQhUViRm2D9wZJ30Plv-8BPMoE8uvUPIq6y-xUxthPLI6Hl_ddTeCSLhzAoKUobnXU2g"
    },
    default: {
        gradient: "from-primary to-emerald-600",
        shadow: "shadow-primary/20",
        badge: "bg-primary",
        icon: "📜",
        desc: "Petualang cilik! Temukan ribuan cerita seru di perpustakaan ajaib.",
        stats: { hp: 50, attack: 50, defense: 50, speed: 50 },
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDHODyCsHDlMDx2PbC4I7Yq8QNtdF2Stxl4uTaJKMovT4hp66dy6or_S2W-qlHho79olQ4EjHtxzXPLigswodaZ-dpBJhAawqej-ABRvCtr89pnrDKhPuA1C3KHJDyaHHQ2LcgD5Okdspysp283KhVaGieHARpZUmHJi4GwEPrj0CrgHORt7RBaeyfoGSwL_UO_kkkBw3KLwN20jliMdWvDA0hKFrcxjsf6zScfolDG4UPLTgwk0hmG83ROkgSikAkjzRoHJ0zuKDE"
    }
  };

  const activeTheme = (currentHero?.role && HERO_THEMES[currentHero.role.toLowerCase()]) 
    ? HERO_THEMES[currentHero.role.toLowerCase()] 
    : HERO_THEMES.default;

  return (
    <div className="p-6 md:p-10 space-y-12 relative">
      {/* Background Magic Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(16,185,129,0.05),_transparent_70%)]"></div>
        <div className="absolute top-0 left-0 w-full h-full magic-texture opacity-30"></div>
        <img 
          className="w-full h-full object-cover opacity-[0.03] mix-blend-overlay" 
          alt="" 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDitFYMTipcLwQmr291EDkDrke3pazlU6Pysv2PIa7FksNuNPDoROgTgUlxRhgYsiO5KjHt7Z7CW-4SzvpTV7TSeT2qur3WxA36_LrjMwNEXjdkBdv2WtoF2iwaV8yS0wcmrTQOokZXKu5yhyRlBVjSqaI-LfaXnHJAfOO1p7oslAf9J_XBJqmhPz4p7RzIXoM-yhrKVaNnu6UEfmUo9rokLdlFK6UFj7OAQSIfyPWxmZ8KNkPFeG-j5O-5FS9fHr0-R6nlPKWUrW4"
        />
        {[...Array(8)].map((_, i) => (
            <div 
                key={i} 
                className="absolute w-64 h-64 bg-primary/5 blur-[100px] rounded-full" 
                style={{ 
                    top: `${Math.random() * 100}%`, 
                    left: `${Math.random() * 100}%`,
                    animation: `float ${10 + Math.random() * 10}s ease-in-out infinite`
                }} 
            />
        ))}
      </div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Column 1: Welcome & Continue Adventure */}
        <div className="lg:col-span-8 space-y-10">
          {/* Welcome Hero Section */}
          <section className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-primary to-blue-700 p-10 md:p-14 text-white shadow-2xl shadow-primary/20">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[80px] rounded-full -mr-20 -mt-20"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-yellow-400/10 blur-[60px] rounded-full -ml-10 -mb-10"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-12">
              <div className="flex-1 space-y-6 text-center md:text-left">
                <div className="inline-flex px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-[10px] font-black tracking-[0.2em] uppercase border border-white/10">
                  {currentHero?.role?.toUpperCase() || "PAHLAWAN"} RANK: JUNIOR
                </div>
                <h2 className="text-4xl md:text-6xl font-black font-header leading-[1.1] tracking-tight">
                  Halo Pahlawan, <br /> Selamat Datang!
                </h2>
                <p className="text-lg text-white/80 max-w-sm font-bold leading-relaxed">
                  Petualanganmu masih panjang. Ada 3 bab baru yang menunggumu di Hutan Berbisik.
                </p>
                <Link href="/dashboard/collections" className="inline-flex items-center gap-3 px-8 py-4 bg-white text-primary font-black rounded-2xl shadow-xl hover:scale-105 transition-all group">
                   Lanjut Petualangan <ChevronRight className="group-hover:translate-x-2 transition-transform" />
                </Link>
              </div>
              <div className="relative w-48 h-48 md:w-64 md:h-64 flex items-center justify-center shrink-0">
                <div className="absolute inset-0 rounded-full border-[12px] border-white/10"></div>
                <div 
                    className="absolute inset-0 rounded-full border-t-[12px] border-yellow-400" 
                    style={{ 
                        transform: `rotate(${readingPercentage * 3.6}deg)`,
                        transition: 'transform 1s ease-out'
                    }} 
                ></div>
                <div className="text-center">
                  <span className="text-5xl font-black block">{readingPercentage}%</span>
                  <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Goal Minggu Ini</span>
                </div>
              </div>
            </div>
          </section>

          {/* Role Selection Section (Preserved) */}
          <section className="py-4">
              <RoleSelection currentRole={currentHero?.role} />
          </section>

          {/* Continue Adventure Section */}
          <section className="space-y-6">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-3xl font-black font-header text-foreground flex items-center gap-3 italic">
                 Koleksi Terbaru <span className="material-symbols-outlined text-primary text-3xl">auto_stories</span>
              </h3>
              <Link href="/dashboard/collections" className="text-primary font-black text-sm flex items-center gap-2 hover:translate-x-1 transition-transform">
                 Lihat Semua <ChevronRight size={18} />
              </Link>
            </div>
            
            <div className="flex gap-8 overflow-x-auto pb-8 px-2 custom-scrollbar snap-x">
              {recentStories.map((story) => {
                const isFinished = storyProgressMap[story.id];
                return (
                  <Link key={story.id} href={`/story/${story.slug}`} className="flex-none w-72 group snap-start">
                    <div className="glass-panel rounded-[2rem] p-5 border border-white/60 shadow-xl hover:-translate-y-2 transition-all duration-500">
                      <div className="aspect-[3/4] rounded-2xl overflow-hidden mb-5 relative shadow-inner">
                        <img 
                          src={story.thumbnailUrl || activeTheme.image} 
                          alt={story.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-md text-white text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-widest">
                          {story.category?.name || "CERITA"}
                        </div>
                        {isFinished && (
                           <div className="absolute inset-0 bg-emerald-500/20 backdrop-blur-[2px] flex items-center justify-center">
                              <div className="bg-white rounded-full p-3 shadow-lg scale-110 animate-bounce">
                                 <Trophy className="text-emerald-500" size={24} />
                              </div>
                           </div>
                        )}
                      </div>
                      <h4 className="font-black text-foreground truncate text-lg font-header">{story.title}</h4>
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden mr-4 border border-black/5 shadow-inner">
                          <div 
                            className={`h-full ${isFinished ? 'bg-emerald-500' : 'bg-primary'} rounded-full relative transition-all duration-1000`}
                            style={{ width: isFinished ? '100%' : '10%' }}
                          >
                             <div className="absolute inset-0 shimmer" />
                          </div>
                        </div>
                        <span className={`text-xs font-black ${isFinished ? 'text-emerald-500' : 'text-primary'}`}>
                          {isFinished ? '100%' : 'Baru'}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        </div>

        {/* Column 2: RPG Stats & Social */}
        <div className="lg:col-span-4 space-y-10">
          {/* Character Status Card */}
          <section className="glass-panel rounded-[2.5rem] p-10 magical-glow border border-white/60 relative overflow-hidden shadow-2xl">
            <div className="absolute -top-10 -right-10 opacity-5 rotate-12">
               <Shield size={200} strokeWidth={1} />
            </div>
            
            <div className="relative z-10 flex flex-col items-center text-center space-y-8">
              <div className="relative">
                <div className="w-48 h-48 rounded-[3rem] border-8 border-primary/20 p-2 shadow-inner bg-white/50">
                  <img 
                    src={activeTheme.image} 
                    alt="Hero Avatar" 
                    className="w-full h-full object-cover rounded-[2.5rem] shadow-xl"
                  />
                </div>
                <div className="absolute -bottom-4 right-0 bg-yellow-400 text-amber-900 px-5 py-2 rounded-2xl text-sm font-black shadow-xl shadow-yellow-400/20 border-4 border-white">
                    LV. 12
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-3xl font-black font-header text-foreground tracking-tight">{session.user.name}</h3>
                <p className="text-primary font-black uppercase tracking-widest text-[10px] italic">
                   The Brave {currentHero?.role || "Apprentice"}
                </p>
              </div>

              <div className="w-full space-y-6 pt-4">
                {/* Stats Mapping */}
                {[
                  { label: "DARAH (HP)", value: activeTheme.stats.hp, color: "from-red-500 to-rose-600", icon: Heart, textColor: "text-red-500" },
                  { label: "SERANGAN (ATK)", value: activeTheme.stats.attack, color: "from-blue-500 to-indigo-600", icon: Sword, textColor: "text-blue-500" },
                  { label: "PERTAHANAN (DEF)", value: activeTheme.stats.defense, color: "from-emerald-500 to-teal-600", icon: Shield, textColor: "text-emerald-500" },
                  { label: "KECEPATAN (SPD)", value: activeTheme.stats.speed, color: "from-amber-500 to-orange-600", icon: Zap, textColor: "text-amber-500" },
                ].map((stat) => (
                  <div key={stat.label} className="space-y-2">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                      <span className={`flex items-center gap-2 ${stat.textColor}`}>
                        <stat.icon size={14} /> {stat.label}
                      </span>
                      <span className="text-foreground/40">{stat.value}%</span>
                    </div>
                    <div className="h-4 bg-muted rounded-full overflow-hidden border border-black/5 p-1 shadow-inner">
                      <div 
                        className={`h-full bg-gradient-to-r ${stat.color} rounded-full transition-all duration-1000 relative`}
                        style={{ width: `${stat.value}%` }}
                      >
                        <div className="absolute inset-0 shimmer opacity-30" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Daily Quests Widget */}
          <section className="space-y-6">
            <h3 className="text-2xl font-black font-header text-foreground px-2 flex items-center gap-3">
               Misi Harian <Trophy className="text-amber-500" />
            </h3>
            <div className="space-y-4">
              <div className="glass-panel p-6 rounded-3xl flex items-center gap-5 border border-white/60 hover:bg-white transition-all cursor-pointer group shadow-lg">
                <div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform">
                   <Link href="/dashboard/collections"><Clock size={28} /></Link>
                </div>
                <div className="flex-1">
                  <h5 className="font-black text-sm">Pembaca Kilat</h5>
                  <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-wide">Selesaikan 2 bab hari ini</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-black text-primary block">+50 XP</span>
                  <Star size={16} className="text-amber-500 fill-amber-500 inline" />
                </div>
              </div>

              <div className="glass-panel p-6 rounded-3xl flex items-center gap-5 border border-white/60 hover:bg-white transition-all cursor-pointer group shadow-lg">
                <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                   <Target size={28} />
                </div>
                <div className="flex-1">
                  <h5 className="font-black text-sm">Pakar Kata</h5>
                  <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-wide">Pelajari 5 kosa kata baru</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-black text-primary block">+30 XP</span>
                  <Star size={16} className="text-amber-500 fill-amber-500 inline" />
                </div>
              </div>
            </div>
          </section>

          {/* Social / High Table */}
          <section className="space-y-6 pb-10 md:pb-0">
             <div className="flex items-center justify-between px-2">
                <h3 className="text-2xl font-black font-header text-foreground flex items-center gap-3">
                   Pasukan Ajaib <Users className="text-primary" />
                </h3>
                <span className="text-[10px] font-black bg-primary/10 text-primary px-3 py-1 rounded-full uppercase tracking-widest">
                   4 ONLINE
                </span>
             </div>
             <div className="flex flex-wrap gap-4 px-2">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="relative group cursor-pointer">
                        <div className="w-16 h-16 rounded-[1.5rem] p-1 bg-gradient-to-tr from-primary to-blue-400">
                           <div className="w-full h-full bg-white rounded-[1.2rem] overflow-hidden flex items-center justify-center text-primary font-black text-xl">
                               {String.fromCharCode(64 + i)}
                           </div>
                        </div>
                        <div className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 border-4 border-white rounded-full shadow-lg" />
                    </div>
                ))}
                <button className="w-16 h-16 rounded-[1.5rem] border-4 border-dashed border-foreground/10 flex items-center justify-center text-foreground/20 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all">
                    <ChevronRight size={24} />
                </button>
             </div>
          </section>
        </div>
      </div>
    </div>
  );
}
