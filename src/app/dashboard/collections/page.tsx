import Link from "next/link";
import { db } from "@/db";
import { stories, categories } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { SearchInput } from "@/components/SearchInput";
import { Suspense } from "react";
import { and, ilike } from "drizzle-orm";
import { Clock, ArrowRight, BookOpen } from "lucide-react";

const COLOR_MAP: Record<string, string> = {
  "Fabel": "bg-blue-500",
  "Legenda": "bg-emerald-500",
  "Dongeng": "bg-purple-500",
  "default": "bg-amber-500"
};

export default async function CollectionsPage({
  searchParams,
}: {
  searchParams: { cat?: string; q?: string };
}) {
  const params = await searchParams;
  const selectedCatId = params.cat ? parseInt(params.cat) : null;
  const searchQuery = params.q || "";

  // Fetch categories for filtering
  const allCategories = await db.select().from(categories);

  // Build where clause
  const whereClause = and(
    selectedCatId ? eq(stories.categoryId, selectedCatId) : undefined,
    searchQuery ? ilike(stories.title, `%${searchQuery}%`) : undefined
  );

  // Fetch stories based on filter and search
  const allStories = await db.query.stories.findMany({
    where: whereClause,
    with: {
      category: true,
    },
    orderBy: [desc(stories.createdAt)],
  });

  return (
    <div className="space-y-16 pb-20 pt-10 min-h-screen relative">
      {/* Decorative Background Fillers */}
      <div className="absolute top-20 right-1/4 text-5xl opacity-10 animate-pulse">☁️</div>
      <div className="absolute top-[400px] left-10 text-6xl opacity-10 animate-float">🍄</div>
      <div className="absolute bottom-20 right-10 text-6xl opacity-10 animate-float" style={{ animationDelay: '2s' }}>🌷</div>

      {/* Header Section */}
      <header className="space-y-10 relative z-10 px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-black font-header text-foreground tracking-tighter leading-none">
              Jelajah <span className="text-primary italic">Ajaib</span>
            </h1>
            <p className="text-foreground/40 font-bold max-w-lg text-lg leading-relaxed">
              Temukan ribuan rahasia dan petualangan yang menunggumu untuk dibaca.
            </p>
          </div>
          
          <Suspense fallback={<div className="h-16 w-[350px] bg-white animate-pulse rounded-full" />}>
            <SearchInput />
          </Suspense>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4">
          <Link 
            href="/dashboard/collections"
            className={`px-8 py-3 rounded-full text-sm font-black transition-all shadow-lg active:scale-95 ${
              !selectedCatId 
                ? "bg-primary text-white shadow-primary/30 -rotate-2" 
                : "bg-white text-foreground/40 hover:text-primary hover:bg-primary/5"
            }`}
          >
            Semua Cerita
          </Link>
          {allCategories.map((cat, idx) => (
            <Link 
              key={cat.id}
              href={`/dashboard/collections?cat=${cat.id}`}
              className={`px-8 py-3 rounded-full text-sm font-black transition-all shadow-lg active:scale-95 ${
                selectedCatId === cat.id 
                  ? "bg-secondary text-white shadow-secondary/30 rotate-2" 
                  : "bg-white text-foreground/40 hover:text-secondary hover:bg-secondary/5"
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </header>

      {/* Grid Section */}
      <div className="relative z-10">
      {allStories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {allStories.map((story) => (
            <Link 
              key={story.id} 
              href={`/story/${story.slug}`} 
              className="group"
            >
              <div className="bubble-card flex flex-col h-full hover:shadow-primary/10 transition-all duration-500">
                <div className={`aspect-[16/10] w-full ${COLOR_MAP[story.category?.name || "default"]} relative p-6 flex items-end overflow-hidden`}>
                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  {/* Decorative icon backdrop */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10 group-hover:scale-150 group-hover:rotate-12 transition-transform duration-700">
                      <BookOpen size={150} strokeWidth={1} className="text-white" />
                  </div>

                  <div className="relative z-10 w-full flex justify-between items-center text-white">
                      <span className="px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-[9px] font-black uppercase tracking-widest border border-white/20">
                          {story.category?.name}
                      </span>
                      <div className="w-10 h-10 rounded-xl bg-white text-primary flex items-center justify-center shadow-xl group-hover:scale-110 transition-all">
                          <ArrowRight size={20} strokeWidth={4} />
                      </div>
                  </div>
                </div>

                <div className="p-6 space-y-3 bg-white border-t-4 border-black/5 flex-1 flex flex-col">
                  <h3 className="text-xl font-black font-header text-foreground group-hover:text-primary transition-colors leading-tight">
                    {story.title}
                  </h3>
                  <p className="text-foreground/40 text-[13px] line-clamp-2 leading-relaxed font-bold flex-1">
                    {story.preview}
                  </p>
                  <div className="pt-3 flex items-center gap-2 text-[10px] font-black uppercase text-primary tracking-widest leading-none">
                    <Clock size={14} /> 5 MENIT BACA
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="py-32 text-center space-y-8 bg-white/50 backdrop-blur-sm rounded-[3rem] border-4 border-dashed border-black/5">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto text-primary shadow-xl animate-float">
                <BookOpen size={40} />
            </div>
            <div className="space-y-2">
                <h3 className="text-3xl font-black font-header text-foreground italic">Oops! Alamatnya Salah...</h3>
                <p className="text-foreground/40 font-bold">Belum ada cerita ajaib di sini. Coba cari petualangan lain ya!</p>
            </div>
            <Link href="/dashboard/collections" className="inline-block btn-primary">
               Lihat Koleksi Lain
            </Link>
        </div>
      )}
      </div>
    </div>
  );
}
