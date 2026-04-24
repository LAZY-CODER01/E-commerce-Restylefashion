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
    description: "Sell from your personal Wadrobe\npreowned personal items",
    icon: "person",
    iconImage: "/seller-individual-person.png",
    iconImageTint: "#C9417A",
    iconWrapClass: "bg-[#FCEFF5]",
    iconClass: "text-[#C9417A]",
  },
  {
    id: "influencer",
    title: "Influencer Shop",
    description: "Pass on your looks to your fans!\nFashion creator with min. 10K followers",
    icon: "camera",
    iconWrapClass: "bg-[#FFF0E5]",
    iconClass: "text-[#E07A3A]",
  },
  {
    id: "thrifter",
    title: "Thrifters",
    description:
      "Sell your sourced drops!\nmedium to high inventory with regular restocking",
    icon: "person",
    iconImage: "/seller-thrifter-hanger.png",
    iconWrapClass: "bg-[#EBFBEF]",
    iconClass: "text-[#22A057]",
  },
  {
    id: "designer",
    title: "Designer",
    description: "Sell your own designs and new collection !\nOwn brand or label",
    icon: "briefcase",
    iconImage: "/seller-designer-dress.png",
    iconWrapClass: "bg-[#F0EBFF]",
    iconClass: "text-[#7C5CDB]",
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
      className={clsx("shrink-0", iconClass)}
      aria-hidden
    >
      {icon === "person" ? (
        <>
          <circle cx="12" cy="8" r="3.1" />
          <path d="M6 18.2c.8-2.9 3.1-4.4 6-4.4s5.2 1.5 6 4.4" />
        </>
      ) : null}
      {icon === "camera" ? (
        <>
          <path
            d="M3 9a2 2 0 0 1 2-2h.93a2 2 0 0 0 1.664-.89l.812-1.22A2 2 0 0 1 10.07 4h3.86a2 2 0 0 1 1.664.89l.812 1.22A2 2 0 0 0 17.07 7H19a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M15 13a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      ) : null}
      {icon === "briefcase" ? (
        <>
          <path
            d="M6.1 0.2H17.0V2.3H6.1V0.2Z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <rect
            x="2.2"
            y="2.3"
            width="19.6"
            height="18.6"
            rx="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      ) : null}
    </svg>
  );
}

function BenefitIcon({ icon, className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      className={clsx("shrink-0 text-[#121212]", className || "h-7 w-7")}
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
              : "border-gray-200 focus:border-gray-300 focus:ring-0",
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
    if (t === "influencer" || t === "thrifter" || t === "designer") {
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
        sellerType === "influencer" ||
        sellerType === "thrifter" ||
        sellerType === "designer"
          ? true
          : false,
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
    <div className="min-h-[calc(100dvh-80px)] w-full bg-[#F7F7F8] px-4 py-4 font-sans sm:px-6 sm:py-8">
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
              We&apos;ll customize your store experience
            </p>
          </div>
        </div>

        <div className="flex max-sm:min-h-0 flex-col gap-4 px-0 sm:gap-4">
          {SELLER_TYPES.map((type) => {
            const open = expandedId === type.id;
            return (
              <div
                key={type.id}
                className={clsx(
                  "overflow-hidden rounded-xl border bg-white shadow-sm transition-all duration-300 transform-gpu sm:rounded-2xl",
                  open
                    ? "border-brand-pink/40 shadow-md shadow-brand-pink/10"
                    : "border-gray-200 hover:-translate-y-1 hover:border-brand-pink/20 hover:shadow-md"
                )}
              >
                <button
                  type="button"
                  onClick={() => toggleExpand(type.id)}
                  className="flex min-h-0 w-full items-center gap-2 px-2.5 py-2 text-left sm:min-h-[118px] sm:gap-3 sm:px-5 sm:py-4"
                >
                  <span
                    className={clsx(
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg sm:h-14 sm:w-14 sm:rounded-xl",
                      type.iconWrapClass
                    )}
                  >
                    {type.iconImage ? (
                      <span className="grid size-5 shrink-0 place-items-center sm:size-7">
                        {type.iconImageTint ? (
                          <span
                            className="h-full w-full"
                            style={{
                              backgroundColor: type.iconImageTint,
                              WebkitMaskImage: `url(${type.iconImage})`,
                              WebkitMaskSize: "contain",
                              WebkitMaskPosition: "center",
                              WebkitMaskRepeat: "no-repeat",
                              maskImage: `url(${type.iconImage})`,
                              maskSize: "contain",
                              maskPosition: "center",
                              maskRepeat: "no-repeat",
                            }}
                            aria-hidden
                          />
                        ) : (
                          <img
                            src={type.iconImage}
                            alt={`${type.title} icon`}
                            className="!h-full !w-full !max-h-full !max-w-full !object-contain !object-center"
                          />
                        )}
                      </span>
                    ) : (
                      <span className="grid size-5 shrink-0 place-items-center sm:size-7">
                        <SellerTypeIcon
                          icon={type.icon}
                          iconClass={clsx(
                            "!h-full !w-full !min-h-0 !min-w-0",
                            type.iconClass
                          )}
                        />
                      </span>
                    )}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[12px] font-bold leading-tight text-brand-dark sm:text-[16px] sm:leading-snug">
                      {type.title}
                    </span>
                    <span className="mt-0.5 block whitespace-pre-line text-[10px] font-medium leading-snug text-slate-500 sm:mt-1 sm:text-[13px] sm:leading-relaxed">
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
                      <form onSubmit={handleContinue} className="flex flex-col gap-2.5 pt-1">
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
                                  "h-12 w-full rounded-xl border border-gray-200 bg-gray-50/50 pl-4 pr-24 text-sm font-normal text-gray-900 placeholder:text-gray-500 outline-none transition-all focus:border-gray-300 focus:ring-0",
                                  fieldErrors.instagram && formFieldErrorClass
                                )}
                              />
                              {(type.id === "influencer" ||
                                type.id === "thrifter" ||
                                type.id === "designer") && (
                                <button
                                  type="button"
                                  onClick={handleVerifyInstagram}
                                  disabled={form.instagramVerified}
                                  className={clsx(
                                    "absolute right-2 top-1/2 -translate-y-1/2 h-auto rounded-lg px-1 text-xs font-semibold transition bg-transparent",
                                    form.instagramVerified
                                      ? "cursor-not-allowed text-emerald-600"
                                      : "text-[#D95C95] hover:text-[#C94F88]"
                                  )}
                                >
                                  {form.instagramVerified ? "Verified" : "Verify"}
                                </button>
                              )}
                            </div>
                            <div className="min-h-[12px]">
                              {fieldErrors.instagram ? (
                                <span className="text-[12px] text-red-600 font-medium">
                                  {fieldErrors.instagram}
                                </span>
                              ) : null}
                            </div>
                          </div>
                        )}

                        {(type.id === "influencer" ||
                          type.id === "thrifter" ||
                          type.id === "designer") && (
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

                        <Button
                          type="submit"
                          fullWidth
                          disabled={submitting}
                          className="mt-1 h-12 rounded-full bg-[#FFF6FA] font-bold text-[#D95C95] !shadow-none [box-shadow:none] hover:bg-[#FFF6FA] hover:!shadow-none hover:[box-shadow:none] focus:!shadow-none focus:[box-shadow:none] active:!shadow-none active:[box-shadow:none]"
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
          <div className="grid grid-cols-4 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm sm:grid-cols-4 sm:rounded-2xl">
            {SELLER_BENEFITS.map((item, index) => (
              <div
                key={item.id}
                className={clsx(
                  "flex min-h-0 flex-col items-center justify-start gap-0.5 px-1 py-2 text-center sm:min-h-[148px] sm:gap-2 sm:px-3 sm:py-4",
                  index % 2 === 0 && "max-sm:border-r max-sm:border-gray-100",
                  index < 2 && "max-sm:border-b max-sm:border-gray-100",
                  index < 3 && "sm:border-r sm:border-gray-100"
                )}
              >
                <span className="flex h-6 w-6 items-center justify-center sm:h-10 sm:w-10">
                  {item.iconImage ? (
                    <img
                      src={item.iconImage}
                      alt={`${item.title} icon`}
                      className="h-5 w-5 object-contain sm:h-10 sm:w-10"
                    />
                  ) : (
                    <BenefitIcon
                      icon={item.icon}
                      className="h-4 w-4 sm:h-7 sm:w-7"
                    />
                  )}
                </span>
                <p className="line-clamp-2 text-[9px] font-bold leading-tight text-[#171717] sm:line-clamp-none sm:text-[15px] sm:font-bold sm:leading-snug">
                  {item.title}
                </p>
                <p className="line-clamp-2 text-[7px] font-medium leading-tight text-slate-500 sm:line-clamp-none sm:text-[12px] sm:leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
