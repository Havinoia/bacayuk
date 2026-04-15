"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, Loader2 } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";

export function SearchInput() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const searchQuey = searchParams.get("q") || "";
    const [value, setValue] = useState(searchQuey);
    const debouncedValue = useDebounce<string>(value, 500);

    // Sync input local state with URL changes (e.g. when clicking filter links)
    useEffect(() => {
        setValue(searchQuey);
    }, [searchQuey]);

    useEffect(() => {
        const currentQuery = searchParams.get("q") || "";
        
        // CRITICAL FIX: Only update URL if the search value is actually different 
        // from what's already there. Prevents the infinite loop.
        if (debouncedValue === currentQuery) return;

        const params = new URLSearchParams(searchParams.toString());
        if (debouncedValue) {
            params.set("q", debouncedValue);
        } else {
            params.delete("q");
        }
        
        // Use replace to avoid filling up the history stack with every keystroke
        router.replace(`/dashboard/collections?${params.toString()}`);
    }, [debouncedValue, router, searchParams]);

    return (
        <div className="relative group min-w-[300px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/20 group-focus-within:text-primary transition-colors" size={20} />
            <input 
                type="text" 
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Cari judul cerita..." 
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white border border-black/5 shadow-sm outline-none focus:ring-4 focus:ring-primary/10 transition-all font-bold text-sm"
            />
            {value !== debouncedValue && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <Loader2 className="animate-spin text-primary/40" size={16} />
                </div>
            )}
        </div>
    );
}
