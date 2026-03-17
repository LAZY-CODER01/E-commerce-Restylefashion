"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import ProductCard from "@/components/ProductCard";
import InfluencerCard from "@/components/InfluencerCard";
import Button from "@/components/Button";
import { useSearch } from "@/context/SearchContext";

import { ALL_PRODUCTS, CATEGORIES } from "@/data/mockData";

const HERO_SLIDES = [
  { id: 1, title: "Summer Collection", subtitle: "HOT DEALS", bg: "from-pink-100 to-pink-50" },
  { id: 2, title: "Vintage Classics", subtitle: "PRE-LOVED", bg: "from-purple-100 to-purple-50" },
  { id: 3, title: "Y2K Fashion", subtitle: "TRENDING", bg: "from-orange-100 to-orange-50" },
];

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeCategory, setActiveCategory] = useState('all');
  const { searchQuery } = useSearch();

  // Auto Carousel logic
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const filteredProducts = ALL_PRODUCTS.filter(p => {
    const matchesCategory = activeCategory === 'all' || p.category === activeCategory;
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.brand.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-[100dvh] bg-brand-light pb-24">
      <main className="max-w-[1400px] mx-auto px-4 md:px-9 pt-4 flex flex-col gap-8">
        
        {/* Hero Carousel */}
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

        {/* Categories Section */}
        <section className="flex flex-col gap-3 overflow-hidden">
          <h3 className="text-[18px] font-bold text-brand-dark tracking-tight">
            Categories
          </h3>
          <div className="flex items-center gap-4 md:gap-6 overflow-x-auto hide-scrollbar pb-2 snap-x snap-mandatory">
            {CATEGORIES.map((cat) => (
              <button 
                key={cat.id} 
                onClick={() => setActiveCategory(cat.id)}
                className={`flex flex-col items-center gap-2 min-w-[72px] sm:min-w-[84px] snap-start transition-all transform active:scale-95 group`}
              >
                <div className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 transition-all ${
                  activeCategory === cat.id ? "border-brand-pink shadow-pink-md scale-105" : "border-transparent group-hover:border-brand-pink/30"
                }`}>
                  <Image 
                    src={cat.image} 
                    alt={cat.name} 
                    fill 
                    className="object-cover transition-transform group-hover:scale-110"
                  />
                  {activeCategory === cat.id && (
                    <div className="absolute inset-0 bg-brand-pink/10 flex items-center justify-center">
                    </div>
                  )}
                </div>
                <span className={`text-[12px] font-bold transition-colors ${
                  activeCategory === cat.id ? "text-brand-pink" : "text-brand-dark opacity-70 group-hover:opacity-100"
                }`}>
                  {cat.name}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* Dynamic Products Section */}
        <section className="flex flex-col gap-5 min-h-[400px]">
          <div className="flex items-end justify-between">
            <h3 className="text-[20px] font-bold text-brand-dark tracking-tight">
              {activeCategory === 'all' ? 'New Arrivals' : `${activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)} Collection`}
            </h3>
            {activeCategory !== 'all' && (
              <button 
                onClick={() => setActiveCategory('all')}
                className="text-[13px] font-bold text-brand-pink hover:underline"
              >
                Clear Filters
              </button>
            )}
          </div>
          
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6 animate-fadeIn">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-card border border-dashed border-gray-200">
               <p className="text-gray-400 font-medium italic">No items found in this category yet.</p>
               <Button 
                variant="ghost" 
                className="mt-4 text-brand-pink underline"
                onClick={() => setActiveCategory('all')}
               >
                 View All Products
               </Button>
            </div>
          )}
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
        <section className="flex flex-col gap-5">
           <h3 className="text-[18px] font-bold text-brand-dark tracking-tight">
            Pre-Loved
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
            <ProductCard id="5" title="Ribbed Knit Top" price="25" brand="H&M" imageUrl="https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=800&q=80" />
            <ProductCard id="6" title="Graphic Tee" price="15" brand="Vintage" imageUrl="https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80" />
            <ProductCard id="7" title="Leather Jacket" price="150" originalPrice="300" brand="AllSaints" imageUrl="https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=800&q=80" />
            <ProductCard id="8" title="Maxi Skirt" price="35" brand="Mango" imageUrl="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80" />
          </div>
        </section>

      </main>
    </div>
  );
}

