"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { User, Mail, Lock, Loader2, ArrowRight } from "lucide-react";

export default function RegisterPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const { data, error } = await authClient.signUp.email({
                email,
                password,
                name,
            });

            if (error) {
                setError(error.message || "Gagal mendaftar. Silakan coba lagi.");
            } else {
                router.push("/dashboard");
                router.refresh();
            }
        } catch (err) {
            setError("Terjadi kesalahan sistem. Silakan coba lagi.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
            <div className="w-full max-w-md">
                {/* Logo / Brand */}
                <div className="text-center mb-10">
                    <Link href="/" className="inline-block mb-6">
                         <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-white text-3xl font-black shadow-xl shadow-primary/20">
                            B
                         </div>
                    </Link>
                    <h1 className="text-3xl font-black text-foreground mb-2">Buat Akun Baru</h1>
                    <p className="text-foreground/40 font-medium">Bergabunglah dan mulai petualanganmu hari ini.</p>
                </div>

                <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-2xl shadow-black/5 border border-black/5">
                    <form onSubmit={handleRegister} className="space-y-6">
                        {error && (
                            <div className="p-4 rounded-2xl bg-red-50 text-red-600 text-sm font-bold border border-red-100 italic">
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                             <label className="text-xs font-black uppercase tracking-widest text-foreground/30 px-2">Nama Lengkap</label>
                             <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/20 group-focus-within:text-primary transition-colors" size={20} />
                                <input 
                                    type="text" 
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Nama Kamu"
                                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-primary/20 focus:bg-white outline-none transition-all font-bold"
                                />
                             </div>
                        </div>

                        <div className="space-y-2">
                             <label className="text-xs font-black uppercase tracking-widest text-foreground/30 px-2">Alamat Email</label>
                             <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/20 group-focus-within:text-primary transition-colors" size={20} />
                                <input 
                                    type="email" 
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="nama@email.com"
                                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-primary/20 focus:bg-white outline-none transition-all font-bold"
                                />
                             </div>
                        </div>

                        <div className="space-y-2">
                             <label className="text-xs font-black uppercase tracking-widest text-foreground/30 px-2">Kata Sandi</label>
                             <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/20 group-focus-within:text-primary transition-colors" size={20} />
                                <input 
                                    type="password" 
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Minimal 8 karakter"
                                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-primary/20 focus:bg-white outline-none transition-all font-bold"
                                />
                             </div>
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full btn-primary py-4 rounded-2xl flex items-center justify-center gap-2 group transition-all"
                        >
                            {loading ? (
                                <Loader2 className="animate-spin" size={20} />
                            ) : (
                                <>
                                    Daftar Sekarang <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <p className="text-center mt-8 text-foreground/40 font-bold">
                    Sudah punya akun? <Link href="/auth/login" className="text-primary hover:underline">Masuk Sini</Link>
                </p>
            </div>
        </div>
    );
}
