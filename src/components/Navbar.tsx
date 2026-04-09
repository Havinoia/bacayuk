"use client";

import Link from "next/link";
import { BookOpen, User, LogIn, Menu, LogOut, Loader2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export function Navbar() {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push("/auth/login");
    router.refresh();
  };

  return (
    <nav className="fixed top-6 inset-x-4 md:inset-x-10 z-50 h-20 bg-white/60 backdrop-blur-xl border-4 border-white rounded-full shadow-[0_15px_40px_rgba(0,0,0,0.05)] flex items-center px-4 md:px-10">
      <div className="w-full flex justify-between items-center">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/30 group-hover:rotate-[15deg] group-hover:scale-110 transition-transform duration-300">
              <BookOpen size={24} strokeWidth={3} />
            </div>
            <span className="text-2xl md:text-3xl font-black text-foreground tracking-tighter">
              Baca<span className="text-primary italic">yuk</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/dashboard/collections" className="px-5 py-2 rounded-full text-sm font-black text-foreground/40 hover:text-primary hover:bg-primary/5 transition-all">Jelajah Cerita</Link>
            
            <div className="h-6 w-px bg-black/5" />
            
            {isPending ? (
                 <Loader2 className="animate-spin text-primary" size={20} />
            ) : session ? (
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3 bg-white/50 px-4 py-2 rounded-full border border-white">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-black">
                            {session.user.name.charAt(0)}
                        </div>
                        <span className="text-sm font-black text-foreground">{session.user.name}</span>
                    </div>
                    <button 
                        onClick={handleSignOut}
                        className="px-6 py-2.5 rounded-full text-sm font-black text-red-500 hover:bg-red-50 transition-all cursor-pointer active:scale-90"
                    >
                        <LogOut size={18} className="inline mr-2" /> Keluar
                    </button>
                </div>
            ) : (
                <Link href="/auth/login" className="btn-primary py-2.5 px-8 flex items-center gap-2 text-sm">
                    <LogIn size={18} strokeWidth={3} />
                    Masuk
                </Link>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden p-3 bg-primary/10 text-primary rounded-2xl">
            <Menu size={24} strokeWidth={3} />
          </button>
      </div>
    </nav>
  );
}
