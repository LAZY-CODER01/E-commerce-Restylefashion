"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import SearchIcon from "@mui/icons-material/Search";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import SellerProcessBottomNav from "@/components/SellerProcessBottomNav";

const TABS = ["All Orders", "Pending Orders", "Pickups Due", "In-transit", "Delivered"];

const MOCK_ORDERS = [
  {
    id: "#ORD10293",
    product: "Oversized Graphic Tee",
    date: "31 May",
    time: "10:24 AM",
    price: "₹999.00",
    status: "In-transit",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: "#ORD10292",
    product: "Swing Bag 20 In",
    date: "31 May",
    time: "09:15 AM",
    price: "₹999.00",
    status: "Delivered",
    image:
      "https://images.unsplash.com/photo-1523779105320-d1cd346ff52b?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: "#ORD10291",
    product: "Utility Cargo Pants",
    date: "30 May",
    time: "08:47 PM",
    price: "₹999.00",
    status: "Pending",
    image:
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: "#ORD10290",
    product: "Lost In Space Hoodie",
    date: "30 May",
    time: "07:30 PM",
    price: "₹999.00",
    status: "In-transit",
    image:
      "https://images.unsplash.com/photo-1520975958221-b5d5c8f6fcb9?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: "#ORD10289",
    product: "Graffiti Denim Jacket",
    date: "29 May",
    time: "06:12 PM",
    price: "₹999.00",
    status: "Delivered",
    image:
      "https://images.unsplash.com/photo-1520975869013-38f7bdf1f9a3?auto=format&fit=crop&w=200&q=80",
  },
];

function statusPill(status) {
  switch (status) {
    case "Pending":
      return "bg-orange-50 text-orange-700";
    case "Pickups Due":
      return "bg-violet-50 text-violet-700";
    case "In-transit":
      return "bg-sky-50 text-sky-700";
    case "Delivered":
      return "bg-emerald-50 text-emerald-700";
    default:
      return "bg-gray-50 text-gray-600";
  }
}

export default function SellerOrdersPage() {
  const [activeTab, setActiveTab] = useState("All Orders");
  const [searchQuery, setSearchQuery] = useState("");

  const stats = useMemo(() => {
    const pendingOrders = MOCK_ORDERS.filter((o) => o.status === "Pending").length;
    const pickupsDue = MOCK_ORDERS.filter((o) => o.status === "Pickups Due").length;
    const inTransit = MOCK_ORDERS.filter((o) => o.status === "In-transit").length;
    const delivered = MOCK_ORDERS.filter((o) => o.status === "Delivered").length;
    return [
      { label: "Pending Orders", value: pendingOrders },
      { label: "Pickups Due", value: pickupsDue },
      { label: "In-transit", value: inTransit },
      { label: "Delivered", value: delivered },
    ];
  }, []);

  const filteredOrders = useMemo(() => {
    const q = (searchQuery || "").trim().toLowerCase();
    return MOCK_ORDERS.filter((o) => {
      const searchMatch =
        !q ||
        o.id.toLowerCase().includes(q) ||
        o.product.toLowerCase().includes(q) ||
        o.status.toLowerCase().includes(q);

      if (!searchMatch) return false;
      if (activeTab === "All Orders") return true;
      if (activeTab === "Pending Orders") return o.status === "Pending";
      if (activeTab === "Pickups Due") return o.status === "Pickups Due";
      if (activeTab === "In-transit") return o.status === "In-transit";
      if (activeTab === "Delivered") return o.status === "Delivered";
      return true;
    });
  }, [activeTab, searchQuery]);

  return (
    <div className="min-h-[100dvh] bg-[#F5F5F5] pb-28 font-sans text-neutral-900">
      {/* Top bar (no pink header) */}
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
            Orders
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
        {/* Search */}
        <div className="mt-4 md:mt-6">
          <div className="mx-auto flex max-w-[900px] items-center rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
            <SearchIcon className="text-gray-400" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by order ID or product"
              className="ml-2 w-full bg-transparent text-[13px] font-medium text-gray-700 outline-none placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Stats cards */}
        <div className="mt-4 grid grid-cols-2 gap-3 md:mt-6 md:gap-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="rounded-2xl border border-gray-200 bg-white px-4 py-4 shadow-sm md:px-5"
            >
              <p className="text-[12px] font-medium text-gray-500">{s.label}</p>
              <p className="mt-2 text-[22px] font-extrabold text-[#000000]">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="mt-4 overflow-x-auto border-b border-gray-200">
          <div className="flex min-w-max gap-6 px-1">
            {TABS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setActiveTab(t)}
                className={`relative pb-3 text-[13px] font-semibold ${
                  activeTab === t ? "text-[#F7246E]" : "text-gray-500"
                }`}
              >
                {t}
                {activeTab === t ? (
                  <span className="absolute inset-x-0 -bottom-[1px] h-[3px] rounded-full bg-[#F7246E]" />
                ) : null}
              </button>
            ))}
          </div>
        </div>

        {/* Orders list */}
        <div className="mt-3 divide-y divide-gray-100 rounded-2xl border border-gray-200 bg-white shadow-sm">
          {filteredOrders.length ? (
            filteredOrders.map((o) => (
              <button
                key={o.id}
                type="button"
                className="flex w-full items-center gap-3 px-4 py-4 text-left hover:bg-gray-50/70 md:px-5"
              >
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-gray-100">
                  <Image src={o.image} alt="" fill className="object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-extrabold text-[#000000]">{o.id}</p>
                  <p className="mt-0.5 line-clamp-1 text-[12px] font-medium text-gray-700">
                    {o.product}
                  </p>
                  <p className="mt-1 text-[11px] font-medium text-gray-400">
                    {o.date} • {o.time}
                  </p>
                  <p className="mt-1 text-[12px] font-extrabold text-[#000000]">{o.price}</p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <span className={`rounded-full px-3 py-1 text-[11px] font-bold ${statusPill(o.status)}`}>
                    {o.status}
                  </span>
                  <KeyboardArrowRightIcon className="text-gray-300" />
                </div>
              </button>
            ))
          ) : (
            <div className="px-6 py-10 text-center">
              <p className="text-[14px] font-bold text-gray-700">No orders found</p>
              <p className="mt-1 text-[13px] text-gray-500">Try a different search or tab.</p>
            </div>
          )}
        </div>
      </main>

      <SellerProcessBottomNav />
    </div>
  );
}
