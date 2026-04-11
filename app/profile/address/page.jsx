"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { toast } from "react-toastify";
import api from "@/lib/api";

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

// ── Address card ───────────────────────────────────────
function AddressCard({ address, onSetDefault, onEdit, onDelete }) {
  return (
    <div className={`bg-white rounded-2xl border shadow-sm p-5 relative transition-all ${address.isDefault ? "border-[#F7246E]" : "border-gray-100"}`}>
      {address.isDefault && (
        <span className="absolute top-4 right-4 flex items-center gap-1 text-[11px] font-bold text-[#F7246E]">
          <CheckCircleIcon sx={{ fontSize: 14 }} /> Default
        </span>
      )}
      <span className="inline-block mb-2 px-3 py-0.5 rounded-full bg-gray-100 text-[12px] font-bold text-gray-500 uppercase">
        {address.label}
      </span>
      <p className="text-[15px] font-bold text-[#2F2F2F]">{address.name}</p>
      <p className="text-[13px] text-gray-500 mt-0.5">{address.mobile}</p>
      <p className="text-[13px] text-gray-600 mt-2 leading-relaxed">
        {address.line1}{address.line2 ? `, ${address.line2}` : ""},&nbsp;
        {address.city}, {address.state} — {address.pincode}
        {address.country ? `, ${address.country}` : ""}
      </p>
      <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-100">
        {!address.isDefault && (
          <button onClick={onSetDefault} className="text-[12px] font-semibold text-[#F7246E] hover:underline">
            Set as Default
          </button>
        )}
        <button onClick={onEdit} className="flex items-center gap-1 text-[12px] font-semibold text-gray-500 hover:text-[#2F2F2F] ml-auto">
          <EditOutlinedIcon sx={{ fontSize: 16 }} /> Edit
        </button>
        <button onClick={onDelete} className="flex items-center gap-1 text-[12px] font-semibold text-red-400 hover:text-red-600">
          <DeleteOutlineOutlinedIcon sx={{ fontSize: 16 }} /> Delete
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
    <div className="min-h-screen bg-[#F5F5F5] pb-24">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-[768px] mx-auto px-4 md:px-9 h-16 flex items-center gap-4">
          <button onClick={() => router.back()} className="p-2 rounded-full hover:bg-gray-100 transition-colors text-[#2F2F2F]" aria-label="Go back">
            <ArrowBackOutlinedIcon sx={{ fontSize: 24 }} />
          </button>
          <h1 className="text-[18px] md:text-[20px] font-bold text-[#2F2F2F] flex-1">Saved Addresses</h1>
          {!showForm && !editingAddr && (
            <button onClick={() => setShowForm(true)}
              className="flex items-center gap-1.5 bg-[#F7246E] text-white text-[13px] font-bold px-4 py-2 rounded-full hover:bg-[#F8085A] transition-all shadow-sm active:scale-95">
              <AddCircleOutlineOutlinedIcon sx={{ fontSize: 18 }} />
              <span className="hidden sm:inline">Add New</span>
            </button>
          )}
        </div>
      </div>

      <div className="max-w-[768px] mx-auto px-4 md:px-9 pt-6 flex flex-col gap-4">
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
