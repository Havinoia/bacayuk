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
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-[2.5rem] bg-slate-900 px-8 py-16 md:px-16 md:py-24 text-white shadow-2xl shadow-blue-500/20">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs font-bold uppercase tracking-widest mb-6">
            <Star size={14} className="text-secondary fill-secondary" />
            Cerita Baru Pekan Ini
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
            Ayo Masuk ke <br />
            <span className="text-primary italic">Dunia Imajinasi!</span>
          </h1>
          <p className="text-white/60 text-lg mb-10 leading-relaxed">
            Temukan ribuan cerita seru dan dongeng mendidik yang akan menemanimu setiap hari.
          </p>
          <div className="flex flex-wrap gap-4">
            <button className="btn-primary">Mulai Membaca</button>
            <button className="px-6 py-3 rounded-2xl font-bold bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
              Lihat Kategori
            </button>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/20 to-transparent pointer-events-none" />
      </section>

      {/* Categories Grid */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-black text-foreground">Koleksi Terpopuler</h2>
          <Link href="/dashboard" className="text-sm font-bold text-primary flex items-center gap-1 hover:underline">
            Lihat Semua <ChevronRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {allStories.map((story) => (
            <Link key={story.id} href={`/story/${story.slug}`} className="story-card flex flex-col group">
              <div className={`aspect-[16/10] w-full rounded-2xl ${COLOR_MAP[story.category?.name || "default"]} mb-6 relative overflow-hidden`}>
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                <div className="absolute bottom-4 left-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/20 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-wider">
                  <Clock size={12} /> 5 Menit Baca
                </div>
              </div>
              <div className="px-2">
                <span className="text-xs font-black text-primary uppercase tracking-widest mb-2 block">
                  {story.category?.name}
                </span>
                <h3 className="text-xl font-black text-foreground mb-4 group-hover:text-primary transition-colors">
                  {story.title}
                </h3>
                <p className="text-foreground/50 text-sm line-clamp-2 leading-relaxed">
                  {story.preview}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
