"use client";

import { useState } from "react";
import { CheckCircle2, Loader2, Sparkles } from "lucide-react";
import { toggleStoryCompletion } from "@/lib/actions/progress";
import { useRouter } from "next/navigation";

interface MarkAsFinishedProps {
    storyId: number;
    userId: string;
    isCompleted: boolean;
}

export function MarkAsFinished({ storyId, userId, isCompleted }: MarkAsFinishedProps) {
    const [loading, setLoading] = useState(false);
    const [completed, setCompleted] = useState(isCompleted);
    const router = useRouter();

    const handleToggle = async () => {
        try {
            setLoading(true);
            await toggleStoryCompletion(userId, storyId);
            setCompleted(!completed);
            router.refresh();
        } catch (error) {
            console.error("Failed to update progress:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button 
            onClick={handleToggle}
            disabled={loading}
            className={`
                relative px-10 py-5 rounded-[2rem] font-black text-lg md:text-xl transition-all duration-500 flex items-center gap-3 overflow-hidden group
                ${completed 
                    ? "bg-emerald-500 text-white shadow-xl shadow-emerald-200" 
                    : "bg-primary text-white shadow-xl shadow-primary/20 hover:scale-105 active:scale-95"
                }
            `}
        >
            {/* Shimmer Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            
            {loading ? (
                <Loader2 size={24} className="animate-spin" />
            ) : completed ? (
                <>
                    <CheckCircle2 size={24} />
                    Selesai Baca ✅
                </>
            ) : (
                <>
                    <Sparkles size={24} />
                    Selesai Baca! ✨
                </>
            )}

            {/* Subtle glow when completed */}
            {completed && (
                <div className="absolute inset-0 ring-4 ring-emerald-300 ring-inset rounded-[2rem] animate-pulse" />
            )}
        </button>
    );
}
