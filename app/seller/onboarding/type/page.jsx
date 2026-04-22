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
    description:
      "• Sell from your personal Wadrobe\n• preowned personal items",
    icon: "person",
    iconWrapClass: "bg-[#FCEFF5]",
    iconClass: "text-[#C9417A]",
  },
  {
    id: "influencer",
    title: "Influencer Shop",
    description:
      "• Pass on your looks to yours fans!\n• Public Fashion Creator\n• Minimum ~10K followers",
    icon: "star",
    iconWrapClass: "bg-[#F3EEFF]",
    iconClass: "text-[#6E4BC9]",
  },
  {
    id: "thrifter",
    title: "Thrifters",
    description:
      "• Sell your sourced drops!\n• medium to high inventory\n• regular restocking patterns",
    icon: "hanger",
    iconImage: "/thrifter-hanger.png",
    iconWrapClass: "bg-[#EBFBEF]",
    iconClass: "text-[#22A057]",
  },
  {
    id: "designer",
    title: "Designer / Brand",
    description:
      "• Sell your own designs and new collection !\n• Own brand or label",
    icon: "crown",
    iconWrapClass: "bg-[#FFF8E8]",
    iconClass: "text-[#D5A22A]",
  },
];

const SELLER_BENEFITS = [
  {
    id: "sell-minutes",
    title: "Sell in minutes",
    description: "Snap it. Sell it. Cash it.",
    iconImage: "/feature-sell-minutes.png",
    icon: "headset",
  },
  {
    id: "growth",
    title: "Grow Your Business",
    description: "Tools & insights to scale faster",
    icon: "growth",
  },
  {
    id: "trusted",
    title: "Trusted by Sellers",
    description: "Join thousands of successful sellers",
    icon: "badge",
  },
  {
    id: "secure",
    title: "Safe & Secure",
    description: "Your data and payments are always protected",
    icon: "shield",
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

function SellerTypeIcon({ icon, iconClass }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      className={clsx("h-7 w-7", iconClass)}
      aria-hidden
    >
      {icon === "person" ? (
        <>
          <circle cx="12" cy="8" r="3.1" />
          <path d="M6 18.2c.8-2.9 3.1-4.4 6-4.4s5.2 1.5 6 4.4" />
        </>
      ) : null}
      {icon === "star" ? (
        <>
          <rect x="5" y="6" width="14" height="13" rx="2.8" />
          <path d="M12 9.1l1.15 2.3 2.55.37-1.85 1.8.44 2.54L12 14.9l-2.29 1.2.44-2.54-1.85-1.8 2.55-.37L12 9.1z" />
        </>
      ) : null}
      {icon === "hanger" ? (
        <>
          <path
            d="M12 9.3v-1.1a2.2 2.2 0 1 0-2.2-2.2"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 8.2 5.1 12.2a2.2 2.2 0 0 0 1.1 4.1h11.6a2.2 2.2 0 0 0 1.1-4.1L12 8.2z"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      ) : null}
      {icon === "crown" ? (
        <>
          <path d="M4.8 18.5h14.4l-1.4-8-4.1 3.4L12 8.7l-1.7 5.2-4.1-3.4-1.4 8z" />
          <path d="M4.8 18.5h14.4" />
        </>
      ) : null}
    </svg>
  );
}

function BenefitIcon({ icon }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      className="h-7 w-7 text-[#121212]"
      aria-hidden
    >
      {icon === "headset" ? (
        <>
          <path d="M4 13v2.4c0 1.7 1.3 3 3 3h1.1v-5.8H7a3 3 0 0 0-3 3.4z" />
          <path d="M20 13v2.4c0 1.7-1.3 3-3 3h-1.1v-5.8H17a3 3 0 0 1 3 3.4z" />
          <path d="M5 12a7 7 0 0 1 14 0" />
        </>
      ) : null}
      {icon === "growth" ? (
        <>
          <path d="M4 16l5-5 3.2 3.2L20 7.5" />
          <path d="M15.8 7.5H20v4.2" />
        </>
      ) : null}
      {icon === "badge" ? (
        <>
          <circle cx="12" cy="9.5" r="4.8" />
          <path d="M10 14.2l-1 4 3-1.7 3 1.7-1-4" />
          <path d="M10.5 9.6l1 .7 1.1-.7-.4 1.2 1 .7h-1.3l-.4 1.2-.4-1.2H9.8l1-.7-.3-1.2z" />
        </>
      ) : null}
      {icon === "shield" ? (
        <>
          <path d="M12 4.8 5.8 7.1V12c0 4 2.6 6.8 6.2 7.9 3.6-1.1 6.2-3.9 6.2-7.9V7.1L12 4.8z" />
          <path d="m9.5 12 1.7 1.7L14.8 10" />
        </>
      ) : null}
    </svg>
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
    <div className="min-h-[calc(100dvh-80px)] w-full bg-[#F7F7F8] px-4 py-8 font-sans sm:px-6">
      <div className="mx-auto w-full max-w-5xl animate-fadeIn">
        <div className="space-y-6">
          <div className="relative h-[220px] overflow-hidden rounded-3xl bg-[#FCE9F2] shadow-sm sm:h-[290px]">
          <button
            type="button"
            onClick={() => router.back()}
            className="absolute left-4 top-4 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-brand-dark backdrop-blur-sm transition hover:bg-white"
            aria-label="Back"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
          <img
            src="/seller-onboarding-hero.png"
            alt="Seller onboarding"
            className="absolute inset-0 h-full w-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#F7EDF3]/95 via-[#F7EDF3]/75 to-transparent" />
          <div className="relative z-[1] flex h-full max-w-[360px] flex-col justify-end px-4 pb-5 sm:max-w-[500px] sm:px-6 sm:pb-7">
            <h1 className="text-[40px] font-semibold leading-[0.96] tracking-[-0.02em] text-[#101010] sm:text-[45px]">
              Pick your
              <br />
              <span className="text-[#E84D97]">selling</span> style
            </h1>
            <p className="mt-3 text-[12px] font-normal leading-[1.45] text-slate-600 sm:mt-4 sm:max-w-[540px] sm:text-[17px] sm:leading-[1.3]">
              Tell us what best describes you.
              <br />
              We&apos;ll customize your shop experience
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4 px-0">
          {SELLER_TYPES.map((type) => {
            const open = expandedId === type.id;
            return (
              <div
                key={type.id}
                className={clsx(
                  "overflow-hidden rounded-2xl border bg-white shadow-sm transition-all duration-300 transform-gpu",
                  open
                    ? "border-brand-pink/40 shadow-md shadow-brand-pink/10"
                    : "border-gray-200 hover:-translate-y-1 hover:border-brand-pink/20 hover:shadow-md"
                )}
              >
                <button
                  type="button"
                  onClick={() => toggleExpand(type.id)}
                  className="flex min-h-[118px] w-full items-center gap-3 px-3.5 py-3.5 text-left sm:px-5 sm:py-4"
                >
                  <span
                    className={clsx(
                      "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl sm:h-14 sm:w-14",
                      type.iconWrapClass
                    )}
                  >
                    {type.iconImage ? (
                      <img
                        src={type.iconImage}
                        alt={`${type.title} icon`}
                        className="h-7 w-7 object-contain"
                      />
                    ) : (
                      <SellerTypeIcon icon={type.icon} iconClass={type.iconClass} />
                    )}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[14px] font-bold leading-snug text-brand-dark sm:text-[16px]">
                      {type.title}
                    </span>
                    <span className="mt-1 block whitespace-pre-line text-[12px] font-medium leading-relaxed text-slate-500 sm:text-[13px]">
                      {type.description}
                    </span>
                  </span>
                  <span
                    className={clsx(
                      "shrink-0 text-gray-400 transition-transform duration-300",
                      open ? "rotate-90" : "rotate-0"
                    )}
                    aria-hidden
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                      <path d="M9 6l6 6-6 6" />
                    </svg>
                  </span>
                </button>

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
                          placeholder="Full Name"
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
                          <div className="w-full">
                            <div className="relative w-full">
                              <input
                                id={`instagram-${type.id}`}
                                type="text"
                                placeholder="Instagram Handle"
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
                                className={clsx(
                                  "h-12 w-full rounded-xl border border-gray-200 bg-gray-50/50 pl-4 pr-24 text-sm font-normal text-gray-900 placeholder:text-gray-500 outline-none transition-all focus:border-rose-500 focus:ring-1 focus:ring-rose-500",
                                  fieldErrors.instagram && formFieldErrorClass
                                )}
                              />
                              {(type.id === "influencer" || type.id === "thrifter") && (
                                <button
                                  type="button"
                                  onClick={handleVerifyInstagram}
                                  disabled={form.instagramVerified}
                                  className={clsx(
                                    "absolute right-1.5 top-1.5 h-9 rounded-lg px-3 text-xs font-semibold transition",
                                    form.instagramVerified
                                      ? "cursor-not-allowed bg-emerald-100 text-emerald-600"
                                      : "bg-[#FCEFF5] text-[#C9417A] hover:bg-[#FBE4EF]"
                                  )}
                                >
                                  {form.instagramVerified ? "Verified" : "Verify"}
                                </button>
                              )}
                            </div>
                            <div className="min-h-[18px]">
                              {fieldErrors.instagram ? (
                                <span className="text-[12px] text-red-600 font-medium">
                                  {fieldErrors.instagram}
                                </span>
                              ) : null}
                            </div>
                          </div>
                        )}

                        {type.id === "designer" && (
                          <Input
                            id={`gst-${type.id}`}
                            placeholder="GST (optional)"
                            value={form.gst}
                            onChange={(e) =>
                              setForm((f) => ({ ...f, gst: e.target.value }))
                            }
                          />
                        )}

                        {(type.id === "influencer" || type.id === "thrifter") && (
                          <div className="flex flex-col gap-2">
                            {form.otpSent && !form.instagramVerified ? (
                              <div className="relative isolate pt-1">
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
        <div>
          <div className="grid grid-cols-2 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm sm:grid-cols-4">
            {SELLER_BENEFITS.map((item, index) => (
              <div
                key={item.id}
                className={clsx(
                  "flex min-h-[132px] flex-col items-center justify-start gap-2 px-3 py-4 text-center sm:min-h-[148px]",
                  index % 2 === 0 && "border-r border-gray-100",
                  index < 2 && "border-b border-gray-100",
                  index !== SELLER_BENEFITS.length - 1 && "sm:border-r sm:border-gray-100",
                  "sm:border-b-0"
                )}
              >
                <span className="flex h-10 w-10 items-center justify-center">
                  {item.iconImage ? (
                    <img
                      src={item.iconImage}
                      alt={`${item.title} icon`}
                      className="h-15 w-15 object-contain"
                    />
                  ) : (
                    <BenefitIcon icon={item.icon} />
                  )}
                </span>
                <p className="text-[15px] font-bold leading-snug text-[#171717]">
                  {item.title}
                </p>
                <p className="text-[12px] font-medium leading-relaxed text-slate-500">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>

          <p className="pb-2 text-center text-[13px] font-medium text-[#4A4A4A] sm:text-[13px]">
            Not sure yet? You can{" "}
            <span className="font-semibold text-[#D8588E]">change this later.</span>
          </p>
        </div>
      </div>
    </div>
  );
}
