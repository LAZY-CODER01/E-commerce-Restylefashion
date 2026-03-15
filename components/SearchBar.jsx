import React from "react";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";

export default function SearchBar({ className }) {
  return (
    <div className={`relative w-full shadow-sm rounded-full bg-white transition-all duration-300 focus-within:shadow-md focus-within:ring-1 focus-within:ring-brand-pink/20 ${className || ""}`}>
      <input
        type="text"
        placeholder="Search &quot;Puffer Jackets&quot;"
        className="w-full h-[52px] rounded-full border border-gray-200 bg-transparent pl-4 pr-12 text-[15px] text-brand-dark placeholder:text-gray-400 outline-none focus:border-brand-pink transition-colors"
      />
      <button
        aria-label="Search"
        type="button"
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-pink transition-colors h-8 w-8 flex items-center justify-center rounded-full"
      >
        <SearchOutlinedIcon fontSize="small" />
      </button>
    </div>
  );
}
