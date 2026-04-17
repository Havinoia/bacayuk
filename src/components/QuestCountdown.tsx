"use client";

import { useState, useEffect } from "react";
import { Clock } from "lucide-react";

export function QuestCountdown() {
    const [timeLeft, setTimeLeft] = useState("");

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date();
            const tomorrow = new Date(now);
            tomorrow.setDate(tomorrow.getDate() + 1);
            tomorrow.setHours(0, 0, 0, 0);

            const diff = tomorrow.getTime() - now.getTime();

            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            setTimeLeft(
                `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
            );
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="flex items-center gap-2 text-[10px] font-black text-[var(--base-color-olive-gray)] uppercase tracking-widest bg-[var(--base-color-sand-gray)] px-3 py-1.5 rounded-full border border-black/5 shadow-inner">
            <Clock size={12} className="text-[var(--base-color-pinterest-red)]" />
            <span>Reset Dalam: <span className="text-[var(--base-color-plum-black)] font-mono">{timeLeft || "00:00:00"}</span></span>
        </div>
    );
}
