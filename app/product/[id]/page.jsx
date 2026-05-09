"use client";

import React, { useState, use, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import api from "@/lib/api";
import ProductImageGallery from "@/components/pdp/ProductImageGallery";
import RelatedProductsSection from "@/components/pdp/RelatedProductsSection";

import { ALL_PRODUCTS } from "@/data/mockData";
import { useCart } from "@/context/CartContext";

const VALID_PRODUCTS = ALL_PRODUCTS.filter((p) => p != null && p.id != null);

const getProductData = (id) => {
  if (id == null || id === "") return null;
  const list = VALID_PRODUCTS;
  const foundProduct = list.find((p) => String(p.id) === String(id));
  if (!foundProduct) return null;

  const similarProducts = list
    .filter((p) => {
      if (String(p.id) === String(id)) return false;
      if (p.category === foundProduct.category) return true;
      const commonTags = p.tags?.filter((tag) => foundProduct.tags?.includes(tag));
      return commonTags && commonTags.length > 0;
    })
    .slice(0, 6);

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
    colors: foundProduct.colors || [],
    images: foundProduct.images || [foundProduct.imageUrl],
    description: foundProduct.description || "In excellent condition.",
    details: foundProduct.details || { fabric: "Cotton Mix", fit: "Standard Fit", care: "Handle with care" },
    seller: {
      name: foundProduct.seller?.name || "Restyle Seller",
      initials: (foundProduct.seller?.name || "RS").split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase(),
      followers: foundProduct.seller?.followers || "2.4k",
      products: foundProduct.seller?.products || 68,
      avatar: foundProduct.seller?.avatar || null,
    },
    similarProducts,
    bestSellers,
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

function normalizeApiProductForPdp(data) {
  const p = data;
  const idStr = String(p._id ?? p.id ?? "");
  let images = Array.isArray(p.images) && p.images.length ? [...p.images] : [];
  if (!images.length && p.imageUrl) images = [p.imageUrl];
  if (!images.length) images = [PLACEHOLDER_IMG];

  const details =
    p.details && typeof p.details === "object" && !Array.isArray(p.details)
      ? { fabric: p.details.fabric || "", fit: p.details.fit || "", care: p.details.care || "" }
      : { fabric: "", fit: "", care: "" };

  const sellerDoc = p.seller;
  const sellerName =
    sellerDoc && typeof sellerDoc === "object" && !Array.isArray(sellerDoc)
      ? sellerDoc.fullName || "Seller"
      : "Restyle Seller";
  const seller = {
    name: sellerName,
    initials: sellerName.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase(),
    followers: sellerDoc?.followers || "2.4k",
    products: sellerDoc?.products || 68,
    avatar: (sellerDoc && typeof sellerDoc === "object" ? sellerDoc.avatar : null) || null,
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
    sizes: Array.isArray(p.sizes) && p.sizes.length ? p.sizes : [],
    sizeInventory: Array.isArray(p.sizeInventory) ? p.sizeInventory : [],
    colors: Array.isArray(p.colors) && p.colors.length ? p.colors : [],
    description: p.description || "",
    similarProducts: related,
    bestSellers: related,
    rating: p.rating ?? 4.5,
    ratingCount: p.ratingCount ?? 0,
  };
}

const COLOR_HEX_MAP = {
  "Black":      "#1C1C1E",
  "White":      "#FFFFFF",
  "Red":        "#E8001C",
  "Pink":       "#F7246E",
  "Light Pink": "#F9A8C9",
  "Blue":       "#2563EB",
  "Light Blue": "#93C5FD",
  "Navy":       "#1E3A5F",
  "Green":      "#16A34A",
  "Yellow":     "#FBBF24",
  "Orange":     "#F97316",
  "Purple":     "#7C3AED",
  "Brown":      "#92400E",
  "Beige":      "#D4B896",
  "Grey":       "#9CA3AF",
  "Tan":        "#C8A96B",
};
const LIGHT_COLORS = new Set(["White", "Beige", "Light Blue", "Light Pink", "Yellow", "Tan"]);

function ConditionPill({ condition }) {
  const isNew = condition?.toLowerCase().includes("new") || condition?.toLowerCase().includes("brand");
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-semibold border ${
        isNew
          ? "bg-[#DCFCE7] text-[#16A34A] border-[#BBF7D0]"
          : "bg-[#FFF7ED] text-[#EA580C] border-[#FED7AA]"
      }`}
    >
      {condition}
    </span>
  );
}

export default function ProductDetailsPage({ params }) {
  const resolvedParams = use(params);
  const id = resolvedParams?.id ?? resolvedParams?.slug ?? "";
  const router = useRouter();

  const mockProduct = useMemo(() => getProductData(id), [id]);
  const [remoteProduct, setRemoteProduct] = useState(null);
  const [fetchStatus, setFetchStatus] = useState(() => (getProductData(id) ? "ready" : "loading"));

  useEffect(() => {
    const mock = getProductData(id);
    if (mock) { setRemoteProduct(null); setFetchStatus("ready"); return; }
    if (!id) { setRemoteProduct(null); setFetchStatus("notfound"); return; }
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
    return () => { cancelled = true; };
  }, [id]);

  const product = mockProduct ?? remoteProduct;

  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [pincode, setPincode] = useState("");
  const [deliveryInfo, setDeliveryInfo] = useState(null);

  useEffect(() => {
    setSelectedSize("");
    setSelectedColor("");
    setPincode("");
    setDeliveryInfo(null);
  }, [id]);

  const { wishlist, toggleWishlist, addToBag } = useCart();
  const safeWishlist = Array.isArray(wishlist) ? wishlist : [];
  const productIdKey = product?.id != null || product?._id != null ? String(product.id ?? product._id) : "";
  const isWishlisted =
    Boolean(productIdKey) &&
    safeWishlist.some((w) => String(w?.id ?? w?._id ?? w?.sku ?? w?.slug ?? w?.productId) === productIdKey);

  const handleWishlistToggle = () => {
    if (!product) return;
    toggleWishlist({
      id: product.id ?? product._id,
      title: product.title,
      brand: product.brand,
      price: product.price,
      originalPrice: product.originalPrice,
      imageUrl: product.imageUrl,
    });
    toast.info(isWishlisted ? `Removed from wishlist.` : `Added to wishlist!`);
  };

  const handleAddToCart = () => {
    if (!product) return;
    if (!selectedSize) { toast.warn("Please select a size first."); return; }
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
    if (!selectedSize) { toast.warn("Please select a size before buying."); return; }
    addToBag({
      id: product.id ?? product._id,
      title: product.title,
      brand: product.brand,
      price: product.price,
      originalPrice: product.originalPrice,
      imageUrl: product.imageUrl,
      selectedSize,
      selectedColor: selectedColor || (product.colors?.[0] ?? ""),
      qty: 1,
    });
    router.push("/checkout");
  };

  const handleCheckPincode = () => {
    if (!pincode || pincode.length < 6) { toast.warn("Please enter a valid 6-digit pincode."); return; }
    // Simulate delivery check
    const day = new Date();
    day.setDate(day.getDate() + 4);
    const options = { weekday: "short", day: "numeric", month: "short" };
    setDeliveryInfo({ date: day.toLocaleDateString("en-IN", options), city: "Your location" });
  };

  if (!product && fetchStatus === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-[#F7246E] border-t-transparent" />
      </div>
    );
  }

  if (!product && fetchStatus === "notfound") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-white px-4">
        <p className="text-lg font-bold text-gray-900">Product not found</p>
        <p className="mt-2 text-sm text-gray-500">This listing may have been removed.</p>
        <Link href="/" className="mt-5 rounded-xl bg-[#F7246E] px-6 py-3 text-sm font-bold text-white">
          Back to shop
        </Link>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#F7246E] border-t-transparent" />
      </div>
    );
  }

  const hasColors = Array.isArray(product.colors) && product.colors.length > 0;
  const hasSizes = Array.isArray(product.sizes) && product.sizes.length > 0;
  const sellerInitials = product.seller?.initials || product.seller?.name?.slice(0, 2)?.toUpperCase() || "RS";

  return (
    <div className="min-h-screen bg-white pb-40">

      {/* ── Top Nav Bar ── */}
      <div className="sticky top-0 z-40 flex items-center justify-between px-4 pt-4 pb-2 bg-white">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex h-9 w-9 items-center justify-center rounded-full transition active:scale-95"
          aria-label="Go back"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1C1C1E" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleWishlistToggle}
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            className="flex h-9 w-9 items-center justify-center transition active:scale-95"
          >
            {isWishlisted ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="#F7246E" stroke="#F7246E" strokeWidth="1.5" aria-hidden>
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1C1C1E" strokeWidth="1.75" aria-hidden>
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            )}
          </button>
          <button type="button" aria-label="Share" className="flex h-9 w-9 items-center justify-center transition active:scale-95">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1C1C1E" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13" />
            </svg>
          </button>
        </div>
      </div>

      {/* ── Product Image ── */}
      <div className="px-4 mt-1">
        <div className="w-full overflow-hidden rounded-2xl bg-gray-50">
          <ProductImageGallery images={product.images} />
        </div>
      </div>

      {/* ── Product Info ── */}
      <div className="px-4 mt-4 flex flex-col gap-0">

        {/* Title + Bookmark */}
        <div className="flex items-start justify-between gap-2">
          <h1 className="flex-1 text-[18px] font-bold leading-snug tracking-tight text-[#1C1C1E] uppercase">
            {product.title}
          </h1>
          <button type="button" aria-label="Save product" className="mt-0.5 shrink-0">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1C1C1E" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
            </svg>
          </button>
        </div>

        {/* Price Row */}
        <div className="mt-2 flex items-center gap-2 flex-wrap">
          <span className="text-[22px] font-bold text-[#1C1C1E] tracking-tight">
            ₹{product.price.toLocaleString("en-IN")}
          </span>
          <span className="text-[15px] font-medium text-[#888] line-through">
            ₹{product.originalPrice.toLocaleString("en-IN")}
          </span>
          {product.discount > 0 && (
            <span className="text-[15px] font-bold text-[#22A44E]">
              {product.discount}% OFF
            </span>
          )}
        </div>

        {/* MRP line */}
        <p className="mt-1 text-[12px] font-medium text-[#2563EB]">MRP incl. of all taxes</p>

        {/* Condition */}
        <div className="mt-3 flex items-center gap-2">
          <span className="text-[13px] font-semibold text-[#1C1C1E]">Condition:</span>
          <ConditionPill condition={product.condition} />
        </div>

        {/* ── Colour Row ── */}
        {hasColors && (
          <div className="mt-3 flex items-center gap-3 flex-wrap">
            <span className="text-[13px] font-semibold text-[#1C1C1E] shrink-0">Colour:</span>
            <span className="text-[13px] font-medium text-[#1C1C1E] shrink-0">
              {selectedColor || product.colors[0]}
            </span>
            <div className="flex items-center gap-2 flex-wrap">
              {product.colors.map((color) => {
                const hex = COLOR_HEX_MAP[color] || "#CCCCCC";
                const isSelected = selectedColor === color || (!selectedColor && color === product.colors[0]);
                return (
                  <button
                    key={color}
                    type="button"
                    title={color}
                    onClick={() => setSelectedColor(color)}
                    aria-label={color}
                    aria-pressed={isSelected}
                    className={`h-[30px] w-[30px] shrink-0 rounded-lg border transition-all duration-150 ${
                      isSelected
                        ? "ring-2 ring-[#F7246E] ring-offset-1 border-transparent"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                    style={{ backgroundColor: hex }}
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* ── Size Row ── */}
        {hasSizes && (
          <div className="mt-3 flex items-center gap-2 flex-wrap">
            <span className="text-[13px] font-semibold text-[#1C1C1E] shrink-0">Size:</span>
            <div className="flex items-center gap-1.5 flex-wrap flex-1">
              {product.sizes.map((size) => {
                const invItem = product.sizeInventory?.find(s => s.size === size);
                // If it has inventory data, use it; otherwise assume infinite (old items)
                const hasInventoryData = !!invItem;
                const qty = hasInventoryData ? invItem.quantity : null;
                const isOutOfStock = hasInventoryData && qty <= 0;
                const isSelected = selectedSize === size;
                
                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => { if (!isOutOfStock) setSelectedSize(isSelected ? "" : size) }}
                    disabled={isOutOfStock}
                    className={`relative h-[34px] min-w-[38px] px-2 rounded-lg border text-[13px] font-semibold transition-all duration-150 ${
                      isOutOfStock
                        ? "border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed"
                        : isSelected
                          ? "border-[#F7246E] bg-white text-[#F7246E]"
                          : "border-gray-300 bg-white text-[#1C1C1E] hover:border-gray-400"
                    }`}
                  >
                    {size}
                    {hasInventoryData && !isOutOfStock && qty <= 3 && (
                      <span className="absolute -top-1.5 -right-1.5 bg-[#F7246E] text-white text-[9px] px-1 rounded-full border border-white">
                        {qty}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            <button
              type="button"
              className="shrink-0 flex items-center gap-0.5 text-[12px] font-semibold text-[#1C1C1E] underline-offset-2 ml-auto"
            >
              Size Guide
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
        )}

        {/* ── Description ── */}
        <div className="mt-4">
          <p className="text-[13px] font-bold text-[#1C1C1E]">Description</p>
          <p className="mt-1 text-[13px] leading-relaxed text-[#2563EB]">
            {product.description}
          </p>
        </div>

        {/* ── Seller Card ── */}
        <div className="mt-5 flex items-center justify-between gap-3 border-t border-b border-gray-100 py-4">
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-full bg-[#F7246E] text-white text-[16px] font-bold">
              {product.seller?.avatar ? (
                <img src={product.seller.avatar} alt={product.seller.name} className="h-full w-full rounded-full object-cover" />
              ) : (
                sellerInitials
              )}
            </div>
            {/* Info */}
            <div className="flex flex-col">
              <span className="text-[11px] font-medium text-[#888]">Seller Store</span>
              <span className="text-[15px] font-bold text-[#1C1C1E] leading-tight">{product.seller?.name || "Restyle Seller"}</span>
              <span className="text-[12px] text-[#888] mt-0.5">
                {product.seller?.followers || "2.4k"} followers · {product.seller?.products || 68} products
              </span>
            </div>
          </div>
          {/* Follow / View Store */}
          <button
            type="button"
            className="shrink-0 h-9 rounded-xl border-2 border-[#F7246E] bg-white px-4 text-[13px] font-bold text-[#F7246E] transition hover:bg-[#FFF0F6] active:scale-95"
          >
            Follow
          </button>
        </div>

        {/* ── Buy Now + Add to Bag ── */}
        <div className="mt-4 flex gap-3">
          <button
            type="button"
            onClick={handleBuyNow}
            className="flex-1 h-[52px] rounded-2xl bg-[#F7246E] text-white text-[15px] font-bold tracking-wide shadow-[0_4px_14px_rgba(247,36,110,0.3)] transition active:scale-[0.97]"
          >
            Buy Now
          </button>
          <button
            type="button"
            onClick={handleAddToCart}
            className="flex-1 h-[52px] rounded-2xl border-2 border-[#F7246E] bg-white text-[#F7246E] text-[15px] font-bold tracking-wide transition active:scale-[0.97]"
          >
            Add to Bag
          </button>
        </div>

        {/* ── Estimated Delivery ── */}
        <div className="mt-5 rounded-2xl border border-gray-100 bg-white p-4">
          <p className="text-[14px] font-bold text-[#1C1C1E] mb-3">Estimated Delivery Time</p>
          <div className="flex items-center gap-2">
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={pincode}
              onChange={(e) => {
                setPincode(e.target.value.replace(/\D/g, "").slice(0, 6));
                setDeliveryInfo(null);
              }}
              placeholder="Enter pincode"
              className="flex-1 h-[44px] rounded-xl border border-gray-200 bg-white px-3 text-[14px] text-[#1C1C1E] placeholder:text-gray-400 outline-none focus:border-[#F7246E] transition"
            />
            <button
              type="button"
              onClick={handleCheckPincode}
              className="h-[44px] px-4 text-[14px] font-bold text-[#F7246E] transition hover:opacity-80 active:scale-95"
            >
              Check
            </button>
          </div>
          {deliveryInfo && (
            <div className="mt-3 flex flex-col gap-1.5">
              <div className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22A44E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <rect x="1" y="3" width="15" height="13" rx="1" /><path d="M16 8h4l3 3v5h-7V8z" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
                </svg>
                <span className="text-[13px] text-[#1C1C1E]">
                  Delivery by{" "}
                  <span className="font-semibold text-[#22A44E]">{deliveryInfo.date}</span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
                </svg>
                <span className="text-[13px] text-[#888]">Delivering to your location</span>
              </div>
            </div>
          )}
        </div>

        {/* ── Related Sections ── */}
        <div className="mt-6 flex flex-col gap-4">
          <RelatedProductsSection title="Similar Products" products={product.similarProducts} />
          <RelatedProductsSection title="Best Sellers in this Category" products={product.bestSellers} />
        </div>
      </div>
    </div>
  );
}
