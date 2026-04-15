import Link from "next/link";
import { db } from "@/db";
import { stories, categories } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { SearchInput } from "@/components/SearchInput";
import { Suspense } from "react";
import { and, ilike } from "drizzle-orm";
import { BookOpen } from "lucide-react";
import { MasonryGrid } from "@/components/MasonryGrid";
import { StoryPin } from "@/components/StoryPin";

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
          {allCategories.map((cat) => (
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
      <div className="relative z-10 px-4">
      {allStories.length > 0 ? (
        <MasonryGrid>
          {allStories.map((story) => (
             <StoryPin 
              key={story.id} 
              id={story.id}
              title={story.title}
              slug={story.slug}
              thumbnailUrl={story.thumbnailUrl || ""}
              category={story.category || { name: "Cerita" }}
            />
          ))}
        </MasonryGrid>
      ) : (
        <div className="py-32 text-center space-y-8 bg-white/50 backdrop-blur-sm rounded-[3rem] border-4 border-dashed border-black/5 mx-auto max-w-4xl">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto text-primary shadow-xl animate-float">
                <BookOpen size={40} />
            </div>
            <div className="space-y-2">
                <h3 className="text-3xl font-black font-header text-foreground italic">Oops! Alamatnya Salah...</h3>
                <p className="text-foreground/40 font-bold">Belum ada cerita ajaib di sini. Coba cari petualangan lain ya!</p>
            </div>
            <Link href="/dashboard/collections" className="inline-block btn-primary px-8 py-4">
               Lihat Koleksi Lain
            </Link>
        </div>
      )}
      </div>
    </div>
  );
}

