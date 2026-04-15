import React from "react";

interface MasonryGridProps {
  children: React.ReactNode;
}

/**
 * Pinterest-style Masonry Grid with high density.
 */
export const MasonryGrid = ({ children }: MasonryGridProps) => {
  return (
    <div className="w-full">
      <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 2xl:columns-6 gap-6 space-y-6">
        {children}
      </div>
    </div>
  );
};
