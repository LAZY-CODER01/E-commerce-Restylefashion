"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";

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
function IconCheckCircle() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}
function IconMail() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
}
function IconClipboardCheck() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
      <path d="M9 14l2 2 4-4" />
    </svg>
  );
}
function IconBox() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
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
function IconHome() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L2 9v13a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1V9z" />
      <polyline points="9 18 9 12 15 12 15 18" />
    </svg>
  );
}
function IconPin() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#E8001C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}
function IconWallet() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
      <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
      <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
    </svg>
  );
}
function IconChevronRight() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1C1C1E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}

function SectionLabel({ children }) {
  return (
    <p className="px-4 pt-4 pb-2 text-[11px] font-bold uppercase tracking-widest text-[#888]">
      {children}
    </p>
  );
}

function Divider() {
  return <div className="h-px bg-gray-100 mx-4" />;
}

function OrderPlacedContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      return;
    }

    const fetchOrder = async () => {
      try {
        const { data } = await api.get(`/payment/orders/${orderId}`);
        if (data.success) {
          setOrder(data.order);
        }
      } catch (err) {
        console.error("Failed to fetch order:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center">
        <svg className="animate-spin h-8 w-8 text-[#E8001C]" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="32" strokeDashoffset="12" />
        </svg>
      </div>
    );
  }

  if (!order && !loading) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex flex-col items-center justify-center p-4">
        <p className="text-gray-500 mb-4">Order not found.</p>
        <button onClick={() => router.push("/")} className="px-6 py-2 bg-[#E8001C] text-white rounded-full font-bold">
          Go Home
        </button>
      </div>
    );
  }

  const name = order?.deliveryAddress?.name || "Customer";
  const displayOrderId = "ORD" + (order._id ? order._id.slice(-10).toUpperCase() : "1234567890");

  return (
    <div className="min-h-screen bg-[#F5F5F5] pb-36">
      {/* ── Top Nav ─────────────────────────────────────────────────────────── */}
      <div className="sticky top-0 z-40 bg-white flex items-center justify-between px-4 h-[56px] border-b border-gray-100 shadow-[0_1px_4px_rgba(0,0,0,0.05)]">
        <button type="button" onClick={() => router.push("/")} className="flex h-9 w-9 items-center justify-center transition active:scale-95" aria-label="Go home">
          <IconBack />
        </button>
        <h1 className="text-[16px] font-bold uppercase tracking-widest text-[#1C1C1E]">Order Placed</h1>
        <Link href="/cart" className="relative flex h-9 w-9 items-center justify-center">
          <IconBag count={0} /> {/* Assuming cart is cleared */}
        </Link>
      </div>

      {/* ── Success Header ──────────────────────────────────────────────────── */}
      <div className="bg-white pt-8 pb-6 flex flex-col items-center text-center shadow-[0_1px_4px_rgba(0,0,0,0.05)] mb-2">
        <div className="h-20 w-20 rounded-full border-[3px] border-[#22C55E] bg-green-50 flex items-center justify-center mb-4 shadow-[0_4px_12px_rgba(34,197,94,0.15)]">
          <IconCheckCircle />
        </div>
        <h2 className="text-[22px] font-bold text-[#1C1C1E] mb-1">Thank you, {name.split(' ')[0]}!</h2>
        <p className="text-[14px] text-[#555] mb-5">Your order has been placed successfully.</p>
        
        <div className="bg-[#F0FDF4] px-4 py-2.5 rounded-xl border border-green-100 flex items-center gap-2 mx-4 max-w-sm">
          <IconMail />
          <p className="text-[13px] font-medium text-[#15803D]">We've sent your order details via Email.</p>
        </div>
      </div>

      {/* ── Order Status Timeline ───────────────────────────────────────────── */}
      <div className="mx-4 my-4 rounded-2xl bg-white p-6 shadow-[0_1px_4px_rgba(0,0,0,0.06)] overflow-hidden">
        <div className="flex items-center justify-between relative">
          {/* Dashed connecting lines */}
          <div className="absolute top-[30px] left-[12%] right-[12%] h-[1px] z-0" style={{backgroundImage: 'url("data:image/svg+xml,%3csvg width=%271%27 height=%271%27 xmlns=%27http://www.w3.org/2000/svg%27%3e%3cline x1=%270%27 y1=%270%27 x2=%271%27 y2=%270%27 stroke=%27%23d1d5db%27 stroke-dasharray=%274,4%27/%3e%3c/svg%3e")', backgroundRepeat: 'repeat-x'}} />
        </div>

        {/* Timeline items */}
        <div className="flex items-start justify-between relative">
          {/* Order Confirmed */}
          <div className="flex flex-col items-center gap-3 flex-1">
            <div className="h-14 w-14 rounded-full bg-green-50 flex items-center justify-center relative flex-shrink-0 border-4 border-white shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
              <span className="text-green-500"><IconClipboardCheck /></span>
              <div className="absolute -bottom-1 -right-1 h-5 w-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                 <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
              </div>
            </div>
            <p className="text-[12px] font-bold text-[#1C1C1E] text-center leading-tight">Order<br/>Confirmed</p>
          </div>

          {/* Shipped */}
          <div className="flex flex-col items-center gap-3 flex-1">
            <div className="h-14 w-14 rounded-full bg-gray-50 flex items-center justify-center relative flex-shrink-0 border-4 border-white shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
              <span className="text-gray-400"><IconBox /></span>
            </div>
            <p className="text-[12px] font-medium text-[#888] text-center leading-tight">Shipped</p>
          </div>

          {/* Out for Delivery */}
          <div className="flex flex-col items-center gap-3 flex-1">
            <div className="h-14 w-14 rounded-full bg-gray-50 flex items-center justify-center relative flex-shrink-0 border-4 border-white shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
              <span className="text-gray-400"><IconTruck /></span>
            </div>
            <p className="text-[12px] font-medium text-[#888] text-center leading-tight">Out for<br/>Delivery</p>
          </div>

          {/* Delivered */}
          <div className="flex flex-col items-center gap-3 flex-1">
            <div className="h-14 w-14 rounded-full bg-gray-50 flex items-center justify-center relative flex-shrink-0 border-4 border-white shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
              <span className="text-gray-400"><IconHome /></span>
            </div>
            <p className="text-[12px] font-medium text-[#888] text-center leading-tight">Delivered</p>
          </div>
        </div>
      </div>

      {/* ── Order ID ────────────────────────────────────────────────────────── */}
      <div className="mx-4 my-2 rounded-2xl bg-white shadow-[0_1px_4px_rgba(0,0,0,0.06)] overflow-hidden">
        <Link href="/my-orders" className="flex items-center p-4 transition hover:bg-gray-50 active:bg-gray-100">
          <div className="h-10 w-10 shrink-0 rounded-full bg-[#E6F4EA] flex items-center justify-center mr-3">
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
               <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
               <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
               <line x1="12" y1="22.08" x2="12" y2="12" />
             </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[12px] text-[#555] mb-0.5">Order ID</p>
            <p className="text-[15px] font-bold text-[#1C1C1E]">{displayOrderId}</p>
          </div>
          <div className="flex items-center gap-1">
             <span className="text-[13px] font-semibold text-[#1C1C1E]">View Order</span>
             <IconChevronRight />
          </div>
        </Link>
      </div>

      {/* ── Delivery Address ────────────────────────────────────────────────── */}
      <div className="mx-4 my-2 rounded-2xl bg-white shadow-[0_1px_4px_rgba(0,0,0,0.06)] overflow-hidden">
         <div className="flex items-start p-4">
          <div className="h-10 w-10 shrink-0 rounded-full bg-[#FFF0F2] flex items-center justify-center mr-3">
            <IconPin />
          </div>
          <div className="flex-1 min-w-0 pr-2">
            <p className="text-[12px] text-[#555] mb-0.5">Delivering to</p>
            <p className="text-[14px] font-bold text-[#1C1C1E] mb-0.5">{order?.deliveryAddress?.name || "Customer"}</p>
            <p className="text-[13px] text-[#555] leading-snug">
               {order?.deliveryAddress?.line || "123, Green Park, New Delhi - 110016"}
            </p>
          </div>
          <button className="flex items-center gap-1 self-center shrink-0" onClick={() => {}}>
             <span className="text-[13px] font-semibold text-[#1C1C1E]">View Address</span>
             <IconChevronRight />
          </button>
        </div>
      </div>

      {/* ── ORDER SUMMARY ───────────────────────────────────────────────────── */}
      <SectionLabel>Order Summary</SectionLabel>
      <div className="mx-4 rounded-2xl bg-white overflow-hidden shadow-[0_1px_4px_rgba(0,0,0,0.06)] mb-4">
        {(order?.items || []).map((item, idx) => (
          <React.Fragment key={item._id || idx}>
            {idx > 0 && <Divider />}
            <div className="flex items-start gap-3 px-4 py-4">
              <div className="h-[60px] w-[56px] shrink-0 overflow-hidden rounded-xl bg-gray-100">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.title} className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full bg-gray-200" />
                )}
              </div>
              <div className="flex-1 min-w-0 self-center">
                <p className="text-[14px] font-semibold text-[#1C1C1E] leading-snug">{item.title}</p>
                <p className="mt-1 text-[13px] text-[#888] flex items-center gap-2">
                  <span>{item.selectedSize || "N/A"}</span>
                  <span className="h-3 w-px bg-gray-300" />
                  <span>{item.selectedColor || "N/A"}</span>
                  <span className="h-3 w-px bg-gray-300" />
                  <span>Qty: {item.qty || 1}</span>
                </p>
              </div>
              <span className="text-[14px] font-semibold text-[#1C1C1E] shrink-0 self-center">
                ₹ {((Number(item.price) || 0) * (Number(item.qty) || 1)).toLocaleString("en-IN")}
              </span>
            </div>
          </React.Fragment>
        ))}

        <Divider />

        <div className="px-4 py-4 flex items-center justify-between">
          <span className="text-[15px] font-bold text-[#1C1C1E]">Total Amount</span>
          <div className="text-right">
            <p className="text-[18px] font-bold text-[#1C1C1E] leading-tight">
              ₹ {(order?.total || 0).toLocaleString("en-IN")}
            </p>
            <p className="text-[10px] text-[#888] mt-0.5">(GST included)</p>
          </div>
        </div>
      </div>

      {/* ── PAYMENT METHOD ──────────────────────────────────────────────────── */}
      <SectionLabel>Payment Method</SectionLabel>
      <div className="mx-4 rounded-2xl bg-white shadow-[0_1px_4px_rgba(0,0,0,0.06)] overflow-hidden mb-4">
         <div className="flex items-center p-4">
          <div className="h-10 w-10 shrink-0 rounded-full bg-[#EEF2FF] flex items-center justify-center mr-3">
            <IconWallet />
          </div>
          <div className="flex-1 min-w-0 pr-2">
            <p className="text-[14px] font-bold text-[#1C1C1E] mb-0.5">Online Payment</p>
            <p className="text-[13px] text-[#555]">
               Amount Paid: ₹ {(order?.total || 0).toLocaleString("en-IN")}
            </p>
          </div>
          <button className="flex items-center gap-1 shrink-0">
             <span className="text-[13px] font-semibold text-[#1C1C1E]">View Details</span>
             <IconChevronRight />
          </button>
        </div>
      </div>

      {/* ── SHIPPING METHOD ─────────────────────────────────────────────────── */}
      <SectionLabel>Shipping Method</SectionLabel>
      <div className="mx-4 rounded-2xl bg-white shadow-[0_1px_4px_rgba(0,0,0,0.06)] overflow-hidden mb-6">
         <div className="flex items-center p-4">
          <div className="h-10 w-10 shrink-0 rounded-full bg-[#F3F4F6] flex items-center justify-center mr-3">
            <IconTruck />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[14px] font-bold text-[#1C1C1E] mb-0.5">Standard Delivery</p>
            <p className="text-[13px] text-[#555]">
               Delivery in 3–5 business days
            </p>
          </div>
          <span className="text-[14px] font-semibold text-[#1C1C1E] shrink-0">
            ₹ {order?.deliveryFee || 49}
          </span>
        </div>
      </div>

      {/* ── Bottom CTAs ─────────────────────────────────────────────────────── */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 px-4 pt-4 pb-6 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
        <Link href="/my-orders" className="flex w-full h-[54px] items-center justify-center rounded-2xl bg-[#E8001C] text-white text-[15px] font-bold tracking-wide shadow-[0_4px_16px_rgba(232,0,28,0.35)] transition active:scale-[0.98] mb-3">
          Track Order
        </Link>
        <Link href="/" className="flex w-full h-[54px] items-center justify-center rounded-2xl border-[1.5px] border-[#E8001C] text-[#E8001C] text-[15px] font-bold tracking-wide transition active:scale-[0.98] mb-4">
          Continue Shopping
        </Link>
        <p className="text-center text-[12px] font-medium text-[#555]">
          Need help with your order ?
        </p>
      </div>
    </div>
  );
}

export default function OrderPlacedPage() {
  return (
    <React.Suspense fallback={
      <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center">
        <svg className="animate-spin h-8 w-8 text-[#E8001C]" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="32" strokeDashoffset="12" />
        </svg>
      </div>
    }>
      <OrderPlacedContent />
    </React.Suspense>
  );
}
