"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import Link from "next/link";

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  });
}

function StatusBadge({ status }) {
  const map = {
    paid:    { bg: "bg-green-100",  text: "text-green-700",  label: "Paid" },
    created: { bg: "bg-yellow-100", text: "text-yellow-700", label: "Pending" },
    failed:  { bg: "bg-red-100",    text: "text-red-700",    label: "Failed" },
  };
  const s = map[status] || map.created;
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide ${s.bg} ${s.text}`}>
      {s.label}
    </span>
  );
}

function OrderCard({ order }) {
  const total = Number(order.total || 0);
  const items = Array.isArray(order.items) ? order.items : [];

  return (
    <div className="rounded-2xl bg-white border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.06)] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-[#888]">Order ID</p>
          <p className="text-[13px] font-semibold text-[#1C1C1E] mt-0.5 font-mono">
            {order.razorpay_order_id || order._id}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <StatusBadge status={order.status} />
          <p className="text-[12px] text-[#888]">{formatDate(order.createdAt)}</p>
        </div>
      </div>

      {/* Items */}
      <div className="px-5 py-4 flex flex-col gap-3">
        {items.map((item, idx) => (
          <div key={idx} className="flex items-center gap-3">
            <div className="h-14 w-12 shrink-0 rounded-xl bg-gray-100 overflow-hidden">
              {item.imageUrl ? (
                <img src={item.imageUrl} alt={item.title} className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full bg-gray-200" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold text-[#1C1C1E] truncate">{item.title}</p>
              <p className="text-[12px] text-[#888] mt-0.5">
                {[item.selectedSize, item.selectedColor].filter(Boolean).join(" · ")}
                {item.qty > 1 ? ` · Qty ${item.qty}` : ""}
              </p>
            </div>
            <span className="text-[13px] font-bold text-[#1C1C1E] shrink-0">
              ₹{(Number(item.price) * (item.qty || 1)).toLocaleString("en-IN")}
            </span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50">
        <div>
          <p className="text-[12px] text-[#888]">
            {order.deliveryOption === "express" ? "⚡ Express Delivery" : "🚚 Standard Delivery"}
          </p>
          {order.deliveryAddress?.name && (
            <p className="text-[12px] text-[#888] mt-0.5">To: {order.deliveryAddress.name}</p>
          )}
        </div>
        <div className="text-right">
          <p className="text-[11px] text-[#888]">Total Paid</p>
          <p className="text-[18px] font-extrabold text-[#1C1C1E]">
            ₹{total.toLocaleString("en-IN")}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function MyOrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const justPaid = searchParams.get("success") === "1";

  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push("/login");
      return;
    }
    (async () => {
      try {
        const { data } = await api.get("/payment/orders");
        setOrders(data.orders || []);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load orders.");
      } finally {
        setLoading(false);
      }
    })();
  }, [user, authLoading, router]);

  return (
    <div className="min-h-screen bg-[#F5F5F5] pb-16">
      {/* Nav */}
      <div className="sticky top-0 z-40 bg-white flex items-center gap-3 px-4 h-[56px] border-b border-gray-100 shadow-[0_1px_4px_rgba(0,0,0,0.05)]">
        <button onClick={() => router.back()} className="flex h-9 w-9 items-center justify-center transition active:scale-95" aria-label="Go back">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1C1C1E" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <h1 className="text-[16px] font-bold uppercase tracking-widest text-[#1C1C1E]">My Orders</h1>
      </div>

      <div className="mx-auto max-w-2xl px-4 pt-5">
        {/* Success Banner */}
        {justPaid && (
          <div className="mb-5 flex items-center gap-3 rounded-2xl bg-green-50 border border-green-200 px-5 py-4">
            <span className="text-2xl">🎉</span>
            <div>
              <p className="text-[14px] font-bold text-green-800">Payment Successful!</p>
              <p className="text-[13px] text-green-700 mt-0.5">Your order has been placed. We'll deliver it soon.</p>
            </div>
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center py-20">
            <svg className="animate-spin h-8 w-8 text-[#E8001C]" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="#E8001C" strokeWidth="3" strokeDasharray="32" strokeDashoffset="12" />
            </svg>
          </div>
        )}

        {error && (
          <div className="rounded-2xl bg-red-50 border border-red-200 px-5 py-4 text-[14px] text-red-700 font-medium">
            {error}
          </div>
        )}

        {!loading && !error && orders.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="text-5xl mb-4">📦</div>
            <p className="text-[16px] font-bold text-[#1C1C1E]">No orders yet</p>
            <p className="text-[14px] text-[#888] mt-1">Looks like you haven't ordered anything yet.</p>
            <Link href="/" className="mt-6 inline-flex h-12 items-center rounded-2xl bg-[#E8001C] px-8 text-[14px] font-bold text-white shadow-[0_4px_16px_rgba(232,0,28,0.3)] transition active:scale-95">
              Start Shopping
            </Link>
          </div>
        )}

        {!loading && !error && orders.length > 0 && (
          <div className="flex flex-col gap-4">
            <p className="text-[12px] font-semibold text-[#888] uppercase tracking-widest">
              {orders.length} Order{orders.length !== 1 ? "s" : ""}
            </p>
            {orders.map((order) => (
              <OrderCard key={order._id} order={order} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
