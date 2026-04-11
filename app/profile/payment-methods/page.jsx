"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import { toast } from "react-toastify";
import api from "@/lib/api";

// ── Helpers ────────────────────────────────────────────
const inputCls =
  "w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-[14px] font-medium text-[#2F2F2F] outline-none focus:border-[#F7246E] focus:ring-2 focus:ring-[#F7246E]/15 transition-all placeholder:text-gray-300 disabled:bg-gray-50 disabled:cursor-not-allowed";
const labelCls = "text-[12px] font-semibold text-gray-500 uppercase tracking-wider mb-1 block";

function formatCardInput(val) {
  return val.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
}

// ── Card form ──────────────────────────────────────────
function CardForm({ onSave, onCancel, saving }) {
  const [form, setForm] = useState({ number: "", nameOnCard: "", expiry: "", cvv: "", isDefault: false });
  const [showCvv, setShowCvv] = useState(false);

  const handle = (f) => (e) => {
    let val = e.target.value;
    if (f === "number") val = formatCardInput(val);
    if (f === "expiry") {
      val = val.replace(/\D/g, "").slice(0, 4);
      if (val.length > 2) val = val.slice(0, 2) + "/" + val.slice(2);
    }
    if (f === "cvv") val = val.replace(/\D/g, "").slice(0, 4);
    setForm((p) => ({ ...p, [f]: val }));
  };

  const submit = (e) => {
    e.preventDefault();
    const clean = form.number.replace(/\s/g, "");
    if (clean.length < 13 || !form.nameOnCard || !form.expiry || !form.cvv) {
      toast.error("Please fill all card details."); return;
    }
    // Send number (server extracts last4 + brand), NEVER stored cvv on server
    onSave({ type: "card", number: form.number, nameOnCard: form.nameOnCard, expiry: form.expiry, isDefault: form.isDefault });
  };

  return (
    <form onSubmit={submit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-4">
      <h3 className="text-[15px] font-bold text-[#2F2F2F]">Add Debit / Credit Card</h3>
      <div>
        <label className={labelCls}>Card Number *</label>
        <input className={inputCls} placeholder="1234 5678 9012 3456" value={form.number} onChange={handle("number")} inputMode="numeric" disabled={saving} />
      </div>
      <div>
        <label className={labelCls}>Name on Card *</label>
        <input className={inputCls} placeholder="As printed on card" value={form.nameOnCard} onChange={handle("nameOnCard")} disabled={saving} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Expiry (MM/YY) *</label>
          <input className={inputCls} placeholder="08/27" value={form.expiry} onChange={handle("expiry")} inputMode="numeric" disabled={saving} />
        </div>
        <div>
          <label className={labelCls}>CVV *</label>
          <div className="relative">
            <input
              className={inputCls + " pr-12"}
              placeholder="•••"
              type={showCvv ? "text" : "password"}
              value={form.cvv}
              onChange={handle("cvv")}
              inputMode="numeric"
              disabled={saving}
            />
            <button type="button" onClick={() => setShowCvv((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              {showCvv ? <VisibilityOffOutlinedIcon sx={{ fontSize: 20 }} /> : <VisibilityOutlinedIcon sx={{ fontSize: 20 }} />}
            </button>
          </div>
        </div>
      </div>
      <label className="flex items-center gap-2 cursor-pointer select-none">
        <input type="checkbox" checked={form.isDefault} onChange={(e) => setForm((p) => ({ ...p, isDefault: e.target.checked }))} className="accent-[#F7246E] w-4 h-4" disabled={saving} />
        <span className="text-[13px] font-medium text-gray-600">Set as default payment method</span>
      </label>
      <div className="flex gap-3 pt-1">
        <button type="submit" disabled={saving}
          className="flex-1 h-11 rounded-xl text-[14px] font-bold text-white transition-all active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2"
          style={{ background: "linear-gradient(90deg, #F7246E 0%, #913CF0 100%)" }}>
          {saving ? <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg> : "Save Card"}
        </button>
        <button type="button" onClick={onCancel} disabled={saving} className="flex-1 h-11 rounded-xl text-[14px] font-semibold text-gray-600 border border-gray-200 hover:bg-gray-50 transition-all">Cancel</button>
      </div>
    </form>
  );
}

// ── UPI form ───────────────────────────────────────────
function UpiForm({ onSave, onCancel, saving }) {
  const [upi, setUpi] = useState("");
  const [isDefault, setIsDefault] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    if (!upi.includes("@")) { toast.error("Enter a valid UPI ID (e.g. name@upi)."); return; }
    onSave({ type: "upi", upiId: upi, isDefault });
  };

  return (
    <form onSubmit={submit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-4">
      <h3 className="text-[15px] font-bold text-[#2F2F2F]">Add UPI ID</h3>
      <div>
        <label className={labelCls}>UPI ID *</label>
        <input className={inputCls} placeholder="yourname@upi" value={upi} onChange={(e) => setUpi(e.target.value)} disabled={saving} />
      </div>
      <label className="flex items-center gap-2 cursor-pointer select-none">
        <input type="checkbox" checked={isDefault} onChange={(e) => setIsDefault(e.target.checked)} className="accent-[#F7246E] w-4 h-4" disabled={saving} />
        <span className="text-[13px] font-medium text-gray-600">Set as default payment method</span>
      </label>
      <div className="flex gap-3">
        <button type="submit" disabled={saving}
          className="flex-1 h-11 rounded-xl text-[14px] font-bold text-white active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2"
          style={{ background: "linear-gradient(90deg, #F7246E 0%, #913CF0 100%)" }}>
          {saving ? <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg> : "Save UPI"}
        </button>
        <button type="button" onClick={onCancel} disabled={saving} className="flex-1 h-11 rounded-xl text-[14px] font-semibold text-gray-600 border border-gray-200 hover:bg-gray-50 transition-all">Cancel</button>
      </div>
    </form>
  );
}

// ── Payment method card ────────────────────────────────
function PaymentCard({ method, onSetDefault, onDelete }) {
  const isCard = method.type === "card";
  return (
    <div className={`bg-white rounded-2xl border shadow-sm p-5 relative transition-all ${method.isDefault ? "border-[#F7246E]" : "border-gray-100"}`}>
      {method.isDefault && (
        <span className="absolute top-4 right-4 flex items-center gap-1 text-[11px] font-bold text-[#F7246E]">
          <CheckCircleIcon sx={{ fontSize: 14 }} /> Default
        </span>
      )}
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${isCard ? "bg-blue-50" : "bg-green-50"}`}>
          {isCard
            ? <CreditCardOutlinedIcon sx={{ fontSize: 28, color: "#1a56db" }} />
            : <AccountBalanceWalletOutlinedIcon sx={{ fontSize: 28, color: "#057a55" }} />}
        </div>
        <div className="flex-1 min-w-0">
          {isCard ? (
            <>
              <p className="text-[15px] font-bold text-[#2F2F2F]">
                {method.brand}&nbsp;
                <span className="text-gray-400 font-medium">•••• •••• •••• {method.last4}</span>
              </p>
              <p className="text-[13px] text-gray-500 mt-0.5">{method.nameOnCard} · Expires {method.expiry}</p>
            </>
          ) : (
            <>
              <p className="text-[15px] font-bold text-[#2F2F2F]">UPI</p>
              <p className="text-[13px] text-gray-500 mt-0.5">{method.upiId}</p>
            </>
          )}
        </div>
      </div>
      <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-100">
        {!method.isDefault && (
          <button onClick={onSetDefault} className="text-[12px] font-semibold text-[#F7246E] hover:underline">
            Set as Default
          </button>
        )}
        <button onClick={onDelete} className="flex items-center gap-1 text-[12px] font-semibold text-red-400 hover:text-red-600 ml-auto">
          <DeleteOutlineOutlinedIcon sx={{ fontSize: 16 }} /> Remove
        </button>
      </div>
    </div>
  );
}

// ── Main page ──────────────────────────────────────────
export default function PaymentMethodsPage() {
  const router = useRouter();
  const [methods, setMethods]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [addMode, setAddMode]   = useState(null); // null | "card" | "upi"

  // ── Fetch ──
  useEffect(() => {
    api.get("/auth/payment-methods")
      .then(({ data }) => setMethods(data))
      .catch(() => toast.error("Failed to load payment methods."))
      .finally(() => setLoading(false));
  }, []);

  // ── Save ──
  const handleSave = async (payload) => {
    setSaving(true);
    try {
      const { data } = await api.post("/auth/payment-methods", payload);
      setMethods(data);
      setAddMode(null);
      toast.success("Payment method saved!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save payment method.");
    } finally { setSaving(false); }
  };

  // ── Delete ──
  const handleDelete = async (id) => {
    try {
      const { data } = await api.delete(`/auth/payment-methods/${id}`);
      setMethods(data);
      toast.success("Payment method removed.");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to remove.");
    }
  };

  // ── Set default ──
  const handleSetDefault = async (id) => {
    try {
      const { data } = await api.patch(`/auth/payment-methods/${id}/default`);
      setMethods(data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to set default.");
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] pb-24">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-[768px] mx-auto px-4 md:px-9 h-16 flex items-center gap-4">
          <button onClick={() => router.back()} className="p-2 rounded-full hover:bg-gray-100 transition-colors text-[#2F2F2F]">
            <ArrowBackOutlinedIcon sx={{ fontSize: 24 }} />
          </button>
          <h1 className="text-[18px] md:text-[20px] font-bold text-[#2F2F2F] flex-1">Payment Methods</h1>
        </div>
      </div>

      <div className="max-w-[768px] mx-auto px-4 md:px-9 pt-6 flex flex-col gap-4">
        {/* Skeleton */}
        {loading && (
          <div className="flex flex-col gap-4">
            {[1, 2].map((i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse flex gap-4 items-center">
                <div className="w-12 h-12 bg-gray-200 rounded-xl flex-shrink-0" />
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
                  <div className="h-3 bg-gray-100 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add mode selector */}
        {!loading && addMode === null && (
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => setAddMode("card")}
              className="flex flex-col items-center justify-center gap-2 bg-white rounded-2xl border border-dashed border-gray-200 p-6 hover:border-[#F7246E] hover:bg-[#F7246E]/5 transition-all group">
              <CreditCardOutlinedIcon sx={{ fontSize: 32, color: "#9ca3af" }} className="group-hover:!text-[#F7246E]" />
              <span className="text-[13px] font-bold text-gray-500 group-hover:text-[#F7246E]">Add Card</span>
            </button>
            <button onClick={() => setAddMode("upi")}
              className="flex flex-col items-center justify-center gap-2 bg-white rounded-2xl border border-dashed border-gray-200 p-6 hover:border-[#F7246E] hover:bg-[#F7246E]/5 transition-all group">
              <AccountBalanceWalletOutlinedIcon sx={{ fontSize: 32, color: "#9ca3af" }} className="group-hover:!text-[#F7246E]" />
              <span className="text-[13px] font-bold text-gray-500 group-hover:text-[#F7246E]">Add UPI</span>
            </button>
          </div>
        )}

        {/* Forms */}
        {addMode === "card" && <CardForm onSave={handleSave} onCancel={() => setAddMode(null)} saving={saving} />}
        {addMode === "upi"  && <UpiForm  onSave={handleSave} onCancel={() => setAddMode(null)} saving={saving} />}

        {/* Empty state */}
        {!loading && methods.length === 0 && addMode === null && (
          <div className="flex flex-col items-center justify-center py-20 gap-5 text-center">
            <div className="w-20 h-20 rounded-full bg-[#F7246E]/10 flex items-center justify-center">
              <CreditCardOutlinedIcon sx={{ fontSize: 40, color: "#F7246E" }} />
            </div>
            <div>
              <h2 className="text-[20px] font-bold text-[#2F2F2F] mb-1">No payment methods</h2>
              <p className="text-[14px] text-gray-500 max-w-xs">Save a card or UPI ID to speed up checkout.</p>
            </div>
          </div>
        )}

        {/* Method cards */}
        {!loading && methods.map((m) => (
          <PaymentCard
            key={m._id}
            method={m}
            onSetDefault={() => handleSetDefault(m._id)}
            onDelete={() => handleDelete(m._id)}
          />
        ))}
      </div>
    </div>
  );
}
