"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import TuneOutlinedIcon from "@mui/icons-material/TuneOutlined";
import {
  getSellerProfileSsrPlaceholder,
  getSellerStoreId,
  mergeSellerProfileFromStorage,
  readSellerProductsForStore,
} from "@/lib/sellerHubProfile";
import SellerProcessBottomNav from "@/components/SellerProcessBottomNav";

function initialsFromName(fullName) {
  if (!fullName?.trim()) return "S";
  const p = fullName.trim().split(/\s+/).filter(Boolean);
  if (p.length >= 2) return `${p[0][0]}${p[1][0]}`.toUpperCase();
  const w = p[0];
  return w.length >= 2 ? w.slice(0, 2).toUpperCase() : `${w[0]}`.toUpperCase();
}

export default function SellerStorePreviewPage() {
  const [mounted, setMounted] = useState(false);
  const [tick, setTick] = useState(0);
  const [query, setQuery] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const bump = () => setTick((t) => t + 1);
    window.addEventListener("seller-products-updated", bump);
    window.addEventListener("focus", bump);
    return () => {
      window.removeEventListener("seller-products-updated", bump);
      window.removeEventListener("focus", bump);
    };
  }, []);

  const { profile, products } = useMemo(() => {
    if (!mounted) {
      return { profile: getSellerProfileSsrPlaceholder(), products: [] };
    }
    const sid = getSellerStoreId();
    return {
      profile: mergeSellerProfileFromStorage(),
      products: readSellerProductsForStore(sid),
    };
  }, [mounted, tick]);

  const storeTypeLabel =
    profile?.sellerType === "influencer"
      ? "Influencer Store"
      : profile?.sellerType
        ? `${String(profile.sellerType).replace(/_/g, " ")} Store`
        : "Store";

  const liveListings = Number(profile?.liveProducts || products.length || 0);
  const followers = Number(profile?.followers || 0);
  const following = Number(profile?.followings || 0);

  const categories = useMemo(() => {
    const byCat = new Map();
    for (const p of products || []) {
      const key = String(p.category || "Products");
      if (!query || key.toLowerCase().includes(query.toLowerCase())) {
        byCat.set(key, (byCat.get(key) || 0) + 1);
      }
    }

    const fallback = [
      {
        key: "women-handbags",
        label: "Women's Handbags",
        count: 120,
        image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=700&q=80",
      },
      {
        key: "wallets",
        label: "Wallets",
        count: 86,
        image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=700&q=80",
      },
      {
        key: "accessories",
        label: "Accessories",
        count: 64,
        image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=700&q=80",
      },
      {
        key: "perfumes",
        label: "Perfumes",
        count: 32,
        image: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=700&q=80",
      },
    ];

    const fromProducts = Array.from(byCat.entries())
      .map(([k, c]) => ({
        key: k,
        label: k,
        count: c,
        image: products?.find((p) => String(p.category || "Products") === k)?.image || "",
      }))
      .slice(0, 8);

    return fromProducts.length ? fromProducts : fallback;
  }, [products, query]);

  return (
    <div className="min-h-[100dvh] bg-[#F5F5F5] pb-28 font-sans text-neutral-900">
      {/* Top bar — same pattern as /seller/profile & /seller/orders */}
      <header className="sticky top-0 z-30 bg-[#F7246E] px-4 py-4 md:px-9">
        <div className="relative mx-auto flex w-full max-w-[1200px] items-center justify-between">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="flex h-10 w-10 items-center justify-center text-white"
            aria-label="Back"
          >
            <ArrowBackOutlinedIcon sx={{ fontSize: 22 }} />
          </button>

          <h1 className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[18px] font-extrabold tracking-tight text-white md:text-[20px]">
            Store
          </h1>

          <Link
            href="/seller/wallet"
            aria-label="Wallet"
            className="flex h-10 w-10 items-center justify-center text-white"
          >
            <Image
              src="/seller-wallet.png"
              alt=""
              width={26}
              height={26}
              className="h-6 w-6 object-contain brightness-0 invert"
            />
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1200px] px-4 pb-10 md:px-9">
        {/* Centered content block (matches profile desktop spacing) */}
        <div className="mx-auto w-full max-w-[560px] lg:max-w-[900px]">
          {/* Profile summary card */}
          <section className="mt-3 rounded-3xl border border-gray-200 bg-white px-4 py-6 shadow-sm lg:px-8 lg:py-8">
            <div className="flex flex-col items-center text-center">
              <div className="relative h-[88px] w-[88px] overflow-hidden rounded-full bg-gradient-to-br from-[#F7246E] to-[#FF6FA0] ring-4 ring-white lg:h-[96px] lg:w-[96px]">
                {profile?.avatarUrl ? (
                  <Image src={profile.avatarUrl} alt="" fill className="object-cover" sizes="96px" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-[32px] font-extrabold text-white">
                    {initialsFromName(profile?.avatarName || profile?.name || "Seller")}
                  </div>
                )}
              </div>

              <p className="mt-3 text-[16px] font-extrabold text-[#000000] lg:text-[18px]">{profile?.name}</p>
              <p className="mt-1 inline-flex rounded-full bg-[#F7246E]/10 px-2.5 py-0.5 text-[11px] font-bold text-[#F7246E]">
                {storeTypeLabel}
              </p>

              <div className="mt-5 grid w-full grid-cols-3 items-center lg:mt-6">
                <div className="flex flex-col items-center justify-center py-2.5 pr-3">
                  <p className="text-[18px] font-bold leading-none text-[#000000]">{followers.toLocaleString()}</p>
                  <p className="mt-1 text-[12px] font-medium text-gray-500">Followers</p>
                </div>
                <div className="flex flex-col items-center justify-center py-2.5 px-3 border-x border-gray-200/80">
                  <p className="text-[18px] font-bold leading-none text-[#000000]">{following.toLocaleString()}</p>
                  <p className="mt-1 text-[12px] font-medium text-gray-500">Following</p>
                </div>
                <div className="flex flex-col items-center justify-center py-2.5 pl-3">
                  <div className="flex items-center gap-1">
                    <p className="text-[18px] font-bold leading-none text-[#000000]">{liveListings}</p>
                    <span className="text-[11px] font-extrabold text-[#F7246E]" aria-hidden>
                      (•)
                    </span>
                  </div>
                  <p className="mt-1 text-[12px] font-medium text-gray-500">Live Listings</p>
                </div>
              </div>
            </div>
          </section>

          {/* Search + filter */}
          <section className="mt-4 flex items-center gap-3 lg:mt-5">
            <div className="flex flex-1 items-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
              <SearchOutlinedIcon className="text-gray-400" sx={{ fontSize: 20 }} aria-hidden />
              <input
                type="text"
                placeholder="Search in store"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-transparent text-[13px] font-medium text-gray-700 outline-none placeholder:text-gray-400"
              />
            </div>
            <button
              type="button"
              className="inline-flex items-center justify-center gap-1.5 rounded-2xl border border-gray-200 bg-white px-4 py-3 text-[12px] font-extrabold text-gray-700 shadow-sm hover:bg-gray-50"
            >
              <TuneOutlinedIcon sx={{ fontSize: 18 }} className="text-gray-500" aria-hidden />
              Filter
            </button>
          </section>

          {/* Category grid */}
          <section className="mt-4 grid grid-cols-2 gap-3 lg:mt-5 lg:grid-cols-4 lg:gap-4">
            {categories.map((c) => (
              <button
                key={c.key}
                type="button"
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:bg-gray-50"
              >
                <div className="relative aspect-square w-full bg-gray-50">
                  {c.image ? (
                    <Image src={c.image} alt="" fill className="object-cover" sizes="260px" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-[12px] font-semibold text-gray-400">
                      No image
                    </div>
                  )}
                </div>
                <div className="px-3 py-3 text-left">
                  <p className="line-clamp-1 text-[13px] font-extrabold text-[#000000]">{c.label}</p>
                  <p className="mt-0.5 text-[11px] font-medium text-gray-500">{c.count} items</p>
                </div>
              </button>
            ))}
          </section>
        </div>
      </main>

      <SellerProcessBottomNav />
    </div>
  );
}
