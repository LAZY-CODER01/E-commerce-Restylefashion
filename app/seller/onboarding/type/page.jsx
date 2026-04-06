"use client";

import React, { useState, useEffect } from "react";
import Button from "@/components/Button";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import { toast } from "react-toastify";
import { getDraftListing, mergeDraftListing } from "@/lib/draftListing";

const SELLER_TYPES = [
  {
    id: "individual",
    label: "Individual Seller",
    color: "#F7246E",
    colorLight: "rgba(247,36,110,0.08)",
    colorBorder: "rgba(247,36,110,0.25)",
    guideline:
      "Direct listing and auto-verification. You must own the products (from your wardrobe or small purchases) and be willing to directly ship and handle your orders.",
  },
  {
    id: "influencer",
    label: "Influencer",
    color: "#F7246E",
    colorLight: "rgba(247,36,110,0.08)",
    colorBorder: "rgba(247,36,110,0.25)",
    guideline:
      "Requires a minimum of ~5K followers, good engagement, and preferably fashion-related content. Verification requires adding your profile link/username and a phone code cross-check. (One-time 24hr verification process)",
  },
  {
    id: "thrifter",
    label: "Thrifter",
    color: "#F7246E",
    colorLight: "rgba(247,36,110,0.08)",
    colorBorder: "rgba(247,36,110,0.25)",
    guideline:
      "Must upload real product photos, have a minimum of 5 items to start, and preferably an active social media page. Verification requires adding your store link/business name and an email/phone cross-check. (One-time 24hr verification process)",
  },
  {
    id: "designer",
    label: "Designer",
    color: "#F7246E",
    colorLight: "rgba(247,36,110,0.08)",
    colorBorder: "rgba(247,36,110,0.25)",
    guideline:
      "Must upload original designs/portfolio, have a minimum of 5 items to start (customization or stitching preferred). Verification requires adding your brand/boutique link, GST (if registered), and an email/phone cross-check. (One-time 24hr verification process)",
  },
];

export default function SellerTypePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [selectedType, setSelectedType] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const draft = getDraftListing();
    if (draft?.sellerType) {
      setSelectedType(draft.sellerType);
    }
  }, []);

  useEffect(() => {
    if (selectedType) {
      mergeDraftListing({ sellerType: selectedType });
    }
  }, [selectedType]);

  const isSelected = (id) => selectedType === id;

  const handleStartSelling = async () => {
    if (!selectedType) return;
    mergeDraftListing({ sellerType: selectedType });
    localStorage.setItem("seller_type", selectedType);

    if (user) {
      setSubmitting(true);
      try {
        await api.put("/auth/seller-profile", { sellerType: selectedType });
        router.push("/seller/onboarding/details");
      } catch (err) {
        toast.error(err.response?.data?.message || "Something went wrong");
      } finally {
        setSubmitting(false);
      }
    } else {
      router.push("/seller/onboarding/details");
    }
  };

  const openModal = (e, type) => {
    e.stopPropagation();
    setModalData(type);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setTimeout(() => setModalData(null), 200);
  };

  return (
    <>
      <div className="min-h-[calc(100dvh-80px)] bg-brand-light flex items-center justify-center p-4 font-roboto">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden p-6 sm:p-8 animate-slideUp">
          <div className="flex flex-col gap-8 sm:gap-10">
            {/* Header */}
            <div>
              <div className="flex items-center gap-4 mb-3 sm:mb-4 -ml-2">
                <button
                  onClick={() => router.back()}
                  className="w-10 h-10 rounded-full hover:bg-gray-50 flex items-center justify-center text-brand-dark transition-all"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M19 12H5" />
                    <path d="M12 19l-7-7 7-7" />
                  </svg>
                </button>
                <span className="text-[12px] font-bold text-brand-pink uppercase tracking-widest">
                  Step 1 of 6
                </span>
              </div>

              <h2 className="text-[26px] sm:text-[28px] font-extrabold text-brand-dark leading-tight">
                Seller Type
              </h2>

              <p className="text-[13px] sm:text-[14px] text-gray-500 font-medium">
                Select your category to customize your profile
              </p>
            </div>

            {/* Options */}
            <div className="flex flex-col gap-3 sm:gap-4">
              {SELLER_TYPES.map((type) => {
                const selected = isSelected(type.id);
                return (
                  <button
                    key={type.id}
                    onClick={() => setSelectedType(type.id)}
                    className="w-full h-[60px] sm:h-[64px] rounded-[24px] text-[15px] sm:text-[16px] font-bold transition-all duration-300 border-2 flex items-center justify-between px-6 sm:px-8 group"
                    style={{
                      backgroundColor: selected ? type.colorLight : "#fff",
                      borderColor: selected ? type.color : "#f3f4f6",
                      color: selected ? type.color : "#2F2F2F",
                      boxShadow: selected
                        ? `0 4px 14px ${type.colorBorder}`
                        : "0 1px 3px rgba(0,0,0,0.04)",
                      transform: selected ? "scale(1.02)" : "scale(1)",
                    }}
                  >
                    <span>{type.label}</span>
                    <span
                      onClick={(e) => openModal(e, type)}
                      className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 z-10"
                      style={{
                        backgroundColor: selected
                          ? `${type.color}15`
                          : "#f3f4f6",
                        color: selected ? type.color : "#9ca3af",
                      }}
                      title="View guidelines"
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 16v-4" />
                        <path d="M12 8h.01" />
                      </svg>
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Button */}
            <Button
              onClick={handleStartSelling}
              disabled={!selectedType || submitting}
              fullWidth
              className="h-[50px] sm:h-[54px] rounded-full font-bold text-[15px] sm:text-[16px] mt-2 sm:mt-4"
            >
              {submitting ? "Saving..." : "Start Selling"}
            </Button>
          </div>
        </div>
      </div>

      {/* Info Modal */}
      {modalData && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{
            opacity: modalVisible ? 1 : 0,
            transition: "opacity 0.2s ease",
            pointerEvents: modalVisible ? "auto" : "none",
          }}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeModal}
          />

          {/* Modal Content */}
          <div
            className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden"
            style={{
              transform: modalVisible ? "scale(1)" : "scale(0.95)",
              transition: "transform 0.2s ease",
            }}
          >
            {/* Accent bar */}
            <div
              className="h-1.5 w-full"
              style={{ backgroundColor: modalData.color }}
            />

            <div className="p-6">
              {/* Close button */}
              <button
                onClick={closeModal}
                className="absolute top-5 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 6L6 18" />
                  <path d="M6 6l12 12" />
                </svg>
              </button>

              {/* Icon + Title */}
              <div className="flex items-center gap-3 mb-3 pr-8">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{
                    backgroundColor: modalData.colorLight,
                    color: modalData.color,
                  }}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 16v-4" />
                    <path d="M12 8h.01" />
                  </svg>
                </div>
                <h3
                  className="text-xl font-bold"
                  style={{ color: modalData.color }}
                >
                  {modalData.label}
                </h3>
              </div>

              {/* Guideline Content */}
              <p className="text-gray-600 text-sm leading-relaxed pl-[52px]">
                {modalData.guideline}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
