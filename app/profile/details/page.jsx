"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import { toast } from "react-toastify";

function Field({ label, id, icon, type = "text", value, onChange, placeholder, disabled }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-[13px] font-semibold text-gray-500 uppercase tracking-wider">
        {label}
      </label>
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">{icon}</span>
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full pl-12 pr-4 py-3.5 rounded-xl border text-[15px] font-medium text-[#2F2F2F] outline-none transition-all
            ${disabled
              ? "bg-gray-50 border-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-white border-gray-200 focus:border-[#F7246E] focus:ring-2 focus:ring-[#F7246E]/15"
            }`}
        />
      </div>
    </div>
  );
}

export default function ProfileDetailsPage() {
  const router = useRouter();
  const { user, setUser } = useAuth();

  const [form, setForm] = useState({ fullName: "", email: "", mobile: "" });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Populate once user loads
  useEffect(() => {
    if (user) {
      setForm({
        fullName: user.fullName || "",
        email: user.email || "",
        mobile: user.mobile || "",
      });
    }
  }, [user]);

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.fullName.trim()) {
      toast.error("Full name is required.");
      return;
    }
    setSaving(true);
    try {
      const { data } = await api.put("/auth/profile", {
        fullName: form.fullName.trim(),
        mobile: form.mobile.trim(),
      });
      setUser((prev) => ({ ...prev, ...data }));
      setSaved(true);
      toast.success("Profile updated successfully!");
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] pb-24">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-[768px] mx-auto px-4 md:px-9 h-16 flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors text-[#2F2F2F]"
            aria-label="Go back"
          >
            <ArrowBackOutlinedIcon sx={{ fontSize: 24 }} />
          </button>
          <h1 className="text-[18px] md:text-[20px] font-bold text-[#2F2F2F] flex-1">
            Profile Details
          </h1>
        </div>
      </div>

      <div className="max-w-[768px] mx-auto px-4 md:px-9 pt-8">
        {/* Avatar banner */}
        <div className="flex items-center gap-5 bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#F7246E]/20 to-[#913CF0]/20 flex items-center justify-center flex-shrink-0">
            <PersonOutlineOutlinedIcon sx={{ fontSize: 36, color: "#F7246E" }} />
          </div>
          <div>
            <p className="text-[17px] font-bold text-[#2F2F2F]">{user?.fullName || "—"}</p>
            <p className="text-[13px] text-gray-400 mt-0.5">{user?.email}</p>
            <span className="inline-block mt-1.5 px-2.5 py-0.5 rounded-full bg-[#F7246E]/10 text-[#F7246E] text-[11px] font-semibold">
              {user?.role || "User"}
            </span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col gap-5">
          <Field
            label="Full Name"
            id="fullName"
            icon={<PersonOutlineOutlinedIcon sx={{ fontSize: 20 }} />}
            value={form.fullName}
            onChange={handleChange("fullName")}
            placeholder="Enter your full name"
          />
          <Field
            label="Email"
            id="email"
            type="email"
            icon={<EmailOutlinedIcon sx={{ fontSize: 20 }} />}
            value={form.email}
            onChange={handleChange("email")}
            placeholder="your@email.com"
            disabled={true}
          />
          <p className="text-[12px] text-gray-400 -mt-3 ml-1">Email cannot be changed.</p>
          <Field
            label="Mobile Number"
            id="mobile"
            type="tel"
            icon={<PhoneOutlinedIcon sx={{ fontSize: 20 }} />}
            value={form.mobile}
            onChange={handleChange("mobile")}
            placeholder="+91 99999 99999"
          />

          <button
            type="submit"
            disabled={saving}
            className="mt-2 w-full h-12 rounded-xl text-[15px] font-bold text-white transition-all flex items-center justify-center gap-2 disabled:opacity-60 active:scale-[0.98]"
            style={{ background: "linear-gradient(90deg, #F7246E 0%, #913CF0 100%)" }}
          >
            {saving ? (
              <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
            ) : saved ? (
              <><CheckCircleOutlineOutlinedIcon sx={{ fontSize: 20 }} /> Saved!</>
            ) : (
              "Save Changes"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
