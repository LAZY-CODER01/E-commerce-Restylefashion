"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined";
import AccountBalanceOutlinedIcon from "@mui/icons-material/AccountBalanceOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import KeyboardArrowRightOutlinedIcon from "@mui/icons-material/KeyboardArrowRightOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import { toast } from "react-toastify";
import api from "@/lib/api";

const inputCls =
  "w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-[14px] font-medium text-[#2F2F2F] outline-none focus:border-[#F7246E] focus:ring-2 focus:ring-[#F7246E]/15 transition-all placeholder:text-gray-300 disabled:bg-gray-50 disabled:cursor-not-allowed";
const labelCls = "text-[12px] font-semibold text-gray-500 uppercase tracking-wider mb-1 block";

function formatCardInput(val) {
  return val.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
}

function brandIcon(brand) {
  const b = (brand || "").toLowerCase();
  if (b.includes("visa"))
    return <span className="text-[14px] font-extrabold italic tracking-tight text-[#1a1f71]">VISA</span>;
  if (b.includes("master"))
    return (
      <span className="relative flex h-6 w-9 items-center justify-center">
        <span className="absolute left-0 h-5 w-5 rounded-full bg-[#eb001b] opacity-90" />
        <span className="absolute left-2.5 h-5 w-5 rounded-full bg-[#f79e1b] opacity-90" />
      </span>
    );
  return <CreditCardOutlinedIcon sx={{ fontSize: 24, color: "#666" }} />;
}

function upiIcon() {
  return <span className="text-[13px] font-extrabold tracking-tight text-[#5F259F]">UPI</span>;
}

function bankIcon() {
  return <AccountBalanceOutlinedIcon sx={{ fontSize: 22, color: "#333" }} />;
}

// ── Card Form ──
function CardForm({ onSave, onCancel, saving, initial }) {
  const [form, setForm] = useState({
    number: initial?.number || (initial?.last4 ? `•••• •••• •••• ${initial.last4}` : ""),
    nameOnCard: initial?.nameOnCard || "",
    expiry: initial?.expiry || "",
    cvv: "",
    isDefault: initial?.isDefault || false,
  });
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
    const clean = form.number.replace(/[^\d]/g, "");
    if (!initial?._id && clean.length < 13) {
      toast.error("Please enter a valid card number.");
      return;
    }
    if (!form.nameOnCard || !form.expiry || !form.cvv) {
      toast.error("Please fill all card details.");
      return;
    }
    onSave({
      type: "card",
      number: form.number,
      nameOnCard: form.nameOnCard,
      expiry: form.expiry,
      isDefault: form.isDefault,
      ...(initial?._id ? { _id: initial._id } : {}),
    });
  };

  return (
    <form onSubmit={submit} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <h3 className="mb-4 text-[15px] font-bold text-[#2F2F2F]">
        {initial?._id ? "Edit Card" : "Add Debit / Credit Card"}
      </h3>
      <div className="flex flex-col gap-4">
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
        <label className="flex cursor-pointer select-none items-center gap-2">
          <input type="checkbox" checked={form.isDefault} onChange={(e) => setForm((p) => ({ ...p, isDefault: e.target.checked }))} className="h-4 w-4 accent-[#F7246E]" disabled={saving} />
          <span className="text-[13px] font-medium text-gray-600">Set as default payment method</span>
        </label>
        <div className="flex gap-3 pt-1">
          <button
            type="submit"
            disabled={saving}
            className="flex h-11 flex-1 items-center justify-center rounded-xl text-[14px] font-bold text-white transition-all active:scale-[0.98] disabled:opacity-60"
            style={{ background: "linear-gradient(90deg, #F7246E 0%, #913CF0 100%)" }}
          >
            {saving ? "Saving…" : initial?._id ? "Update Card" : "Save Card"}
          </button>
          <button type="button" onClick={onCancel} disabled={saving} className="h-11 flex-1 rounded-xl border border-gray-200 text-[14px] font-semibold text-gray-600 transition-all hover:bg-gray-50">
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
}

// ── UPI Form ──
function UpiForm({ onSave, onCancel, saving, initial }) {
  const [upi, setUpi] = useState(initial?.upiId || "");
  const [name, setName] = useState(initial?.nameOnCard || initial?.holderName || "");
  const [isDefault, setIsDefault] = useState(initial?.isDefault || false);

  const submit = (e) => {
    e.preventDefault();
    if (!upi.includes("@")) {
      toast.error("Enter a valid UPI ID (e.g. name@upi).");
      return;
    }
    onSave({
      type: "upi",
      upiId: upi,
      holderName: name,
      isDefault,
      ...(initial?._id ? { _id: initial._id } : {}),
    });
  };

  return (
    <form onSubmit={submit} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <h3 className="mb-4 text-[15px] font-bold text-[#2F2F2F]">
        {initial?._id ? "Edit UPI" : "Add UPI ID"}
      </h3>
      <div className="flex flex-col gap-4">
        <div>
          <label className={labelCls}>UPI ID *</label>
          <input className={inputCls} placeholder="yourname@upi" value={upi} onChange={(e) => setUpi(e.target.value)} disabled={saving} />
        </div>
        <div>
          <label className={labelCls}>Name</label>
          <input className={inputCls} placeholder="Account holder name" value={name} onChange={(e) => setName(e.target.value)} disabled={saving} />
        </div>
        <label className="flex cursor-pointer select-none items-center gap-2">
          <input type="checkbox" checked={isDefault} onChange={(e) => setIsDefault(e.target.checked)} className="h-4 w-4 accent-[#F7246E]" disabled={saving} />
          <span className="text-[13px] font-medium text-gray-600">Set as default payment method</span>
        </label>
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="flex h-11 flex-1 items-center justify-center rounded-xl text-[14px] font-bold text-white active:scale-[0.98] disabled:opacity-60"
            style={{ background: "linear-gradient(90deg, #F7246E 0%, #913CF0 100%)" }}
          >
            {saving ? "Saving…" : initial?._id ? "Update UPI" : "Save UPI"}
          </button>
          <button type="button" onClick={onCancel} disabled={saving} className="h-11 flex-1 rounded-xl border border-gray-200 text-[14px] font-semibold text-gray-600 transition-all hover:bg-gray-50">
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
}

// ── Payment Method Card ──
function PaymentCard({ method, isSelected, onSelect, onEdit, onRemove }) {
  const isCard = method.type === "card";
  const isUpi = method.type === "upi";
  const icon = isCard ? brandIcon(method.brand) : isUpi ? upiIcon() : bankIcon();
  const holderName = method.nameOnCard || method.holderName || "";

  return (
    <div className={`rounded-2xl border bg-white shadow-sm transition-all ${isSelected ? "border-[#F7246E]" : "border-gray-100"}`}>
      <div className="flex items-start gap-4 p-4 pb-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gray-50">
          {icon}
        </div>

        <div className="min-w-0 flex-1">
          {isCard && (
            <>
              <p className="text-[15px] font-bold text-[#111]">
                {method.brand || "Card"} •••• {method.last4}
              </p>
              {holderName && <p className="mt-0.5 text-[13px] text-gray-500">{holderName}</p>}
              {method.expiry && <p className="mt-0.5 text-[13px] text-gray-500">Expires {method.expiry}</p>}
            </>
          )}
          {isUpi && (
            <>
              <p className="text-[15px] font-bold text-[#111]">UPI • {method.upiId}</p>
              {holderName && <p className="mt-0.5 text-[13px] text-gray-500">{holderName}</p>}
            </>
          )}
          {!isCard && !isUpi && (
            <>
              <p className="text-[15px] font-bold text-[#111]">Bank Account •••• {method.last4 || "****"}</p>
              {method.bankName && <p className="mt-0.5 text-[13px] text-gray-500">{method.bankName}</p>}
              {holderName && <p className="mt-0.5 text-[13px] text-gray-500">{holderName}</p>}
              {method.linkedDate && <p className="mt-0.5 text-[13px] text-gray-400">Linked on {method.linkedDate}</p>}
            </>
          )}
          {isSelected && (
            <p className="mt-1 text-[12px] font-semibold text-[#F7246E]">Used for checkout</p>
          )}
        </div>

        {/* Radio */}
        <button
          type="button"
          onClick={onSelect}
          className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors"
          style={{
            borderColor: isSelected ? "#F7246E" : "#D1D5DB",
            backgroundColor: isSelected ? "#F7246E" : "transparent",
          }}
          aria-label={isSelected ? "Selected" : "Select as default"}
        >
          {isSelected && <span className="h-2 w-2 rounded-full bg-white" />}
        </button>
      </div>

      {/* Edit / Remove */}
      <div className="flex items-center border-t border-gray-100 px-4 py-3">
        <button
          type="button"
          onClick={onEdit}
          className="flex items-center gap-1.5 text-[12px] font-semibold text-[#F7246E] transition hover:opacity-80"
        >
          <EditOutlinedIcon sx={{ fontSize: 15 }} />
          Edit
        </button>
        <button
          type="button"
          onClick={onRemove}
          className="ml-auto flex items-center gap-1.5 text-[12px] font-semibold text-red-400 transition hover:text-red-600"
        >
          <DeleteOutlineOutlinedIcon sx={{ fontSize: 15 }} />
          Remove
        </button>
      </div>
    </div>
  );
}

// ── Main Page ──
export default function PaymentMethodsPage() {
  const router = useRouter();
  const [methods, setMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [addMode, setAddMode] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const addMenuRef = useRef(null);

  useEffect(() => {
    api.get("/auth/payment-methods")
      .then(({ data }) => setMethods(data))
      .catch(() => toast.error("Failed to load payment methods."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    function handleClickOutside(e) {
      if (addMenuRef.current && !addMenuRef.current.contains(e.target)) setShowAddMenu(false);
    }
    if (showAddMenu) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showAddMenu]);

  const handleSave = async (payload) => {
    setSaving(true);
    try {
      let data;
      if (payload._id) {
        const res = await api.put(`/auth/payment-methods/${payload._id}`, payload);
        data = res.data;
      } else {
        const res = await api.post("/auth/payment-methods", payload);
        data = res.data;
      }
      setMethods(data);
      setAddMode(null);
      setEditItem(null);
      toast.success(payload._id ? "Payment method updated!" : "Payment method saved!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save payment method.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const { data } = await api.delete(`/auth/payment-methods/${id}`);
      setMethods(data);
      toast.success("Payment method removed.");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to remove.");
    }
  };

  const handleSetDefault = async (id) => {
    try {
      const { data } = await api.patch(`/auth/payment-methods/${id}/default`);
      setMethods(data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to set default.");
    }
  };

  const handleEdit = (method) => {
    setEditItem(method);
    setAddMode(method.type === "card" ? "card" : "upi");
    setShowAddMenu(false);
  };

  const cancelForm = () => {
    setAddMode(null);
    setEditItem(null);
  };

  const selectAddType = (type) => {
    setEditItem(null);
    setAddMode(type);
    setShowAddMenu(false);
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] pb-24">
      {/* Header */}
      <div className="sticky top-0 z-30 border-b border-gray-100 bg-white shadow-sm">
        <div className="mx-auto flex h-14 max-w-[1280px] items-center gap-3 px-4 md:px-6">
          <button
            type="button"
            onClick={() => router.back()}
            className="-ml-2 rounded-full p-2 text-gray-800 hover:bg-gray-100"
            aria-label="Back"
          >
            <ArrowBackOutlinedIcon sx={{ fontSize: 22 }} />
          </button>
          <h1 className="flex-1 text-[17px] font-bold text-[#111]">Payment Methods</h1>

          {/* + Add New */}
          <div className="relative" ref={addMenuRef}>
            <button
              type="button"
              onClick={() => setShowAddMenu((v) => !v)}
              className="flex items-center gap-1 text-[14px] font-semibold text-[#F7246E] transition hover:opacity-80"
            >
              <AddRoundedIcon sx={{ fontSize: 20 }} />
              Add New
            </button>

            {showAddMenu && (
              <div className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg">
                <button
                  type="button"
                  onClick={() => selectAddType("card")}
                  className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition hover:bg-gray-50"
                >
                  <CreditCardOutlinedIcon sx={{ fontSize: 22, color: "#888" }} />
                  <span className="text-[14px] font-medium text-[#333]">Add Card</span>
                </button>
                <div className="mx-4 border-t border-gray-100" />
                <button
                  type="button"
                  onClick={() => selectAddType("upi")}
                  className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition hover:bg-gray-50"
                >
                  <span className="flex h-[22px] w-[22px] items-center justify-center text-[10px] font-extrabold text-[#5F259F]">UPI</span>
                  <span className="text-[14px] font-medium text-[#333]">Add UPI</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1280px] px-4 pt-5 md:px-6">
        {/* Loading */}
        {loading && (
          <div className="flex flex-col gap-4">
            {[1, 2].map((i) => (
              <div key={i} className="flex animate-pulse items-center gap-4 rounded-2xl border border-gray-100 bg-white p-5">
                <div className="h-12 w-12 shrink-0 rounded-xl bg-gray-200" />
                <div className="flex-1">
                  <div className="mb-2 h-4 w-1/2 rounded bg-gray-200" />
                  <div className="h-3 w-1/3 rounded bg-gray-100" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Form */}
        {addMode === "card" && (
          <div className="mb-5">
            <CardForm onSave={handleSave} onCancel={cancelForm} saving={saving} initial={editItem} />
          </div>
        )}
        {addMode === "upi" && (
          <div className="mb-5">
            <UpiForm onSave={handleSave} onCancel={cancelForm} saving={saving} initial={editItem} />
          </div>
        )}

        {/* Saved Payment Methods */}
        {!loading && methods.length > 0 && (
          <>
            <p className="mb-3 text-[13px] font-medium text-gray-400">Saved Payment Methods</p>
            <div className="flex flex-col gap-4">
              {methods.map((m) => (
                <PaymentCard
                  key={m._id}
                  method={m}
                  isSelected={m.isDefault}
                  onSelect={() => handleSetDefault(m._id)}
                  onEdit={() => handleEdit(m)}
                  onRemove={() => handleDelete(m._id)}
                />
              ))}
            </div>
          </>
        )}

        {/* Empty state */}
        {!loading && methods.length === 0 && !addMode && (
          <div className="flex flex-col items-center justify-center gap-5 py-20 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#F7246E]/10">
              <CreditCardOutlinedIcon sx={{ fontSize: 40, color: "#F7246E" }} />
            </div>
            <div>
              <h2 className="mb-1 text-[20px] font-bold text-[#2F2F2F]">No payment methods</h2>
              <p className="max-w-xs text-[14px] text-gray-500">Save a card or UPI ID to speed up checkout.</p>
            </div>
          </div>
        )}

        {/* 100% Secure Payments */}
        {!loading && (
          <>
            <div className="mt-8 flex items-center gap-3 rounded-2xl border border-gray-100 bg-white px-4 py-4 shadow-sm">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FFF0F4]">
                <LockOutlinedIcon sx={{ fontSize: 20, color: "#F7246E" }} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[14px] font-bold text-[#111]">100% Secure Payments</p>
                <p className="text-[12px] text-gray-500">Your payment information is safe with us.</p>
              </div>
              <KeyboardArrowRightOutlinedIcon className="shrink-0 text-gray-400" sx={{ fontSize: 22 }} />
            </div>

            <p className="mt-5 text-center text-[13px] leading-relaxed text-gray-400">
              You can add or manage your payment methods<br />to make your checkout faster and easier.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
