"use client";

import React, { useState, useCallback } from "react";
import Button from "@/components/Button";
import Input from "@/components/Input";
import ValidationTooltip from "@/components/ValidationTooltip";
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
      "Must upload real product photos, have a minimum of 5 items to start, and preferably an active social media page. Verification requires adding your store link and an email/phone cross-check. (One-time 24hr verification process)",
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

function emptyForm() {
  return {
    fullName: "",
    instagram: "",
    otp: "",
    gst: "",
    otpSent: false,
  };
}

export default function SellerTypePage() {
  const router = useRouter();
  const { user, setUser } = useAuth();
  const [modalType, setModalType] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [modalErrors, setModalErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const openModal = useCallback((type) => {
    const draft = getDraftListing();
    setModalType(type);
    setForm({
      fullName: draft?.sellerProfile?.fullName?.trim() || "",
      instagram:
        draft?.sellerProfile?.socialMediaName?.trim() ||
        draft?.sellerProfile?.instagramId?.trim() ||
        "",
      otp: "",
      gst: draft?.sellerProfile?.gstNumber?.trim() || "",
      otpSent: false,
    });
    setModalErrors({});
    setModalOpen(true);
  }, []);

  const closeModal = () => {
    setModalOpen(false);
    setTimeout(() => {
      setModalType(null);
      setModalErrors({});
    }, 200);
  };

  const handleSendOtp = () => {
    toast.success("OTP sent to your registered mobile number");
    setForm((f) => ({ ...f, otpSent: true }));
    setModalErrors((e) => {
      const next = { ...e };
      delete next.otp;
      return next;
    });
  };

  const validateModal = () => {
    if (!modalType) return false;
    const e = {};
    const t = modalType.id;

    if (!form.fullName.trim()) {
      e.fullName = "Please fill in this field.";
    }

    if (t === "influencer" || t === "thrifter" || t === "designer") {
      if (!form.instagram.trim()) {
        e.instagram = "Please fill in this field.";
      }
    }

    if (t === "influencer" || t === "thrifter") {
      if (!form.otpSent) {
        e.otp = "Please request an OTP, then fill in this field.";
      } else if (!/^\d{6}$/.test(form.otp.trim())) {
        e.otp = "Please fill in this field.";
      }
    }

    setModalErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleContinueToListing = async (ev) => {
    ev.preventDefault();
    if (!modalType) return;
    if (!validateModal()) {
      toast.warn("Please complete the required fields.");
      return;
    }

    const sellerType = modalType.id;
    const profile = {
      fullName: form.fullName.trim(),
      businessName: "",
      socialMediaName:
        sellerType === "influencer" ||
        sellerType === "thrifter" ||
        sellerType === "designer"
          ? form.instagram.trim()
          : "",
      gstNumber: sellerType === "designer" ? form.gst.trim() : "",
      otpVerified:
        sellerType === "influencer" || sellerType === "thrifter" ? true : false,
    };

    mergeDraftListing({ sellerType, sellerProfile: profile });
    localStorage.setItem("seller_type", sellerType);

    if (user) {
      setSubmitting(true);
      try {
        const { data } = await api.put("/auth/seller-profile", {
          sellerType,
          businessName: "",
          instagramId: profile.socialMediaName,
          fullName: profile.fullName,
        });
        if (data.token) {
          localStorage.setItem("restyle_token", data.token);
          setUser(data);
        }
      } catch (err) {
        toast.error(err.response?.data?.message || "Could not save seller profile");
        setSubmitting(false);
        return;
      } finally {
        setSubmitting(false);
      }
    }

    toast.success("Profile saved. Continue with your listing.");
    closeModal();
    router.push("/seller/products/new");
  };

  return (
    <>
      <div className="min-h-[calc(100dvh-80px)] bg-brand-light flex items-center justify-center p-4 font-roboto">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden p-6 sm:p-8 animate-slideUp">
          <div className="flex flex-col gap-8 sm:gap-10">
            <div>
              <div className="flex items-center gap-4 mb-3 sm:mb-4 -ml-2">
                <button
                  type="button"
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
                Tap a category to continue — a form will open for your details
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:gap-4">
              {SELLER_TYPES.map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => openModal(type)}
                  className="w-full h-[60px] sm:h-[64px] rounded-[24px] text-[15px] sm:text-[16px] font-bold transition-all duration-300 border-2 flex items-center justify-center px-6 sm:px-8 text-left hover:scale-[1.01] active:scale-[0.99]"
                  style={{
                    backgroundColor: type.colorLight,
                    borderColor: type.colorBorder,
                    color: "#2F2F2F",
                    boxShadow: "0 4px 14px rgba(247,36,110,0.08)",
                  }}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {modalType && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{
            opacity: modalOpen ? 1 : 0,
            transition: "opacity 0.2s ease",
            pointerEvents: modalOpen ? "auto" : "none",
          }}
        >
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeModal}
            aria-hidden
          />

          <div
            className="relative w-full max-w-md max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl"
            style={{
              transform: modalOpen ? "scale(1)" : "scale(0.95)",
              transition: "transform 0.2s ease",
            }}
          >
            <div
              className="h-1.5 w-full sticky top-0 z-10"
              style={{ backgroundColor: modalType.color }}
            />

            <form
              onSubmit={handleContinueToListing}
              className="p-6 pb-8 flex flex-col gap-5"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{
                      backgroundColor: modalType.colorLight,
                      color: modalType.color,
                    }}
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                  <div>
                    <h3
                      className="text-lg font-bold leading-tight"
                      style={{ color: modalType.color }}
                    >
                      {modalType.label}
                    </h3>
                    <p className="text-[12px] text-gray-500 mt-1 leading-snug">
                      {modalType.guideline}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={closeModal}
                  className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 shrink-0"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path d="M18 6L6 18" />
                    <path d="M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <Input
                id="modal-fullName"
                label="Full Name"
                placeholder="As per your ID"
                value={form.fullName}
                onChange={(e) =>
                  setForm((f) => ({ ...f, fullName: e.target.value }))
                }
                error={modalErrors.fullName}
                tooltipError
              />

              {(modalType.id === "influencer" ||
                modalType.id === "thrifter" ||
                modalType.id === "designer") && (
                <Input
                  id="modal-instagram"
                  label="Instagram Handle"
                  placeholder="@username"
                  value={form.instagram}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, instagram: e.target.value }))
                  }
                  error={modalErrors.instagram}
                  tooltipError
                />
              )}

              {(modalType.id === "influencer" ||
                modalType.id === "thrifter") && (
                <div className="flex w-full flex-col gap-1.5">
                  <label
                    htmlFor="modal-otp"
                    className="text-[14px] font-medium text-brand-dark"
                  >
                    OTP verification
                  </label>
                  <div className="relative isolate w-full">
                    <div className="flex w-full flex-col gap-2 md:flex-row md:items-center md:gap-3">
                      <input
                        id="modal-otp"
                        type="text"
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        maxLength={6}
                        placeholder="6-digit code"
                        value={form.otp}
                        onChange={(e) => {
                          setForm((f) => ({
                            ...f,
                            otp: e.target.value.replace(/\D/g, "").slice(0, 6),
                          }));
                          setModalErrors((prev) => {
                            if (!prev.otp) return prev;
                            const next = { ...prev };
                            delete next.otp;
                            return next;
                          });
                        }}
                        className="min-h-[52px] w-full flex-1 rounded-xl border border-gray-200 bg-brand-light px-4 py-3.5 text-[15px] text-brand-dark outline-none transition-all placeholder:text-gray-400 focus:border-brand-pink focus:shadow-[0_0_0_3px_rgba(247,36,110,0.1)] md:min-w-0"
                      />
                      <Button
                        type="button"
                        variant="outlined"
                        className="h-[52px] w-full shrink-0 rounded-xl px-5 font-bold whitespace-nowrap md:mt-0 md:w-auto md:min-w-[132px]"
                        onClick={handleSendOtp}
                      >
                        Send OTP
                      </Button>
                    </div>
                    {modalErrors.otp && (
                      <ValidationTooltip message={modalErrors.otp} floating />
                    )}
                  </div>
                  <p className="text-[11px] text-gray-500">
                    Tap Send OTP, then enter the code you receive on your phone.
                  </p>
                </div>
              )}

              {modalType.id === "designer" && (
                <Input
                  id="modal-gst"
                  label="GST (optional)"
                  placeholder="GSTIN if registered"
                  value={form.gst}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, gst: e.target.value }))
                  }
                />
              )}

              <Button
                type="submit"
                fullWidth
                disabled={submitting}
                className="h-[50px] rounded-full font-bold text-[15px] mt-2"
              >
                {submitting ? "Saving..." : "Continue to Product Listing"}
              </Button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
