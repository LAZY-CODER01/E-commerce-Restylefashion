"use client";

import React from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

export default function QuantitySelector({ quantity = 1, onChange }) {
  const options = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  return (
    <div className="flex flex-col gap-2">
      <div className="relative">
        <select
          value={quantity}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="w-full appearance-none bg-brand-light border border-gray-200 rounded-full px-5 h-[48px] text-[14px] font-semibold text-brand-dark outline-none focus:border-brand-pink focus:ring-1 focus:ring-brand-pink/20 transition-all cursor-pointer shadow-sm hover:bg-white"
        >
          {options.map((opt) => (
            <option key={opt} value={opt}>
              Quantity: {opt}
            </option>
          ))}
        </select>
        <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
          <KeyboardArrowDownIcon fontSize="small" />
        </div>
      </div>
    </div>
  );
}
