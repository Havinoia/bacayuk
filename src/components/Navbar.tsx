import Link from "next/link";
import { BookOpen, User, LogIn, Menu } from "lucide-react";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full bg-white/70 backdrop-blur-md border-b border-black/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/30 group-hover:rotate-12 transition-transform">
              <BookOpen size={24} strokeWidth={2.5} />
            </div>
            <span className="text-2xl font-black text-foreground tracking-tight">
              Baca<span className="text-primary">yuk</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/dashboard" className="text-sm font-bold text-foreground/60 hover:text-primary transition-colors">Semua Cerita</Link>
            <Link href="/dashboard?cat=fabel" className="text-sm font-bold text-foreground/60 hover:text-primary transition-colors">Fabel</Link>
            <Link href="/dashboard?cat=legenda" className="text-sm font-bold text-foreground/60 hover:text-primary transition-colors">Legenda</Link>
            
            <div className="h-6 w-px bg-black/10 mx-2" />
            
            <Link href="/auth/login" className="btn-primary py-2 px-6 flex items-center gap-2 text-sm">
              <LogIn size={18} />
              Masuk
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden p-2 text-foreground/60">
            <Menu size={24} />
          </button>
        </div>
      </div>
    </nav>
  );
}
