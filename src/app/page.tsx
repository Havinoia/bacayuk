import Link from "next/link";
import { BookOpen, Sparkles, Star, Shield, Sword, Heart, ArrowRight } from "lucide-react";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  // If already logged in, show a different CTA or just keep it as a landing page
  // but usually users go to dashboard if logged in.
  
  return (
    <div className="flex flex-col min-h-screen selection:bg-primary/20">
      {/* Navigation Header */}
      <nav className="fixed top-6 inset-x-4 md:inset-x-10 z-50 h-20 bg-white/60 backdrop-blur-xl border-4 border-white rounded-full shadow-[0_15px_40px_rgba(0,0,0,0.05)] flex items-center px-6 md:px-10">
        <div className="w-full flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg">
                <BookOpen size={20} strokeWidth={3} />
              </div>
              <span className="text-xl md:text-2xl font-black text-foreground tracking-tighter font-header">
                Baca<span className="text-primary italic">yuk</span>
              </span>
            </div>
            
            <div className="flex items-center gap-4">
              {session ? (
                <Link href="/dashboard" className="btn-primary py-2 px-6 text-sm">
                  Ke Dashboard <ArrowRight size={16} />
                </Link>
              ) : (
                <Link href="/auth/login" className="btn-secondary py-2 px-6 text-sm">
                  Masuk Sekarang
                </Link>
              )}
            </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 pt-40 pb-20 px-6 relative overflow-hidden flex flex-col items-center">
        {/* Abstract Background Magic Particles */}
        <div className="absolute top-40 left-10 text-6xl opacity-20 animate-float">📖</div>
        <div className="absolute top-20 right-20 text-7xl opacity-10 animate-sparkle">✨</div>
        <div className="absolute bottom-40 left-1/4 text-5xl opacity-15 animate-float delay-700">⚔️</div>
        <div className="absolute top-1/2 right-10 text-6xl opacity-10 animate-sparkle delay-1000">⭐</div>
        
        <div className="relative z-10 max-w-4xl text-center space-y-10 animate-slide-in">
          <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white border-2 border-primary/10 shadow-xl shadow-primary/5 text-xs font-black uppercase tracking-[0.2em] text-primary">
            <Sparkles size={16} className="animate-pulse" />
            Tempat Imajinasi Tanpa Batas
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black font-header text-foreground leading-[0.9] tracking-tighter">
            Dunia <span className="text-primary italic">Cerita Ajaib</span> <br className="hidden md:block" />
            Menantikan Petualanganmu!
          </h1>
          
          <p className="max-w-2xl mx-auto text-xl md:text-2xl font-medium text-foreground/50 leading-relaxed">
            Pilih pahlawan favoritmu, jelajahi ribuan kisah dongeng nusantara, dan temukan pesan moral yang berharga setiap harinya.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4">
            <Link href={session ? "/dashboard" : "/auth/login"} className="btn-primary py-6 px-12 text-xl shadow-2xl shadow-primary/40 min-w-[240px]">
              {session ? "Buka Perpustakaan" : "Mulai Petualangan"} <ArrowRight size={24} strokeWidth={3} />
            </Link>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="mt-32 max-w-6xl w-full grid grid-cols-1 md:grid-cols-3 gap-10 relative z-10">
          <div className="bubble-card p-10 space-y-6 group hover:-translate-y-4 duration-500">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-3xl flex items-center justify-center text-3xl group-hover:rotate-12 transition-transform">
              🛡️
            </div>
            <h3 className="text-2xl font-black font-header">Pilih Pahlawanmu</h3>
            <p className="text-foreground/40 font-medium leading-relaxed">
              Jadilah Ksatria, Peri, atau Penyihir. Setiap pahlawan memiliki misi unik di dunia cerita.
            </p>
          </div>

          <div className="bubble-card p-10 space-y-6 group hover:-translate-y-4 duration-500 delay-100">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center text-3xl group-hover:rotate-12 transition-transform">
              📜
            </div>
            <h3 className="text-2xl font-black font-header">Kisah Nusantara</h3>
            <p className="text-foreground/40 font-medium leading-relaxed">
              Mulai dari Legenda Danau Toba hingga Fabel Kancil. Semua dikemas secara interaktif dan seru.
            </p>
          </div>

          <div className="bubble-card p-10 space-y-6 group hover:-translate-y-4 duration-500 delay-200">
            <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-3xl flex items-center justify-center text-3xl group-hover:rotate-12 transition-transform">
              ⭐
            </div>
            <h3 className="text-2xl font-black font-header">Misi & Hadiah</h3>
            <p className="text-foreground/40 font-medium leading-relaxed">
              Selesaikan misi membaca setiap hari dan kumpulkan lencana pahlawan legendaris.
            </p>
          </div>
        </div>
      </main>

      {/* Simple Footer */}
      <footer className="py-12 border-t border-black/5 bg-muted/30">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3 opacity-50">
            <div className="w-8 h-8 bg-foreground rounded-lg flex items-center justify-center text-white">
              <BookOpen size={16} strokeWidth={3} />
            </div>
            <span className="text-lg font-black text-foreground tracking-tighter">
              BacaYuk
            </span>
          </div>
          <p className="text-foreground/20 text-sm font-bold">
            &copy; 2026 Bacayuk Platform. Dibuat dengan cinta untuk imajinasi anak Indonesia.
          </p>
        </div>
      </footer>
    </div>
  );
}
