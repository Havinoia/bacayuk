"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
    BookOpen, 
    Sword, 
    School, 
    Settings, 
    Wand2, 
    User 
} from "lucide-react";

export function BottomNav() {
    const pathname = usePathname();

    const navItems = [
        { label: "Library", icon: BookOpen, href: "/dashboard/collections" },
        { label: "Quests", icon: Sword, href: "/dashboard/quests" },
        { label: "Academy", icon: School, href: "/dashboard" },
        { label: "Profile", icon: User, href: "/dashboard/settings" },
    ];

    return (
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 glass-panel border-t border-black/5 px-6 py-4 flex justify-between items-center z-50">
            {navItems.slice(0, 2).map((item) => {
                const isActive = pathname === item.href;
                return (
                    <Link key={item.label} href={item.href} className="flex flex-col items-center gap-1">
                        <item.icon size={22} className={isActive ? "text-primary" : "text-foreground/40"} />
                        <span className={`text-[10px] font-black uppercase tracking-widest ${isActive ? "text-primary" : "text-foreground/40"}`}>
                            {item.label}
                        </span>
                    </Link>
                );
            })}

            <div className="relative -mt-12">
                <button className="w-16 h-16 rounded-full bg-primary text-white shadow-2xl shadow-primary/40 flex items-center justify-center border-4 border-white active:scale-90 transition-all">
                    <Wand2 size={24} />
                </button>
            </div>

            {navItems.slice(2).map((item) => {
                const isActive = pathname === item.href;
                return (
                    <Link key={item.label} href={item.href} className="flex flex-col items-center gap-1">
                        <item.icon size={22} className={isActive ? "text-primary" : "text-foreground/40"} />
                        <span className={`text-[10px] font-black uppercase tracking-widest ${isActive ? "text-primary" : "text-foreground/40"}`}>
                            {item.label}
                        </span>
                    </Link>
                );
            })}
        </nav>
    );
}
