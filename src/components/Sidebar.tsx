"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { 
    BookOpen, 
    Sword, 
    School, 
    Settings, 
    LogOut, 
    Wand2 
} from "lucide-react";

export function Sidebar({ userRole }: { userRole?: string | null }) {
    const pathname = usePathname();
    const router = useRouter();
    const { data: session } = authClient.useSession();

    const handleSignOut = async () => {
        await authClient.signOut();
        router.push("/auth/login");
        router.refresh();
    };

    const navItems = [
        { label: "Library", icon: BookOpen, href: "/dashboard/collections" },
        { label: "Quests", icon: Sword, href: "/dashboard/quests" },
        { label: "Academy", icon: School, href: "/dashboard" },
    ];

    return (
        <aside className="hidden lg:flex flex-col h-screen w-64 sticky left-0 top-0 border-r border-black/5 bg-white/80 backdrop-blur-2xl shadow-[20px_0_40px_rgba(0,0,0,0.02)] py-8 px-4 z-50">
            <div className="flex items-center gap-3 px-2 mb-10">
                <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 text-white">
                    <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>school</span>
                </div>
                <div>
                    <h3 className="text-foreground font-black text-sm leading-tight font-header tracking-tight">Bacayuk Portal</h3>
                    <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest">
                        {userRole || "Apprentice"} Mage
                    </p>
                </div>
            </div>

            <nav className="flex-1 space-y-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link 
                            key={item.label}
                            href={item.href}
                            className={`
                                flex items-center gap-4 py-3 px-4 rounded-2xl transition-all duration-300 group
                                ${isActive 
                                    ? "bg-gradient-to-r from-primary to-blue-500 text-white shadow-lg shadow-primary/20" 
                                    : "text-foreground/40 hover:text-primary hover:bg-primary/5 hover:translate-x-1"
                                }
                            `}
                        >
                            <item.icon size={20} className={isActive ? "text-white" : "group-hover:text-primary"} />
                            <span className="font-bold text-sm tracking-tight">{item.label}</span>
                        </Link>
                    )
                })}
            </nav>

            <div className="mt-auto space-y-2 border-t border-black/5 pt-6">
                <button className="w-full py-4 mb-4 bg-primary text-white font-black rounded-2xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2">
                    <Wand2 size={18} />
                    Cast Magic
                </button>
                
                <Link 
                    href="/dashboard/settings" 
                    className="flex items-center gap-4 py-2 px-4 text-foreground/40 text-sm font-bold hover:text-primary transition-colors"
                >
                    <Settings size={18} />
                    <span>Settings</span>
                </Link>
                
                <button 
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-4 py-2 px-4 text-foreground/40 text-sm font-bold hover:text-red-500 transition-colors"
                >
                    <LogOut size={18} />
                    <span>Log Out</span>
                </button>
            </div>
        </aside>
    );
}
