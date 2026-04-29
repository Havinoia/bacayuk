"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronRight, Trophy, Star, Clock, Target, Check } from "lucide-react";
import Link from "next/link";
import { StoryPin } from "./StoryPin";
import { QuestCountdown } from "./QuestCountdown";
import "@/app/dashboard/dashboard.css";

interface DashboardClientProps {
    userName: string;
    userImage?: string | null;
    completedCount: number;
    totalStories: number;
    allStories: { id: number; title: string; slug: string; thumbnailUrl: string | null; category?: { name: string } | null }[];
    userActiveQuests: { id: number; isCompleted: boolean; quest: { title: string; type: string; pointsReward: number } }[];
    heroPoints: number;
    bookmarkIds?: number[];
}

export function DashboardClient({ 
    userName, 
    userImage,
    completedCount, 
    totalStories, 
    allStories, 
    userActiveQuests,
    heroPoints,
    bookmarkIds = []
}: DashboardClientProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isFullyRevealed, setIsFullyRevealed] = useState(false);

    // 1. Fluid Scroll Listener (Interpolation)
    useEffect(() => {
        const handleScroll = () => {
            if (!containerRef.current) return;
            
            const scrollY = window.scrollY;
            const threshold = 500; // Increased threshold for a more majestic peel-off
            const progress = Math.min(Math.max(scrollY / threshold, 0), 1);
            
            // Set CSS variable for 60fps smooth animation
            containerRef.current.style.setProperty('--lift-progress', progress.toString());
            
            // State Toggles with Hysteresis (Prevents "blinking")
            if (progress > 0.95) {
                if (!isFullyRevealed) setIsFullyRevealed(true);
            } else if (progress < 0.85) {
                if (isFullyRevealed) setIsFullyRevealed(false);
            }
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        handleScroll(); // Initial check
        return () => window.removeEventListener("scroll", handleScroll);
    }, [isFullyRevealed]);

    return (
        <div ref={containerRef} className="relative bg-white dashboard-reveal-wrapper" style={{ '--lift-progress': '0' } as React.CSSProperties}>
            
            {/* 1. THE CURTAIN (Hero Layer - Lifts UP) */}
            <div 
                className={`curtain-container transform-gpu ${isFullyRevealed ? 'curtain-fully-lifted' : ''}`}
                style={{ 
                    transform: `translateY(calc(var(--lift-progress) * -100%))`,
                    opacity: `calc(max(0, 1 - var(--lift-progress) * 1.1))`
                }}
            >
                <section className="px-6 max-w-7xl mx-auto text-center space-y-12">
                    <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-[var(--base-color-warm-wash)] text-[14px] font-black tracking-[0.3em] text-[var(--base-color-olive-gray)] uppercase shadow-sm border border-black/5">
                        {userImage && (
                            <div className="w-6 h-6 rounded-full overflow-hidden border border-black/10 shrink-0">
                                <img src={userImage} alt="Profile" className="w-full h-full object-cover" />
                            </div>
                        )}
                        Halo Petualang, {userName}
                    </div>
                    
                    <h1 className="text-6xl md:text-9xl font-black font-header text-[var(--base-color-plum-black)] leading-[0.8] tracking-tighter">
                        Dunia <span className="text-[var(--base-color-pinterest-red)]">Ajaib</span> <br className="hidden md:block" />
                        Menantimu.
                    </h1>

                    <p className="text-2xl text-[var(--base-color-olive-gray)] max-w-2xl mx-auto font-medium leading-relaxed">
                        Kamu sudah membaca {completedCount} dari {totalStories} cerita. Ayo temukan petualangan barumu hari ini!
                    </p>
                    
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8">
                        <button 
                            onClick={() => {
                                window.scrollTo({ top: 600, behavior: 'smooth' });
                            }}
                            className="btn-pin-primary py-6 px-12 text-white text-2xl shadow-3xl shadow-red-500/30 cursor-pointer"
                        >
                            Mulai Membaca Sekarang
                        </button>
                    </div>

                    {!isFullyRevealed && (
                        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce flex flex-col items-center gap-4 opacity-40">
                            <span className="text-[12px] font-black uppercase tracking-widest text-slate-400">Scroll untuk Membuka</span>
                            <div className="w-8 h-12 border-2 border-slate-300 rounded-full flex justify-center p-1.5">
                                <div className="w-1.5 h-3 bg-slate-300 rounded-full" />
                            </div>
                        </div>
                    )}
                </section>
            </div>

            {/* 2. THE CONTENT (Revealed in the same place as the curtain) */}
            <div className="dashboard-main-content">
                <div className="px-4 md:px-10 pt-32 pb-16 max-w-[2000px] mx-auto flex flex-col lg:flex-row gap-12">
                    
                    {/* Left Column: Popular Stories */}
                    <div className="flex-1 space-y-12">
                        <div className="flex items-center justify-between border-b-2 border-black pb-8">
                            <h2 className="text-4xl font-black text-[var(--base-color-plum-black)] italic tracking-tight uppercase">Cerita Terpopuler</h2>
                            <Link href="/dashboard/collections" className="text-[14px] font-black text-[var(--base-color-pinterest-red)] hover:underline flex items-center gap-1 uppercase tracking-widest">
                                Lihat Semua <ChevronRight size={18} />
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
                            {allStories.map((story) => (
                                <div 
                                    key={story.id} 
                                    className="reveal-static-item"
                                >
                                    <StoryPin 
                                        id={story.id}
                                        title={story.title}
                                        slug={story.slug}
                                        thumbnailUrl={story.thumbnailUrl || ""}
                                        author={undefined}
                                        category={story.category || { name: "Cerita" }}
                                        isFeatured={true}
                                        isSavedInitial={bookmarkIds.includes(story.id)}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Column: Quests */}
                    <div className="w-full lg:w-96 shrink-0 h-fit space-y-10">
                        <section className="space-y-10 bg-[var(--base-color-warm-wash)] p-10 rounded-[4rem] border-2 border-black/5 shadow-2xl">
                            <div className="space-y-4">
                                <h3 className="text-3xl font-black text-[var(--base-color-plum-black)] flex items-center justify-between">
                                    Misi Harian <Trophy size={32} className="text-amber-500" />
                                </h3>
                                <QuestCountdown />
                            </div>

                            <div className="bg-white p-8 rounded-[3rem] border-2 border-black/5 flex items-center justify-between shadow-xl">
                                <div className="space-y-1">
                                    <p className="text-[12px] font-black text-[var(--base-color-olive-gray)] uppercase tracking-widest">Poin Aktivitas</p>
                                    <p className="text-4xl font-black text-[var(--base-color-pinterest-red)]">0</p>
                                </div>
                                <div className="w-16 h-16 rounded-[2rem] bg-amber-50 flex items-center justify-center text-amber-500 shadow-inner">
                                    <Star size={32} className="fill-amber-500" />
                                </div>
                            </div>

                            <div className="space-y-6">
                                {userActiveQuests.slice(0, 3).map((uq) => (
                                    <Link key={uq.id} href="/dashboard/quests">
                                        <div className={`p-8 rounded-[3rem] flex items-center gap-6 border-2 transition-all group relative overflow-hidden active:scale-95 ${uq.isCompleted ? 'bg-emerald-50 border-emerald-100' : 'bg-white border-black/5 hover:border-[var(--base-color-pinterest-red)] shadow-xl'}`}>
                                            <div className={`w-16 h-16 rounded-[2rem] flex items-center justify-center shrink-0 ${uq.isCompleted ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-50 text-slate-400'}`}>
                                                {uq.quest.type === 'READING' ? <Clock size={32} /> : <Target size={32} />}
                                            </div>
                                            <div className="flex-1 overflow-hidden">
                                                <h5 className="font-black text-[18px] text-[var(--base-color-plum-black)] line-clamp-1 group-hover:text-[var(--base-color-pinterest-red)] transition-colors">{uq.quest.title}</h5>
                                                <div className="flex items-center gap-2 mt-1.5">
                                                    <Star size={14} className="text-amber-500 fill-amber-500" />
                                                    <p className="text-[12px] font-black text-amber-600 uppercase tracking-widest">+{uq.quest.pointsReward} POIN</p>
                                                </div>
                                            </div>
                                            {uq.isCompleted && (
                                                <div className="bg-emerald-500 text-white p-2 rounded-full shadow-lg">
                                                    <Check size={20} />
                                                </div>
                                            )}
                                        </div>
                                    </Link>
                                ))}
                            </div>
                            <Link href="/dashboard/quests" className="btn-pin-secondary w-full py-5 text-[14px] font-black uppercase tracking-widest text-center shadow-xl">
                                Semua Misi →
                            </Link>
                        </section>
                    </div>
                </div>
            </div>

            {/* 3. REVEAL SPACER (This provides the 'lift' distance) */}
            <div className="dashboard-reveal-spacer" />

        </div>
    );
}
