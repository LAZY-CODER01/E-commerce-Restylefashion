"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import GppGoodOutlined from "@mui/icons-material/GppGoodOutlined";
import KeyboardArrowRightOutlinedIcon from "@mui/icons-material/KeyboardArrowRightOutlined";
import { toast } from "react-toastify";
import { useAuth } from "@/context/AuthContext";

/** Account Security rows — no leading icons; optional right label (e.g. 2FA “Off”). */
const ACCOUNT_SECURITY_ROWS = [
  {
    title: "Change Password",
    subtitle: "Update your account password",
    action: "password",
  },
  {
    title: "Change Phone Number",
    subtitle: "Update your registered phone number",
    action: "phone",
  },
  {
    title: "Change Email Address",
    subtitle: "Update your registered email address",
    action: "email",
  },
  {
    title: "Two-Factor Authentication",
    subtitle: "Add an extra layer of security",
    action: "2fa",
    trailingLabel: "Off",
  },
];

export default function ProfileSecurityPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (!user) router.replace("/auth?next=/profile/security");
  }, [loading, user, router]);

  const onComingSoon = () => toast.info("Coming soon.");

  if (loading || !user) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-[#F5F5F5] font-sans">
        <p className="animate-pulse text-[14px] font-medium text-gray-400">Loading…</p>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-[#F5F5F5] font-sans selection:bg-brand-pink/15 pb-24">
      {/* Header — match reference: back, title, shield badge */}
      <header className="sticky top-0 z-30 border-b border-gray-100 bg-white/95 backdrop-blur-sm">
        <div className="relative mx-auto flex h-14 max-w-[1440px] items-center justify-center px-4 md:h-[60px] md:px-9">
          <button
            type="button"
            onClick={() => router.push("/profile")}
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full p-2 text-[#000000] transition-colors hover:bg-gray-100 md:left-6"
            aria-label="Back to profile"
          >
            <ArrowBackOutlinedIcon sx={{ fontSize: 22 }} />
          </button>
          <h1 className="text-[17px] font-bold tracking-tight text-[#000000] md:text-[18px]">
            Security
          </h1>
          <span
            className="absolute right-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-[#F7246E]/10 md:right-8"
            aria-hidden
          >
            <GppGoodOutlined sx={{ fontSize: 24 }} className="text-[#F7246E]" />
          </span>
        </div>
      </header>

      <div className="mx-auto w-full max-w-[1440px] px-4 pt-6 md:px-9 md:pt-8">
        {/* Status */}
        <div className="mb-6 md:mb-8">
          <p className="text-[16px] font-bold leading-snug text-[#000000] md:text-[17px]">
            Your account is secure
          </p>
          <p className="mt-1 text-[13px] leading-snug text-gray-600 md:text-[14px]">
            Keep your account information safe and up to date.
          </p>
        </div>

        {/* Account Security */}
        <div className="mb-6 md:mb-8">
          <p className="mb-3 px-1 text-[15px] font-bold text-[#000000] md:mb-3.5">Account Security</p>
          <div className="overflow-hidden rounded-2xl border border-gray-200/90 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            {ACCOUNT_SECURITY_ROWS.map((row) => (
              <button
                key={row.action}
                type="button"
                onClick={onComingSoon}
                className="flex w-full cursor-pointer items-center gap-3 border-b border-gray-100 px-4 py-4 text-left transition-colors last:border-b-0 hover:bg-gray-50/90 active:bg-gray-50 md:gap-4 md:px-5 md:py-[18px]"
              >
                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span className="text-[15px] font-bold leading-snug tracking-tight text-[#000000] md:text-[16px]">
                    {row.title}
                  </span>
                  <span className="text-[13px] font-normal leading-snug text-gray-500">
                    {row.subtitle}
                  </span>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {row.trailingLabel ? (
                    <span className="text-[13px] font-medium text-gray-500">{row.trailingLabel}</span>
                  ) : null}
                  <KeyboardArrowRightOutlinedIcon className="text-gray-400" sx={{ fontSize: 22 }} aria-hidden />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Account Management */}
        <div>
          <p className="mb-3 px-1 text-[15px] font-bold text-[#000000] md:mb-3.5">Account Management</p>
          <div className="overflow-hidden rounded-2xl border border-gray-200/90 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <button
              type="button"
              onClick={onComingSoon}
              className="flex w-full cursor-pointer items-center gap-3 px-4 py-4 text-left transition-colors hover:bg-gray-50/90 active:bg-gray-50 md:gap-4 md:px-5 md:py-[18px]"
            >
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="text-[15px] font-bold leading-snug tracking-tight text-[#000000] md:text-[16px]">
                  Delete Account
                </span>
                <span className="text-[13px] font-normal leading-snug text-gray-500">
                  Permanently delete your account and data
                </span>
              </div>
              <KeyboardArrowRightOutlinedIcon className="shrink-0 text-gray-400" sx={{ fontSize: 22 }} aria-hidden />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
