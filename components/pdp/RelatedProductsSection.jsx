"use client";

import React from "react";
import ProductCard from "../ProductCard";

export default function RelatedProductsSection({ title, products }) {
  if (!products || products.length === 0) return null;

  return (
    <section className="py-12 border-t border-[#F0F0F0] font-roboto">
      <div className="flex flex-col gap-8">
        <h2 className="text-[20px] font-bold text-brand-dark uppercase tracking-wide">
          {title}
        </h2>
        
        {/* Horizontal Scroll Container */}
        <div className="flex gap-6 overflow-x-auto pb-6 -mx-4 px-4 scrollbar-none snap-x snap-mandatory">
          {products.map((product) => (
            <div key={product.id} className="min-w-[200px] md:min-w-[260px] flex-shrink-0 snap-start">
              <ProductCard
                id={product.id}
                title={product.title}
                brand={product.brand}
                price={product.price}
                originalPrice={product.originalPrice}
                imageUrl={product.imageUrl}
                rating={product.rating}
                size={product.sizes?.[0] || "M"}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
