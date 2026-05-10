"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import { toast } from "react-toastify";
import { useAuth } from "@/context/AuthContext";
import { FOLLOWING_EVENT, readFollowed, unfollowSeller } from "@/lib/following";

const BRAND = "#F7246E";

function initialsFromName(fullName) {
  if (!fullName?.trim()) return "??";
  const p = fullName.trim().split(/\s+/).filter(Boolean);
  if (p.length >= 2) return `${p[0][0]}${p[1][0]}`.toUpperCase();
  const w = p[0];
  return w.length >= 2 ? w.slice(0, 2).toUpperCase() : `${w[0]}`.toUpperCase();
}

function useSyncedFollowList(userKey) {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const on = () => setTick((x) => x + 1);
    window.addEventListener(FOLLOWING_EVENT, on);
    return () => window.removeEventListener(FOLLOWING_EVENT, on);
  }, []);
  return useMemo(() => readFollowed(userKey), [userKey, tick]);
}

function FollowingStoreCard({ store, onUnfollow }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm lg:gap-4">
      <div className="relative flex h-[52px] w-[52px] shrink-0 overflow-hidden rounded-full bg-[#FFF5F8] ring-2 ring-white">
        {store.avatar ? (
          <Image src={store.avatar} alt="" fill className="object-cover" sizes="52px" />
        ) : (
          <span className="flex h-full w-full items-center justify-center text-[15px] font-bold text-neutral-900">
            {initialsFromName(store.name)}
          </span>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-[15px] font-bold leading-tight tracking-tight text-neutral-950 lg:text-[16px]">
          {store.name}
        </p>
        <p className="mt-1 truncate text-[13px] leading-snug text-gray-500">
          {store.followersLabel} followers{" "}
          <span aria-hidden className="whitespace-pre">
            {" "}
            •{" "}
          </span>{" "}
          {Number(store.listings).toLocaleString()} listings
        </p>
      </div>

      <button
        type="button"
        onClick={() => onUnfollow(store.sellerId, store.name)}
        className="shrink-0 rounded-xl border border-gray-300 bg-white px-3 py-2 text-[13px] font-semibold text-neutral-900 shadow-sm transition hover:bg-gray-50 active:scale-[0.98] lg:min-w-[100px]"
      >
        Following
      </button>
    </div>
  );
}

export default function ProfileFollowingPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const userKey = user?._id ?? user?.id;

  useEffect(() => {
    if (loading) return;
    if (!user) router.replace("/auth?next=/profile/following");
  }, [loading, user, router]);

  const stores = useSyncedFollowList(userKey);

  const handleUnfollow = useCallback(
    (sellerId, name) => {
      if (!userKey) return;
      unfollowSeller(userKey, sellerId);
      toast.info(`Unfollowed ${name}`);
    },
    [userKey]
  );

  const countLabel = `${stores.length} Store${stores.length === 1 ? "" : "s"}`;

  if (loading || !user) {
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
              <li key={s.sellerId}>
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
