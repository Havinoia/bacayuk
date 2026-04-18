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
  isFeatured?: boolean;
}

export const StoryPin = ({ title, author, category, slug, thumbnailUrl, isFeatured = false }: StoryPinProps) => {
  const categoryName = typeof category === 'string' ? category : category.name;
  
  const handleActionClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div className="group animate-pin-enter">
      <Link href={`/story/${slug}`} className="block">
        {/* Visual Container */}
        <div className={`relative ${isFeatured ? 'aspect-[4/5]' : 'aspect-[4/5]'} overflow-hidden rounded-[2.5rem] bg-white cursor-zoom-in border-4 border-white shadow-lg group-hover:shadow-[0_45px_70px_rgba(0,0,0,0.18)] transition-all duration-700 flex flex-col`}>
          
          {/* Background Image/Fallback */}
          {thumbnailUrl ? (
            <div className="absolute inset-0 transition-transform duration-1000 group-hover:scale-110">
              <img 
                src={thumbnailUrl} 
                alt={title} 
                className="w-full h-full object-cover"
              />
              {/* Premium Overlays */}
              <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10" />
              <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
            </div>
          ) : (
            <>
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--base-color-warm-wash)] to-[var(--base-color-sand-gray)] opacity-50" />
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
            </>
          )}

          {/* Content Layer */}
          <div className="relative z-20 flex-1 p-8 flex flex-col justify-between">
            {/* Top: Category */}
            <div className="flex justify-between items-start">
              <div className="bg-white/20 backdrop-blur-xl border border-white/30 px-4 py-1.5 rounded-full text-[10px] font-black text-white shadow-sm uppercase tracking-widest">
                {categoryName}
              </div>
              <div className="bg-[var(--base-color-pinterest-red)] text-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100">
                <Bookmark size={16} fill="white" />
              </div>
            </div>

            {/* Middle: Spacer for visual balance */}
            <div className="flex-1" />

            {/* Bottom: Title (White text for contrast on image) */}
            <div className="space-y-4 text-center">
               <h3 className={`${isFeatured ? 'text-[28px]' : 'text-[22px]'} font-black leading-[1.1] ${thumbnailUrl ? 'text-white' : 'text-[var(--base-color-plum-black)]'} line-clamp-3 tracking-tighter group-hover:text-[var(--base-color-pinterest-red)] transition-colors uppercase italic font-header`}>
                  {title}
               </h3>
               
               <div className={`flex items-center justify-center gap-2 pt-2 border-t ${thumbnailUrl ? 'border-white/10' : 'border-black/5'} mx-4`}>
                  <div className={`w-6 h-6 rounded-full ${thumbnailUrl ? 'bg-white text-[var(--base-color-plum-black)]' : 'bg-[var(--base-color-plum-black)] text-white'} flex items-center justify-center text-[10px] font-black uppercase`}>
                      {author?.charAt(0) || "B"}
                  </div>
                  <span className={`text-[12px] ${thumbnailUrl ? 'text-white/60' : 'text-[var(--base-color-olive-gray)]'} font-bold tracking-tight uppercase`}>
                    {author || "Bacayuk"}
                  </span>
               </div>
            </div>
          </div>

          {/* Interaction Trigger Box */}
          <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-all duration-300 z-30 pointer-events-none" />
        </div>
      </Link>
    </div>
  );
};
