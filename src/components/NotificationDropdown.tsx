"use client";

import { useState, useRef, useEffect } from "react";
import { Bell, Check, Clock, ExternalLink, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { markAsRead, markAllAsRead } from "@/lib/notificationUtils";

interface Notification {
    id: number;
    title: string;
    message: string;
    type: string;
    link: string | null;
    isRead: boolean;
    createdAt: Date | string;
}

export function NotificationDropdown({ 
    initialNotifications = [],
    userId,
    isOpen,
    onToggle
}: { 
    initialNotifications: any[],
    userId: string,
    isOpen: boolean,
    onToggle: () => void
}) {
    const [notifications, setNotifications] = useState(initialNotifications);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    const unreadCount = notifications.filter(n => !n.isRead).length;

    // Close dropdown on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (isOpen && dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                onToggle();
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen, onToggle]);

    const handleMarkAsRead = async (id: number) => {
        // Optimistic Update
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
        await markAsRead(id);
    };

    const handleMarkAllAsRead = async () => {
        // Optimistic Update
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        await markAllAsRead(userId);
    };

    const formatTime = (date: any) => {
        const d = new Date(date);
        const now = new Date();
        const diffMs = now.getTime() - d.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);

        if (diffMins < 1) return "Baru saja";
        if (diffMins < 60) return `${diffMins}m yang lalu`;
        if (diffHours < 24) return `${diffHours}j yang lalu`;
        return d.toLocaleDateString('id-ID');
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button 
                onClick={onToggle}
                className="btn-pin-circle cursor-pointer relative border-none"
            >
                <Bell size={22} className={unreadCount > 0 ? "animate-swing" : ""} />
                {unreadCount > 0 && (
                    <span className="absolute top-2 right-2 w-3 h-3 bg-red-500 border-2 border-white rounded-full" />
                )}
            </button>

            {isOpen && (
                <div className="absolute top-14 right-[-50px] sm:right-0 w-80 sm:w-96 bg-white rounded-[2rem] shadow-[0_10px_40px_rgba(0,0,0,0.15)] border border-black/5 overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-[100]">
                    {/* Header */}
                    <div className="px-6 py-5 border-b border-black/5 flex items-center justify-between bg-slate-50/50">
                        <h3 className="font-black text-lg text-[var(--base-color-plum-black)]">Notifikasi</h3>
                        {unreadCount > 0 && (
                            <button 
                                onClick={handleMarkAllAsRead}
                                className="text-[11px] font-black uppercase tracking-widest text-[var(--base-color-pinterest-red)] hover:underline"
                            >
                                Tandai Semua Dibaca
                            </button>
                        )}
                    </div>

                    {/* Scrollable List */}
                    <div className="max-h-[70vh] overflow-y-auto bg-white custom-scrollbar">
                        {notifications.length === 0 ? (
                            <div className="py-20 text-center space-y-4 px-10">
                                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300">
                                    <Bell size={32} />
                                </div>
                                <p className="text-sm font-bold text-slate-400">Belum ada kabar baru untukmu.</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-black/5">
                                {notifications.map((n) => (
                                    <div 
                                        key={n.id} 
                                        className={`group relative p-6 transition-colors hover:bg-slate-50/50 ${!n.isRead ? 'bg-red-50/20' : ''}`}
                                    >
                                        <div className="flex gap-4">
                                            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${n.type === 'REMINDER' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'}`}>
                                                {n.type === 'REMINDER' ? <Clock size={20} /> : <ExternalLink size={20} />}
                                            </div>
                                            <div className="flex-1 space-y-1">
                                                <div className="flex items-center justify-between gap-2">
                                                    <p className={`text-sm font-black leading-tight ${!n.isRead ? 'text-[var(--base-color-plum-black)]' : 'text-slate-500'}`}>
                                                        {n.title}
                                                    </p>
                                                    {!n.isRead && (
                                                        <span className="w-2 h-2 bg-red-500 rounded-full shrink-0" />
                                                    )}
                                                </div>
                                                <p className="text-[13px] text-slate-500 font-medium leading-relaxed">
                                                    {n.message}
                                                </p>
                                                <div className="flex items-center justify-between pt-2">
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                                                        <Clock size={10} /> {formatTime(n.createdAt)}
                                                    </span>
                                                    {n.link && (
                                                        <Link 
                                                            href={n.link}
                                                            onClick={() => {
                                                                handleMarkAsRead(n.id);
                                                                onToggle(); // Use onToggle to close
                                                            }}
                                                            className="text-[11px] font-black text-[var(--base-color-pinterest-red)] flex items-center gap-1 hover:underline"
                                                        >
                                                            Buka <ExternalLink size={10} />
                                                        </Link>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* Mark as read button */}
                                        {!n.isRead && (
                                            <button 
                                                onClick={() => handleMarkAsRead(n.id)}
                                                className="absolute top-2 right-2 p-2 opacity-0 group-hover:opacity-100 transition-opacity text-slate-300 hover:text-emerald-500"
                                                title="Tandai sudah dibaca"
                                            >
                                                <Check size={16} />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(0,0,0,0.05);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(0,0,0,0.1);
                }
            `}</style>
        </div>
    );
}
