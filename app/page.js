"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import ProductCard from "@/components/ProductCard";
import InfluencerCard from "@/components/InfluencerCard";
import Button from "@/components/Button";
import { useSearch } from "@/context/SearchContext";
import api from "@/lib/api";

const HERO_SLIDES = [
  { id: 1, title: "Summer Collection", subtitle: "HOT DEALS", bg: "from-pink-100 to-pink-50" },
  { id: 2, title: "Vintage Classics",  subtitle: "PRE-LOVED",  bg: "from-purple-100 to-purple-50" },
  { id: 3, title: "Y2K Fashion",       subtitle: "TRENDING",   bg: "from-orange-100 to-orange-50" },
];

const HOME_CATEGORIES = [
  { id: 'all',        name: 'All',                  image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=200&q=80' },
  { id: 'tops',       name: 'Tops',                 image: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=200&q=80' },
  { id: 'bottoms',    name: 'Bottoms',              image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=200&q=80' },
  { id: 'dresses',    name: 'Dresses',              image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=200&q=80' },
  { id: 'co-ords',    name: 'Co-ords',              image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=200&q=80' },
  { id: 'outerwear',  name: 'Outerwear',            image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=200&q=80' },
  { id: 'vintage',    name: 'Vintage',              image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=200&q=80' },
  { id: 'streetwear', name: 'Streetwear',           image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=200&q=80' },
  { id: 'ethnic',     name: 'Ethnic',               image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=200&q=80' },
  { id: 'influencers',name: 'Shop by Influencers',  image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=200&q=80' },
];

function SkeletonCard() {
  return (
    <div className="flex flex-col gap-3 animate-pulse">
      <div className="aspect-[2/3] w-full bg-gray-200 rounded-lg" />
      <div className="h-3 bg-gray-200 rounded w-1/2" />
      <div className="h-4 bg-gray-200 rounded w-3/4" />
      <div className="h-4 bg-gray-100 rounded w-1/3" />
    </div>
  );
}

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { searchQuery, activeCategory, setActiveCategory } = useSearch();
  const [listings, setListings]               = useState([]);
  const [listingsLoading, setListingsLoading] = useState(true);
  
  const [influencers, setInfluencers] = useState([]);
  const [influencersLoading, setInfluencersLoading] = useState(true);

  // Auto carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // Fetch approved listings from backend
  useEffect(() => {
    setListingsLoading(true);
    api.get("/products", { params: { limit: 40 } })
      .then(({ data }) => setListings(data.products || []))
      .catch(() => setListings([]))
      .finally(() => setListingsLoading(false));
  }, []);

  // Fetch influencers from backend
  useEffect(() => {
    setInfluencersLoading(true);
    api.get("/auth/influencers")
      .then(({ data }) => setInfluencers(data || []))
      .catch(() => setInfluencers([]))
      .finally(() => setInfluencersLoading(false));
  }, []);

  const listingCategoryMatch = (p) => {
    if (activeCategory === "all") return true;
    if (activeCategory === "new-arrivals") {
      const d = p.createdAt ? new Date(p.createdAt) : null;
      if (!d || Number.isNaN(d.getTime())) return true;
      return Date.now() - d.getTime() < 30 * 86400000;
    }
    if (activeCategory === "dresses-jumpsuits") {
      return p.category === "dresses" || p.category === "jumpsuits";
    }
    return p.category === activeCategory;
  };

  const categorySectionTitle =
    activeCategory === "all"
      ? "New Arrivals "
      : activeCategory === "new-arrivals"
        ? "New Arrivals"
        : activeCategory === "dresses-jumpsuits"
          ? "Dresses | Jumpsuits"
          : activeCategory === "hot"
            ? "Hot Picks"
            : `${activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)} Collection`;

  // Filter by active category + search
  const filteredListings = listings.filter((p) => {
    const matchCat = listingCategoryMatch(p);
    const q = (searchQuery || "").toLowerCase();
    const matchSearch =
      !q || p.title.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-[100dvh] bg-brand-light pb-24">
      <main className="app-gutter flex w-full min-w-0 flex-col gap-8 pt-4">

        {/* ── Hero Carousel ── */}
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
                  <p className="text-[11px] font-bold tracking-[0.2em] text-brand-pink uppercase mb-1">{slide.subtitle}</p>
                  <h2 className="text-[22px] sm:text-[28px] md:text-[36px] font-extrabold text-brand-dark uppercase tracking-wide drop-shadow-sm">{slide.title}</h2>
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

        {/* ── Categories ── */}
        <section id="categories" className="flex flex-col gap-5 overflow-hidden py-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-[20px] font-bold text-brand-dark tracking-tight">Shop by Category</h3>
            <span className="text-[12px] font-bold text-gray-400 uppercase tracking-widest hidden sm:block">Scroll to explore</span>
          </div>
          <div className="flex items-center gap-4 md:gap-6 overflow-x-auto hide-scrollbar pb-6 snap-x snap-mandatory px-1">
            {HOME_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  if (cat.id === "influencers") {
                    document.getElementById("influencers")?.scrollIntoView({ behavior: "smooth", block: "center" });
                    return;
                  }
                  setActiveCategory(cat.id);
                }}
                className="flex flex-col items-center gap-3 snap-start transition-all transform active:scale-95 group focus:outline-none"
              >
                <div className={`relative w-[90px] h-[90px] md:w-[110px] md:h-[110px] rounded-[16px] md:rounded-[20px] overflow-hidden border-2 transition-all duration-500 shadow-sm ${
                  activeCategory === cat.id
                    ? "border-brand-pink shadow-[0_10px_25px_-5px_rgba(247,36,110,0.3)] ring-4 ring-brand-pink/10 scale-105"
                    : "border-white bg-white group-hover:border-brand-pink/30 group-hover:shadow-md"
                }`}>
                  <Image src={cat.image} alt={cat.name} fill className={`object-cover transition-transform duration-700 ${activeCategory === cat.id ? "scale-110" : "group-hover:scale-110"}`} />
                  <div className={`absolute inset-0 bg-gradient-to-b from-transparent to-black/5 transition-opacity duration-300 ${activeCategory === cat.id ? "opacity-20" : "opacity-0 group-hover:opacity-10"}`} />
                </div>
                <span className={`text-[12px] md:text-[13px] font-bold leading-tight text-center max-w-[90px] md:max-w-[110px] transition-all duration-300 ${activeCategory === cat.id ? "text-brand-pink scale-105" : "text-brand-dark/80 group-hover:text-brand-dark"}`}>
                  {cat.name}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* ── Product Catalogue (first 4) ── */}
        <section className="flex flex-col gap-5 min-h-[200px]">
          <div className="flex items-end justify-between">
            <div>
              <h3 className="text-[20px] font-bold text-brand-dark tracking-tight">
                {categorySectionTitle}
              </h3>
              {!listingsLoading && (
                <p className="text-[13px] text-gray-400 font-medium mt-0.5">
                  {filteredListings.length} {filteredListings.length === 1 ? "item" : "items"} available
                </p>
              )}
            </div>
            {activeCategory !== "all" && (
              <button onClick={() => setActiveCategory("all")} className="text-[13px] font-bold text-brand-pink hover:underline">
                Clear Filters
              </button>
            )}
          </div>

          {listingsLoading ? (
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : filteredListings.length > 0 ? (
            <>
              <div className="grid grid-cols-2 gap-3 sm:gap-4 animate-fadeIn">
                {filteredListings.slice(0, 4).map((product) => (
                  <ProductCard
                    key={product._id}
                    id={product._id}
                    title={product.title}
                    brand={product.brand}
                    price={product.price}
                    originalPrice={product.originalPrice}
                    imageUrl={product.imageUrl || product.images?.[0]}
                    rating={product.rating}
                  />
                ))}
              </div>
              {/* View All CTA */}
              {filteredListings.length > 4 && (
                <button
                  onClick={() => {}}
                  className="w-full mt-1 py-3.5 rounded-2xl border-2 border-brand-pink text-brand-pink text-[14px] font-bold tracking-wide hover:bg-brand-pink hover:text-white transition-all duration-200"
                >
                  View All {filteredListings.length} Listings →
                </button>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-card border border-dashed border-gray-200">
              <p className="text-gray-400 font-medium italic">No listings in this category yet.</p>
              <Button variant="ghost" className="mt-4 text-brand-pink underline" onClick={() => setActiveCategory("all")}>
                View All Listings
              </Button>
            </div>
          )}
        </section>

        {/* ── Shop by Influencer ── */}
        <section id="influencers" className="flex flex-col gap-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-[20px] font-bold text-brand-dark tracking-tight">Shop by Influencer</h3>
            {influencers.length > 2 && (
              <span className="text-[12px] font-bold text-brand-pink uppercase tracking-widest cursor-pointer hover:underline">See all</span>
            )}
          </div>
          {influencersLoading ? (
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
               {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="animate-pulse flex flex-col gap-2">
                  <div className="h-32 w-full bg-gray-200 rounded-card" />
                  <div className="h-20 w-20 bg-gray-300 rounded-full mx-auto -mt-10 border-4 border-white" />
                  <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mt-2" />
                </div>
               ))}
            </div>
          ) : influencers.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {influencers.map((inf) => (
                <InfluencerCard
                  key={inf._id}
                  id={inf._id}
                  name={inf.fullName || inf.businessName}
                  handle={inf.instagramId ? `@${inf.instagramId}` : `@${(inf.fullName || "user").replace(/\s+/g, "").toLowerCase()}`}
                  followers={inf.followersCount > 1000 ? `${(inf.followersCount / 1000).toFixed(1)}k` : inf.followersCount}
                  itemsListed={inf.itemsListed}
                  avatarUrl={inf.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"}
                  coverUrl={inf.coverUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 bg-white rounded-card border border-dashed border-gray-200">
              <p className="text-gray-400 font-medium italic">No influencers available.</p>
            </div>
          )}
        </section>

      </main>
    </div>
  );
}
