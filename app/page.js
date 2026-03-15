"use client";

import React, { useState, useEffect } from "react";
import ProductCard from "@/components/ProductCard";
import InfluencerCard from "@/components/InfluencerCard";

const HERO_SLIDES = [
  { id: 1, title: "Summer Collection", subtitle: "HOT DEALS", bg: "from-pink-100 to-pink-50" },
  { id: 2, title: "Vintage Classics", subtitle: "PRE-LOVED", bg: "from-purple-100 to-purple-50" },
  { id: 3, title: "Y2K Fashion", subtitle: "TRENDING", bg: "from-orange-100 to-orange-50" },
];

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto Carousel logic
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-[100dvh] bg-brand-light pb-24">
      <main className="max-w-[1400px] mx-auto px-4 md:px-9 pt-4 flex flex-col gap-8">
        
        {/* Hero Carousel / Image Slider */}
        <section className="relative w-full aspect-[2/1] sm:aspect-[3/1] rounded-card overflow-hidden shadow-sm group">
          <div 
            className="flex transition-transform duration-700 ease-in-out h-full"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {HERO_SLIDES.map((slide) => (
              <div 
                key={slide.id} 
                className={`min-w-full h-full bg-gradient-to-b ${slide.bg} flex flex-col items-center justify-center text-center px-4 relative`}
              >
                <div className="absolute inset-0 bg-black/5" />
                <div className="relative z-10">
                  <p className="text-[11px] font-bold tracking-[0.2em] text-brand-pink uppercase mb-1">
                    {slide.subtitle}
                  </p>
                  <h2 className="text-[22px] sm:text-[28px] md:text-[36px] font-extrabold text-brand-dark uppercase tracking-wide drop-shadow-sm">
                    {slide.title}
                  </h2>
                </div>
              </div>
            ))}
          </div>
          
          {/* Carousel dots */}
          <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-2 z-20">
            {HERO_SLIDES.map((_, idx) => (
              <button 
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`w-2 h-2 rounded-full transition-all ${currentSlide === idx ? "bg-brand-pink w-4" : "bg-brand-dark/30"}`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </section>

        {/* Categories Section (Category Slider) */}
        <section className="flex flex-col gap-3 overflow-hidden">
          <h3 className="text-[18px] font-bold text-brand-dark tracking-tight">
            Categories
          </h3>
          <div className="flex items-center gap-3 md:gap-4 overflow-x-auto hide-scrollbar pb-2 snap-x snap-mandatory">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex flex-col items-center gap-2 min-w-[72px] sm:min-w-[88px] snap-start">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gray-200 flex-shrink-0 animate-pulse" />
                <span className="text-[11px] font-medium text-brand-dark">Category {i}</span>
              </div>
            ))}
          </div>
        </section>

        {/* New Arrivals Section */}
        <section className="flex flex-col gap-3">
          <h3 className="text-[18px] font-bold text-brand-dark tracking-tight">
            New Arrivals
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
            <ProductCard id="1" title="Vintage Denim" price="45" brand="Levi's" />
            <ProductCard id="2" title="Oversized Blazer" price="85" originalPrice="150" brand="Zara" />
            <ProductCard id="3" title="Silk Slip Dress" price="60" brand="Réalisation Par" />
            <ProductCard id="4" title="Chunky Loafers" price="120" brand="Prada" />
          </div>
        </section>

        {/* Top Influencers Section */}
        <section className="flex flex-col gap-3">
          <h3 className="text-[18px] font-bold text-brand-dark tracking-tight">
            Our Top Influencers
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
            <InfluencerCard id="1" name="Sarah Style" handle="@sarahstyle" />
            <InfluencerCard id="2" name="Jane Doe" handle="@janedoe" />
          </div>
        </section>

        {/* Pre-Loved Section */}
        <section className="flex flex-col gap-3">
           <h3 className="text-[18px] font-bold text-brand-dark tracking-tight">
            Pre-Loved
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
            <ProductCard id="5" title="Ribbed Knit Top" price="25" brand="H&M" />
            <ProductCard id="6" title="Graphic Tee" price="15" brand="Vintage" />
            <ProductCard id="7" title="Leather Jacket" price="150" originalPrice="300" brand="AllSaints" />
            <ProductCard id="8" title="Maxi Skirt" price="35" brand="Mango" />
          </div>
        </section>
      </main>
    </div>
  );
}
