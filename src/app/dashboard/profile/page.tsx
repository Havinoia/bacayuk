import { auth } from "@/lib/auth";
import { db } from "@/db";
import { heroes, stories, readingProgress } from "@/db/schema";
import { eq, count } from "drizzle-orm";
import { headers } from "next/headers";
import { User, Shield, Trophy, BookOpen, Star, Calendar } from "lucide-react";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function ProfilePage() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session?.user) {
    redirect("/auth/login");
  }

  const userName = session.user.name || "Pahlawan";

  // Get Hero stats
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

  return (
    <div className="min-h-screen bg-white pb-20 px-6 pt-10 animate-pin-enter">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* Profile Header */}
        <section className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
          <div className="relative group">
             <div className="w-40 h-40 md:w-56 md:h-56 rounded-[40px] overflow-hidden border-8 border-white shadow-2xl bg-[var(--base-color-sand-gray)] flex items-center justify-center transition-transform group-hover:scale-[1.02] duration-500">
                {session.user.image ? (
                   <img src={session.user.image} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                   <span className="text-7xl font-black text-[var(--base-color-olive-gray)] uppercase">
                      {userName.charAt(0)}
                   </span>
                )}
             </div>
             <div className="absolute -bottom-4 -right-2 bg-[var(--base-color-pinterest-red)] text-white px-6 py-2 rounded-2xl text-sm font-black shadow-xl ring-4 ring-white">
                LV. {currentHero?.level || 1}
             </div>
          </div>

          <div className="text-center md:text-left space-y-4 flex-1">
             <div className="space-y-1">
                <h1 className="text-4xl md:text-6xl font-black text-[var(--base-color-plum-black)] tracking-tight">
                   {userName}
                </h1>
                <div className="flex flex-wrap justify-center md:justify-start gap-4">
                   <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 text-amber-600 text-[12px] font-black uppercase tracking-wider border border-amber-100 italic">
                      <Shield size={14} /> {currentHero?.role ? `The Brave ${currentHero.role}` : "Apprentice"}
                   </div>
                   <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 text-[12px] font-black uppercase tracking-wider border border-blue-100">
                      <Calendar size={14} /> Terdaftar {new Date(session.user.createdAt).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
                   </div>
                </div>
             </div>
             
             <p className="text-lg text-[var(--base-color-olive-gray)] font-medium max-w-lg leading-relaxed">
                Pahlawan literasi yang sedang dalam petualangan ajaib. Teruslah membaca untuk meningkatkan levelmu!
             </p>

             <div className="flex gap-4 justify-center md:justify-start pt-2">
                <button className="btn-pin-primary px-6 py-2.5">Edit Profil</button>
                <button className="btn-pin-secondary px-6 py-2.5">Bagikan</button>
             </div>
          </div>
        </section>

        {/* Achievement Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="bg-[var(--base-color-warm-light)] p-8 rounded-[32px] space-y-4 hover:shadow-xl transition-all border border-black/5">
              <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-[var(--base-color-pinterest-red)] shadow-sm">
                 <BookOpen size={24} />
              </div>
              <div className="space-y-1">
                 <p className="text-4xl font-black text-[var(--base-color-plum-black)]">{completedCount}</p>
                 <p className="text-sm font-bold text-[var(--base-color-olive-gray)] uppercase tracking-widest">Cerita Selesai</p>
              </div>
           </div>

           <div className="bg-[var(--base-color-warm-light)] p-8 rounded-[32px] space-y-4 hover:shadow-xl transition-all border border-black/5">
              <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-amber-500 shadow-sm">
                 <Trophy size={24} />
              </div>
              <div className="space-y-1">
                 <p className="text-4xl font-black text-[var(--base-color-plum-black)]">{currentHero?.xp || 0}</p>
                 <p className="text-sm font-bold text-[var(--base-color-olive-gray)] uppercase tracking-widest">Total XP</p>
              </div>
           </div>

           <div className="bg-[var(--base-color-warm-light)] p-8 rounded-[32px] space-y-4 hover:shadow-xl transition-all border border-black/5">
              <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-emerald-500 shadow-sm">
                 <Star size={24} />
              </div>
              <div className="space-y-1">
                 <p className="text-4xl font-black text-[var(--base-color-plum-black)]">{Math.round((completedCount / (totalStories || 1)) * 100)}%</p>
                 <p className="text-sm font-bold text-[var(--base-color-olive-gray)] uppercase tracking-widest">Penyelesaian</p>
              </div>
           </div>
        </div>

        {/* Secondary Navigation (Optional) */}
        <section className="pt-10 border-t border-black/5">
           <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-black text-[var(--base-color-plum-black)]">Petualanganmu</h3>
              <Link href="/dashboard/collections" className="text-sm font-bold text-[var(--base-color-pinterest-red)] hover:underline">Jelajahi Lagi →</Link>
           </div>
           
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link href="/dashboard/quests" className="p-6 rounded-3xl bg-white border-2 border-dashed border-slate-200 hover:border-[var(--base-color-pinterest-red)] hover:bg-slate-50 transition-all group">
                 <div className="flex items-center gap-4">
                    <div className="p-4 rounded-full bg-slate-100 group-hover:bg-white transition-colors">
                       <Trophy size={24} />
                    </div>
                    <div>
                       <p className="font-black text-lg">Misi Harian</p>
                       <p className="text-sm text-slate-400 font-medium">Selesaikan misi untuk XP ekstra</p>
                    </div>
                 </div>
              </Link>
              <div className="p-6 rounded-3xl bg-white border-2 border-dashed border-slate-200 opacity-50 cursor-not-allowed">
                 <div className="flex items-center gap-4">
                    <div className="p-4 rounded-full bg-slate-100">
                       <Star size={24} />
                    </div>
                    <div>
                       <p className="font-black text-lg">Pencapaian</p>
                       <p className="text-sm text-slate-400 font-medium">Segera Hadir...</p>
                    </div>
                 </div>
              </div>
           </div>
        </section>

      </div>
    </div>
  );
}
