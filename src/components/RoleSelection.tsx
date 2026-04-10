"use client";

import { useState } from "react";
import { updateHeroRole } from "@/app/actions/hero";
import { Shield, Sparkles, Sword, Hammer, Target, CheckCircle2 } from "lucide-react";

const ROLES = [
    {
        id: "dwarf",
        name: "Dwarf",
        emoji: "⚒️",
        icon: Hammer,
        color: "bg-orange-100 text-orange-600 border-orange-200",
        ringColor: "ring-orange-200",
        desc: "Tangguh dan ahli membuat senjata sakti!"
    },
    {
        id: "peri",
        name: "Peri",
        emoji: "🧚",
        icon: Sparkles,
        color: "bg-emerald-100 text-emerald-600 border-emerald-200",
        ringColor: "ring-emerald-200",
        desc: "Lincah dan memiliki sihir alam yang indah."
    },
    {
        id: "kesatria",
        name: "Kesatria",
        emoji: "⚔️",
        icon: Sword,
        color: "bg-blue-100 text-blue-600 border-blue-200",
        ringColor: "ring-blue-200",
        desc: "Pemberani yang selalu melindungi teman."
    },
    {
        id: "penyihir",
        name: "Penyihir",
        emoji: "🧙‍♂️",
        icon: Sparkles,
        color: "bg-purple-100 text-purple-600 border-purple-200",
        ringColor: "ring-purple-200",
        desc: "Bijaksana dengan mantra-mantra kuno."
    },
    {
        id: "pemanah",
        name: "Pemanah",
        emoji: "🏹",
        icon: Target,
        color: "bg-rose-100 text-rose-600 border-rose-200",
        ringColor: "ring-rose-200",
        desc: "Fokus dan sangat ahli dalam ketepatan."
    }
];

export default function RoleSelection({ 
    currentRole 
}: { 
    currentRole?: string | null
}) {
    const [selected, setSelected] = useState<string | null>(currentRole || null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSelect = async (roleId: string) => {
        if (roleId === selected) return;
        
        setError(null);
        setLoading(true);
        
        const res = await updateHeroRole(roleId);
        
        if (res.error) {
            setError(res.error);
            setLoading(false);
        } else {
            setSelected(roleId);
            setLoading(false);
        }
    };

    return (
        <div className="relative">
            {/* Header */}
            <div className="flex flex-col items-center text-center space-y-4 mb-20 relative">
                <div className="w-24 h-2 bg-primary/20 rounded-full mb-4" />
                <h2 className="text-5xl md:text-7xl font-black text-foreground tracking-tight">
                    Pilih <span className="text-primary italic">Pahlawanmu!</span>
                </h2>
                <p className="text-foreground/40 font-bold uppercase tracking-[0.3em] text-[10px]">
                    Siapa karakter petualangmu hari ini?
                </p>
            </div>

            {/* Error Message */}
            {error && (
                <div className="max-w-md mx-auto mb-12 p-6 bg-red-50 border-2 border-red-200 rounded-[2rem] text-red-600 font-bold text-center animate-bounce shadow-xl">
                    ⚠️ {error}
                </div>
            )}

            {/* Role Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
                {ROLES.map((role) => {
                    const isSelected = selected === role.id;

                    return (
                        <div 
                            key={role.id}
                            onClick={() => !loading && handleSelect(role.id)}
                            className={`
                                bubble-card p-10 flex flex-col items-center justify-center text-center space-y-6 cursor-pointer group transition-all duration-500
                                ${isSelected ? `ring-[12px] ${role.ringColor} border-primary scale-105 shadow-2xl` : 'hover:-translate-y-4 hover:border-primary/40'}
                                ${loading ? 'opacity-50 grayscale cursor-wait' : ''}
                            `}
                        >
                            <div className={`
                                w-24 h-24 rounded-[3rem] flex items-center justify-center text-4xl shadow-xl transition-all duration-500
                                ${role.color}
                                ${isSelected ? 'scale-110 rotate-12' : 'group-hover:rotate-12'}
                            `}>
                                {role.emoji}
                            </div>
                            <div className="space-y-3">
                                <h3 className="text-2xl font-black text-foreground group-hover:text-primary transition-colors">{role.name}</h3>
                                <p className="text-[11px] font-bold text-foreground/40 leading-relaxed uppercase tracking-wider">
                                    {role.desc}
                                </p>
                            </div>
                            {isSelected && (
                                <div className="pt-2 text-primary animate-pulse">
                                    <CheckCircle2 size={36} strokeWidth={3} />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
