import React from "react";
import ProductCard from "@/components/ProductCard";

export default function SimilarProductsCarousel({ products = [] }) {
  if (!products.length) return null;

  return (
    <section className="flex flex-col gap-6 py-8">
      <h3 className="text-[20px] font-bold text-brand-dark px-4 md:px-0">You May Also Like</h3>
      <div className="flex gap-4 overflow-x-auto hide-scrollbar snap-x snap-mandatory px-4 md:px-0 pb-4">
        {products.map((product) => (
          <div key={product.id} className="min-w-[200px] sm:min-w-[240px] snap-start">
            <ProductCard {...product} />
          </div>
        ))}
      </div>
    </section>
  );
}
