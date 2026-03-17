"use client";

import React, { useState, use } from "react";
import ProductImageGallery from "@/components/pdp/ProductImageGallery";
import SizeSelector from "@/components/pdp/SizeSelector";
import ConditionTag from "@/components/pdp/ConditionTag";
import ActionButtons from "@/components/pdp/ActionButtons";
import Rating from "@/components/pdp/Rating";
import QuantitySelector from "@/components/pdp/QuantitySelector";
import RelatedProductsSection from "@/components/pdp/RelatedProductsSection";
import ProductReviews from "@/components/pdp/ProductReviews";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

import { ALL_PRODUCTS } from "@/data/mockData";

// Mock Data Function
const getProductData = (id) => {
  if (!id) return null;
  const foundProduct = ALL_PRODUCTS.find(p => String(p.id) === String(id));
  
  if (!foundProduct) return null;

  // Logic for Similar Products
  const similarProducts = ALL_PRODUCTS.filter(p => {
    if (String(p.id) === String(id)) return false;
    
    // Same category
    if (p.category === foundProduct.category) return true;
    
    // Matching tags
    const commonTags = p.tags?.filter(tag => foundProduct.tags?.includes(tag));
    return commonTags && commonTags.length > 0;
  }).slice(0, 6);

  // Logic for Best Sellers
  const bestSellers = ALL_PRODUCTS
    .filter(p => p.category === foundProduct.category)
    .sort((a, b) => (b.totalSales || 0) - (a.totalSales || 0))
    .slice(0, 6);

  return {
    ...foundProduct,
    price: foundProduct.price || 1299,
    originalPrice: foundProduct.originalPrice || 3999,
    discount: foundProduct.discount || 67,
    rating: foundProduct.rating || 4.5,
    ratingCount: foundProduct.ratingCount || 128,
    stockStatus: "In Stock",
    condition: foundProduct.condition || "Gently Used",
    sizes: foundProduct.sizes || ["XS", "S", "M", "L", "XL"],
    images: foundProduct.images || [foundProduct.imageUrl],
    description: foundProduct.description || "In excellent condition.",
    details: foundProduct.details || {
      fabric: "Cotton Mix",
      fit: "Standard Fit",
      care: "Handle with care",
    },
    seller: {
      name: "Restyle Seller",
      rating: 4.8,
      location: "Mumbai",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80"
    },
    similarProducts: similarProducts,
    bestSellers: bestSellers
  };
};

export default function ProductDetailsPage({ params }) {
  // Direct use of the params promise for Next.js 15+
  const { id } = use(params);
  const product = getProductData(id);

  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isDescExpanded, setIsDescExpanded] = useState(true);
  
  if (!product) return (
    <div className="min-h-screen flex items-center justify-center bg-brand-light">
      <div className="bg-white p-8 rounded-2xl shadow-sm text-center">
        <div className="w-12 h-12 border-4 border-brand-pink border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-[15px] font-bold text-brand-dark">Loading product details...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white pb-24">
      <main className="max-w-[1440px] mx-auto px-4 md:px-9 pt-0 md:pt-9">
        <div className="flex flex-col lg:flex-row gap-9 lg:gap-9 relative">
          
          {/* 1. Left Column: Image Gallery */}
          <div className="w-full lg:w-[45%] lg:sticky lg:top-32 h-fit">
            <ProductImageGallery images={product.images} />
          </div>

          {/* 2. Middle Column: Product Info */}
          <div className="flex-1 flex flex-col gap-9">
            <div className="flex flex-col gap-3">
              <span className="text-[12px] font-bold text-brand-purple uppercase tracking-widest opacity-80">
                From {product.brand}
              </span>
              <h1 className="text-[26px] md:text-[32px] font-bold text-brand-dark leading-tight tracking-tight">
                {product.title}
              </h1>
              
              <Rating rating={product.rating} count={product.ratingCount} />
              
              <hr className="my-6 border-[#F0F0F0]" />

              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-white bg-brand-pink px-2 py-1 rounded-[2px] uppercase tracking-tighter">
                    {product.discount}% off
                  </span>
                  <span className="text-[12px] font-bold text-brand-pink uppercase tracking-tight">Limited time deal</span>
                </div>
                
                <div className="flex items-start">
                   <span className="text-[14px] text-brand-dark font-medium mt-1.5 mr-0.5">₹</span>
                   <span className="text-[32px] font-medium text-brand-dark tracking-tighter leading-none">
                    {Math.floor(product.price)}
                   </span>
                   <span className="text-[14px] text-brand-dark font-medium mt-1.5 ml-0.5">
                    {((product.price % 1) * 100).toFixed(0).padStart(2, '0') === '00' ? '00' : ((product.price % 1) * 100).toFixed(0)}
                   </span>
                </div>

                <div className="text-[13px] text-gray-500 font-medium opacity-70">
                  MRP: <span className="line-through">₹{product.originalPrice}</span>
                </div>

                <div className="mt-4">
                  <ConditionTag condition={product.condition} />
                </div>
              </div>
            </div>

            <SizeSelector 
              sizes={product.sizes} 
              selectedSize={selectedSize} 
              onSizeSelect={setSelectedSize} 
            />

            <hr className="border-[#F0F0F0]" />

            <div className="flex flex-col gap-4">
               <h4 className="text-[15px] font-bold text-brand-dark uppercase tracking-wider">Description</h4>
               <p className="text-[15px] leading-relaxed text-[#555555] max-w-2xl font-normal">
                {product.description}
               </p>
            </div>

            <hr className="border-[#F0F0F0]" />
            
            <div className="grid grid-cols-2 gap-6 bg-brand-light p-9 rounded-[24px] border border-[#EEEEEE]">
               {Object.entries(product.details).map(([key, value]) => (
                <div key={key} className="flex flex-col gap-1.5">
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">{key}</span>
                  <span className="text-[14px] font-bold text-brand-dark">{value}</span>
                </div>
              ))}
            </div>
          </div>
          {/* 3. Right Column: Checkout Card (Amazon Style) */}
          <div className="w-full lg:w-[320px]">
            <article className="sticky top-32 bg-white border border-[#EEEEEE] rounded-[24px] p-9 shadow-sm flex flex-col gap-6">
              <div className="flex flex-col">
                <div className="flex items-start">
                   <span className="text-[12px] text-brand-dark font-medium mt-1 mr-0.5">₹</span>
                   <span className="text-[28px] font-medium text-brand-dark tracking-tighter leading-none">
                    {Math.floor(product.price)}
                   </span>
                   <span className="text-[12px] text-brand-dark font-medium mt-1 ml-0.5">
                    {((product.price % 1) * 100).toFixed(0).padStart(2, '0') === '00' ? '00' : ((product.price % 1) * 100).toFixed(0)}
                   </span>
                </div>
                <span className="text-[15px] font-bold text-green-600 mt-2">
                  {product.stockStatus}
                </span>
              </div>

              <QuantitySelector quantity={quantity} onChange={setQuantity} />

              <ActionButtons 
                isWishlisted={isWishlisted}
                onWishlistToggle={() => setIsWishlisted(!isWishlisted)}
                onBuyNow={() => console.log("Buy Now", { productId, quantity, selectedSize })}
                onAddToCart={() => console.log("Add to Cart", { productId, quantity, selectedSize })}
              />
              
              <p className="text-[11px] text-gray-400 text-center font-medium opacity-80">
                Secure transaction • Ship from Restyle
              </p>
            </article>
          </div>

        </div>

        {/* Dynamic Related Sections */}
        <div className="flex flex-col gap-4">
          <RelatedProductsSection 
            title="Similar Products" 
            products={product.similarProducts} 
          />
          <RelatedProductsSection 
            title="Best Sellers in this Category" 
            products={product.bestSellers} 
          />
        </div>

        {/* Dynamic Reviews Section */}
        <ProductReviews />
      </main>
    </div>
  );
}
