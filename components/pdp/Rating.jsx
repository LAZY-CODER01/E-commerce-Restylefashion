"use client";

import React from "react";
import StarIcon from "@mui/icons-material/Star";
import StarHalfIcon from "@mui/icons-material/StarHalf";
import StarOutlineIcon from "@mui/icons-material/StarOutline";

export default function Rating({ rating = 0, count = 0 }) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center gap-1.5 group cursor-pointer">
      <span className="text-[15px] font-bold text-brand-dark">{rating}</span>
      <div className="flex text-yellow-500">
        {[...Array(fullStars)].map((_, i) => (
          <StarIcon key={`full-${i}`} className="w-[18px] h-[18px]" />
        ))}
        {hasHalfStar && <StarHalfIcon className="w-[18px] h-[18px]" />}
        {[...Array(emptyStars)].map((_, i) => (
          <StarOutlineIcon key={`empty-${i}`} className="w-[18px] h-[18px] text-gray-300" />
        ))}
      </div>
      <span className="text-[14px] font-medium text-brand-purple hover:text-brand-pink transition-colors">
        {count} ratings
      </span>
    </div>
  );
}
