"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Mail, Lock, Loader2, ArrowRight, Globe } from "lucide-react";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const { data, error } = await authClient.signIn.email({
                email,
                password,
            });

            if (error) {
                setError(error.message || "Email atau password salah.");
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
                    <h1 className="text-3xl font-black text-foreground mb-2">Selamat Datang Kembali!</h1>
                    <p className="text-foreground/40 font-medium">Masuk untuk melanjutkan petualangan membacamu.</p>
                </div>

                <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-2xl shadow-black/5 border border-black/5">
                    <form onSubmit={handleLogin} className="space-y-6">
                        {error && (
                            <div className="p-4 rounded-2xl bg-red-50 text-red-600 text-sm font-bold border border-red-100 italic">
                                {error}
                            </div>
                        )}

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
                                    placeholder="••••••••"
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
                                    Masuk Sekarang <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-8 border-t border-slate-100 space-y-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
                            <div className="relative flex justify-center text-xs uppercase tracking-widest font-black text-foreground/20"><span className="bg-white px-4">Atau Lewat</span></div>
                        </div>
                        
                        <button className="w-full py-4 rounded-2xl bg-slate-50 border-2 border-transparent hover:border-slate-200 transition-all font-bold flex items-center justify-center gap-3 group">
                            <Globe size={20} className="group-hover:scale-110 transition-transform" />
                            <span>Lanjutkan dengan Google</span>
                        </button>
                    </div>
                </div>

                <p className="text-center mt-8 text-foreground/40 font-bold">
                    Belum punya akun? <Link href="/auth/register" className="text-primary hover:underline">Daftar Sekarang</Link>
                </p>
            </div>
        </div>
    );
}
