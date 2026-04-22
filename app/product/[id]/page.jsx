"use client";

import React, { useState, use, useEffect, useMemo } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import api from "@/lib/api";
import ProductImageGallery from "@/components/pdp/ProductImageGallery";
import SizeSelector from "@/components/pdp/SizeSelector";
import ConditionTag from "@/components/pdp/ConditionTag";
import ActionButtons from "@/components/pdp/ActionButtons";
import RelatedProductsSection from "@/components/pdp/RelatedProductsSection";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

import { ALL_PRODUCTS } from "@/data/mockData";
import { useCart } from "@/context/CartContext";

const VALID_PRODUCTS = ALL_PRODUCTS.filter((p) => p != null && p.id != null);

// Mock Data Function
const getProductData = (id) => {
  if (id == null || id === "") return null;
  const list = VALID_PRODUCTS;
  const foundProduct = list.find((p) => String(p.id) === String(id));

  if (!foundProduct) return null;

  // Logic for Similar Products
  const similarProducts = list.filter((p) => {
    if (String(p.id) === String(id)) return false;

    // Same category
    if (p.category === foundProduct.category) return true;

    // Matching tags
    const commonTags = p.tags?.filter((tag) => foundProduct.tags?.includes(tag));
    return commonTags && commonTags.length > 0;
  }).slice(0, 6);

  // Logic for Best Sellers
  const bestSellers = list
    .filter((p) => p.category === foundProduct.category)
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

const PLACEHOLDER_IMG =
  "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=800&q=80";

function mapRelatedForCards(items) {
  return (Array.isArray(items) ? items : []).map((x) => ({
    id: String(x._id ?? x.id),
    _id: x._id,
    title: x.title,
    brand: x.brand,
    price: Number(x.price) || 0,
    originalPrice: Number(x.originalPrice ?? x.price) || 0,
    imageUrl: x.imageUrl || x.images?.[0] || PLACEHOLDER_IMG,
    rating: x.rating ?? 4.5,
    sizes: Array.isArray(x.sizes) && x.sizes.length ? x.sizes : ["S", "M", "L"],
  }));
}

/** Shape API `GET /products/:id` into the same shape as `getProductData` (mock). */
function normalizeApiProductForPdp(data) {
  const p = data;
  const idStr = String(p._id ?? p.id ?? "");
  let images = Array.isArray(p.images) && p.images.length ? [...p.images] : [];
  if (!images.length && p.imageUrl) images = [p.imageUrl];
  if (!images.length) images = [PLACEHOLDER_IMG];

  const details =
    p.details && typeof p.details === "object" && !Array.isArray(p.details)
      ? {
          fabric: p.details.fabric || "",
          fit: p.details.fit || "",
          care: p.details.care || "",
        }
      : { fabric: "", fit: "", care: "" };

  const sellerDoc = p.seller;
  const seller =
    sellerDoc && typeof sellerDoc === "object" && !Array.isArray(sellerDoc)
      ? {
          name: sellerDoc.fullName || "Seller",
          rating: 4.8,
          location: "India",
          avatar:
            sellerDoc.avatar ||
            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80",
        }
      : {
          name: "Restyle Seller",
          rating: 4.8,
          location: "Mumbai",
          avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80",
        };

  const price = Number(p.price) || 0;
  const original = Number(p.originalPrice) || price;
  let discount = Number(p.discount);
  if (!Number.isFinite(discount) || discount < 0) {
    discount = original > 0 ? Math.max(0, Math.min(100, Math.round(((original - price) / original) * 100))) : 0;
  }

  const related = mapRelatedForCards(p.similarProducts);

  return {
    ...p,
    id: idStr,
    price,
    originalPrice: original,
    discount,
    images,
    imageUrl: images[0],
    details,
    seller,
    stockStatus: p.stockStatus || "In Stock",
    condition: p.condition || "Gently Used",
    sizes: Array.isArray(p.sizes) && p.sizes.length ? p.sizes : ["XS", "S", "M", "L", "XL"],
    description: p.description || "",
    similarProducts: related,
    bestSellers: related,
    rating: p.rating ?? 4.5,
    ratingCount: p.ratingCount ?? 0,
  };
}

export default function ProductDetailsPage({ params }) {
  const resolvedParams = use(params);
  const id = resolvedParams?.id ?? resolvedParams?.slug ?? "";

  const mockProduct = useMemo(() => getProductData(id), [id]);
  const [remoteProduct, setRemoteProduct] = useState(null);
  const [fetchStatus, setFetchStatus] = useState(() => (getProductData(id) ? "ready" : "loading"));

  useEffect(() => {
    const mock = getProductData(id);
    if (mock) {
      setRemoteProduct(null);
      setFetchStatus("ready");
      return;
    }
    if (!id) {
      setRemoteProduct(null);
      setFetchStatus("notfound");
      return;
    }
    let cancelled = false;
    setFetchStatus("loading");
    setRemoteProduct(null);
    api
      .get(`/products/${id}`)
      .then(({ data }) => {
        if (cancelled) return;
        setRemoteProduct(normalizeApiProductForPdp(data));
        setFetchStatus("ready");
      })
      .catch(() => {
        if (cancelled) return;
        setRemoteProduct(null);
        setFetchStatus("notfound");
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  const product = mockProduct ?? remoteProduct;

  const [selectedSize, setSelectedSize] = useState("");
  const [isDescExpanded, setIsDescExpanded] = useState(true);

  useEffect(() => {
    setSelectedSize("");
  }, [id]);

  const { wishlist, toggleWishlist, addToBag } = useCart();
  const safeWishlist = Array.isArray(wishlist) ? wishlist : [];
  const productIdKey = product?.id != null || product?._id != null ? String(product.id ?? product._id) : "";
  const isWishlisted =
    Boolean(productIdKey) &&
    safeWishlist.some((w) => String(w?.id ?? w?._id ?? w?.sku ?? w?.slug ?? w?.productId) === productIdKey);

  const handleWishlistToggle = () => {
    if (!product) return;
    const wid = product.id ?? product._id;
    toggleWishlist({
      id: wid,
      title: product.title,
      brand: product.brand,
      price: product.price,
      originalPrice: product.originalPrice,
      imageUrl: product.imageUrl,
    });
    toast.info(isWishlisted ? `${product.title} removed from wishlist.` : `${product.title} added to wishlist!`);
  };

  const handleAddToCart = () => {
    if (!product) return;
    if (!selectedSize) {
      toast.warn("Please select a size first.");
      return;
    }
    addToBag({
      id: product.id ?? product._id,
      title: product.title,
      brand: product.brand,
      price: product.price,
      originalPrice: product.originalPrice,
      imageUrl: product.imageUrl,
      selectedSize,
      qty: 1,
    });
    toast.success(`${product.title} (${selectedSize}) added to bag!`);
  };

  const handleBuyNow = () => {
    if (!selectedSize) {
      toast.warn("Please select a size before buying.");
      return;
    }
    toast.info("Redirecting to checkout...");
  };

  if (!product && fetchStatus === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-brand-light">
        <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-brand-pink border-t-transparent" />
          <p className="text-[15px] font-bold text-brand-dark">Loading product details…</p>
        </div>
      </div>
    );
  }

  if (!product && fetchStatus === "notfound") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-brand-light px-4">
        <div className="max-w-md rounded-2xl bg-white p-8 text-center shadow-sm">
          <p className="text-lg font-bold text-brand-dark">Product not found</p>
          <p className="mt-2 text-[14px] text-gray-500">
            This listing may have been removed or the link is invalid.
          </p>
          <Link
            href="/"
            className="mt-6 inline-block rounded-[11px] bg-[#F7246E] px-6 py-3 text-[14px] font-bold text-white shadow-pink-md transition hover:bg-brand-pink-hover"
          >
            Back to shop
          </Link>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-brand-light">
        <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-brand-pink border-t-transparent" />
          <p className="text-[15px] font-bold text-brand-dark">Loading product details…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-36 lg:pb-24">
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
          {/* 3. Right Column: Checkout Card — desktop only */}
          <div className="hidden lg:block w-full lg:w-[320px]">
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

              <ActionButtons 
                isWishlisted={isWishlisted}
                onWishlistToggle={handleWishlistToggle}
                onBuyNow={handleBuyNow}
                onAddToCart={handleAddToCart}
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
      </main>

      {/* ── Sticky Bottom Bar — mobile only (hidden on lg+) ── */}
      <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
        {/* Size chips row — shown only when no size selected */}
        {!selectedSize && (
          <div className="flex items-center gap-2 overflow-x-auto bg-white/95 px-4 py-2 border-t border-gray-100 backdrop-blur-sm">
            <span className="shrink-0 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Size:</span>
            {product.sizes.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => setSelectedSize(size)}
                className="shrink-0 h-9 min-w-[44px] px-2 rounded-xl border border-gray-200 text-[13px] font-bold text-brand-dark transition-all active:scale-95 hover:border-brand-pink hover:text-brand-pink"
              >
                {size}
              </button>
            ))}
          </div>
        )}

        {/* Main CTA bar */}
        <div className="flex items-center gap-3 bg-white border-t border-gray-100 px-4 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.07)]">
          {/* Selected size chip (tap to change) */}
          {selectedSize && (
            <button
              type="button"
              onClick={() => setSelectedSize("")}
              className="flex-shrink-0 flex items-center gap-1 rounded-xl border border-brand-pink/40 bg-brand-pink/5 px-3 py-2 text-[12px] font-bold text-brand-pink"
            >
              <span>{selectedSize}</span>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden><path d="M6 9l6 6 6-6"/></svg>
            </button>
          )}

          {/* Add to Bag */}
          <button
            type="button"
            onClick={handleAddToCart}
            className="flex-1 h-[50px] rounded-2xl bg-[#F7246E] text-white text-[15px] font-bold tracking-wide shadow-[0_4px_14px_rgba(247,36,110,0.35)] active:scale-[0.97] transition-all duration-150"
          >
            Add to Bag
          </button>

          {/* Buy Now */}
          <button
            type="button"
            onClick={handleBuyNow}
            className="flex-1 h-[50px] rounded-2xl border-2 border-[#F7246E] bg-white text-[#F7246E] text-[15px] font-bold tracking-wide active:scale-[0.97] transition-all duration-150"
          >
            Buy Now
          </button>

          {/* Wishlist icon */}
          <button
            type="button"
            onClick={handleWishlistToggle}
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            className="flex-shrink-0 flex h-[50px] w-[50px] items-center justify-center rounded-2xl border border-gray-200 bg-white transition-all active:scale-[0.97]"
          >
            {isWishlisted ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="#F7246E" stroke="#F7246E" strokeWidth="1.5" aria-hidden><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="1.75" aria-hidden><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
