"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import OrderListItem from "@/components/dashboard/OrderListItem";
import { DASHBOARD_ORDERS, formatINR } from "@/data/sellerDashboardMock";
import { ChevronLeft, Search } from "lucide-react";

export default function DashboardOrdersSoldPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (authLoading) return;
    if (!user) router.replace("/auth?next=/dashboard/orders-sold");
  }, [authLoading, user, router]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return DASHBOARD_ORDERS;
    return DASHBOARD_ORDERS.filter((o) => {
      const hay = `${o.id} ${o.productName}`.toLowerCase();
      return hay.includes(q);
    });
  }, [query]);

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
          <h1 className="text-[16px] font-semibold text-gray-900">Orders Sold</h1>
        </div>

        <section className="rounded-2xl bg-white px-4 py-4 shadow-sm">
          <p className="text-[12px] font-semibold text-gray-500">Total Orders</p>
          <p className="mt-1 text-[24px] font-semibold tracking-tight text-gray-900">{filtered.length}</p>
        </section>

        <div className="mt-4 rounded-2xl bg-white px-4 py-3 shadow-sm">
          <div className="flex items-center gap-2">
            <Search className="h-5 w-5 text-gray-400" aria-hidden />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by order ID or product"
              className="w-full bg-transparent text-[13px] font-medium text-gray-900 placeholder:text-gray-400 outline-none"
              aria-label="Search orders"
            />
          </div>
        </div>

        <section className="mt-4 rounded-2xl bg-white shadow-sm">
          <div className="mt-2 flex flex-col gap-2 px-3 pb-4 pt-3">
            {filtered.map((o) => (
              <OrderListItem key={o.id} order={o} href="#" />
            ))}
          </div>
        </section>
        </div>
      </main>
    </div>
  );
}

