"use client";

import { useState } from "react";
import { updateHeroRole } from "@/app/actions/hero";
import { useRouter } from "next/navigation";

const ROLES = [
    {
        id: "dwarf",
        name: "Dwarf",
        subtitle: "Strength",
        statLabel: "Vitalitas Tinggi",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDOTiGvsaEbGL427buSXNpEA9JbnClZ_qsV9qfSA0qXzexiP4QV_NwxXiNIKjNlHzxH9FQO5BhNA8OKuo4OnpuEeSMOie04AcG6sxqb1sMU0ySehc6vSrEtAebhVwcrWM7vdNnr37AX0NkiRYSRkTtdGkElWe8bQQvecucsuTvjwuIY3jet5eEZs34_frpf_SUuY4JNeQ-XiNOVZXtQWbA9bK-IxH5zojeFNwg5Zy7eGNlGTDxmQVN63Zaf9i3SUs1HLtGflWqcHeU",
        glowClass: "hero-glow-dwarf",
        overlay: "from-amber-900/90",
        statColor: "text-amber-600",
        statBg: "bg-amber-400"
    },
    {
        id: "peri",
        name: "Peri",
        subtitle: "Nature",
        statLabel: "Harmoni Alam",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA_2wEC4pie8U99I9YqZUNz54P2AX-Dk310IDLspiMmji83Ww9wOhpyx7smTwPSbZjXy2xYNmBe3sW9LlYsDSNoZ-UzfKRXO-dWxy2-m7J-7YREUPPudZHvZCvyX1hQlQtEtosfAB88hVGr1MSmPJXvRtQrx0fQDVe7NhBNeZznFZM-yYMzVxwmPBupRwdZR9XaiUz6IKwv0cWb5-VQucXvmg3S6Xn3RASuHTHVaR4tBZPQmEx8ULGuK2YEPMeuspiiTf-XE1kSE6Q",
        glowClass: "hero-glow-peri",
        overlay: "from-emerald-900/90",
        statColor: "text-emerald-600",
        statBg: "bg-emerald-400"
    },
    {
        id: "kesatria",
        name: "Kesatria",
        subtitle: "Wisdom",
        statLabel: "Wawasan Luas",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD570WHrUNGLcNAjCuHVJXYCkaQo942CuDUvnNMXbtlrF7GppkdK60DQACodJqIAPATloj8laT0PiQ0700qDepnWQey6DJvRfgluVA1qQXHDizBj8wkZ10upf9DVZMv3lc-zVSjRL62zQSSAW9oqgQHB1VtaDE-nqOLJzH_mP5ma-EoUoVhEVJUdI95P2SdqUxmKa5XgDXVG8zbHVmzYKaxsSRH2SaGCVb607nTuFQqXb1ZmKF6KSZttrlKJlghl4KcurCbX7bnf0E",
        glowClass: "hero-glow-kesatria",
        overlay: "from-blue-900/90",
        statColor: "text-blue-600",
        statBg: "bg-blue-400",
        featured: true
    },
    {
        id: "penyihir",
        name: "Penyihir",
        subtitle: "Arcane",
        statLabel: "Kekuatan Sihir",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBYWl3Gl4JWe4RgRQXQ_UJ-2St-XgDlTyfOv8_sAvTSKmip0mzJPoD0CfLbP-3OOCQc-n6vFthpcRr2tzKJUykFncreYpT854kiA9jXYLeGxbjoXZzOPNhffE5NaoWwa3zLx2iq_3kVuQJM5m13ZCO_fD0hd-DJH4B6Nf6pJdQVvKtoaRVSXUTa1cKX6vXABCCDM-5ImX3gxC7r5_QeXcl0S_WroNPWbckI3kfg87UpB2OivP0XI3p8LZSgjUK_JhOka3bNKr8Dz-Q",
        glowClass: "hero-glow-penyihir",
        overlay: "from-purple-900/90",
        statColor: "text-purple-600",
        statBg: "bg-purple-400"
    },
    {
        id: "pemanah",
        name: "Pemanah",
        subtitle: "Precision",
        statLabel: "Fokus Tajam",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCrHvuYdj3bT-78w-oQdPKb1ecnppXOS5KO_JGBDl1C4sdt9zjkRn-6wLcIoLUox55m8NQ3zn_2wB1IMs_l3dhXxenZjekCD7-dKTvra2m3_-N-JURvuDzTDWisgxJ4hULK9KNFklMczPOE_xn3V4SgFTUjjdPavjZlnKq5wuuX2x6yFzq4P-sgOwvebgX-3DymUZtSSh-HQhUViRm2D9wZJ30Plv-8BPMoE8uvUPIq6y-xUxthPLI6Hl_ddTeCSLhzAoKUobnXU2g",
        glowClass: "hero-glow-pemanah",
        overlay: "from-rose-900/90",
        statColor: "text-rose-600",
        statBg: "bg-rose-400"
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
    const router = useRouter();

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
            router.refresh();
        }
    };

    return (
        <div className="relative">
            {/* Header Section */}
            <div className="text-center mb-16 space-y-4">
                <h2 className="text-5xl md:text-6xl font-header font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">
                    Pilih Pahlawanmu
                </h2>
                <p className="text-foreground/60 text-lg max-w-2xl mx-auto font-bold uppercase tracking-widest text-xs">
                    Setiap petualangan besar dimulai dengan satu langkah berani. Siapakah yang akan memandu ceritamu hari ini?
                </p>
            </div>

            {/* Error Message */}
            {error && (
                <div className="max-w-md mx-auto mb-12 p-6 bg-red-50 border-2 border-red-200 rounded-[2rem] text-red-600 font-bold text-center animate-bounce shadow-xl relative z-20">
                    ⚠️ {error}
                </div>
            )}

            {/* Hero Gallery Grid */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-end relative z-10">
                {ROLES.map((role) => {
                    const isSelected = selected === role.id;
                    const isFeatured = role.featured;

                    return (
                        <div key={role.id} className="group relative flex flex-col items-center">
                            <div 
                                onClick={() => !loading && handleSelect(role.id)}
                                className={`
                                    w-full aspect-[3/5] bg-muted rounded-2xl overflow-hidden transition-all duration-500 cursor-pointer relative
                                    ${role.glowClass}
                                    ${isSelected ? 'scale-105 -translate-y-8 ring-8 ring-primary shadow-2xl z-20' : isFeatured ? '-translate-y-4 hover:-translate-y-8 shadow-xl' : 'hover:-translate-y-4'}
                                    ${loading ? 'opacity-50 grayscale cursor-wait' : ''}
                                `}
                            >
                                <img 
                                    src={role.image} 
                                    alt={role.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                {/* Gradient Overlay */}
                                <div className={`absolute inset-0 bg-gradient-to-t ${role.overlay} via-transparent to-transparent`} />
                                
                                {/* Recommended Badge */}
                                {isFeatured && !isSelected && (
                                    <div className="absolute top-4 right-4 bg-primary text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter shadow-lg">
                                        Recommended
                                    </div>
                                )}

                                {/* Card Content */}
                                <div className="absolute bottom-6 left-6 right-6 text-white">
                                    <span className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-1 block">
                                        {role.subtitle}
                                    </span>
                                    <h3 className={`font-header font-black leading-none ${isFeatured ? 'text-3xl' : 'text-2xl'}`}>
                                        {role.name}
                                    </h3>
                                </div>

                                {/* Selection Overlay */}
                                {isSelected && (
                                    <div className="absolute inset-0 bg-primary/20 backdrop-blur-[2px] flex items-center justify-center">
                                        <div className="bg-white text-primary p-3 rounded-full shadow-2xl animate-pulse">
                                            <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Hover Stat Label */}
                            <div className={`mt-4 transition-all duration-500 flex flex-col items-center gap-2 ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                                <span className={`${role.statColor} font-black text-xs uppercase tracking-widest`}>
                                    {role.statLabel}
                                </span>
                                <div className={`h-1 ${isSelected ? 'w-20' : 'w-12'} ${role.statBg} rounded-full transition-all duration-500`} />
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Bottom Info */}
            <div className="mt-20 flex flex-col items-center">
                <div className="px-6 py-3 bg-muted/50 rounded-full border border-black/5 text-foreground/40 text-xs font-black uppercase tracking-widest flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">info</span>
                    Anda dapat mengubah peran pahlawan nanti di menu setelan
                </div>
            </div>
        </div>
    );
}
