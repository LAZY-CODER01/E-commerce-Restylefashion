"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import ProductListItem from "@/components/dashboard/ProductListItem";
import { DASHBOARD_METRICS, DASHBOARD_PRODUCTS, formatINR } from "@/data/sellerDashboardMock";
import { ChevronLeft } from "lucide-react";

function ActiveBadge() {
  return (
    <span className="inline-flex items-center rounded-full bg-[#DCFCE7] px-2.5 py-1 text-[11px] font-semibold text-[#16A34A]">
      Active
    </span>
  );
}

export default function DashboardActiveListingsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (authLoading) return;
    if (!user) router.replace("/auth?next=/dashboard/active-listings");
  }, [authLoading, user, router]);

  if (authLoading) {
    return <div className="mx-auto max-w-[560px] px-4 py-12 text-gray-500">Loading…</div>;
  }
  if (!user) {
    return <div className="mx-auto max-w-[560px] px-4 py-12 text-gray-500">Redirecting…</div>;
  }

  return (
    <div className="pb-2">
      <main className="mx-auto w-full max-w-[1200px] px-4 pb-10 pt-4 md:px-9 md:pt-6">
        <div className="mx-auto w-full max-w-[720px]">
        <div className="mb-3 flex items-center gap-2">
          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-sm"
            aria-label="Back"
          >
            <ChevronLeft className="h-5 w-5 text-gray-700" />
          </button>
          <h1 className="text-[16px] font-semibold text-gray-900">Active Listings</h1>
        </div>

        <section className="rounded-2xl bg-white px-4 py-4 shadow-sm">
          <p className="text-[12px] font-semibold text-gray-500">Active Listings</p>
          <p className="mt-1 text-[24px] font-semibold tracking-tight text-gray-900">
            {DASHBOARD_METRICS.activeListings.value}
          </p>
          <p className="mt-1 text-[12px] font-medium text-gray-500">Live on your store</p>
        </section>

        <section className="mt-4 rounded-2xl bg-white shadow-sm">
          <div className="mt-2 flex flex-col gap-2 px-3 pb-4 pt-3">
            {DASHBOARD_PRODUCTS.map((p) => (
              <ProductListItem
                key={p.id}
                product={p}
                href={`/product/${encodeURIComponent(p.id)}`}
                badgeSlot={<ActiveBadge />}
                subtitleSlot={
                  <div className="mt-0.5 flex items-center gap-2 text-[12px] font-medium text-gray-500">
                    <span>₹{formatINR(p.price)}</span>
                    <span className="text-gray-300" aria-hidden>
                      •
                    </span>
                    <span className="text-gray-400">SKU: {p.sku}</span>
                  </div>
                }
                rightSlot={
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <p className="text-[11px] font-medium text-gray-500">Views</p>
                      <p className="text-[12px] font-semibold text-gray-900">{p.views}</p>
                    </div>
                    <span className="text-gray-300" aria-hidden>
                      ›
                    </span>
                  </div>
                }
              />
            ))}
          </div>
        </section>
        </div>
      </main>
    </div>
  );
}

