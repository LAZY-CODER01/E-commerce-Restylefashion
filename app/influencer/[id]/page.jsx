"use client";

import React, { use } from "react";
import Image from "next/image";
import TuneOutlinedIcon from '@mui/icons-material/TuneOutlined';
import SwapVertOutlinedIcon from '@mui/icons-material/SwapVertOutlined';
import ProductCard from "@/components/ProductCard";
import { useSearch } from "@/context/SearchContext";
import { ALL_PRODUCTS } from "@/data/mockData";

// Mock data for influencers
const INFLUENCER_DATA = {
  "1": {
    name: "Sarah Style",
    handle: "@sarahstyle",
    cover: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1600&q=80",
    bio: "With a loyal social media following, Sarah's stylish feed never misses. She keeps it real, shares self-care moments, and that authentic city life is exactly why fans adore her. Discover her standout style and shop her pre-loved wardrobe now on Restyle."
  },
  "2": {
    name: "Jane Doe",
    handle: "@janedoe",
    cover: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=80",
    bio: "Jane is a minimalist fashion enthusiast focusing on sustainable and vintage finds. Her closet features timeless pieces that help you build a capsule wardrobe. Shop her curated collection of pre-loved gems."
  }
};

export default function InfluencerProfile({ params }) {
  const unwrappedParams = use(params);
  const { id } = unwrappedParams;
  const { searchQuery } = useSearch();
  
  const influencer = INFLUENCER_DATA[id] || INFLUENCER_DATA["1"];

  // Filter products by search query
  const filteredProducts = ALL_PRODUCTS.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.brand.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 5); // Just taking first 5 for the influencer demo

  return (
    <div className="min-h-screen bg-brand-light pb-20">
      <main className="max-w-[1400px] mx-auto px-4 md:px-9 flex flex-col gap-6 pt-4">
        
        {/* Cover / Bio Section */}
        <div className="w-full relative bg-gray-200 overflow-hidden rounded-card aspect-[16/9] md:aspect-[21/9] flex items-center justify-center text-center px-6">
          <Image 
            src={influencer.cover} 
            alt="Cover" 
            fill 
            className="object-cover opacity-60 mix-blend-multiply" 
          />
          <div className="relative z-10 flex flex-col items-center">
            <h1 className="text-[20px] md:text-[28px] font-bold text-white tracking-widest uppercase mb-3">
              {influencer.name}
            </h1>
            <p className="text-[12px] md:text-[14px] text-white/90 font-medium max-w-2xl leading-relaxed">
              {influencer.bio}
            </p>
          </div>
        </div>

        {/* Toolbar: Categories | Filters | Sort By */}
        <div className="flex items-center justify-between border-b border-gray-200 pb-3 pt-2">
          <button className="text-[13px] font-bold text-brand-dark flex items-center gap-1.5 hover:text-brand-pink transition-colors">
            Categories <span>▼</span>
          </button>
          
          <div className="flex items-center gap-6">
            <button className="text-[13px] font-bold text-brand-dark flex items-center gap-1.5 hover:text-brand-pink transition-colors">
              Filters <TuneOutlinedIcon fontSize="small" />
            </button>
            <button className="text-[13px] font-bold text-brand-dark flex items-center gap-1.5 hover:text-brand-pink transition-colors">
              Sort By <SwapVertOutlinedIcon fontSize="small" />
            </button>
          </div>
        </div>

        {/* Masonry Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6 mt-2">
          {filteredProducts.length > 0 ? (
            filteredProducts.map(p => (
              <ProductCard key={p.id} {...p} />
            ))
          ) : (
            <div className="col-span-full py-10 text-center text-gray-500 italic">
              No matching products found in this closet.
            </div>
          )}
        </div>
      </main>

    </div>
  );
}
