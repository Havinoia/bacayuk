"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
    Home,
    BookOpen,
    Trophy,
    User 
} from "lucide-react";

export function BottomNav() {
    const pathname = usePathname();

    const navItems = [
        { label: "Beranda", icon: Home, href: "/dashboard" },
        { label: "Koleksi", icon: BookOpen, href: "/dashboard/collections" },
        { label: "Misi", icon: Trophy, href: "/dashboard/quests" },
        { label: "Profil", icon: User, href: "/dashboard/profile" },
    ];

    return (
        <nav className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-xl border border-black/5 rounded-full px-6 py-3 flex items-center gap-8 z-50 shadow-2xl">
            {navItems.map((item) => {
                const isActive = item.href === "/dashboard" 
                    ? pathname === item.href 
                    : pathname.startsWith(item.href);
                return (
                    <Link key={item.label} href={item.href} className="relative flex flex-col items-center gap-1">
                        <item.icon size={24} className={isActive ? "text-[var(--base-color-plum-black)]" : "text-[var(--base-color-olive-gray)] opacity-50"} strokeWidth={isActive ? 3 : 2} />
                        <span className={`text-[9px] font-black uppercase tracking-wider ${isActive ? "text-[var(--base-color-plum-black)]" : "text-[var(--base-color-olive-gray)] opacity-50"}`}>{item.label}</span>
                        {isActive && <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[var(--base-color-pinterest-red)] rounded-full" />}
                    </Link>
                );
            })}
        </nav>
    );
}
