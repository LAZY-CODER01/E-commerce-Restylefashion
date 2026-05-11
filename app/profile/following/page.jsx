"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import { toast } from "react-toastify";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";

const BRAND = "#F7246E";

function initialsFromName(fullName) {
  if (!fullName?.trim()) return "??";
  const p = fullName.trim().split(/\s+/).filter(Boolean);
  if (p.length >= 2) return `${p[0][0]}${p[1][0]}`.toUpperCase();
  const w = p[0];
  return w.length >= 2 ? w.slice(0, 2).toUpperCase() : `${w[0]}`.toUpperCase();
}

function FollowingStoreCard({ store, onUnfollow }) {
  const storeName = store.businessName || store.fullName || "Store";
  const avatar = store.avatar;
  const followersCount = Number(store.followersCount || 0);
  const listingsCount = Number(store.itemsListed || 0);

  return (
    <div className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm lg:gap-4 cursor-pointer hover:border-gray-300 transition-colors"
         onClick={() => window.location.href = `/influencer/${store._id}`}>
      <div className="relative flex h-[52px] w-[52px] shrink-0 overflow-hidden rounded-full bg-[#FFF5F8] ring-2 ring-white">
        {avatar ? (
          <Image src={avatar} alt="" fill className="object-cover" sizes="52px" />
        ) : (
          <span className="flex h-full w-full items-center justify-center text-[15px] font-bold text-neutral-900">
            {initialsFromName(storeName)}
          </span>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-[15px] font-bold leading-tight tracking-tight text-neutral-950 lg:text-[16px]">
          {storeName}
        </p>
        <p className="mt-1 truncate text-[13px] leading-snug text-gray-500">
          {followersCount > 1000 ? `${(followersCount / 1000).toFixed(1)}k` : followersCount} followers{" "}
          <span aria-hidden className="whitespace-pre">
            {" "}
            •{" "}
          </span>{" "}
          {listingsCount.toLocaleString()} listings
        </p>
      </div>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onUnfollow(store._id, storeName);
        }}
        className="shrink-0 rounded-xl border border-gray-300 bg-white px-3 py-2 text-[13px] font-semibold text-neutral-900 shadow-sm transition hover:bg-gray-50 active:scale-[0.98] lg:min-w-[100px]"
      >
        Following
      </button>
    </div>
  );
}

export default function ProfileFollowingPage() {
  const router = useRouter();
  const { user, loading: authLoading, setUser } = useAuth();
  
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.replace("/auth?next=/profile/following");
      return;
    }

    // Fetch following list
    setLoading(true);
    api.get("/auth/following")
      .then(({ data }) => setStores(data || []))
      .catch((err) => {
        toast.error("Failed to load following list.");
      })
      .finally(() => setLoading(false));
  }, [authLoading, user, router]);

  const handleUnfollow = useCallback(
    async (sellerId, name) => {
      if (!user) return;
      try {
        const { data } = await api.post(`/auth/influencer/${sellerId}/follow`);
        // Remove from local list instantly
        setStores((prev) => prev.filter(s => s._id !== sellerId));
        // Sync context
        setUser(data.user);
        toast.info(`Unfollowed ${name}`);
      } catch (error) {
        toast.error("Failed to unfollow.");
      }
    },
    [user, setUser]
  );

  const countLabel = `${stores.length} Store${stores.length === 1 ? "" : "s"}`;

  if (authLoading || loading) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-[#fafafa]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#F7246E] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-[#fafafa] pb-24 font-sans">
      <header className="sticky top-0 z-40 border-b border-gray-100 bg-white">
        <div className="mx-auto flex max-w-[1280px] items-center gap-3 px-4 py-3 md:px-8 lg:px-12">
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-full p-2 text-neutral-900 hover:bg-gray-100"
            aria-label="Back"
          >
            <ArrowBackOutlinedIcon sx={{ fontSize: 24 }} />
          </button>
          <h1 className="flex-1 text-center text-[18px] font-bold text-neutral-950 md:text-xl">Following</h1>
          <span className="w-10 shrink-0" aria-hidden />
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1280px] px-4 pt-6 md:px-8 lg:px-12 lg:pt-10">
        <div className="rounded-2xl bg-[#FFF5F8] px-4 py-3 md:py-4">
          <p className="text-center text-[14px] font-medium leading-snug text-neutral-900 md:text-left md:text-[15px]">
            See what your favourite stores are up to.
          </p>
        </div>

        <p className="mb-4 mt-6 text-[13px] font-semibold tracking-wide text-slate-500 md:mt-8">{countLabel}</p>

        {stores.length === 0 ? (
          <div className="rounded-2xl border border-gray-100 bg-white p-10 text-center shadow-sm">
            <p className="text-[17px] font-bold text-neutral-900">No stores followed yet</p>
            <p className="mt-2 text-[14px] text-gray-500">
              Explore products and tap Follow on a seller to see them here.
            </p>
            <Link
              href="/"
              className="mt-6 inline-flex h-11 items-center justify-center rounded-full border-2 px-8 text-[14px] font-bold"
              style={{ borderColor: BRAND, color: BRAND }}
            >
              Explore stores
            </Link>
          </div>
        ) : (
          <ul className="grid grid-cols-1 gap-3 lg:grid-cols-2 lg:gap-4 xl:gap-5">
            {stores.map((s) => (
              <li key={s._id}>
                <FollowingStoreCard store={s} onUnfollow={handleUnfollow} />
              </li>
            ))}
          </ul>
        )}

        <div className="mt-10 flex flex-col gap-4 rounded-2xl bg-[#FFF5F8] p-5 md:flex-row md:items-center md:justify-between md:p-7">
          <p className="text-[14px] font-medium leading-relaxed text-neutral-900 md:max-w-lg md:text-[15px]">
            Love something new? Explore more amazing stores to follow.
          </p>
          <Link
            href="/"
            className="shrink-0 self-start rounded-xl border-2 bg-white px-6 py-2.5 text-center text-[14px] font-bold transition hover:bg-white/90 md:self-auto"
            style={{ borderColor: BRAND, color: BRAND }}
          >
            Discover more
          </Link>
        </div>
      </main>
    </div>
  );
}
