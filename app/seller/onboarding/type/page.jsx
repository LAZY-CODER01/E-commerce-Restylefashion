"use client";

import React, { useState, useCallback, useRef } from "react";
import Button from "@/components/Button";
import Input, { formFieldErrorClass } from "@/components/Input";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import { toast } from "react-toastify";
import { getDraftListing, mergeDraftListing } from "@/lib/draftListing";
import clsx from "clsx";

const SELLER_TYPES = [
  {
    id: "individual",
    title: "Individual",
    emoji: "👤",
    tooltip:
      "Sell from your personal Wardrobe • Preowned personal items",
  },
  {
    id: "influencer",
    title: "Influencer Shop",
    emoji: "📸",
    tooltip:
      "Pass on your looks to your fans! • Public Fashion Creator • Minimum ~10K followers",
  },
  {
    id: "thrifter",
    title: "Thrifters & Preloved",
    emoji: "♻️",
    tooltip:
      "Sell your sourced drops! • Medium to high inventory • Regular restocking patterns",
  },
  {
    id: "designer",
    title: "Designer",
    emoji: "👗",
    tooltip:
      "Sell your own designs and new collection! • Own brand or label",
  },
];

function emptyForm() {
  return {
    fullName: "",
    instagram: "",
    gst: "",
    otp: "",
    otpSent: false,
    instagramVerified: false,
  };
}

function InfoButton({ open, onToggle, children }) {
  return (
    <div className="relative shrink-0">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
        className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-brand-pink/80 ring-[0px] ring-brand-pink/30 transition hover:bg-brand-pink/10 hover:text-brand-pink focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-1 focus-visible:outline-brand-pink/40"
        aria-label="Category details"
        aria-expanded={open}
      >
        <span className="text-[12px] font-bold leading-none">i</span>
      </button>
      {open ? (
        <div
          role="tooltip"
          className="absolute right-0 top-[calc(100%+6px)] z-20 w-[min(100vw-3rem,18rem)] rounded-xl border border-gray-200 bg-white p-3 text-left text-[12px] font-medium leading-snug text-gray-600 shadow-lg"
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </div>
      ) : null}
    </div>
  );
}

function OtpFourBoxes({ value, onChange, onFilled, disabled, hasError }) {
  const refs = useRef([]);
  const digits = (value || "").slice(0, 4).split("");
  while (digits.length < 4) digits.push("");

  const setAt = (index, char) => {
    const d = String(char).replace(/\D/g, "").slice(-1);
    let next = (value || "").replace(/\D/g, "");
    const arr = next.split("");
    while (arr.length < 4) arr.push("");
    arr[index] = d;
    next = arr.join("").slice(0, 4);
    onChange(next);
    if (d && index < 3) {
      refs.current[index + 1]?.focus();
    }
    if (next.length === 4) {
      onFilled?.(next);
    }
  };

  return (
    <div className="flex gap-2 sm:gap-3 pt-1">
      {[0, 1, 2, 3].map((i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={1}
          disabled={disabled}
          value={digits[i] || ""}
          onChange={(e) => setAt(i, e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Backspace" && !digits[i] && i > 0) {
              refs.current[i - 1]?.focus();
            }
          }}
          onPaste={(e) => {
            e.preventDefault();
            const t = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 4);
            if (!t) return;
            onChange(t);
            if (t.length === 4) onFilled?.(t);
          }}
          className={clsx(
            "h-12 w-11 shrink-0 rounded-xl border bg-gray-50/50 text-center text-base font-semibold text-gray-900 outline-none transition-all sm:h-12 sm:w-12",
            hasError
              ? formFieldErrorClass
              : "border-gray-200 focus:border-rose-500 focus:ring-1 focus:ring-rose-500",
            disabled && "opacity-50"
          )}
        />
      ))}
    </div>
  );
}

export default function SellerTypePage() {
  const router = useRouter();
  const { user, setUser } = useAuth();
  const [expandedId, setExpandedId] = useState(null);
  const [infoOpenId, setInfoOpenId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const loadFormForType = useCallback((typeId) => {
    const draft = getDraftListing();
    setForm({
      fullName: draft?.sellerProfile?.fullName?.trim() || "",
      instagram:
        draft?.sellerProfile?.socialMediaName?.trim() ||
        draft?.sellerProfile?.instagramId?.trim() ||
        "",
      gst: draft?.sellerProfile?.gstNumber?.trim() || "",
      otp: "",
      otpSent: false,
      instagramVerified:
        typeId === "influencer" || typeId === "thrifter"
          ? Boolean(draft?.sellerProfile?.otpVerified)
          : false,
    });
    setFieldErrors({});
  }, []);

  const toggleExpand = (id) => {
    setInfoOpenId(null);
    setExpandedId((cur) => {
      const next = cur === id ? null : id;
      if (next) loadFormForType(next);
      return next;
    });
  };

  const handleVerifyInstagram = () => {
    if (!form.instagram.trim()) {
      toast.warn("Add your Instagram handle first.");
      return;
    }
    if (form.instagramVerified) return;
    toast.success("OTP sent to your registered mobile number");
    setForm((f) => ({ ...f, otpSent: true, otp: "" }));
    setFieldErrors((e) => {
      const n = { ...e };
      delete n.otp;
      return n;
    });
  };

  const completeOtp = () => {
    setForm((f) => ({ ...f, instagramVerified: true }));
    toast.success("Verified");
  };

  const validate = () => {
    const e = {};
    const t = expandedId;
    if (!form.fullName.trim()) e.fullName = "Please fill in this field.";
    if (t === "individual") {
      setFieldErrors(e);
      return Object.keys(e).length === 0;
    }
    if (t === "influencer" || t === "thrifter" || t === "designer") {
      if (!form.instagram.trim()) e.instagram = "Please fill in this field.";
    }
    if (t === "influencer" || t === "thrifter") {
      if (!form.instagramVerified) e.otp = "Please verify with the code sent to your phone.";
    }
    setFieldErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleContinue = async (ev) => {
    ev.preventDefault();
    if (!expandedId) return;
    if (!validate()) {
      toast.warn("Please complete the required fields.");
      return;
    }

    const sellerType = expandedId;
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
    router.push("/seller/products/new");
  };

  return (
    <div className="min-h-[calc(100dvh-80px)] w-full bg-brand-light px-4 pb-12 pt-10 font-sans sm:flex sm:items-center sm:justify-center sm:px-4 sm:pb-10 sm:pt-4">
      <div className="mx-auto w-full max-w-md animate-fadeIn py-3 sm:py-4">
        <div className="relative mb-5 px-1 text-center sm:mb-6 sm:px-0 sm:text-left sm:pl-1">
          <button
            type="button"
            onClick={() => router.back()}
            className="absolute left-1 top-0 inline-flex h-10 w-10 items-center justify-center rounded-full text-brand-dark transition hover:bg-white/80 sm:static sm:mb-4"
            aria-label="Back"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="px-10 pt-1 text-[22px] font-extrabold leading-tight text-brand-dark sm:px-0 sm:pt-0 sm:text-[28px]">
            Pick your selling style
          </h1>
          <p className="mt-2 px-3 text-[13px] font-medium text-gray-500 sm:px-0 sm:text-[14px]">
            Create your shop — tap a category to continue
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {SELLER_TYPES.map((type) => {
            const open = expandedId === type.id;
            const infoOpen = infoOpenId === type.id;
            return (
              <div
                key={type.id}
                className={clsx(
                  "rounded-2xl border bg-white shadow-sm transition-[box-shadow,border-color]",
                  open ? "border-brand-pink/40 shadow-md shadow-brand-pink/10" : "border-gray-200"
                )}
              >
                <div className="flex w-full items-start gap-3 px-3.5 py-3.5 sm:px-5 sm:py-4">
                  <button
                    type="button"
                    onClick={() => toggleExpand(type.id)}
                    className="flex min-w-0 flex-1 items-start gap-3 text-left"
                  >
                    <span className="text-xl leading-none pt-0.5" aria-hidden>
                      {type.emoji}
                    </span>
                    <span className="block min-w-0 text-[14px] font-bold leading-snug text-brand-dark sm:text-[16px]">
                      {type.title}
                    </span>
                  </button>
                  <InfoButton
                    open={infoOpen}
                    onToggle={() =>
                      setInfoOpenId((id) => (id === type.id ? null : type.id))
                    }
                  >
                    {type.tooltip}
                  </InfoButton>
                </div>

                <div
                  className={clsx(
                    "grid transition-[grid-template-rows] duration-300 ease-out",
                    open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  )}
                >
                  <div className="overflow-hidden">
                    {open ? (
                    <div className="border-t border-gray-100 px-4 pb-5 pt-2 sm:px-5">
                      <form onSubmit={handleContinue} className="flex flex-col gap-4 pt-2">
                        <Input
                          id={`fullName-${type.id}`}
                          label="Full Name"
                          placeholder="As per your ID"
                          value={form.fullName}
                          onChange={(e) => {
                            setForm((f) => ({ ...f, fullName: e.target.value }));
                            setFieldErrors((er) => {
                              const n = { ...er };
                              delete n.fullName;
                              return n;
                            });
                          }}
                          error={fieldErrors.fullName}
                        />

                        {(type.id === "influencer" ||
                          type.id === "thrifter" ||
                          type.id === "designer") && (
                          <Input
                            id={`instagram-${type.id}`}
                            label="Instagram Handle"
                            placeholder="@username"
                            value={form.instagram}
                            onChange={(e) => {
                              setForm((f) => ({
                                ...f,
                                instagram: e.target.value,
                                instagramVerified: false,
                                otp: "",
                                otpSent: false,
                              }));
                              setFieldErrors((er) => {
                                const n = { ...er };
                                delete n.instagram;
                                delete n.otp;
                                return n;
                              });
                            }}
                            error={fieldErrors.instagram}
                          />
                        )}

                        {type.id === "designer" && (
                          <Input
                            id={`gst-${type.id}`}
                            label="GST (optional)"
                            placeholder="GSTIN if registered"
                            value={form.gst}
                            onChange={(e) =>
                              setForm((f) => ({ ...f, gst: e.target.value }))
                            }
                          />
                        )}

                        {(type.id === "influencer" || type.id === "thrifter") && (
                          <div className="flex flex-col gap-2">
                            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                              <Button
                                type="button"
                                variant="outlined"
                                className="shrink-0 rounded-xl px-4 font-bold"
                                onClick={handleVerifyInstagram}
                                disabled={form.instagramVerified}
                              >
                                Verify
                              </Button>
                              {form.instagramVerified ? (
                                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600">
                                  <svg
                                    className="h-5 w-5 shrink-0"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    aria-hidden
                                  >
                                    <circle cx="12" cy="12" r="10" fill="#10b981" />
                                    <path
                                      d="M8 12.5l2.5 2.5L16 9"
                                      stroke="white"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                  </svg>
                                  Verified
                                </span>
                              ) : null}
                            </div>

                            {form.otpSent && !form.instagramVerified ? (
                              <div className="relative isolate pt-1">
                                <p className="mb-2 text-[12px] font-medium text-gray-600">
                                  Enter the 4-digit code
                                </p>
                                <OtpFourBoxes
                                  value={form.otp}
                                  onChange={(otp) =>
                                    setForm((f) => ({ ...f, otp }))
                                  }
                                  disabled={form.instagramVerified}
                                  onFilled={() => completeOtp()}
                                  hasError={Boolean(fieldErrors.otp)}
                                />
                                {fieldErrors.otp ? (
                                  <p className="mt-2 text-[12px] font-medium text-red-600" role="alert">
                                    {fieldErrors.otp}
                                  </p>
                                ) : null}
                              </div>
                            ) : null}
                          </div>
                        )}

                        <Button
                          type="submit"
                          fullWidth
                          disabled={submitting}
                          className="mt-2 h-12 rounded-full font-bold"
                        >
                          {submitting
                            ? "Saving..."
                            : "Continue to Product Listing"}
                        </Button>
                      </form>
                    </div>
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
