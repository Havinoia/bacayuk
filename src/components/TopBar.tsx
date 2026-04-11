"use client";

import { Search, Bell, Sparkles } from "lucide-react";
import { authClient } from "@/lib/auth-client";

export function TopBar() {
    const { data: session } = authClient.useSession();

    return (
        <header className="sticky top-0 z-40 bg-white/70 backdrop-blur-xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] px-6 py-4 flex justify-between items-center w-full border-b border-black/5">
            <div className="flex items-center gap-8">
                <h1 className="text-2xl font-black font-header tracking-tight text-primary bg-clip-text bg-gradient-to-r from-primary to-blue-600">
                    Magical Academy
                </h1>
                
                <div className="hidden lg:flex items-center gap-2 bg-muted/50 px-4 py-2 rounded-full border border-black/5 w-80 group focus-within:bg-white transition-all">
                    <Search size={16} className="text-foreground/40 group-focus-within:text-primary" />
                    <input 
                        type="text" 
                        placeholder="Search for spells or books..." 
                        className="bg-transparent border-none focus:ring-0 text-sm font-bold w-full placeholder:text-foreground/20"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4">
                <button className="p-2.5 rounded-full hover:bg-primary/5 transition-all text-foreground/40 hover:text-primary relative group">
                    <Bell size={20} />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
                </button>
                
                <button className="p-2.5 rounded-full hover:bg-primary/5 transition-all text-primary">
                    <Sparkles size={20} />
                </button>
                
                <div className="flex items-center gap-3 pl-2">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-black text-foreground leading-none">{session?.user?.name}</p>
                        <p className="text-[10px] font-black text-primary uppercase tracking-widest mt-1 italic">Apprentice</p>
                    </div>
                    <div className="h-10 w-10 rounded-2xl overflow-hidden border-2 border-primary/20 bg-primary/10 flex items-center justify-center text-primary font-black shadow-inner">
                        {session?.user?.name?.charAt(0) || "U"}
                    </div>
                </div>
            </div>
        </header>
    );
}
