import { auth } from "@/lib/auth";
import { db } from "@/db";
import { heroes, stories, categories } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { headers } from "next/headers";
import { Clock, ChevronRight, Star, Shield, Sword } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import RoleSelection from "@/components/RoleSelection";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session?.user) {
    redirect("/");
  }

  // Get Hero current role
  const currentHero = await db.query.heroes.findFirst({
    where: eq(heroes.userId, session.user.id)
  });

  const allStories = await db.query.stories.findMany({
    with: { category: true },
    orderBy: [desc(stories.createdAt)],
    limit: 6
  });

  const HERO_THEMES: Record<string, any> = {
    dwarf: {
        gradient: "from-orange-400 to-amber-600",
        shadow: "shadow-orange-200",
        badge: "bg-orange-500",
        icon: "⚒️",
        desc: "Ahli tempa yang tangguh! Yuk buat senjata sakti hari ini.",
        stats: { hp: 75, attack: 65, defense: 85, speed: 25 }
    },
    peri: {
        gradient: "from-emerald-400 to-teal-600",
        shadow: "shadow-emerald-200",
        badge: "bg-emerald-500",
        icon: "🧚",
        desc: "Pemilik sihir alam yang indah. Siap menjelajah hutan?",
        stats: { hp: 45, attack: 55, defense: 35, speed: 80 }
    },
    kesatria: {
        gradient: "from-blue-400 to-indigo-600",
        shadow: "shadow-blue-200",
        badge: "bg-blue-500",
        icon: "⚔️",
        desc: "Pahlawan pemberani! Lindungi kerajaan dengan keberanianmu.",
        stats: { hp: 80, attack: 70, defense: 75, speed: 45 }
    },
    penyihir: {
        gradient: "from-purple-400 to-fuchsia-600",
        shadow: "shadow-purple-200",
        badge: "bg-purple-500",
        icon: "🧙‍♂️",
        desc: "Bijaksana dan sakti. Mantra rahasia apa yang akan kita pelajari?",
        stats: { hp: 40, attack: 85, defense: 25, speed: 50 }
    },
    pemanah: {
        gradient: "from-rose-400 to-pink-600",
        shadow: "shadow-rose-200",
        badge: "bg-rose-500",
        icon: "🏹",
        desc: "Fokus dan tepat sasaran! Mari kita bidik masa depan yang cerah.",
        stats: { hp: 55, attack: 75, defense: 45, speed: 75 }
    },
    default: {
        gradient: "from-primary to-emerald-600",
        shadow: "shadow-primary/20",
        badge: "bg-primary",
        icon: "📜",
        desc: "Petualang cilik! Temukan ribuan cerita seru di perpustakaan ajaib.",
        stats: { hp: 50, attack: 50, defense: 50, speed: 50 }
    }
  };

  const activeTheme = currentHero?.role ? HERO_THEMES[currentHero.role.toLowerCase()] : HERO_THEMES.default;

  const COLOR_MAP: Record<string, string> = {
    "Legenda": "bg-emerald-500",
    "Fabel": "bg-blue-500",
    "Dongeng": "bg-purple-500",
    "Sejarah": "bg-amber-500",
    "default": "bg-primary"
  };

  return (
    <div className="space-y-24 pb-20 pt-32 relative overflow-hidden">
      {/* Background Magic Particles */}
      {[...Array(12)].map((_, i) => (
        <div 
          key={i} 
          className="absolute w-4 h-4 rounded-full bg-primary/20 blur-xl animate-pulse" 
          style={{ 
            top: `${Math.random() * 100}%`, 
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`
          }} 
        />
      ))}

      {/* Hero Banner Section */}
      <section className="relative px-4 md:px-10">
        <div className={`
          relative min-h-[500px] rounded-[3rem] overflow-hidden shadow-2xl p-1 md:p-2 transition-all duration-700
          bg-gradient-to-br ${activeTheme.gradient} ${activeTheme.shadow}
        `}>
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/5 blur-[80px] rounded-full translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative z-10 w-full h-full flex flex-col items-center justify-center py-20 px-6 text-center">
            {/* The Hall of Fame Card */}
            <div className="bg-white/95 backdrop-blur-md rounded-[2.5rem] p-10 md:p-14 w-full max-w-5xl shadow-2xl border-4 border-white relative overflow-hidden">
                <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary/10 rounded-full blur-[40px]" />
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-accent/10 rounded-full blur-[40px]" />

                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Left Column: Hero Info */}
                    <div className="space-y-8 text-center lg:text-left">
                        <div className="flex flex-col items-center lg:items-start gap-4">
                            <div className="w-24 h-24 bg-gradient-to-br from-primary to-accent rounded-3xl flex items-center justify-center text-5xl shadow-xl animate-float">
                                {activeTheme.icon}
                            </div>
                            <div className={`px-4 py-1.5 rounded-full ${activeTheme.badge} text-white text-[10px] font-black uppercase tracking-widest`}>
                                LEVEL 1 PETUALANG
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h1 className="text-4xl md:text-6xl font-black font-header text-foreground tracking-tight leading-none">
                                Halo, <span className="text-primary">{currentHero?.role ? currentHero.role.toUpperCase() : "PAHLAWAN"}</span>!
                            </h1>
                            <p className="text-foreground/50 text-lg md:text-xl font-bold italic leading-relaxed">
                                "{activeTheme.desc}"
                            </p>
                        </div>

                        <div className="flex justify-center lg:justify-start">
                            <Link href="/dashboard/collections" className="btn-primary flex items-center gap-2 group text-lg">
                                 Ayo Mulai Petualangan <ChevronRight className="group-hover:translate-x-2 transition-transform" />
                            </Link>
                        </div>
                    </div>

                    {/* Right Column: Attribute Bars */}
                    <div className="space-y-6 bg-muted/40 p-8 rounded-[2rem] border-2 border-primary/5 shadow-inner">
                        <h4 className="text-xs font-black font-header text-primary/60 uppercase tracking-[0.4em] flex items-center gap-2">
                            <Sword size={16} /> ATRIBUT KESAKTIAN
                        </h4>
                        
                        <div className="grid gap-6">
                            {/* HP Bar */}
                            <div className="space-y-2">
                                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-foreground/40">
                                    <span>❤️ DAYA TAHAN (HP)</span>
                                    <span className="text-primary">{activeTheme.stats.hp}%</span>
                                </div>
                                <div className="h-4 w-full bg-white rounded-full overflow-hidden border border-foreground/5 p-1 shadow-inner">
                                    <div 
                                        className="h-full bg-gradient-to-r from-red-400 to-red-600 rounded-full shadow-lg transition-all duration-1000 ease-out" 
                                        style={{ width: `${activeTheme.stats.hp}%` }}
                                    />
                                </div>
                            </div>

                            {/* Attack Bar */}
                            <div className="space-y-2">
                                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-foreground/40">
                                    <span>⚔️ KEKUATAN (ATTACK)</span>
                                    <span className="text-primary">{activeTheme.stats.attack}%</span>
                                </div>
                                <div className="h-4 w-full bg-white rounded-full overflow-hidden border border-foreground/5 p-1 shadow-inner">
                                    <div 
                                        className="h-full bg-gradient-to-r from-orange-400 to-orange-600 rounded-full shadow-lg transition-all duration-1000 ease-out" 
                                        style={{ width: `${activeTheme.stats.attack}%` }}
                                    />
                                </div>
                            </div>

                            {/* Defense Bar */}
                            <div className="space-y-2">
                                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-foreground/40">
                                    <span>🛡️ PERTAHANAN (DEFENSE)</span>
                                    <span className="text-primary">{activeTheme.stats.defense}%</span>
                                </div>
                                <div className="h-4 w-full bg-white rounded-full overflow-hidden border border-foreground/5 p-1 shadow-inner">
                                    <div 
                                        className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full shadow-lg transition-all duration-1000 ease-out" 
                                        style={{ width: `${activeTheme.stats.defense}%` }}
                                    />
                                </div>
                            </div>

                            {/* Speed Bar */}
                            <div className="space-y-2">
                                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-foreground/40">
                                    <span>👟 KECEPATAN (SPEED)</span>
                                    <span className="text-primary">{activeTheme.stats.speed}%</span>
                                </div>
                                <div className="h-4 w-full bg-white rounded-full overflow-hidden border border-foreground/5 p-1 shadow-inner">
                                    <div 
                                        className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full shadow-lg transition-all duration-1000 ease-out" 
                                        style={{ width: `${activeTheme.stats.speed}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </section>
      {/* Role Selection Section */}
      <section className="relative z-10 px-4">
        <RoleSelection currentRole={currentHero?.role} />
      </section>

      {/* Koleksi Stories Grid */}
      <section className="relative z-10 px-4">
        <div className="flex items-center justify-between mb-12">
          <div className="space-y-2">
            <h2 className="text-4xl md:text-5xl font-black font-header text-foreground tracking-tight">Koleksi <span className="text-primary italic">Terpopuler</span></h2>
            <p className="text-foreground/40 font-bold uppercase tracking-widest text-xs">Petualangan terbaik untukmu hari ini</p>
          </div>
          <Link href="/dashboard/collections" className="px-6 py-3 rounded-full bg-muted border border-foreground/10 font-bold text-primary flex items-center gap-2 hover:bg-primary hover:text-white transition-all">
            Semua <ChevronRight size={18} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {allStories.map((story) => (
            <Link key={story.id} href={`/story/${story.slug}`} className="group">
              <div className="bubble-card flex flex-col h-full hover:-translate-y-4 shadow-xl hover:shadow-primary/10 transition-all duration-500">
                <div className={`aspect-[16/10] w-full ${COLOR_MAP[story.category?.name || "default"]} relative p-6 flex flex-col justify-between overflow-hidden`}>
                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative z-10 self-start">
                    <span className="px-4 py-2 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-[10px] font-black uppercase tracking-widest leading-none">
                      {story.category?.name}
                    </span>
                  </div>
                  <div className="relative z-10 self-end">
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-primary shadow-xl group-hover:scale-125 transition-transform duration-500">
                         <ChevronRight size={24} strokeWidth={4} />
                      </div>
                  </div>
                </div>

                <div className="p-8 space-y-4 bg-white">
                  <h3 className="text-2xl font-black font-header text-foreground group-hover:text-primary transition-colors leading-tight">
                    {story.title}
                  </h3>
                  <p className="text-foreground/40 text-sm line-clamp-2 leading-relaxed font-bold">
                    {story.preview}
                  </p>
                  <div className="pt-4 flex items-center gap-2 text-[10px] font-black uppercase text-primary tracking-widest">
                    <Clock size={14} /> 5 MENIT BACA
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
