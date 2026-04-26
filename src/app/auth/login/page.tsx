"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Mail, Lock, Loader2, ArrowRight } from "lucide-react";

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
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#fffef0] relative overflow-hidden">
        {/* Background Decorations for "No Empty Space" */}
        <div className="absolute top-10 left-10 text-6xl opacity-10 floating-element animate-float">🍭</div>
        <div className="absolute top-1/2 -left-10 text-8xl opacity-10 floating-element animate-float">🚀</div>
        <div className="absolute bottom-10 right-10 text-6xl opacity-10 floating-element animate-float">🏰</div>
        <div className="absolute top-20 right-20 text-7xl opacity-10 floating-element animate-float" style={{ animationDelay: '1s' }}>⭐</div>

        <div className="w-full max-w-md relative z-10">
            {/* Logo / Brand */}
            <div className="text-center mb-10">
                <Link href="/" className="inline-block mb-6 group">
                    <div className="w-20 h-20 bg-primary rounded-[2rem] flex items-center justify-center text-white text-4xl font-black shadow-2xl shadow-primary/30 group-hover:rotate-12 transition-transform">
                        B
                    </div>
                </Link>
                <h1 className="text-4xl md:text-5xl font-black text-foreground mb-3 tracking-tighter">Masuk</h1>
                <p className="text-foreground/40 font-bold">Silakan masuk ke akun Anda untuk melanjutkan.</p>
            </div>

            <div className="bg-white p-8 md:p-12 rounded-[3.5rem] shadow-[0_25px_60px_rgba(0,0,0,0.05)] border-4 border-white">
                <form onSubmit={handleLogin} className="space-y-8">
                    {error && (
                        <div className="p-5 rounded-3xl bg-red-50 text-red-600 text-sm font-black border-2 border-red-100 flex items-center gap-3 italic">
                            <span>🛑</span> {error}
                        </div>
                    )}

                    <div className="space-y-3">
                         <label className="text-xs font-black uppercase tracking-[0.2em] text-foreground/30 px-4">Email</label>
                         <div className="relative group">
                            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-foreground/20 group-focus-within:text-primary transition-colors" size={20} />
                            <input 
                                type="email" 
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email Kamu"
                                className="w-full pl-14 pr-6 py-5 rounded-full bg-slate-50 border-4 border-transparent focus:border-primary/20 focus:bg-white outline-none transition-all font-black"
                            />
                         </div>
                    </div>

                    <div className="space-y-3">
                         <label className="text-xs font-black uppercase tracking-[0.2em] text-foreground/30 px-4">Password</label>
                         <div className="relative group">
                            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-foreground/20 group-focus-within:text-primary transition-colors" size={20} />
                            <input 
                                type="password" 
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full pl-14 pr-6 py-5 rounded-full bg-slate-50 border-4 border-transparent focus:border-primary/20 focus:bg-white outline-none transition-all font-black"
                            />
                         </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full btn-primary py-5 text-xl flex items-center justify-center gap-3 group"
                    >
                        {loading ? (
                            <Loader2 className="animate-spin" size={24} />
                        ) : (
                            "Masuk"
                        )}
                    </button>
                </form>

            </div>

            <p className="text-center mt-10 text-foreground/40 font-black">
                Belum punya akun? <Link href="/auth/register" className="text-primary hover:underline italic">Daftar</Link>
            </p>
        </div>
    </div>
);
}
