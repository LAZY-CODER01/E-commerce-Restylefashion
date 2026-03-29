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

const HOME_CATEGORIES = [
  { id: 'all', name: 'All', image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=200&q=80' },
  { id: 'tops', name: 'Tops', image: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=200&q=80' },
  { id: 'bottoms', name: 'Bottoms', image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=200&q=80' },
  { id: 'dresses', name: 'Dresses', image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=200&q=80' },
  { id: 'co-ords', name: 'Co-ords', image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=200&q=80' },
  { id: 'outerwear', name: 'Outerwear', image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=200&q=80' },
  { id: 'jumpsuits', name: 'Dresses | Jumpsuits', image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=200&q=80' },
  { id: 'coats', name: 'Coats | Jackets', image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=200&q=80' },
  { id: 'desi', name: 'Desi x GenZ', image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=200&q=80' },
  { id: 'hot', name: 'Hot Picks', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=200&q=80' },
  { id: 'influencers', name: 'Shop by Influencers', image: 'https://images.unsplash.com/photo-1520333789090-1afc82db536a?auto=format&fit=crop&w=200&q=80' },
];

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { searchQuery, activeCategory, setActiveCategory } = useSearch();

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
        <section className="relative w-full aspect-[21/9] sm:aspect-[3/1] rounded-card overflow-hidden shadow-sm group">
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

        {/* Categories Section - Redesigned */}
        <section id="categories" className="flex flex-col gap-5 overflow-hidden py-4">
          <div className="flex items-center justify-between px-1">
             <h3 className="text-[20px] font-bold text-brand-dark tracking-tight">
               Shop by Category
             </h3>
             <span className="text-[12px] font-bold text-gray-400 uppercase tracking-widest hidden sm:block">Scroll to explore</span>
          </div>
          
          <div className="flex items-center gap-4 md:gap-6 overflow-x-auto hide-scrollbar pb-6 snap-x snap-mandatory px-1">
            {HOME_CATEGORIES.map((cat) => (
              <button 
                key={cat.id} 
                onClick={() => {
                  if (cat.id === "influencers") {
                    const element = document.getElementById("influencers");
                    element?.scrollIntoView({ behavior: "smooth", block: "center" });
                    return;
                  }
                  setActiveCategory(cat.id);
                }}
                className="flex flex-col items-center gap-3 snap-start transition-all transform active:scale-95 group focus:outline-none"
              >
                {/* Image Card Container */}
                <div className={`relative w-[90px] h-[90px] md:w-[110px] md:h-[110px] rounded-[16px] md:rounded-[20px] overflow-hidden border-2 transition-all duration-500 shadow-sm ${
                  activeCategory === cat.id 
                    ? "border-brand-pink shadow-[0_10px_25px_-5px_rgba(247,36,110,0.3)] ring-4 ring-brand-pink/10 scale-105" 
                    : "border-white bg-white group-hover:border-brand-pink/30 group-hover:shadow-md"
                }`}>
                  <Image 
                    src={cat.image} 
                    alt={cat.name} 
                    fill 
                    className={`object-cover transition-transform duration-700 ${
                      activeCategory === cat.id ? "scale-110" : "group-hover:scale-110"
                    }`}
                  />
                  {/* Subtle Gradient Overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-b from-transparent to-black/5 transition-opacity duration-300 ${
                    activeCategory === cat.id ? "opacity-20" : "opacity-0 group-hover:opacity-10"
                  }`} />
                </div>
                
                {/* Category Text */}
                <span className={`text-[12px] md:text-[13px] font-bold leading-tight text-center max-w-[90px] md:max-w-[110px] transition-all duration-300 truncate-2-lines ${
                  activeCategory === cat.id ? "text-brand-pink scale-105" : "text-brand-dark/80 group-hover:text-brand-dark"
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
        <section id="influencers" className="flex flex-col gap-3">
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

