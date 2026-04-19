"use client";

import { useState } from "react";
import { X, User, Image, Shield, Loader2 } from "lucide-react";
import { updateProfile } from "@/app/actions/profile";

interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: {
        id: string;
        name: string;
        image: string | null;
    };
    hero: {
        role: string | null;
    } | null;
}

const ROLES = [
    { value: "penyihir", label: "Penyihir (Mage)" },
    { value: "pemanah", label: "Pemanah (Archer)" },
    { value: "kesatria", label: "Kesatria (Knight)" },
    { value: "peri", label: "Peri (Fairy)" },
    { value: "dwarf", label: "Dwarf (Dwarf)" },
];

export function EditProfileModal({ isOpen, onClose, user, hero }: EditProfileModalProps) {
    const [name, setName] = useState(user.name);
    const [image, setImage] = useState(user.image || "");
    const [role, setRole] = useState(hero?.role || "default");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const result = await updateProfile(user.id, {
                name,
                image: image || "",
                role: role || "default",
            });

            if (result.success) {
                onClose();
            } else {
                setError(result.error || "Gagal memperbarui profil");
            }
        } catch (err) {
            setError("Terjadi kesalahan sistem");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <div 
                className="absolute inset-0 bg-[var(--base-color-plum-black)]/40 backdrop-blur-md"
                onClick={onClose}
            />
            
            <div className="relative w-full max-w-lg bg-white rounded-[40px] shadow-2xl overflow-hidden animate-pin-enter flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="text-2xl font-black text-[var(--base-color-plum-black)]">Edit Profil Anda</h3>
                    <button 
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-slate-100 transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Form Content */}
                <div className="p-8 space-y-8 overflow-y-auto">
                    {error && (
                        <div className="p-4 rounded-2xl bg-red-50 text-red-600 text-sm font-bold border border-red-100 italic">
                            {error}
                        </div>
                    )}

                    <div className="space-y-6">
                        {/* Name Field */}
                        <div className="space-y-2">
                            <label className="text-[12px] font-black text-[var(--base-color-olive-gray)] uppercase tracking-widest flex items-center gap-2">
                                <User size={14} /> Nama Petualang
                            </label>
                            <input 
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-[var(--base-color-pinterest-red)] focus:bg-white outline-none transition-all font-bold text-lg text-[var(--base-color-plum-black)]"
                                placeholder="Masukkan nama..."
                                required
                            />
                        </div>

                        {/* Avatar URL Field */}
                        <div className="space-y-2">
                            <label className="text-[12px] font-black text-[var(--base-color-olive-gray)] uppercase tracking-widest flex items-center gap-2">
                                <Image size={14} /> URL Foto Profil
                            </label>
                            <input 
                                type="url"
                                value={image}
                                onChange={(e) => setImage(e.target.value)}
                                className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-[var(--base-color-pinterest-red)] focus:bg-white outline-none transition-all font-bold text-[var(--base-color-plum-black)]"
                                placeholder="https://example.com/avatar.jpg"
                            />
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Gunakan link gambar untuk mengubah foto profil</p>
                        </div>

                        {/* Role Selection */}
                        <div className="space-y-2">
                            <label className="text-[12px] font-black text-[var(--base-color-olive-gray)] uppercase tracking-widest flex items-center gap-2">
                                <Shield size={14} /> Peran Akademi
                            </label>
                            <div className="relative">
                                <select 
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-[var(--base-color-pinterest-red)] focus:bg-white outline-none transition-all font-bold text-lg text-[var(--base-color-plum-black)] appearance-none cursor-pointer"
                                >
                                    <option value="default">Petualang Biasa</option>
                                    {ROLES.map((r) => (
                                        <option key={r.value} value={r.value}>{r.label}</option>
                                    ))}
                                </select>
                                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none">
                                    <Shield size={18} className="text-slate-300" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="p-8 border-t border-slate-100 bg-slate-50 flex gap-4">
                    <button 
                        type="button"
                        onClick={onClose}
                        className="flex-1 py-4 font-black rounded-2xl text-[var(--base-color-olive-gray)] hover:bg-slate-200 transition-all uppercase tracking-widest text-xs"
                    >
                        Batal
                    </button>
                    <button 
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="flex-[2] btn-pin-primary py-4 text-white font-black rounded-2xl shadow-xl disabled:opacity-50 transition-all active:scale-[0.98] flex items-center justify-center gap-2 uppercase tracking-widest text-xs"
                        style={{ color: 'white' }}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="animate-spin" size={18} />
                                <span>Menyimpan...</span>
                            </>
                        ) : (
                            "Simpan Perubahan"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
