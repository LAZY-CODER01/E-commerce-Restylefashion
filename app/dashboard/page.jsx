"use client";

import React, { useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import {
  DASHBOARD_METRICS,
  EARNINGS_MONTH_OPTIONS,
  EARNINGS_SERIES_BY_MONTH,
  DASHBOARD_PRODUCTS,
  formatINR,
} from "@/data/sellerDashboardMock";
import EarningsAreaChart from "@/components/dashboard/EarningsAreaChart";
import ProductListItem from "@/components/dashboard/ProductListItem";

function MetricCard({ href, children, disabled = false, ariaLabel }) {
  const base =
    "rounded-2xl bg-white shadow-sm px-4 py-4 min-h-[92px] flex flex-col justify-between";

  if (disabled) {
    return (
      <div className={base} aria-label={ariaLabel}>
        {children}
      </div>
    );
  }

  return (
    <Link href={href} className={`${base} transition active:scale-[0.99]`} aria-label={ariaLabel}>
      {children}
    </Link>
  );
}

export default function DashboardMainPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (authLoading) return;
    if (!user) router.replace("/auth?next=/dashboard");
  }, [authLoading, user, router]);

  const productsPreview = useMemo(() => DASHBOARD_PRODUCTS.slice(0, 5), []);

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
          <header className="relative mb-4 flex min-h-[48px] items-center justify-between gap-3 md:mb-6">
            <button
              type="button"
              onClick={() => router.back()}
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-700 shadow-sm transition hover:bg-gray-50 md:h-11 md:w-11"
              aria-label="Go back"
            >
              <ArrowLeft className="h-5 w-5" strokeWidth={2} />
            </button>
            <h1 className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[16px] font-semibold text-gray-900 md:text-[17px]">
              Dashboard
            </h1>
            <span className="h-10 w-10 shrink-0 md:h-11 md:w-11" aria-hidden />
          </header>
        <section className="grid grid-cols-2 gap-3">
          <MetricCard href="/dashboard/earnings" ariaLabel="Go to Earnings">
            <div>
              <p className="text-[12px] font-semibold text-gray-500">{DASHBOARD_METRICS.earnings.label}</p>
              <p className="mt-1 text-[20px] font-semibold tracking-tight text-gray-900">
                ₹{formatINR(DASHBOARD_METRICS.earnings.value)}
              </p>
            </div>
            <div className="mt-2 flex items-center gap-1 text-[11px] font-medium">
              <span className="text-[#22C55E]" aria-hidden>
                ↑
              </span>
              <span className="text-gray-500">{DASHBOARD_METRICS.earnings.deltaLabel}</span>
            </div>
          </MetricCard>

          <MetricCard href="/dashboard/active-listings" ariaLabel="Go to Active Listings">
            <div>
              <p className="text-[12px] font-semibold text-gray-500">{DASHBOARD_METRICS.activeListings.label}</p>
              <p className="mt-1 text-[20px] font-semibold tracking-tight text-gray-900">
                {DASHBOARD_METRICS.activeListings.value}
              </p>
            </div>
            <p className="mt-2 text-[11px] font-medium text-gray-500">{DASHBOARD_METRICS.activeListings.subLabel}</p>
          </MetricCard>

          <MetricCard href="/dashboard/orders-sold" ariaLabel="Go to Orders Sold">
            <div>
              <p className="text-[12px] font-semibold text-gray-500">{DASHBOARD_METRICS.ordersSold.label}</p>
              <p className="mt-1 text-[20px] font-semibold tracking-tight text-gray-900">
                {DASHBOARD_METRICS.ordersSold.value}
              </p>
            </div>
            <p className="mt-2 text-[11px] font-medium text-gray-500">{DASHBOARD_METRICS.ordersSold.subLabel}</p>
          </MetricCard>

          <MetricCard disabled ariaLabel="Stock Insights (static)">
            <div>
              <p className="text-[12px] font-semibold text-gray-500">{DASHBOARD_METRICS.stockInsights.label}</p>
              <p className="mt-1 text-[20px] font-semibold tracking-tight text-gray-900">
                {DASHBOARD_METRICS.stockInsights.value}
              </p>
              <p className="mt-1 text-[11px] font-medium text-gray-500">{DASHBOARD_METRICS.stockInsights.subLabel}</p>
            </div>
            <div className="mt-3 flex items-center justify-between gap-3">
              <div className="h-[8px] flex-1 overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#F97316] via-[#FBBF24] to-[#22C55E]"
                  style={{ width: `${DASHBOARD_METRICS.stockInsights.healthPct}%` }}
                />
              </div>
              <p className="text-[11px] font-semibold text-[#22C55E]">{DASHBOARD_METRICS.stockInsights.healthLabel}</p>
            </div>
          </MetricCard>
        </section>

        <section className="mt-4">
          <EarningsAreaChart
            seriesByMonth={EARNINGS_SERIES_BY_MONTH}
            monthOptions={EARNINGS_MONTH_OPTIONS}
            defaultMonthKey="2025-01"
          />
        </section>

        <section className="mt-4 rounded-2xl bg-white shadow-sm">
          <div className="flex items-center justify-between px-4 pt-4">
            <p className="text-[16px] font-semibold text-gray-900">All Products</p>
            <Link href="/dashboard/active-listings" className="text-[12px] font-semibold text-[#F7246E]">
              View all
            </Link>
          </div>

          <div className="mt-2 px-3 pb-4">
            <div className="flex flex-col gap-2">
              {productsPreview.map((p) => (
                <ProductListItem
                  key={p.id}
                  product={p}
                  href={`/product/${encodeURIComponent(p.id)}`}
                  rightSlot={
                    <div className="flex items-center gap-2">
                      <p className="text-[12px] font-medium text-gray-500">{p.status}</p>
                      <span className="text-gray-300" aria-hidden>
                        ›
                      </span>
                    </div>
                  }
                  subtitleSlot={<p className="mt-0.5 text-[12px] font-medium text-gray-500">₹{formatINR(p.price)}</p>}
                />
              ))}
            </div>
          </div>
        </section>
        </div>
      </main>
    </div>
  );
}

