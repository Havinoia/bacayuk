"use client";

import { useState, useRef, useEffect } from "react";
import { Search, Bell, LogOut, Settings, User } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

export function TopBar() {
    const { data: session } = authClient.useSession();
    const router = useRouter();
    const pathname = usePathname();
    const [searchValue, setSearchValue] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchValue.trim()) {
            router.push(`/dashboard/collections?q=${encodeURIComponent(searchValue.trim())}`);
        }
    };

    const handleSignOut = async () => {
        await authClient.signOut();
        router.push("/auth/login");
    };

    // Close dropdown on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const isHome = pathname === "/dashboard";
    const isCollections = pathname.startsWith("/dashboard/collections");
    const isQuests = pathname.startsWith("/dashboard/quests");

    return (
        <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md px-6 py-4 flex items-center gap-4 w-full border-b border-black/5">

            
            {/* Search Bar */}
            <form onSubmit={handleSearchSubmit} className="flex-1 relative group mx-2">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--base-color-olive-gray)] opacity-50 group-focus-within:opacity-100 transition-opacity" size={18} />
                <input 
                    type="text" 
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    placeholder="Cari cerita ajaib..." 
                    className="w-full bg-[var(--base-color-sand-gray)] border-none rounded-full py-3.5 pl-12 pr-6 font-medium text-[15px] focus:ring-4 focus:ring-[var(--base-color-pinterest-red)]/10 transition-all placeholder:text-[var(--base-color-olive-gray)]/50 outline-none"
                />
            </form>

            {/* Profile & Dropdown */}
            <div className="flex items-center gap-1 shrink-0 relative" ref={dropdownRef}>
                <Link href="/dashboard/quests" className="btn-pin-circle relative border-none">
                    <Bell size={22} />
                </Link>
                
                <button 
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="btn-pin-circle border-none overflow-hidden p-0 ml-1 active:scale-95 transition-transform"
                >
                    {session?.user?.image ? (
                        <img src={session.user.image} alt="User" className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-tr from-[var(--base-color-sand-gray)] to-[var(--base-color-warm-light)] flex items-center justify-center text-[12px] font-black uppercase">
                            {session?.user?.name?.charAt(0) || "U"}
                        </div>
                    )}
                </button>

                {/* Pinterest Style Dropdown Menu */}
                {showDropdown && (
                    <div className="absolute top-14 right-0 w-72 bg-white rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-black/5 p-4 animate-in fade-in zoom-in-95 duration-200">
                        <div className="px-4 py-3 mb-2">
                            <p className="text-[14px] font-medium text-[var(--base-color-olive-gray)]">Akun Anda</p>
                            <div className="flex items-center gap-3 mt-3 p-2 rounded-2xl bg-[var(--base-color-warm-light)]/30 border border-black/5">
                                <div className="w-10 h-10 rounded-full bg-[var(--base-color-sand-gray)] flex items-center justify-center text-xs font-black">
                                    {session?.user?.name?.charAt(0) || "U"}
                                </div>
                                <div className="overflow-hidden">
                                    <p className="font-bold text-[14px] truncate text-[var(--base-color-plum-black)]">{session?.user?.name}</p>
                                    <p className="text-[12px] text-[var(--base-color-olive-gray)] truncate">{session?.user?.email}</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <Link href="/dashboard/profile" className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-[var(--base-color-sand-gray)] transition-colors text-[14px] font-bold text-[var(--base-color-plum-black)]">
                                <User size={18} /> Profil
                            </Link>
                            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-[var(--base-color-sand-gray)] transition-colors text-[14px] font-bold text-[var(--base-color-plum-black)] text-left">
                                <Settings size={18} /> Pengaturan
                            </button>
                            <div className="h-px bg-black/5 my-2 mx-4" />
                            <button 
                                onClick={handleSignOut}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-red-50 text-[14px] font-bold text-red-600 transition-colors text-left"
                            >
                                <LogOut size={18} /> Keluar
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}
