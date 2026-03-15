"use client";

import React from "react";
import Image from "next/image";
import TuneOutlinedIcon from '@mui/icons-material/TuneOutlined';
import SwapVertOutlinedIcon from '@mui/icons-material/SwapVertOutlined';

import ProductCard from "@/components/ProductCard";

export default function InfluencerProfile() {
  return (
    <div className="min-h-screen bg-brand-light pb-20">
      <main className="max-w-[1400px] mx-auto px-4 md:px-9 flex flex-col gap-6 pt-4">
        
        {/* Cover / Bio Section */}
        <div className="w-full relative bg-gray-200 overflow-hidden rounded-card aspect-[16/9] md:aspect-[21/9] flex items-center justify-center text-center px-6">
          <Image 
            src="https://images.unsplash.com/photo-1542295669297-4d407eb36b9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80" 
            alt="Cover" 
            fill 
            className="object-cover opacity-60 mix-blend-multiply" 
          />
          <div className="relative z-10 flex flex-col items-center">
            <h1 className="text-[20px] md:text-[28px] font-bold text-white tracking-widest uppercase mb-3">
              Influencer Name
            </h1>
            <p className="text-[12px] md:text-[14px] text-white/90 font-medium max-w-lg leading-relaxed mix-blend-screen text-shadow-sm">
              With a loyal social media following, this influencers stylish feed never misses. 
              She keeps it real, shares self-care moments, and that authentic city life is exactly why fans adore her. 
              Discover her standout style and shop her pre-loved wardrobe now on Restyle.
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

        {/* Masonry Product Grid (2 columns consistent with wireframe) */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6 mt-2">
          <ProductCard id="1" title="Product Name" price="99" originalPrice="150" brand="Brand Name" />
          <ProductCard id="3" title="Product Name" price="99" originalPrice="150" brand="Brand Name" />
          <ProductCard id="4" title="Product Name" price="99" originalPrice="150" brand="Brand Name" />
          <ProductCard id="5" title="Product Name" price="99" originalPrice="150" brand="Brand Name" />
        </div>
      </main>

    </div>
  );
}
