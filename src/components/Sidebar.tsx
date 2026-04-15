"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { 
    Home,
    BookOpen,
    Trophy,
    User,
    LogOut, 
    Plus
} from "lucide-react";

export function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();

    const handleSignOut = async () => {
        await authClient.signOut();
        router.push("/auth/login");
        router.refresh();
    };

    const navItems = [
        { label: "Beranda", icon: Home, href: "/dashboard" },
        { label: "Koleksi", icon: BookOpen, href: "/dashboard/collections" },
        { label: "Misi", icon: Trophy, href: "/dashboard/quests" },
        { label: "Profil", icon: User, href: "/dashboard/profile" },
    ];

    return (
        <aside className="hidden lg:flex flex-col h-screen w-20 xl:w-64 sticky left-0 top-0 bg-white py-8 px-4 border-r border-black/5 z-50">
            {/* Logo */}
            <div className="flex items-center justify-center xl:justify-start gap-4 px-2 mb-10">
                <Link href="/dashboard" className="w-12 h-12 rounded-full bg-[var(--base-color-pinterest-red)] flex items-center justify-center text-white shadow-lg active:scale-95 transition-all">
                    <span className="font-black text-2xl italic leading-none pr-0.5">B</span>
                </Link>
                <span className="hidden xl:block font-black text-xl text-[var(--base-color-plum-black)] tracking-tighter">
                    Bacayuk
                </span>
            </div>

            <nav className="flex-1 space-y-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href || 
                        (item.href !== "/dashboard" && pathname.startsWith(item.href));
                    return (
                        <Link 
                            key={item.label}
                            href={item.href}
                            className={`
                                flex items-center justify-center xl:justify-start gap-4 py-3 px-3 xl:px-4 rounded-[var(--comp-button-radius)] transition-all duration-300 group
                                ${isActive 
                                    ? "bg-[var(--base-color-plum-black)] text-white shadow-lg" 
                                    : "text-[var(--base-color-plum-black)] hover:bg-[var(--base-color-sand-gray)]"
                                }
                            `}
                        >
                            <item.icon size={24} strokeWidth={isActive ? 3 : 2} />
                            <span className={`hidden xl:block font-bold text-base ${isActive ? "opacity-100" : "opacity-80"}`}>{item.label}</span>
                        </Link>
                    )
                })}

                <div className="pt-6 space-y-3 border-t border-black/5 mt-4">
                   <p className="hidden xl:block text-[10px] font-black text-[var(--base-color-olive-gray)] uppercase tracking-widest pl-4 mb-2">Kategori</p>
                   {["Fabel", "Legenda", "Dongeng"].map(cat => (
                      <Link key={cat} href={`/dashboard/collections?cat=${cat.toLowerCase()}`} className="hidden xl:flex items-center gap-3 py-2 px-4 rounded-full text-sm font-bold text-[var(--base-color-plum-black)] hover:bg-[var(--base-color-sand-gray)] transition-all">
                        <div className="w-2 h-2 rounded-full bg-[var(--base-color-pinterest-red)]" />
                        {cat}
                      </Link>
                   ))}
                </div>
            </nav>

            <div className="mt-auto space-y-3 border-t border-black/5 pt-6">
                <Link 
                    href="/dashboard/collections"
                    className="w-full h-12 xl:h-auto py-4 bg-[var(--base-color-pinterest-red)] text-white font-black rounded-[var(--comp-button-radius)] shadow-lg shadow-red-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                    <Plus size={24} strokeWidth={3} />
                    <span className="hidden xl:block">Jelajahi Cerita</span>
                </Link>
                
                <button 
                    onClick={handleSignOut}
                    className="w-full flex items-center justify-center xl:justify-start gap-4 py-3 px-3 xl:px-4 text-[var(--base-color-olive-gray)] hover:text-red-500 transition-colors rounded-[var(--comp-button-radius)] hover:bg-red-50"
                >
                    <LogOut size={24} />
                    <span className="hidden xl:block font-bold">Keluar</span>
                </button>
            </div>
        </aside>
    );
}
