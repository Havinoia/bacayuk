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
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-6 gap-y-10">
        {children}
      </div>
    </div>
  );
};
