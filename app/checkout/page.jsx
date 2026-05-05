"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

// ── Icons ─────────────────────────────────────────────────────────────────────

function IconBack() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1C1C1E" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}
function IconBag({ count = 0 }) {
  return (
    <div className="relative">
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#1C1C1E" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 01-8 0" />
      </svg>
      {count > 0 && (
        <span className="absolute -top-1.5 -right-1.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#E8001C] px-1 text-[10px] font-bold text-white leading-none">
          {count > 9 ? "9+" : count}
        </span>
      )}
    </div>
  );
}
function IconHome() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}
function IconWork() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
    </svg>
  );
}
function IconTruck() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="3" width="15" height="13" rx="1" />
      <path d="M16 8h4l3 3v5h-7V8z" />
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  );
}
function IconBolt() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}
function IconChevronRight() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#AAAAAA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}
function IconPlus() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#E8001C" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}
function IconInfo() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline-block ml-1">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  );
}
function IconLock() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline-block mr-1">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0110 0v4" />
    </svg>
  );
}
function IconGST() {
  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="9" y1="13" x2="15" y2="13" />
        <line x1="9" y1="17" x2="15" y2="17" />
        <line x1="9" y1="9" x2="12" y2="9" />
      </svg>
    </div>
  );
}

// ── Radio Button ──────────────────────────────────────────────────────────────
function Radio({ selected }) {
  return (
    <div className={`flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full border-2 transition-all ${selected ? "border-[#E8001C]" : "border-gray-300"}`}>
      {selected && <div className="h-[10px] w-[10px] rounded-full bg-[#E8001C]" />}
    </div>
  );
}

// ── Section Label ─────────────────────────────────────────────────────────────
function SectionLabel({ children }) {
  return (
    <p className="px-4 pt-5 pb-2 text-[11px] font-bold uppercase tracking-widest text-[#888]">
      {children}
    </p>
  );
}

// ── Divider ───────────────────────────────────────────────────────────────────
function Divider() {
  return <div className="h-px bg-gray-100 mx-4" />;
}

// ── Static delivery dates ─────────────────────────────────────────────────────
function getDeliveryDate(daysFromNow) {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
}

// ── Placeholder addresses (in a real app, pulled from user.addresses) ─────────
const MOCK_ADDRESSES = [
  {
    id: "home",
    label: "Home",
    icon: "home",
    name: "Riya Sharma",
    line: "123, Green Park, New Delhi – 110016",
    phone: "+91 98765 43210",
  },
  {
    id: "work",
    label: "Work",
    icon: "work",
    name: "Riya Sharma",
    line: "456, Sector 18, Gurgaon – 122015",
    phone: "+91 98765 43210",
  },
];

const DELIVERY_OPTIONS = [
  { id: "standard", label: "Standard Delivery", subtitle: `Arrives before ${getDeliveryDate(5)}`, price: 49, icon: "truck" },
  { id: "express",  label: "Express Delivery",  subtitle: `Arrives before ${getDeliveryDate(3)}`, price: 99, icon: "bolt"  },
];

const PLATFORM_FEE = 199;

// ─────────────────────────────────────────────────────────────────────────────

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, cartCount } = useCart();
  const { user } = useAuth();

  const [selectedAddress, setSelectedAddress] = useState(MOCK_ADDRESSES[0].id);
  const [selectedDelivery, setSelectedDelivery] = useState(DELIVERY_OPTIONS[0].id);
  const [processing, setProcessing] = useState(false);

  // Use real cart items; fall back to mock items so the page always looks full
  const cartItems = useMemo(() => {
    if (cart && cart.length > 0) return cart;
    return [
      {
        id: "mock-1",
        title: "Halter Top with Back Bow",
        selectedSize: "S",
        selectedColor: "Light Pink",
        price: 2550,
        originalPrice: 2550,
        qty: 1,
        imageUrl: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=200&q=80",
      },
      {
        id: "mock-2",
        title: "Oversized Cotton Shirt",
        selectedSize: "S",
        selectedColor: "Light Pink",
        price: 1790,
        originalPrice: 1790,
        qty: 1,
        imageUrl: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=200&q=80",
      },
    ];
  }, [cart]);

  const deliveryFee = DELIVERY_OPTIONS.find((o) => o.id === selectedDelivery)?.price ?? 49;
  const subtotal = cartItems.reduce((sum, item) => sum + (Number(item.price) || 0) * (Number(item.qty) || 1), 0);
  const total = subtotal + PLATFORM_FEE + deliveryFee;

  const handleProceed = async () => {
    if (processing) return;
    setProcessing(true);
    await new Promise((r) => setTimeout(r, 1200));
    toast.success("Order placed successfully!");
    setProcessing(false);
  };

  const addresses = useMemo(() => {
    // Merge real user addresses if available
    if (user?.addresses && user.addresses.length > 0) {
      return user.addresses.map((a, i) => ({
        id: a._id || String(i),
        label: a.label || (i === 0 ? "Home" : "Work"),
        icon: i === 0 ? "home" : "work",
        name: a.name,
        line: `${a.line1}${a.line2 ? ", " + a.line2 : ""}, ${a.city} – ${a.pincode}`,
        phone: a.mobile,
      }));
    }
    return MOCK_ADDRESSES;
  }, [user]);

  return (
    <div className="min-h-screen bg-[#F5F5F5] pb-28">
      {/* ── Top Nav ─────────────────────────────────────────────────────────── */}
      <div className="sticky top-0 z-40 bg-white flex items-center justify-between px-4 h-[56px] border-b border-gray-100 shadow-[0_1px_4px_rgba(0,0,0,0.05)]">
        <button type="button" onClick={() => router.back()} className="flex h-9 w-9 items-center justify-center transition active:scale-95" aria-label="Go back">
          <IconBack />
        </button>
        <h1 className="text-[16px] font-bold uppercase tracking-widest text-[#1C1C1E]">Checkout</h1>
        <button type="button" onClick={() => router.back()} aria-label="Cart" className="relative flex h-9 w-9 items-center justify-center">
          <IconBag count={cartCount || cartItems.length} />
        </button>
      </div>

      {/* ── DELIVERY ADDRESS ────────────────────────────────────────────────── */}
      <SectionLabel>Delivery Address</SectionLabel>

      <div className="mx-4 rounded-2xl bg-white overflow-hidden shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
        {addresses.map((addr, idx) => (
          <React.Fragment key={addr.id}>
            {idx > 0 && <Divider />}
            <button
              type="button"
              onClick={() => setSelectedAddress(addr.id)}
              className="w-full flex items-start gap-3 px-4 py-4 text-left transition hover:bg-gray-50 active:bg-gray-100"
            >
              <Radio selected={selectedAddress === addr.id} />
              <div className="flex-shrink-0 mt-0.5">
                {addr.icon === "home" ? <IconHome /> : <IconWork />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-bold text-[#1C1C1E]">{addr.label}</p>
                <p className="text-[13px] text-[#555] mt-0.5">{addr.name}</p>
                <p className="text-[13px] text-[#555]">{addr.line}</p>
                <p className="text-[13px] text-[#555]">{addr.phone}</p>
              </div>
              <div className="flex flex-col items-end gap-1 shrink-0">
                {selectedAddress === addr.id && (
                  <span className="text-[13px] font-semibold text-[#E8001C]">Change</span>
                )}
                <IconChevronRight />
              </div>
            </button>
          </React.Fragment>
        ))}

        <Divider />

        {/* Add New Address */}
        <button
          type="button"
          className="w-full flex items-center gap-3 px-4 py-4 text-left transition hover:bg-gray-50 active:bg-gray-100"
          onClick={() => toast.info("Add address coming soon!")}
        >
          <span className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full bg-red-50">
            <IconPlus />
          </span>
          <span className="text-[14px] font-semibold text-[#E8001C] flex-1">Add New Address</span>
          <IconChevronRight />
        </button>
      </div>

      {/* ── DELIVERY OPTIONS ─────────────────────────────────────────────────── */}
      <SectionLabel>Delivery Options</SectionLabel>

      <div className="mx-4 rounded-2xl bg-white overflow-hidden shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
        {DELIVERY_OPTIONS.map((opt, idx) => (
          <React.Fragment key={opt.id}>
            {idx > 0 && <Divider />}
            <button
              type="button"
              onClick={() => setSelectedDelivery(opt.id)}
              className="w-full flex items-center gap-3 px-4 py-4 text-left transition hover:bg-gray-50 active:bg-gray-100"
            >
              <Radio selected={selectedDelivery === opt.id} />
              <div className="flex-shrink-0">
                {opt.icon === "truck" ? <IconTruck /> : <IconBolt />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-bold text-[#1C1C1E]">{opt.label}</p>
                <p className="text-[13px] text-[#888] mt-0.5">{opt.subtitle}</p>
              </div>
              <span className="text-[14px] font-semibold text-[#1C1C1E] shrink-0">₹ {opt.price}</span>
            </button>
          </React.Fragment>
        ))}
      </div>

      {/* ── ORDER SUMMARY ───────────────────────────────────────────────────── */}
      <SectionLabel>Order Summary</SectionLabel>

      <div className="mx-4 rounded-2xl bg-white overflow-hidden shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
        {/* Cart Items */}
        {cartItems.map((item, idx) => (
          <React.Fragment key={item.id || idx}>
            {idx > 0 && <Divider />}
            <div className="flex items-start gap-3 px-4 py-4">
              <div className="h-[72px] w-[68px] shrink-0 overflow-hidden rounded-xl bg-gray-100">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.title} className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full bg-gray-200" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-semibold text-[#1C1C1E] leading-snug">{item.title}</p>
                <p className="mt-1 text-[13px] text-[#888]">
                  {item.selectedSize || ""}
                  {item.selectedSize && item.selectedColor ? "    " : ""}
                  {item.selectedColor || ""}
                </p>
                <p className="text-[13px] text-[#888]">Qty: {item.qty || 1}</p>
              </div>
              <span className="text-[14px] font-semibold text-[#1C1C1E] shrink-0">
                ₹ {(Number(item.price) * (Number(item.qty) || 1)).toLocaleString("en-IN")}
              </span>
            </div>
          </React.Fragment>
        ))}

        <Divider />

        {/* Price Breakdown */}
        <div className="px-4 py-4 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-[13px] text-[#555]">Subtotal ({cartItems.length} item{cartItems.length !== 1 ? "s" : ""})</span>
            <span className="text-[13px] text-[#1C1C1E] font-medium">₹ {subtotal.toLocaleString("en-IN")}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[13px] text-[#555] flex items-center">
              Platform Fee <IconInfo />
            </span>
            <span className="text-[13px] text-[#1C1C1E] font-medium">₹ {PLATFORM_FEE}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[13px] text-[#555]">Shipping Fee</span>
            <span className="text-[13px] text-[#1C1C1E] font-medium">₹ {deliveryFee}</span>
          </div>
        </div>

        <Divider />

        {/* Total */}
        <div className="px-4 py-4 flex items-center justify-between">
          <span className="text-[15px] font-bold text-[#1C1C1E]">Total Amount</span>
          <div className="text-right">
            <p className="text-[22px] font-bold text-[#1C1C1E] leading-tight">
              ₹ {total.toLocaleString("en-IN")}
            </p>
            <p className="text-[11px] text-[#888] mt-0.5">(GST included)</p>
          </div>
        </div>

        <Divider />

        {/* Add GSTIN */}
        <button
          type="button"
          className="w-full flex items-center gap-3 px-4 py-4 text-left transition hover:bg-gray-50 active:bg-gray-100"
          onClick={() => toast.info("GSTIN feature coming soon!")}
        >
          <IconGST />
          <div className="flex-1 min-w-0">
            <p className="text-[14px] font-bold text-[#1C1C1E]">Add GSTIN</p>
            <p className="text-[12px] text-[#888] mt-0.5">Get GST invoice and claim input credit, if eligible.</p>
          </div>
          <IconChevronRight />
        </button>
      </div>

      {/* ── Sticky Bottom CTA ───────────────────────────────────────────────── */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 px-4 pt-3 pb-5 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
        <button
          type="button"
          onClick={handleProceed}
          disabled={processing}
          className="w-full h-[54px] rounded-2xl bg-[#E8001C] text-white text-[15px] font-bold uppercase tracking-widest shadow-[0_4px_16px_rgba(232,0,28,0.35)] transition active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {processing ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" strokeDasharray="32" strokeDashoffset="12" />
              </svg>
              Processing...
            </span>
          ) : (
            "Proceed to Payment"
          )}
        </button>
        <p className="mt-2 text-center text-[11px] text-[#888]">
          <IconLock />
          Your payment information is 100% secure.
        </p>
      </div>
    </div>
  );
}
