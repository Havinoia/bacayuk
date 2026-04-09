import Link from "next/link";
import { ArrowLeft, Lock, Unlock, Speaker, BookOpen } from "lucide-react";

import { db } from "@/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";
import { stories } from "@/db/schema";

export default async function StoryPage({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  
  const story = await db.query.stories.findFirst({
    where: eq(stories.slug, slug),
    with: {
        category: true
    }
  });
  
  const session = await auth.api.getSession({
    headers: await headers()
  });
  
  const isLoggedIn = !!session;

  if (!story) {
    return <div className="p-20 text-center font-black">Cerita tidak ditemukan!</div>;
  }

  return (
    <div className="min-h-screen bg-[#fffef0] py-10 px-4 md:px-8 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-10 -left-10 w-40 h-40 bg-yellow-200/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 -right-10 w-60 h-60 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      
      <div className="max-w-4xl mx-auto relative z-10">
        {/* Navigation */}
        <Link href="/dashboard" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/80 backdrop-blur-sm border border-black/5 text-sm font-black text-foreground/60 hover:text-primary mb-12 transition-all hover:shadow-lg hover:-translate-y-0.5 group">
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Kembali Jelajah
        </Link>

        <article className="space-y-12">
          {/* Playful Header */}
          <header className="text-center space-y-6">
            <div className="flex justify-center">
              <span className="px-6 py-2 rounded-full bg-emerald-100 text-emerald-600 text-[10px] md:text-xs font-black uppercase tracking-[0.2em] shadow-sm border border-emerald-200">
                ⭐ {story.category?.name} ⭐
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black text-slate-800 leading-[1.1] tracking-tight drop-shadow-sm">
                <span className="text-primary inline-block hover:scale-110 transition-transform cursor-default">
                    {story.title}
                </span>
            </h1>
            
            <div className="flex items-center justify-center gap-3 text-sm font-bold text-slate-400 italic">
              <div className="h-px w-8 bg-slate-200" />
              Diceritakan oleh Kakak Bacayuk
              <div className="h-px w-8 bg-slate-200" />
            </div>
          </header>

          {/* Story Frame Container */}
          <div className="relative">
            {/* The "Green Frame" inspired by user image */}
            <div className="w-full aspect-[16/10] md:aspect-[21/9] rounded-[3rem] border-[12px] md:border-[20px] border-emerald-400 bg-emerald-50 shadow-2xl relative overflow-hidden group">
                <div className="absolute inset-0 flex items-center justify-center">
                    <BookOpen size={120} className="text-emerald-200/50 group-hover:scale-110 transition-transform duration-700" strokeWidth={1} />
                </div>
                {/* Cute Corner Decorations */}
                <div className="absolute top-4 left-4 w-8 h-8 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center shadow-lg transform -rotate-12">🦋</div>
                <div className="absolute bottom-4 right-4 w-8 h-8 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center shadow-lg transform rotate-12">🥕</div>
                
                <div className="absolute bottom-0 inset-x-0 h-1/2 bg-gradient-to-t from-emerald-900/20 to-transparent" />
                <div className="absolute bottom-6 left-10 text-white font-black text-lg md:text-2xl drop-shadow-md">
                   Petualangan Dimulai...
                </div>
            </div>

            {/* Content "Paper" */}
            <div className="mt-[-40px] relative z-20 mx-4 md:mx-12 p-8 md:p-16 rounded-[3rem] bg-white shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100">
              <div className="prose prose-slate max-w-none">
                <div className="text-xl md:text-3xl font-medium leading-[1.8] text-slate-700 space-y-8 first-letter:text-5xl first-letter:font-black first-letter:text-primary first-letter:mr-3 first-letter:float-left">
                  {isLoggedIn ? (
                    <div className="whitespace-pre-wrap">{story.content}</div>
                  ) : (
                    <div className="whitespace-pre-wrap italic opacity-80">{story.preview}</div>
                  )}
                </div>
              </div>

              {!isLoggedIn && (
                <div className="mt-16 pt-16 border-t-4 border-dotted border-slate-100 relative">
                  <div className="absolute inset-x-0 -top-24 h-24 bg-gradient-to-t from-white to-transparent" />
                  
                  <div className="flex flex-col items-center text-center space-y-8">
                    <div className="w-20 h-20 bg-amber-50 rounded-3xl flex items-center justify-center text-amber-400 shadow-inner">
                      <Lock size={32} strokeWidth={2.5} />
                    </div>
                    <div className="space-y-3">
                      <h3 className="text-2xl md:text-3xl font-black text-slate-800">Ups! Ceritanya Masih Terkunci 🔐</h3>
                      <p className="text-slate-400 font-bold max-w-sm mx-auto">
                        Ayo Masuk atau Daftar untuk mengikuti petualangan seru ini sampai akhir!
                      </p>
                    </div>
                    <div className="flex flex-wrap justify-center gap-4">
                      <Link href="/auth/register" className="btn-primary scale-110 hover:scale-125 transition-transform shadow-xl">Daftar Sekarang</Link>
                      <Link href="/auth/login" className="px-8 py-4 rounded-2xl bg-slate-100 font-black text-slate-600 hover:bg-slate-200 transition-colors shadow-lg">Masuk Saja</Link>
                    </div>
                  </div>
                </div>
              )}

              {isLoggedIn && (
                <div className="mt-16 pt-10 border-t-2 border-slate-50 flex flex-col md:flex-row justify-between items-center gap-6">
                   <div className="flex items-center gap-3 text-emerald-500 font-black text-sm md:text-base bg-emerald-50 px-5 py-2.5 rounded-2xl border border-emerald-100">
                      <Unlock size={20} /> Cerita Berhasil Dibuka!
                   </div>
                   <button className="flex items-center gap-2 text-primary font-black text-base hover:scale-105 transition-transform bg-primary/5 px-5 py-2.5 rounded-full border border-primary/20">
                      <Speaker size={20} /> Dengarkan Cerita 🎧
                   </button>
                </div>
              )}
            </div>
          </div>
        </article>
      </div>

      {/* Decorative Garden at Footer */}
      <div className="fixed bottom-0 inset-x-0 h-24 pointer-events-none flex items-end justify-between px-10 opacity-30">
          <div className="text-6xl animate-bounce" style={{ animationDuration: '3s' }}>🌿</div>
          <div className="text-5xl animate-pulse">🌸</div>
          <div className="text-4xl animate-bounce" style={{ animationDuration: '4s' }}>🌼</div>
          <div className="text-6xl animate-pulse" style={{ animationDuration: '5s' }}>🍀</div>
      </div>
    </div>
  );
}
