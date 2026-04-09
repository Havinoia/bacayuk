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
    <div className="space-y-12 pb-20">
      {/* Header Section */}
      <header className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tight">
              Koleksi <span className="text-primary">Cerita</span>
            </h1>
            <p className="text-foreground/40 font-medium max-w-lg">
              Jelajahi berbagai kisah menarik dari seluruh penjuru dunia untuk menemani imajinasimu.
            </p>
          </div>
          
          <Suspense fallback={<div className="h-14 w-[300px] bg-slate-100 animate-pulse rounded-2xl" />}>
            <SearchInput />
          </Suspense>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 pt-4">
          <Link 
            href="/dashboard/collections"
            className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all border ${
              !selectedCatId 
                ? "bg-primary text-white border-primary shadow-lg shadow-primary/20" 
                : "bg-white text-foreground/40 border-black/5 hover:border-primary/20 hover:text-primary"
            }`}
          >
            Semua
          </Link>
          {allCategories.map((cat) => (
            <Link 
              key={cat.id}
              href={`/dashboard/collections?cat=${cat.id}`}
              className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all border ${
                selectedCatId === cat.id 
                  ? "bg-primary text-white border-primary shadow-lg shadow-primary/20" 
                  : "bg-white text-foreground/40 border-black/5 hover:border-primary/20 hover:text-primary"
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </header>

      {/* Grid Section */}
      {allStories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {allStories.map((story) => (
            <Link 
              key={story.id} 
              href={`/story/${story.slug}`} 
              className="group relative flex flex-col bg-white rounded-[2.5rem] border border-black/5 shadow-sm hover:shadow-2xl hover:shadow-black/5 transition-all duration-500 overflow-hidden"
            >
              <div className={`aspect-[16/10] w-full ${COLOR_MAP[story.category?.name || "default"]} relative p-8 flex items-end overflow-hidden`}>
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-60" />
                
                {/* Decorative icon backdrop */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10 group-hover:scale-125 group-hover:rotate-12 transition-transform duration-700">
                    <BookOpen size={180} strokeWidth={1} className="text-white" />
                </div>

                <div className="relative z-10 w-full flex justify-between items-center text-white">
                    <span className="px-3 py-1 rounded-lg bg-white/20 backdrop-blur-md text-[10px] font-black uppercase tracking-wider">
                        5 Menit Baca
                    </span>
                    <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:bg-white group-hover:text-primary transition-all duration-300">
                        <ArrowRight size={18} />
                    </div>
                </div>
              </div>

              <div className="p-8 space-y-4">
                <span className="text-xs font-black text-primary uppercase tracking-widest block">
                  {story.category?.name || "Umum"}
                </span>
                <h3 className="text-2xl font-black text-foreground group-hover:text-primary transition-colors leading-tight">
                  {story.title}
                </h3>
                <p className="text-foreground/40 text-sm line-clamp-2 leading-relaxed font-medium">
                  {story.preview}
                </p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center space-y-4">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300">
                <BookOpen size={32} />
            </div>
            <div className="space-y-1">
                <h3 className="text-xl font-bold text-foreground">Belum ada cerita</h3>
                <p className="text-foreground/40 text-sm">Coba cari di kategori yang berbeda ya!</p>
            </div>
        </div>
      )}
    </div>
  );
}
