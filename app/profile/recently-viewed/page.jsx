"use client";

import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import { Heart } from "lucide-react";
import { toast } from "react-toastify";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import {
  readRecentlyViewed,
  RECENTLY_VIEWED_UPDATED_EVENT,
} from "@/lib/recentlyViewed";

const PLACEHOLDER =
  "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=400&q=70";

function cartItemId(it) {
  return String(it?.id ?? it?._id ?? it?.sku ?? it?.productId ?? "");
}

function formatSubtitle(item) {
  const parts = [];
  if (item.displaySize) parts.push(`Size: ${item.displaySize}`);
  if (item.displayColor) parts.push(`Color: ${item.displayColor}`);
  if (!parts.length) return null;
  return parts.join(" • ");
}

function formatINR(n) {
  return `₹${Number(n || 0).toLocaleString("en-IN")}`;
}

export default function RecentlyViewedPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { wishlist, toggleWishlist } = useCart();
  const [items, setItems] = useState([]);

  const viewerKey = user?.email ?? user?._id ?? user?.id;

  const refresh = useCallback(() => {
    setItems(readRecentlyViewed(viewerKey));
  }, [viewerKey]);

  useEffect(() => {
    if (loading) return;
    if (!user) router.replace("/auth?next=/profile/recently-viewed");
  }, [loading, user, router]);

  useEffect(() => {
    refresh();
    const onUpdate = () => refresh();
    window.addEventListener(RECENTLY_VIEWED_UPDATED_EVENT, onUpdate);
    window.addEventListener("storage", onUpdate);
    return () => {
      window.removeEventListener(RECENTLY_VIEWED_UPDATED_EVENT, onUpdate);
      window.removeEventListener("storage", onUpdate);
    };
  }, [refresh]);

  const isWishlisted = (id) =>
    (Array.isArray(wishlist) ? wishlist : []).some((w) => cartItemId(w) === String(id));

  const onHeart = (e, item) => {
    e.preventDefault();
    e.stopPropagation();
    const was = isWishlisted(item.id);
    toggleWishlist({
      id: item.id,
      title: item.title,
      price: item.price,
      imageUrl: item.imageUrl || PLACEHOLDER,
      originalPrice: item.price,
    });
    toast.info(was ? "Removed from wishlist." : "Added to wishlist!");
  };

  if (loading || !user) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-white font-sans">
        <p className="text-[14px] font-medium text-gray-400">Loading…</p>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-white font-sans selection:bg-brand-pink/15">
      <main className="mx-auto max-w-[720px] px-4 pb-32 pt-4 md:px-8 md:pb-40 md:pt-6 lg:max-w-[800px]">
        <header className="relative mb-5 flex min-h-[52px] items-center justify-between md:mb-6">
          <button
            type="button"
            onClick={() => router.push("/profile")}
            className="-ml-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[#2F2F2F] transition hover:bg-black/5"
            aria-label="Back to profile"
          >
            <ArrowBackOutlinedIcon sx={{ fontSize: 26 }} />
          </button>
          <h1 className="absolute left-1/2 top-1/2 max-w-[78%] -translate-x-1/2 -translate-y-1/2 truncate text-center text-[17px] font-bold tracking-tight text-[#111] md:text-[19px]">
            Recently Viewed
          </h1>
          <span className="h-11 w-11 shrink-0" aria-hidden />
        </header>

        <p className="mb-4 rounded-2xl bg-[#FFF5F8] px-4 py-3 text-[13px] font-medium leading-snug text-gray-700 md:mb-5 md:px-5 md:py-3.5 md:text-[14px]">
          Items you&apos;ve recently viewed.
        </p>

        {items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50/80 px-4 py-16 text-center">
            <p className="text-[15px] font-semibold text-gray-800">Nothing here yet</p>
            <p className="mt-2 text-[13px] text-gray-500">
              Open any product to see it listed here.
            </p>
            <Link
              href="/"
              className="mt-6 inline-flex rounded-full border-2 border-[#F7246E] px-6 py-2.5 text-[14px] font-bold text-[#F7246E] transition hover:bg-[#FFF5F8]"
            >
              Browse products
            </Link>
          </div>
        ) : (
          <ul className="flex flex-col gap-0 divide-y divide-gray-100">
            {items.map((item) => {
              const sub = formatSubtitle(item);
              const saved = isWishlisted(item.id);
              const imgSrc = item.imageUrl || PLACEHOLDER;
              const imgOptimized =
                imgSrc.includes("res.cloudinary.com") || imgSrc.includes("images.unsplash.com");
              return (
                <li key={item.id} className="py-4 first:pt-0 md:py-5">
                  <div className="flex items-center gap-3 md:gap-4">
                    <Link
                      href={`/product/${encodeURIComponent(item.id)}`}
                      className="group flex min-w-0 flex-1 items-center gap-3 md:gap-4"
                    >
                      <div className="relative h-[88px] w-[88px] shrink-0 overflow-hidden rounded-xl bg-[#FAF7F2] md:h-[100px] md:w-[100px]">
                        <Image
                          src={imgSrc}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="100px"
                          unoptimized={!imgOptimized}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[15px] font-bold leading-snug text-[#111] md:text-[16px]">
                          {item.title}
                        </p>
                        {sub ? (
                          <p className="mt-1 text-[13px] font-medium text-gray-500 md:text-[14px]">
                            {sub}
                          </p>
                        ) : null}
                        <p className="mt-1.5 text-[15px] font-bold tabular-nums text-[#111] md:text-[16px]">
                          {formatINR(item.price)}
                        </p>
                      </div>
                    </Link>
                    <button
                      type="button"
                      onClick={(e) => onHeart(e, item)}
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-gray-400 transition hover:bg-[#FFF5F8] hover:text-[#F7246E] md:h-12 md:w-12"
                      aria-label={saved ? "Remove from wishlist" : "Add to wishlist"}
                    >
                      <Heart
                        className="h-6 w-6"
                        strokeWidth={2}
                        fill={saved ? "#F7246E" : "none"}
                        color={saved ? "#F7246E" : "currentColor"}
                      />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        <footer className="mt-8 flex flex-col gap-4 rounded-2xl border border-[#F7246E]/10 bg-gradient-to-br from-[#FFF8FA] to-[#FFF5F8] px-4 py-5 md:mt-10 md:flex-row md:items-center md:justify-between md:gap-6 md:rounded-3xl md:px-6 md:py-6">
          <p className="text-[13px] font-medium leading-relaxed text-gray-700 md:max-w-[62%] md:text-[14px]">
            Love what you see? Add items to your wishlist and shop them later!
          </p>
          <Link
            href="/wishlist"
            className="shrink-0 rounded-xl border-2 border-[#F7246E] bg-white px-5 py-2.5 text-center text-[14px] font-bold text-[#F7246E] transition hover:bg-[#F7246E] hover:text-white md:px-6"
          >
            View Wishlist
          </Link>
        </footer>
      </main>
    </div>
  );
}
