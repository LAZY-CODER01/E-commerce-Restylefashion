"use client";

import React from "react";

export default function SizeSelector({ sizes = [], selectedSize, onSizeSelect }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h4 className="text-[14px] font-bold text-brand-dark uppercase tracking-tight">Select Size</h4>
        <button className="text-[12px] font-bold text-brand-pink hover:underline uppercase tracking-wide">Size Chart</button>
      </div>
      <div className="flex flex-wrap gap-3">
        {sizes.map((size) => (
          <button
            key={size}
            onClick={() => onSizeSelect(size)}
            className={`flex h-[48px] min-w-[48px] items-center justify-center rounded-xl border transition-all duration-200 text-[14px] font-bold ${
              selectedSize === size
                ? "border-brand-pink bg-brand-pink text-white shadow-sm"
                : "border-gray-200 text-brand-dark hover:border-brand-pink hover:text-brand-pink bg-white"
            }`}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  );
}
