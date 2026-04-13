"use client";

import { useState } from "react";
import { updateHeroRole } from "@/app/actions/hero";
import { useRouter } from "next/navigation";
import { Heart, Sword, Shield, Zap, Star, Sparkles, Info, ChevronRight, Award } from "lucide-react";

const ROLES = [
    {
        id: "dwarf",
        name: "Dwarf",
        subtitle: "Strength",
        statLabel: "Vitalitas Tinggi",
        description: "Petarung jarak dekat yang tangguh dengan pertahanan luar biasa. Dwarf mampu menahan serangan musuh paling kuat sekalipun.",
        playstyle: "Sangat cocok bagi pemula yang ingin bermain aman dengan HP besar.",
        stats: { hp: 75, attack: 65, defense: 85, speed: 25 },
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDOTiGvsaEbGL427buSXNpEA9JbnClZ_qsV9qfSA0qXzexiP4QV_NwxXiNIKjNlHzxH9FQO5BhNA8OKuo4OnpuEeSMOie04AcG6sxqb1sMU0ySehc6vSrEtAebhVwcrWM7vdNnr37AX0NkiRYSRkTtdGkElWe8bQQvecucsuTvjwuIY3jet5eEZs34_frpf_SUuY4JNeQ-XiNOVZXtQWbA9bK-IxH5zojeFNwg5Zy7eGNlGTDxmQVN63Zaf9i3SUs1HLtGflWqcHeU",
        glowClass: "hero-glow-dwarf",
        overlay: "from-amber-900/90",
        statColor: "text-amber-600",
        statBg: "bg-amber-400",
        accent: "amber"
    },
    {
        id: "peri",
        name: "Peri",
        subtitle: "Nature",
        statLabel: "Harmoni Alam",
        description: "Penjelajah lincah yang menguasai kekuatan alam. Peri memiliki kecepatan luar biasa untuk menghindari bahaya.",
        playstyle: "Cocok untuk petualang yang suka bergerak cepat dan lincah dalam bercerita.",
        stats: { hp: 45, attack: 55, defense: 35, speed: 80 },
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA_2wEC4pie8U99I9YqZUNz54P2AX-Dk310IDLspiMmji83Ww9wOhpyx7smTwPSbZjXy2xYNmBe3sW9LlYsDSNoZ-UzfKRXO-dWxy2-m7J-7YREUPPudZHvZCvyX1hQlQtEtosfAB88hVGr1MSmPJXvRtQrx0fQDVe7NhBNeZznFZM-yYMzVxwmPBupRwdZR9XaiUz6IKwv0cWb5-VQucXvmg3S6Xn3RASuHTHVaR4tBZPQmEx8ULGuK2YEPMeuspiiTf-XE1kSE6Q",
        glowClass: "hero-glow-peri",
        overlay: "from-emerald-900/90",
        statColor: "text-emerald-600",
        statBg: "bg-emerald-400",
        accent: "emerald"
    },
    {
        id: "kesatria",
        name: "Kesatria",
        subtitle: "Wisdom",
        statLabel: "Wawasan Luas",
        description: "Pejuang seimbang yang mengandalkan keberanian dan kebijaksanaan. Memberikan perlindungan bagi siapa pun yang bersamanya.",
        playstyle: "Pilihan terbaik bagi pahlawan yang ingin memiliki kemampuan seimbang di segala bidang.",
        stats: { hp: 80, attack: 70, defense: 75, speed: 45 },
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD570WHrUNGLcNAjCuHVJXYCkaQo942CuDUvnNMXbtlrF7GppkdK60DQACodJqIAPATloj8laT0PiQ0700qDepnWQey6DJvRfgluVA1qQXHDizBj8wkZ10upf9DVZMv3lc-zVSjRL62zQSSAW9oqgQHB1VtaDE-nqOLJzH_mP5ma-EoUoVhEVJUdI95P2SdqUxmKa5XgDXVG8zbHVmzYKaxsSRH2SaGCVb607nTuFQqXb1ZmKF6KSZttrlKJlghl4KcurCbX7bnf0E",
        glowClass: "hero-glow-kesatria",
        overlay: "from-blue-900/90",
        statColor: "text-blue-600",
        statBg: "bg-blue-400",
        featured: true,
        accent: "blue"
    },
    {
        id: "penyihir",
        name: "Penyihir",
        subtitle: "Arcane",
        statLabel: "Kekuatan Sihir",
        description: "Penguasa mantra kuno dengan daya serang sihir yang dahsyat. Meskipun rapuh, serangannya sangat mematikan.",
        playstyle: "Sangat direkomendasikan jika kamu suka tantangan dan kekuatan serangan yang besar.",
        stats: { hp: 40, attack: 85, defense: 25, speed: 50 },
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBYWl3Gl4JWe4RgRQXQ_UJ-2St-XgDlTyfOv8_sAvTSKmip0mzJPoD0CfLbP-3OOCQc-n6vFthpcRr2tzKJUykFncreYpT854kiA9jXYLeGxbjoXZzOPNhffE5NaoWwa3zLx2iq_3kVuQJM5m13ZCO_fD0hd-DJH4B6Nf6pJdQVvKtoaRVSXUTa1cKX6vXABCCDM-5ImX3gxC7r5_QeXcl0S_WroNPWbckI3kfg87UpB2OivP0XI3p8LZSgjUK_JhOka3bNKr8Dz-Q",
        glowClass: "hero-glow-penyihir",
        overlay: "from-purple-900/90",
        statColor: "text-purple-600",
        statBg: "bg-purple-400",
        accent: "purple"
    },
    {
        id: "pemanah",
        name: "Pemanah",
        subtitle: "Precision",
        statLabel: "Fokus Tajam",
        description: "Ahli menembak jitu dengan konsentrasi tinggi. Mampu menyerang dari jarak jauh dengan akurasi yang menakjubkan.",
        playstyle: "Cocok untuk mereka yang menyukai ketepatan dan efisiensi dalam bertualang.",
        stats: { hp: 55, attack: 75, defense: 45, speed: 75 },
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCrHvuYdj3bT-78w-oQdPKb1ecnppXOS5KO_JGBDl1C4sdt9zjkRn-6wLcIoLUox55m8NQ3zn_2wB1IMs_l3dhXxenZjekCD7-dKTvra2m3_-N-JURvuDzTDWisgxJ4hULK9KNFklMczPOE_xn3V4SgFTUjjdPavjZlnKq5wuuX2x6yFzq4P-sgOwvebgX-3DymUZtSSh-HQhUViRm2D9wZJ30Plv-8BPMoE8uvUPIq6y-xUxthPLI6Hl_ddTeCSLhzAoKUobnXU2g",
        glowClass: "hero-glow-pemanah",
        overlay: "from-rose-900/90",
        statColor: "text-rose-600",
        statBg: "bg-rose-400",
        accent: "rose"
    }
];

export default function RoleSelection({ 
    currentRole 
}: { 
    currentRole?: string | null
}) {
    const [selected, setSelected] = useState<string | null>(currentRole || null);
    const [hovered, setHovered] = useState<string | null>(null);
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

    const activeRole = ROLES.find(r => r.id === (hovered || selected)) || ROLES[2];

    return (
        <div className="relative py-10">
            {/* Background Atmosphere */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-full opacity-[0.03] select-none pointer-events-none flex flex-wrap justify-center gap-20 p-20">
                    {[Heart, Sword, Shield, Zap, Star].map((Icon, i) => (
                        <Icon key={i} size={150} strokeWidth={1} className={`animate-float`} style={{ animationDelay: `${i * 0.5}s` }} />
                    ))}
                </div>
            </div>

            {/* Header Section */}
            <div className="text-center mb-16 space-y-4 relative z-10">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-black tracking-widest uppercase mb-4">
                    <Sparkles size={14} className="animate-pulse" />
                    Pilih Takdirmu
                </div>
                <h2 className="text-5xl md:text-7xl font-header font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-600 to-purple-600">
                    Pilih Pahlawanmu
                </h2>
                <p className="text-foreground/60 text-lg max-w-2xl mx-auto font-bold uppercase tracking-widest text-xs">
                    Setiap petualangan besar dimulai dengan satu langkah berani. <br /> Siapakah yang akan memandu ceritamu hari ini?
                </p>
            </div>

            {/* Error Message */}
            {error && (
                <div className="max-w-md mx-auto mb-12 p-6 bg-red-50 border-2 border-red-200 rounded-[2rem] text-red-600 font-bold text-center animate-bounce shadow-xl relative z-20">
                    ⚠️ {error}
                </div>
            )}

            {/* Hero Gallery Grid */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-end relative z-10 px-4">
                {ROLES.map((role) => {
                    const isSelected = selected === role.id;
                    const isHovered = hovered === role.id;
                    const isFeatured = role.featured;

                    return (
                        <div 
                            key={role.id} 
                            className="group relative flex flex-col items-center"
                            onMouseEnter={() => setHovered(role.id)}
                            onMouseLeave={() => setHovered(null)}
                        >
                            <div 
                                onClick={() => !loading && handleSelect(role.id)}
                                className={`
                                    w-full aspect-[3/5] bg-muted rounded-[2rem] overflow-hidden transition-all duration-700 cursor-pointer relative
                                    ${role.glowClass}
                                    border-4 ${isSelected ? 'border-primary ring-8 ring-primary/20 scale-105 -translate-y-8 z-30 shadow-2xl' : isHovered ? 'border-white/40 -translate-y-4 z-20 shadow-xl' : 'border-black/5'}
                                    ${loading ? 'opacity-50 grayscale cursor-wait' : ''}
                                `}
                            >
                                {/* Paper Texture Overlay */}
                                <div className="absolute inset-0 magic-texture opacity-30 z-10" />

                                <img 
                                    src={role.image} 
                                    alt={role.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                                />
                                {/* Gradient Overlay */}
                                <div className={`absolute inset-0 bg-gradient-to-t ${role.overlay} via-transparent to-transparent z-0`} />
                                
                                {/* Recommended Badge */}
                                {isFeatured && !isSelected && (
                                    <div className="absolute top-6 right-6 bg-primary text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter shadow-lg z-20">
                                        Favorit!
                                    </div>
                                )}

                                {/* Card Content */}
                                <div className="absolute bottom-8 left-8 right-8 text-white z-20">
                                    <span className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-1 block">
                                        {role.subtitle}
                                    </span>
                                    <h3 className={`font-header font-black leading-none ${isFeatured ? 'text-4xl' : 'text-3xl'}`}>
                                        {role.name}
                                    </h3>
                                </div>

                                {/* Selection Confirmation Overlay */}
                                {isSelected && (
                                    <div className="absolute inset-0 bg-primary/30 backdrop-blur-[4px] flex flex-col items-center justify-center z-40">
                                        <div className="bg-white text-primary p-4 rounded-full shadow-2xl animate-bounce mb-4">
                                            <ChevronRight className="rotate-90 animate-pulse" />
                                        </div>
                                        <span className="text-white font-black uppercase tracking-[0.2em] text-[10px]">Aktif</span>
                                    </div>
                                )}
                            </div>

                            {/* Hover Stat Label */}
                            <div className={`mt-6 transition-all duration-500 flex flex-col items-center gap-2 ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                                <span className={`${role.statColor} font-black text-xs uppercase tracking-widest`}>
                                    {role.statLabel}
                                </span>
                                <div className={`h-1.5 ${isSelected ? 'w-24' : 'w-16'} ${role.statBg} rounded-full transition-all duration-500 shadow-sm`} />
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Hero Spotlight Info Panel (The "Full and Dense" part) */}
            <div className="mt-20 max-w-5xl mx-auto px-4 relative z-10 transition-all duration-700 transform">
                <div className={`glass-panel rounded-[2.5rem] p-10 border-2 border-white/60 shadow-2xl overflow-hidden relative group`}>
                    {/* Decorative Background for Panel */}
                    <div className={`absolute top-0 right-0 w-64 h-64 bg-${activeRole.accent}-500/5 blur-[80px] rounded-full -mr-20 -mt-20`}></div>
                    <div className={`absolute bottom-0 left-0 w-48 h-48 bg-${activeRole.accent}-400/5 blur-[60px] rounded-full -ml-10 -mb-10`}></div>
                    
                    <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
                        <div className="md:col-span-4 flex justify-center">
                           <div className="relative">
                               <div className={`w-40 h-40 rounded-[2.5rem] border-8 border-white p-2 shadow-2xl bg-${activeRole.accent}-50 transition-colors duration-500`}>
                                   <img src={activeRole.image} className="w-full h-full object-cover rounded-[1.8rem] group-hover:scale-110 transition-transform duration-700" alt="" />
                               </div>
                               <div className={`absolute -bottom-4 -right-4 bg-${activeRole.accent}-500 text-white w-12 h-12 rounded-2xl flex items-center justify-center shadow-xl border-4 border-white`}>
                                   <Award size={20} />
                               </div>
                           </div>
                        </div>

                        <div className="md:col-span-8 space-y-6">
                            <div className="space-y-2">
                                <h4 className={`text-4xl font-header font-black text-${activeRole.accent}-600 transition-colors`}>{activeRole.name}</h4>
                                <div className="flex flex-wrap gap-4">
                                     <span className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-foreground/40">
                                        <Info size={14} /> Deskripsi Role
                                     </span>
                                     <div className={`h-[1px] flex-1 bg-gradient-to-r from-black/5 to-transparent self-center`}></div>
                                </div>
                            </div>
                            
                            <p className="text-foreground/70 text-lg font-bold leading-relaxed">
                                {activeRole.description}
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-black/5">
                                <div className="space-y-1">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-foreground/30 block mb-2">Gaya Bermain</span>
                                    <p className="text-sm font-black text-foreground/60 italic leading-snug">
                                        "{activeRole.playstyle}"
                                    </p>
                                </div>
                                <div className="flex gap-4 items-end justify-start sm:justify-end">
                                    <div className="text-center">
                                         <div className="text-2xl font-black text-foreground/80">{activeRole.stats.attack}</div>
                                         <div className="text-[8px] font-black uppercase tracking-widest opacity-40">Daya Serang</div>
                                    </div>
                                    <div className="w-[1px] h-8 bg-black/5"></div>
                                    <div className="text-center">
                                         <div className="text-2xl font-black text-foreground/80">{activeRole.stats.hp}</div>
                                         <div className="text-[8px] font-black uppercase tracking-widest opacity-40">Ketahanan</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Info */}
            <div className="mt-16 flex flex-col items-center relative z-10">
                <div className="px-6 py-3 bg-white/50 backdrop-blur-md rounded-full border border-white/60 text-foreground/40 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-3 shadow-sm group hover:bg-white transition-all cursor-default">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <Info size={12} strokeWidth={3} />
                    </div>
                    Jangan Khawatir! Kamu dapat mengubah pahlawanmu kapan saja di menu setelan.
                </div>
            </div>
        </div>
    );
}
