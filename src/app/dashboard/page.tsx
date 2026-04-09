import Link from "next/link";
import { Star, Clock, ChevronRight } from "lucide-react";

import { db } from "@/db";
import { stories } from "@/db/schema";
import { desc } from "drizzle-orm";

const COLOR_MAP: Record<string, string> = {
  "Fabel": "bg-blue-500",
  "Legenda": "bg-emerald-500",
  "default": "bg-amber-500"
};

export default async function DashboardPage() {
  const allStories = await db.query.stories.findMany({
    with: {
        category: true
    },
    orderBy: [desc(stories.createdAt)],
  });
  return (
    <div className="space-y-20 pb-20 pt-10 relative">
      {/* Decorative fillers for "No Empty Space" */}
      <div className="absolute top-40 left-0 text-6xl opacity-10 floating-element animate-float px-10">🎈</div>
      <div className="absolute top-[600px] right-0 text-6xl opacity-10 floating-element animate-float px-10" style={{ animationDelay: '1s' }}>🚀</div>
      <div className="absolute bottom-40 left-1/4 text-5xl opacity-10 floating-element animate-float" style={{ animationDelay: '2s' }}>🌈</div>

      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-[3.5rem] bg-gradient-to-br from-secondary to-[#60a5fa] px-8 py-20 md:px-20 md:py-32 text-white shadow-2xl shadow-secondary/30">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/20 backdrop-blur-xl border border-white/20 text-xs font-black uppercase tracking-widest mb-10 shadow-lg">
            <Star size={16} className="text-accent fill-accent animate-pulse" />
            Cerita Baru Menantimu!
          </div>
          <h1 className="text-5xl md:text-8xl font-black mb-8 leading-[0.9] tracking-tighter drop-shadow-2xl">
            Waktunya <br />
            <span className="text-accent italic drop-shadow-none">Berpetualang!</span>
          </h1>
          <p className="text-white/90 text-xl md:text-2xl font-bold mb-12 max-w-xl leading-relaxed">
            Temukan ribuan cerita seru, dongeng ajaib, dan kisah legenda yang akan membawamu ke dunia imajinasi.
          </p>
          <div className="flex flex-wrap gap-6">
            <Link href="/dashboard/collections" className="btn-secondary text-lg hover:scale-110 active:scale-95 transition-all">
               📖 Ayo Mulai!
            </Link>
            <Link href="/dashboard/collections" className="px-10 py-4 rounded-full font-black bg-white/10 border-2 border-white/20 hover:bg-white/20 transition-all text-lg backdrop-blur-md">
              Lihat Koleksi
            </Link>
          </div>
        </div>
        
        {/* Floating Clouds & Decorative elements */}
        <div className="absolute -top-10 -right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-20 text-9xl opacity-20 floating-element">☁️</div>
        <div className="absolute top-20 right-40 text-6xl opacity-20 floating-element" style={{ animationDelay: '1.5s' }}>⭐</div>
      </section>

      {/* Koleksi Stories Grid */}
      <section className="relative z-10">
        <div className="flex items-center justify-between mb-12 px-4">
          <div className="space-y-2">
            <h2 className="text-4xl md:text-5xl font-black text-foreground tracking-tight">Koleksi <span className="text-primary italic">Terpopuler</span></h2>
            <p className="text-foreground/40 font-bold uppercase tracking-widest text-xs">Pilihan terbaik untukmu hari ini</p>
          </div>
          <Link href="/dashboard/collections" className="px-6 py-3 rounded-full bg-white border-2 border-black/5 font-black text-primary flex items-center gap-2 hover:bg-primary hover:text-white transition-all shadow-lg active:scale-95">
            Semua <ChevronRight size={18} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {allStories.map((story) => (
            <Link key={story.id} href={`/story/${story.slug}`} className="group">
              <div className="bubble-card flex flex-col h-full hover:-translate-y-4 shadow-xl hover:shadow-primary/10 transition-all duration-500">
                <div className={`aspect-[16/10] w-full ${COLOR_MAP[story.category?.name || "default"]} relative p-6 flex flex-col justify-between overflow-hidden`}>
                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  {/* Category Badge */}
                  <div className="relative z-10 self-start">
                    <span className="px-4 py-2 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-[10px] font-black uppercase tracking-widest leading-none">
                      {story.category?.name}
                    </span>
                  </div>

                  {/* Play/Listen Icon overlap */}
                  <div className="relative z-10 self-end">
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-primary shadow-xl group-hover:scale-125 transition-transform duration-500">
                         <ChevronRight size={24} strokeWidth={4} />
                      </div>
                  </div>
                </div>

                <div className="p-8 space-y-4 bg-white border-t-4 border-black/5">
                  <h3 className="text-2xl font-black text-foreground group-hover:text-primary transition-colors leading-tight">
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
