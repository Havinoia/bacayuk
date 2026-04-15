import Link from "next/link";
import { BookOpen, Sparkles, Star, Shield, Sword, Heart, ArrowRight } from "lucide-react";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers()
  });
  
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* 1. Pinterest Centered Header */}
      <nav className="fixed top-0 inset-x-0 z-50 h-20 bg-white/95 backdrop-blur-xl border-b border-black/5 flex items-center px-6 md:px-12">
        <div className="w-full flex justify-between items-center max-w-7xl mx-auto">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[var(--base-color-pinterest-red)] rounded-full flex items-center justify-center text-white shadow-lg pr-0.5">
                <span className="font-black text-xl italic leading-none">B</span>
              </div>
              <span className="text-2xl font-black text-[var(--base-color-plum-black)] tracking-tighter">
                BacaYuk
              </span>
            </div>
            
            <div className="flex items-center gap-4">
              {session ? (
                <Link href="/dashboard" className="btn-pin-primary py-2 px-6 text-sm">
                  Ke Dashboard
                </Link>
              ) : (
                <div className="flex gap-2">
                    <Link href="/auth/login" className="btn-pin-secondary py-2.5 px-6 text-sm">
                        Masuk
                    </Link>
                    <Link href="/auth/register" className="btn-pin-primary py-2.5 px-6 text-sm">
                        Daftar
                    </Link>
                </div>
              )}
            </div>
        </div>
      </nav>

      {/* 2. Display Hero Section (Pinterest Style) */}
      <main className="flex-1 pt-40 pb-20 px-6 relative overflow-hidden flex flex-col items-center max-w-7xl mx-auto">
        
        <div className="relative z-10 text-center space-y-10 animate-pin-enter">
          <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-[var(--base-color-warm-wash)] text-[11px] font-black uppercase tracking-[0.2em] text-[var(--base-color-olive-gray)]">
            <Sparkles size={16} />
            Inspirasi Tanpa Batas
          </div>
          
          <h1 className="text-5xl md:text-8xl font-black font-header text-[var(--base-color-plum-black)] leading-[0.9] tracking-tighter">
            Dunia <span className="text-[var(--base-color-pinterest-red)] italic">Cerita Ajaib</span> <br className="hidden md:block" />
            Menunggumu Disini.
          </h1>
          
          <p className="max-w-2xl mx-auto text-xl md:text-2xl font-medium text-[var(--base-color-olive-gray)] leading-relaxed">
            Pilih pahlawan favoritmu, jelajahi ribuan kisah dongeng nusantara, dan temukan pesan moral yang berharga setiap harinya.
          </p>
 
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6">
            <Link href={session ? "/dashboard" : "/auth/login"} className="btn-pin-primary py-6 px-12 text-xl shadow-2xl shadow-red-500/30 min-w-[280px]">
              {session ? "Buka Perpustakaan" : "Mulai Sekarang"}
            </Link>
          </div>
        </div>

        {/* 3. Visual Features (Masonry Feel) */}
        <div className="mt-32 w-full grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
          <div className="bg-[var(--base-color-warm-light)] p-12 rounded-[28px] space-y-6 group hover:-translate-y-2 transition-all duration-500">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-3xl shadow-sm">
              🛡️
            </div>
            <h3 className="text-2xl font-bold text-[var(--base-color-plum-black)]">Pilih Pahlawan</h3>
            <p className="text-[var(--base-color-olive-gray)] font-medium leading-relaxed">
              Jadilah Ksatria, Peri, atau Penyihir. Setiap pahlawan memiliki misi unik di dunia cerita.
            </p>
          </div>

          <div className="bg-[var(--base-color-warm-wash)] border border-black/5 p-12 rounded-[28px] space-y-6 group hover:-translate-y-2 transition-all duration-500">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-3xl shadow-sm">
              📜
            </div>
            <h3 className="text-2xl font-bold text-[var(--base-color-plum-black)]">Kisah Nusantara</h3>
            <p className="text-[var(--base-color-olive-gray)] font-medium leading-relaxed">
              Mulai dari Legenda Danau Toba hingga Fabel Kancil. Semua dikemas secara interaktif.
            </p>
          </div>

          <div className="bg-[var(--base-color-warm-light)] p-12 rounded-[28px] space-y-6 group hover:-translate-y-2 transition-all duration-500">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-3xl shadow-sm">
              ⭐
            </div>
            <h3 className="text-2xl font-bold text-[var(--base-color-plum-black)]">Misi & Hadiah</h3>
            <p className="text-[var(--base-color-olive-gray)] font-medium leading-relaxed">
              Selesaikan misi membaca setiap hari dan kumpulkan lencana pahlawan legendaris.
            </p>
          </div>
        </div>
      </main>

      {/* 4. Dark Footer (Pinterest Style) */}
      <footer className="py-20 mt-20 bg-[var(--base-color-plum-dark)] text-white">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-start gap-12">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[var(--base-color-pinterest-red)] font-black text-2xl italic">
                B
              </div>
              <span className="text-2xl font-black tracking-tighter">
                BacaYuk
              </span>
            </div>
            <p className="text-white/40 max-w-sm text-sm font-medium">
              Platform cerita anak interaktif terbaik di Indonesia. Membantu imajinasi si kecil tumbuh dengan cara yang menyenangkan.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-12 text-sm font-bold">
            <div className="space-y-4">
              <h5 className="uppercase tracking-widest text-white/20 text-[10px]">Platform</h5>
              <p className="hover:underline cursor-pointer">Tentang Kami</p>
              <p className="hover:underline cursor-pointer">Koleksi Cerita</p>
              <p className="hover:underline cursor-pointer">Fitur Sekolah</p>
            </div>
            <div className="space-y-4">
               <h5 className="uppercase tracking-widest text-white/20 text-[10px]">Legal</h5>
               <p className="hover:underline cursor-pointer">Keamanan Anak</p>
               <p className="hover:underline cursor-pointer">Privasi</p>
               <p className="hover:underline cursor-pointer">Syarat & Ketentuan</p>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-20 pt-8 border-t border-white/5 text-[12px] text-white/20 font-medium">
          &copy; 2026 Bacayuk Platform. Crafted for small dreamers.
        </div>
      </footer>
    </div>
  );
}
