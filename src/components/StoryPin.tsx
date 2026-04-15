"use client";

import React from "react";
import { Bookmark, Heart, MoreHorizontal, BookOpen } from "lucide-react";
import Link from "next/link";

interface StoryPinProps {
  id: number | string;
  title: string;
  thumbnailUrl: string;
  author?: string;
  category: { name: string } | string;
  slug: string;
}

export const StoryPin = ({ title, thumbnailUrl, author, category, slug }: StoryPinProps) => {
  const categoryName = typeof category === 'string' ? category : category.name;
  
  // Custom fallback image path (served from public folder)
  const fallbackImage = "/assets/images/story-placeholder.png";

  const handleActionClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div className="group animate-pin-enter">
      <Link href={`/story/${slug}`} className="block">
        {/* Visual Container */}
        <div className="relative aspect-[4/5] overflow-hidden rounded-[24px] bg-[var(--base-color-warm-light)] cursor-zoom-in group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.12)] transition-all duration-700">
          
          {/* Subtle Background Gradient (Fallback for slow loading) */}
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--base-color-sand-gray)] to-[var(--base-color-warm-light)]" />

          {/* The Image (Main Content) */}
          <img 
            src={thumbnailUrl || fallbackImage} 
            alt={title}
            loading="lazy"
            className="w-full h-full object-cover relative z-10 transition-transform duration-1000 group-hover:scale-105"
          />

          {/* High-Contrast Interactive Overlay */}
          <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-between p-3 z-20">
            
            {/* Top Row: Categorization & Quick Save */}
            <div className="flex justify-between items-center w-full">
               <div className="bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-black text-[var(--base-color-plum-black)] shadow-sm uppercase tracking-tight">
                  {categoryName}
               </div>
               <button 
                onClick={handleActionClick}
                className="bg-[var(--base-color-pinterest-red)] text-white px-3.5 py-2 rounded-full text-[13px] font-black hover:scale-105 active:scale-95 shadow-[0_4px_12px_rgba(230,0,35,0.3)] transition-all pointer-events-auto"
               >
                  Simpan
               </button>
            </div>

            {/* Bottom Row: Contextual Actions */}
            <div className="flex justify-between items-end">
               <div className="flex gap-2">
                  <button 
                    onClick={handleActionClick}
                    className="w-8 h-8 bg-white/95 backdrop-blur-md rounded-full flex items-center justify-center text-[var(--base-color-plum-black)] hover:bg-white transition-all shadow-md active:scale-90 pointer-events-auto"
                  >
                    <MoreHorizontal size={16} strokeWidth={2.5} />
                  </button>
               </div>
               
               <div className="bg-white text-[var(--base-color-plum-black)] p-2 rounded-full hover:bg-[var(--base-color-sand-gray)] transition-all shadow-md active:scale-90 pointer-events-auto">
                  <BookOpen size={16} />
               </div>
            </div>
          </div>
        </div>

        {/* Typography & Metadata (Compact Hierarchy) */}
        <div className="mt-4 px-0.5 space-y-1">
          <div className="min-h-[38px] flex flex-col justify-start">
            <h3 className="text-[13px] font-bold leading-[1.3] text-[var(--base-color-plum-black)] line-clamp-2 tracking-tight group-hover:text-[var(--base-color-pinterest-red)] transition-colors">
              {title}
            </h3>
          </div>
          <div className="flex items-center gap-2 pt-0.5">
            <div className="w-5 h-5 rounded-full bg-[var(--base-color-sand-gray)] flex items-center justify-center text-[8px] font-black text-[var(--base-color-plum-black)] uppercase border border-black/5">
                {author?.charAt(0) || "B"}
            </div>
            <span className="text-[11px] text-[var(--base-color-olive-gray)] font-semibold tracking-tight">
              {author || "Bacayuk"}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
};
