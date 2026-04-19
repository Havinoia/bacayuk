"use client";

import { useState } from "react";
import { EditProfileModal } from "./EditProfileModal";

interface ProfileEditButtonProps {
    user: {
        id: string;
        name: string;
        image: string | null;
    };
    hero: {
        role: string | null;
    } | null;
}

export function ProfileEditButton({ user, hero }: ProfileEditButtonProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button 
                onClick={() => setIsOpen(true)}
                className="btn-pin-primary px-6 py-2.5 font-black uppercase tracking-widest text-[12px] shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            >
                Edit Profil
            </button>
            <EditProfileModal 
                isOpen={isOpen} 
                onClose={() => setIsOpen(false)} 
                user={user} 
                hero={hero} 
            />
        </>
    );
}
