"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import OrderListItem from "@/components/dashboard/OrderListItem";
import { DASHBOARD_METRICS, DASHBOARD_ORDERS, formatINR } from "@/data/sellerDashboardMock";
import { ChevronLeft } from "lucide-react";

export default function DashboardEarningsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (authLoading) return;
    if (!user) router.replace("/auth?next=/dashboard/earnings");
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
          <h1 className="text-[16px] font-semibold text-gray-900">Earnings</h1>
        </div>

        <section className="rounded-2xl bg-white px-4 py-4 shadow-sm">
          <p className="text-[12px] font-semibold text-gray-500">Total Earnings</p>
          <p className="mt-1 text-[24px] font-semibold tracking-tight text-gray-900">
            ₹{formatINR(DASHBOARD_METRICS.earnings.value)}
          </p>
          <p className="mt-1 text-[12px] font-medium text-gray-500">
            <span className="font-semibold text-[#22C55E]" aria-hidden>
              ↑
            </span>{" "}
            {DASHBOARD_METRICS.earnings.deltaLabel}
          </p>
        </section>

        <section className="mt-4 rounded-2xl bg-white shadow-sm">
          <div className="px-4 pt-4">
            <p className="text-[16px] font-semibold text-gray-900">Orders</p>
          </div>
          <div className="mt-2 flex flex-col gap-2 px-3 pb-4">
            {DASHBOARD_ORDERS.slice(0, 5).map((o) => (
              <OrderListItem key={o.id} order={o} href="#" />
            ))}
          </div>
        </section>
        </div>
      </main>
    </div>
  );
}

