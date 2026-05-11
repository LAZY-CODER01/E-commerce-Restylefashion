"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import KeyboardArrowRightOutlinedIcon from "@mui/icons-material/KeyboardArrowRightOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import { toast } from "react-toastify";
import { useAuth } from "@/context/AuthContext";

/** First name + optional last initial for greeting */
function greetingName(fullName) {
  if (!fullName?.trim()) return "there";
  return fullName.trim().split(/\s+/)[0];
}

/** Two-letter avatar initials */
function initialsFromName(fullName) {
  if (!fullName?.trim()) return "U";
  const p = fullName.trim().split(/\s+/).filter(Boolean);
  if (p.length >= 2) return `${p[0][0]}${p[1][0]}`.toUpperCase();
  const w = p[0];
  return w.length >= 2 ? w.slice(0, 2).toUpperCase() : `${w[0]}`.toUpperCase();
}

/** Sectioned menu: chevron-right on each row (no left icons). */

const PROFILE_SECTIONS = [
  {
    label: "ACTIVITY",
    items: [
      {
        title: "Wishlist",
        subtitle: "Your saved favorite finds",
        href: "/wishlist",
      },
      {
        title: "Recently Viewed",
        subtitle: "Items you recently explored",
        href: "/profile/recently-viewed",
      },
    ],
  },
  {
    label: "ORDERS",
    items: [
      {
        title: "Orders",
        subtitle: "Track and manage your orders",
        href: "/my-orders",
      },
    ],
  },
  {
    label: "ACCOUNT",
    items: [
      {
        title: "Saved address",
        subtitle: "Manage your delivery addresses",
        href: "/profile/address",
      },
      {
        title: "Saved payment method",
        subtitle: "Manage your saved payment methods",
        href: "/profile/payment-methods",
      },
      {
        title: "Security",
        subtitle: "Password, phone, email and two-factor authentication",
        href: "/profile/security",
      },
      {
        title: "Wallet",
        subtitle: "View balance, transactions and more",
        hrefSeller: "/seller/wallet",
        comingSoonForBuyer: true,
      },
      {
        title: "Following",
        subtitle: "People and stores you follow",
        href: "/profile/following",
      },
      {
        title: "Seller Profile",
        subtitle: "Manage your seller page, vacation mode, and sharing",
        hrefSeller: "/seller/profile",
        sellerOnly: true,
      },
      {
        title: "My Store",
        subtitle: "Manage your store and listings",
        hrefSeller: "/profile/listings",
        sellerOnly: true,
      },
      {
        title: "Profile Details",
        subtitle: "View and edit your profile details",
        href: "/profile/details",
      },
    ],
  },
  {
    label: "SUPPORT",
    items: [
      {
        title: "Help & Support",
        subtitle: "Orders, deliveries, payments & account help",
        href: "/profile/help",
      },
    ],
  },
];

export default function UserProfile() {
  const router = useRouter();
  const { user, logout, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (!user) router.replace("/auth?next=/profile");
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-[#F5F5F5] font-sans">
        <p className="animate-pulse text-[14px] font-medium text-gray-400">Loading…</p>
      </div>
    );
  }

  const displayName = user?.fullName?.trim() || "";
  const firstName = greetingName(displayName || "");
  const isSeller = user?.role === "Seller" || user?.role === "Influencer";

  const resolveHref = (item) => {
    if (item.comingSoon) return null;
    if (item.comingSoonForBuyer && !isSeller) return null;
    if (item.hrefSeller && item.hrefBuyer) return isSeller ? item.hrefSeller : item.hrefBuyer;
    if (item.hrefSeller && isSeller) return item.hrefSeller;
    return item.href ?? null;
  };

  const handleRowClick = (item) => {
    if (item.comingSoon) {
      toast.info("Coming soon.");
      return;
    }
    if (item.comingSoonForBuyer && !isSeller) {
      toast.info("Wallet is available once you sell on Restyle.");
      return;
    }
    const href = resolveHref(item);
    if (href) {
      router.push(href);
      return;
    }
    toast.info("Coming soon.");
  };

  return (
    <div className="min-h-[100dvh] bg-[#F5F5F5] font-sans selection:bg-brand-pink/15">
      {/* Header — Hi + Welcome (pink wash, boxing-style spacing) */}
      <header className="relative bg-[#FFF5F8] px-4 pb-10 pt-6 md:px-9 md:pb-12 md:pt-8">
        <div className="mx-auto flex max-w-[1440px] items-start gap-4 md:gap-5">
          <button
            type="button"
            onClick={() => router.push("/")}
            className="-ml-2 mt-1 shrink-0 rounded-full p-2 text-[#2F2F2F] transition-colors hover:bg-black/5 md:-ml-1"
            aria-label="Back to home"
          >
            <ArrowBackOutlinedIcon sx={{ fontSize: 26 }} />
          </button>

          <div className="relative h-[52px] w-[52px] shrink-0 overflow-hidden rounded-full border-2 border-white bg-brand-pink shadow-sm ring-[3px] ring-pink-100 md:h-[64px] md:w-[64px] md:ring-4 md:ring-pink-100/90 [&>img]:object-cover">
            {user?.avatar ? (
              <Image
                src={user.avatar}
                alt={displayName ? `Avatar of ${displayName}` : "Profile avatar"}
                fill
                className="object-cover"
                sizes="64px"
              />
            ) : (
              <span className="flex h-full w-full items-center justify-center text-[15px] font-bold tracking-tight text-white md:text-[18px]" aria-hidden>
                {initialsFromName(displayName || "Guest User")}
              </span>
            )}
          </div>

          <div className="min-w-0 flex-1 pt-0.5">
            <h1 className="text-[18px] font-bold leading-snug tracking-tight text-[#000000] md:text-[20px]">
              Hi, {firstName}&nbsp;<span aria-hidden>👋</span>
            </h1>
            <p className="mt-0.5 text-[13px] font-normal leading-snug text-gray-600 md:text-[14px]">
              Welcome back!
            </p>
          </div>
        </div>
      </header>

      <div className="mx-auto mt-[-12px] w-full max-w-[1440px] space-y-5 px-4 pb-28 md:mt-[-16px] md:space-y-6 md:px-9 md:pb-36">
        {PROFILE_SECTIONS.map((section) => (
          <div key={section.label}>
            <p className="mb-3 px-1 text-[11px] font-bold uppercase tracking-[0.12em] text-gray-400 md:mb-3.5">
              {section.label}
            </p>
            <div className="overflow-hidden rounded-2xl border border-gray-200/90 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
              {section.items.filter((item) => !(item.sellerOnly && !isSeller)).map((item) => {
                return (
                  <button
                    key={`${section.label}-${item.title}`}
                    type="button"
                    onClick={() => handleRowClick(item)}
                    className="flex w-full cursor-pointer items-center gap-3 border-b border-gray-100 px-4 py-4 text-left transition-colors last:border-b-0 hover:bg-gray-50/90 active:bg-gray-50 md:gap-4 md:px-5 md:py-[18px]"
                  >
                    <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                      <span className="text-[15px] font-bold leading-snug tracking-tight text-[#000000] md:text-[16px]">
                        {item.title}
                      </span>
                      <span className="text-[13px] font-normal leading-snug text-gray-500 md:text-[13px]">
                        {item.subtitle}
                      </span>
                    </div>
                    <KeyboardArrowRightOutlinedIcon
                      className="shrink-0 text-gray-400"
                      sx={{ fontSize: 22 }}
                      aria-hidden
                    />
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={() => {
            logout();
            toast.success("Logged out");
          }}
          className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-[#F7246E] bg-white px-4 py-3.5 text-[15px] font-bold tracking-wide text-[#F7246E] transition-colors hover:bg-[#FFF5F8] md:mt-10 md:py-4 md:text-[16px]"
        >
          <LogoutOutlinedIcon sx={{ fontSize: 22 }} className="text-[#F7246E]" aria-hidden />
          Logout
        </button>
      </div>
    </div>
  );
}
