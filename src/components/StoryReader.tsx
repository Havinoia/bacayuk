"use client";

import { useState, useEffect, useRef } from "react";
import { 
    ChevronLeft, 
    ChevronRight, 
    Bookmark, 
    Heart, 
    Sparkles, 
    Loader2, 
    CheckCircle2,
    BookOpen 
} from "lucide-react";
import { togglePagePin, togglePageFavorite } from "@/lib/actions/storyActions";
import { MarkAsFinished } from "./MarkAsFinished";
import { useRouter } from "next/navigation";

interface Page {
    pageNumber: number;
    content: string;
    imageUrl?: string | null;
}

interface StoryReaderProps {
    storyId: number;
    userId: string;
    pages: Page[];
    initialPage: number;
    initialFavorites: number[];
    isCompleted: boolean;
}

export function StoryReader({ 
    storyId, 
    userId, 
    pages, 
    initialPage, 
    initialFavorites,
    isCompleted
}: StoryReaderProps) {
    const router = useRouter();
    const readerRef = useRef<HTMLDivElement>(null);
    const [currentPage, setCurrentPage] = useState(initialPage || 1);
    const [pinnedPage, setPinnedPage] = useState<number | null>(initialPage);
    const [favorites, setFavorites] = useState<number[]>(initialFavorites);
    const [loadingPin, setLoadingPin] = useState(false);
    const [loadingFav, setLoadingFav] = useState(false);

    const currentPageData = pages.find(p => p.pageNumber === currentPage) || pages[0];
    const isFirstPage = currentPage === 1;
    const isLastPage = currentPage === pages.length;

    const isPinned = pinnedPage === currentPage;
    const isFavorited = favorites.includes(currentPage);

    const handlePin = async () => {
        if (loadingPin) return;
        setLoadingPin(true);
        try {
            await togglePagePin(userId, storyId, currentPage);
            setPinnedPage(isPinned ? null : currentPage);
            router.refresh();
        } catch (error) {
            console.error("Failed to pin page:", error);
        } finally {
            setLoadingPin(false);
        }
    };

    const handleFavorite = async () => {
        if (loadingFav) return;
        setLoadingFav(true);
        try {
            await togglePageFavorite(userId, storyId, currentPage);
            if (isFavorited) {
                setFavorites(favorites.filter(p => p !== currentPage));
            } else {
                setFavorites([...favorites, currentPage]);
            }
            router.refresh();
        } catch (error) {
            console.error("Failed to favorite page:", error);
        } finally {
            setLoadingFav(false);
        }
    };

    const scrollToContent = () => {
        if (readerRef.current) {
            // Calculate offset to account for some padding/header if necessary, 
            // but standard scrollIntoView is usually enough for "fokus ke div"
            readerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const goToNext = () => {
        if (!isLastPage) {
            setCurrentPage(currentPage + 1);
            scrollToContent();
        }
    };

    const goToPrev = () => {
        if (!isFirstPage) {
            setCurrentPage(currentPage - 1);
            scrollToContent();
        }
    };

    return (
        <div ref={readerRef} className="space-y-12 scroll-mt-24">
            {/* Action Bar */}
            <div className="flex justify-between items-center bg-white/50 backdrop-blur-md p-4 rounded-3xl border border-slate-100 shadow-sm">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={handlePin}
                        disabled={loadingPin}
                        className={`p-3 rounded-2xl transition-all duration-300 flex items-center gap-2 font-black text-xs uppercase tracking-widest ${
                            isPinned 
                                ? "bg-amber-100 text-amber-600 shadow-inner" 
                                : "bg-white text-slate-400 hover:text-amber-500 hover:bg-amber-50"
                        }`}
                    >
                        {loadingPin ? <Loader2 size={18} className="animate-spin" /> : <Bookmark size={18} fill={isPinned ? "currentColor" : "none"} />}
                        {isPinned ? "Tersemat" : "Sematkan"}
                    </button>

                    <button 
                        onClick={handleFavorite}
                        disabled={loadingFav}
                        className={`p-3 rounded-2xl transition-all duration-300 flex items-center gap-2 font-black text-xs uppercase tracking-widest ${
                            isFavorited 
                                ? "bg-rose-100 text-rose-600 shadow-inner" 
                                : "bg-white text-slate-400 hover:text-rose-500 hover:bg-rose-50"
                        }`}
                    >
                        {loadingFav ? <Loader2 size={18} className="animate-spin" /> : <Heart size={18} fill={isFavorited ? "currentColor" : "none"} />}
                        {isFavorited ? "Favorit" : "Sukai"}
                    </button>
                </div>

                <div className="px-6 py-2 bg-primary/10 rounded-full text-primary font-black text-xs uppercase tracking-widest">
                    Halaman {currentPage} dari {pages.length}
                </div>
            </div>

            <div className="pt-4" /> {/* Spacer after action bar */}

            {/* Content Display */}
            <div className="relative group min-h-[400px]">

                {/* Animated Page Container */}
                <div 
                    key={currentPage}
                    className="prose prose-slate max-w-none animate-in fade-in slide-in-from-right-8 duration-700 ease-out"
                >
                    <div className="text-xl md:text-3xl font-medium leading-[1.8] text-slate-700 space-y-8">
                        <div className="whitespace-pre-wrap first-letter:text-5xl first-letter:font-black first-letter:text-primary first-letter:mr-3 first-letter:float-left">
                            {currentPageData.content}
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Controls */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-8 pt-10 border-t-2 border-slate-50">
                <button 
                    onClick={goToPrev}
                    disabled={isFirstPage}
                    className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-lg transition-all ${
                        isFirstPage 
                            ? "opacity-0 pointer-events-none" 
                            : "bg-slate-100 text-slate-500 hover:bg-slate-200 hover:-translate-x-2"
                    }`}
                >
                    <ChevronLeft size={24} /> Sebelumnya
                </button>

                {!isLastPage ? (
                    <button 
                        onClick={goToNext}
                        className="bg-primary text-white flex items-center gap-3 px-12 py-5 rounded-[2.5rem] font-black text-xl shadow-xl shadow-primary/20 hover:scale-105 hover:translate-x-2 transition-all group"
                    >
                        Selanjutnya <ChevronRight size={24} className="group-hover:translate-x-2 transition-transform" />
                    </button>
                ) : (
                    <div className="animate-in zoom-in duration-500">
                         <MarkAsFinished 
                            storyId={storyId} 
                            userId={userId} 
                            isCompleted={isCompleted} 
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
