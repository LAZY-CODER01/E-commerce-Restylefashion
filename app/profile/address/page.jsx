"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import { toast } from "react-toastify";
import api from "@/lib/api";

function formatPhoneDisplay(mobile) {
  const s = String(mobile ?? "").trim();
  if (!s) return "—";
  if (s.startsWith("+")) return s;
  return `+91 ${s.replace(/^\+?91\s?/, "")}`;
}

// ── Address form ───────────────────────────────────────
function AddressForm({ initial = {}, onDone, onCancel, saving }) {
  const [form, setForm] = useState({
    label:   initial.label   || "Home",
    name:    initial.name    || "",
    mobile:  initial.mobile  || "",
    line1:   initial.line1   || "",
    line2:   initial.line2   || "",
    city:    initial.city    || "",
    state:   initial.state   || "",
    pincode: initial.pincode || "",
    country: initial.country || "India",
    isDefault: initial.isDefault ?? false,
  });

  const handle = (f) => (e) => setForm((p) => ({ ...p, [f]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    if (!form.name || !form.mobile || !form.line1 || !form.city || !form.state || !form.pincode) {
      toast.error("Please fill all required fields.");
      return;
    }
    onDone(form);
  };

  const inputCls =
    "w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-[14px] font-medium text-[#2F2F2F] outline-none focus:border-[#F7246E] focus:ring-2 focus:ring-[#F7246E]/15 transition-all placeholder:text-gray-300 disabled:bg-gray-50 disabled:cursor-not-allowed";
  const labelCls = "text-[12px] font-semibold text-gray-500 uppercase tracking-wider mb-1 block";

  return (
    <form onSubmit={submit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-4">
      {/* Label type */}
      <div>
        <p className={labelCls}>Address Type</p>
        <div className="flex gap-2">
          {["Home", "Work", "Other"].map((l) => (
            <button key={l} type="button" onClick={() => setForm((p) => ({ ...p, label: l }))}
              className={`px-4 py-1.5 rounded-full text-[13px] font-semibold border transition-all ${
                form.label === l
                  ? "bg-[#F7246E] text-white border-[#F7246E]"
                  : "bg-white text-gray-600 border-gray-200 hover:border-[#F7246E]"
              }`}>
              {l}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Full Name *</label>
          <input className={inputCls} placeholder="John Doe" value={form.name} onChange={handle("name")} disabled={saving} />
        </div>
        <div>
          <label className={labelCls}>Mobile *</label>
          <input className={inputCls} placeholder="+91 99999 99999" type="tel" value={form.mobile} onChange={handle("mobile")} disabled={saving} />
        </div>
      </div>

      <div>
        <label className={labelCls}>House / Flat / Floor *</label>
        <input className={inputCls} placeholder="E.g. Flat 4B, Silver Heights" value={form.line1} onChange={handle("line1")} disabled={saving} />
      </div>
      <div>
        <label className={labelCls}>Street / Area / Landmark</label>
        <input className={inputCls} placeholder="E.g. Near City Mall, MG Road" value={form.line2} onChange={handle("line2")} disabled={saving} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className={labelCls}>City *</label>
          <input className={inputCls} placeholder="Mumbai" value={form.city} onChange={handle("city")} disabled={saving} />
        </div>
        <div>
          <label className={labelCls}>State *</label>
          <input className={inputCls} placeholder="Maharashtra" value={form.state} onChange={handle("state")} disabled={saving} />
        </div>
        <div>
          <label className={labelCls}>Pincode *</label>
          <input className={inputCls} placeholder="400001" maxLength={6} value={form.pincode} onChange={handle("pincode")} disabled={saving} />
        </div>
      </div>

      <div>
        <label className={labelCls}>Country</label>
        <input className={inputCls} value={form.country} onChange={handle("country")} disabled={saving} />
      </div>

      <label className="flex items-center gap-2 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={form.isDefault}
          onChange={(e) => setForm((p) => ({ ...p, isDefault: e.target.checked }))}
          className="accent-[#F7246E] w-4 h-4"
          disabled={saving}
        />
        <span className="text-[13px] font-medium text-gray-600">Set as default address</span>
      </label>

      <div className="flex gap-3 pt-1">
        <button type="submit" disabled={saving}
          className="flex-1 h-11 rounded-xl text-[14px] font-bold text-white transition-all active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2"
          style={{ background: "linear-gradient(90deg, #F7246E 0%, #913CF0 100%)" }}>
          {saving ? (
            <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
          ) : "Save Address"}
        </button>
        <button type="button" onClick={onCancel} disabled={saving}
          className="flex-1 h-11 rounded-xl text-[14px] font-semibold text-gray-600 border border-gray-200 hover:bg-gray-50 transition-all">
          Cancel
        </button>
      </div>
    </form>
  );
}

// ── Address card (matches Addresses mobile reference) ──
function AddressCard({ address, onSetDefault, onEdit, onDelete }) {
  const lineStreet = [address.line1, address.line2].filter(Boolean).join(", ");
  const lineCity = `${address.city}, ${address.state} ${address.pincode}${address.country ? `, ${address.country}` : ""}`;

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-[0_1px_4px_rgba(0,0,0,0.06)] md:rounded-[18px]">
      <div className="flex gap-3 p-4 md:gap-4 md:p-5">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#FFF0F5] md:h-[52px] md:w-[52px]">
          <LocationOnOutlinedIcon sx={{ fontSize: 26, color: "#F7246E" }} aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[15px] font-bold leading-tight text-[#111] md:text-[16px]">{address.label}</p>
          <p className="mt-1.5 text-[13px] leading-snug text-gray-500 md:text-[14px]">{address.name}</p>
          <p className="mt-0.5 text-[13px] leading-snug text-gray-500 md:text-[14px]">
            {formatPhoneDisplay(address.mobile)}
          </p>
          <p className="mt-2 text-[13px] leading-relaxed text-gray-500 md:text-[14px]">
            {lineStreet}, {lineCity}
          </p>
        </div>
        <button
          type="button"
          onClick={() => !address.isDefault && onSetDefault()}
          aria-label={address.isDefault ? "Default address selected" : "Set as default address"}
          aria-pressed={address.isDefault}
          className={`mt-1 flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full border-2 transition-colors md:h-6 md:w-6 ${
            address.isDefault ? "border-[#F7246E] bg-white" : "border-gray-300 bg-white hover:border-gray-400"
          }`}
        >
          {address.isDefault ? (
            <span className="h-[10px] w-[10px] rounded-full bg-[#F7246E] md:h-2.5 md:w-2.5" />
          ) : null}
        </button>
      </div>
      <div className="flex border-t border-gray-100">
        <button
          type="button"
          onClick={onEdit}
          className="flex flex-1 items-center justify-center gap-2 py-3.5 text-[14px] font-semibold text-[#F7246E] transition hover:bg-[#FFF5F8] md:py-4"
        >
          <EditOutlinedIcon sx={{ fontSize: 18 }} />
          Edit
        </button>
        <div className="w-px self-stretch bg-gray-200 my-2" aria-hidden />
        <button
          type="button"
          onClick={onDelete}
          className="flex flex-1 items-center justify-center gap-2 py-3.5 text-[14px] font-semibold text-[#F7246E] transition hover:bg-[#FFF5F8] md:py-4"
        >
          <DeleteOutlineOutlinedIcon sx={{ fontSize: 18 }} aria-hidden />
          Remove
        </button>
      </div>
    </div>
  );
}

// ── Main page ──────────────────────────────────────────
export default function SavedAddressPage() {
  const router = useRouter();
  const [addresses, setAddresses]   = useState([]);
  const [loading, setLoading]       = useState(true);
  const [saving, setSaving]         = useState(false);
  const [showForm, setShowForm]     = useState(false);
  const [editingAddr, setEditingAddr] = useState(null); // { _id, ...fields }

  // ── Fetch ──
  useEffect(() => {
    api.get("/auth/addresses")
      .then(({ data }) => setAddresses(data))
      .catch(() => toast.error("Failed to load addresses."))
      .finally(() => setLoading(false));
  }, []);

  // ── Add ──
  const handleAdd = async (form) => {
    setSaving(true);
    try {
      const { data } = await api.post("/auth/addresses", form);
      setAddresses(data);
      setShowForm(false);
      toast.success("Address saved!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save address.");
    } finally { setSaving(false); }
  };

  // ── Edit ──
  const handleEdit = async (form) => {
    setSaving(true);
    try {
      const { data } = await api.put(`/auth/addresses/${editingAddr._id}`, form);
      setAddresses(data);
      setEditingAddr(null);
      toast.success("Address updated!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update address.");
    } finally { setSaving(false); }
  };

  // ── Delete ──
  const handleDelete = async (id) => {
    try {
      const { data } = await api.delete(`/auth/addresses/${id}`);
      setAddresses(data);
      toast.success("Address removed.");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete address.");
    }
  };

  // ── Set default ──
  const handleSetDefault = async (id) => {
    try {
      const { data } = await api.patch(`/auth/addresses/${id}/default`);
      setAddresses(data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to set default.");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F8F8] pb-28 font-sans md:pb-32">
      <header className="sticky top-0 z-30 border-b border-gray-100 bg-white">
        <div className="relative mx-auto flex h-[52px] max-w-[720px] items-center px-4 md:h-14 md:max-w-[800px] md:px-8">
          <button
            type="button"
            onClick={() => router.back()}
            className="-ml-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[#111] transition hover:bg-black/5"
            aria-label="Go back"
          >
            <ArrowBackOutlinedIcon sx={{ fontSize: 26 }} />
          </button>
          <h1 className="pointer-events-none absolute left-1/2 top-1/2 max-w-[70%] -translate-x-1/2 -translate-y-1/2 truncate text-center text-[17px] font-bold tracking-tight text-[#111] md:text-[19px]">
            Addresses
          </h1>
          <span className="ml-auto h-11 w-11 shrink-0 md:w-[52px]" aria-hidden />
        </div>
      </header>

      <div className="mx-auto flex max-w-[720px] flex-col gap-4 px-4 pb-24 pt-4 md:max-w-[800px] md:gap-5 md:px-8 md:pt-6">
        <div className="flex items-center justify-between gap-3">
          <p className="text-[13px] font-medium text-gray-500 md:text-[14px]">Saved Addresses</p>
          {!showForm && !editingAddr && (
            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="flex shrink-0 items-center gap-1 text-[14px] font-bold text-[#F7246E] transition hover:text-[#F8085A] hover:underline"
            >
              <span className="text-[18px] font-bold leading-none" aria-hidden>
                +
              </span>
              Add New Address
            </button>
          )}
        </div>
        {/* Skeleton loader */}
        {loading && (
          <div className="flex flex-col gap-4">
            {[1, 2].map((i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-16 mb-3" />
                <div className="h-5 bg-gray-200 rounded w-1/2 mb-2" />
                <div className="h-4 bg-gray-100 rounded w-3/4" />
              </div>
            ))}
          </div>
        )}

        {/* Add form */}
        {showForm && <AddressForm onDone={handleAdd} onCancel={() => setShowForm(false)} saving={saving} />}

        {/* Edit form */}
        {editingAddr && (
          <AddressForm initial={editingAddr} onDone={handleEdit} onCancel={() => setEditingAddr(null)} saving={saving} />
        )}

        {/* Empty state */}
        {!loading && addresses.length === 0 && !showForm && !editingAddr && (
          <div className="flex flex-col items-center justify-center py-28 gap-5 text-center">
            <div className="w-20 h-20 rounded-full bg-[#F7246E]/10 flex items-center justify-center">
              <HomeOutlinedIcon sx={{ fontSize: 40, color: "#F7246E" }} />
            </div>
            <div>
              <h2 className="text-[20px] font-bold text-[#2F2F2F] mb-1">No saved addresses</h2>
              <p className="text-[14px] text-gray-500 max-w-xs">Add your first address to make checkout faster.</p>
            </div>
            <button onClick={() => setShowForm(true)}
              className="flex items-center gap-2 bg-[#F7246E] text-white text-[14px] font-bold px-6 py-3 rounded-full hover:bg-[#F8085A] transition-colors shadow-md active:scale-95">
              <AddCircleOutlineOutlinedIcon sx={{ fontSize: 20 }} /> Add Address
            </button>
          </div>
        )}

        {/* Address cards */}
        {!loading && addresses.map((addr) =>
          editingAddr?._id !== addr._id && (
            <AddressCard
              key={addr._id}
              address={addr}
              onSetDefault={() => handleSetDefault(addr._id)}
              onEdit={() => { setEditingAddr(addr); setShowForm(false); }}
              onDelete={() => handleDelete(addr._id)}
            />
          )
        )}
      </div>
    </div>
  );
}
