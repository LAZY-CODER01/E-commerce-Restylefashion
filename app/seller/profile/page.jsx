"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import KeyboardArrowRightOutlinedIcon from "@mui/icons-material/KeyboardArrowRightOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import BeachAccessOutlinedIcon from "@mui/icons-material/BeachAccessOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import RocketLaunchOutlinedIcon from "@mui/icons-material/RocketLaunchOutlined";
import WorkspacePremiumOutlinedIcon from "@mui/icons-material/WorkspacePremiumOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import TuneOutlinedIcon from "@mui/icons-material/TuneOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { toast } from "react-toastify";
import { QRCodeSVG } from "qrcode.react";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import InstagramIcon from "@mui/icons-material/Instagram";
import MessageOutlinedIcon from "@mui/icons-material/MessageOutlined";
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";
import LinkOutlinedIcon from "@mui/icons-material/LinkOutlined";
import {
  getSellerProfileSsrPlaceholder,
  getSellerStoreId,
  mergeSellerProfileFromStorage,
  readSellerHubState,
  readSellerProductsForStore,
  writeSellerHubState,
} from "@/lib/sellerHubProfile";
import SellerProcessBottomNav from "@/components/SellerProcessBottomNav";

function formatDateLabel(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return format(d, "dd MMM yyyy");
}

function diffDaysInclusive(startIso, endIso) {
  if (!startIso || !endIso) return null;
  const s = new Date(startIso);
  const e = new Date(endIso);
  if (Number.isNaN(s.getTime()) || Number.isNaN(e.getTime())) return null;
  const ms = e.getTime() - s.getTime();
  if (ms < 0) return null;
  return Math.floor(ms / 86400000) + 1;
}

function DateSelectField({ value, onChange, min, max, placeholder = "Select" }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  const selected = value ? new Date(value) : undefined;
  const disabledBefore = min ? new Date(min) : undefined;
  const disabledAfter = max ? new Date(max) : undefined;

  useEffect(() => {
    if (!open) return;
    const onDown = (e) => {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("touchstart", onDown, { passive: true });
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("touchstart", onDown);
    };
  }, [open]);

  return (
    <div ref={wrapRef} className="relative w-full">
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="flex h-[52px] w-full items-center gap-3 overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 shadow-sm transition hover:bg-gray-50"
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <CalendarMonthOutlinedIcon sx={{ fontSize: 22 }} className="text-gray-500" aria-hidden />
        <span className="flex-1 truncate whitespace-nowrap text-[14px] font-semibold text-gray-800">
          {value ? formatDateLabel(value) : placeholder}
        </span>
        <KeyboardArrowDownRoundedIcon sx={{ fontSize: 24 }} className="text-gray-500" aria-hidden />
      </button>

      {open ? (
        <div className="fixed inset-0 z-[260] flex items-start justify-center px-4 pt-24 sm:items-center sm:pt-0">
          {/* Click-away layer (prevents tapping behind on mobile) */}
          <button
            type="button"
            className="absolute inset-0 cursor-default"
            aria-label="Close calendar"
            onClick={() => setOpen(false)}
          />

          <div
            className="relative w-[320px] max-w-[calc(100vw-2rem)] rounded-2xl border border-gray-200 bg-white p-3 shadow-[0_20px_60px_rgba(0,0,0,0.18)]"
            role="dialog"
            aria-label="Calendar"
            onClick={(e) => e.stopPropagation()}
          >
            <DayPicker
              mode="single"
              selected={selected}
              onSelect={(d) => {
                if (!d) return;
                const iso = format(d, "yyyy-MM-dd");
                onChange({ target: { value: iso } });
                setOpen(false);
              }}
              disabled={
                disabledBefore || disabledAfter
                  ? {
                      ...(disabledBefore ? { before: disabledBefore } : {}),
                      ...(disabledAfter ? { after: disabledAfter } : {}),
                    }
                  : undefined
              }
              className="p-1"
              classNames={{
                months: "flex flex-col",
                month: "space-y-3",
                caption: "flex items-center justify-between px-2",
                caption_label: "text-[18px] font-extrabold text-[#000000]",
                nav: "flex items-center gap-2",
                nav_button:
                  "h-8 w-8 rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 flex items-center justify-center",
                table: "w-full border-collapse",
                head_row: "grid grid-cols-7 px-1",
                head_cell: "text-center text-[12px] font-semibold text-gray-500 py-1",
                row: "grid grid-cols-7 px-1",
                cell: "text-center py-1.5",
                day: "h-9 w-9 rounded-full text-[14px] font-semibold text-gray-800 hover:bg-gray-100",
                day_selected:
                  "bg-[#F7246E] text-white hover:bg-[#F7246E] focus:bg-[#F7246E]",
                day_today: "ring-1 ring-[#F7246E]/30",
                day_disabled: "text-gray-300 hover:bg-transparent",
                day_outside: "text-gray-300",
              }}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}

function VacationToggle({ checked, onChange }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-10 shrink-0 items-center rounded-full transition-colors ${
        checked ? "bg-[#F7246E]" : "bg-gray-200"
      }`}
    >
      <span
        className={`inline-block h-5 w-5 rounded-full bg-white shadow transition-transform ${
          checked ? "translate-x-5" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}

function initialsFromName(fullName) {
  if (!fullName?.trim()) return "S";
  const p = fullName.trim().split(/\s+/).filter(Boolean);
  if (p.length >= 2) return `${p[0][0]}${p[1][0]}`.toUpperCase();
  const w = p[0];
  return w.length >= 2 ? w.slice(0, 2).toUpperCase() : `${w[0]}`.toUpperCase();
}

export default function SellerProfilePage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [tick, setTick] = useState(0);
  const [vacationModalOpen, setVacationModalOpen] = useState(false);
  const [vacationStart, setVacationStart] = useState("");
  const [vacationEnd, setVacationEnd] = useState("");
  const [vacationModeUI, setVacationModeUI] = useState(false);
  const [followed, setFollowed] = useState(false);
  const [storeSearch, setStoreSearch] = useState("");
  const [shareSheetOpen, setShareSheetOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const bump = () => setTick((t) => t + 1);
    window.addEventListener("seller-products-updated", bump);
    window.addEventListener("focus", bump);
    return () => {
      window.removeEventListener("seller-products-updated", bump);
      window.removeEventListener("focus", bump);
    };
  }, []);

  const { profile, hub, products } = useMemo(() => {
    if (!mounted) {
      return { profile: getSellerProfileSsrPlaceholder(), hub: {}, products: [] };
    }
    const sid = getSellerStoreId();
    return {
      profile: mergeSellerProfileFromStorage(),
      hub: readSellerHubState(),
      products: readSellerProductsForStore(sid),
    };
  }, [mounted, tick]);

  const vacationMode = hub.onlineStore === false;
  useEffect(() => {
    // Keep UI state synced with persisted hub state (but allow instant flips on click).
    setVacationModeUI(vacationMode);
  }, [vacationMode]);

  const setVacationMode = (nextVacationMode) => {
    // vacationMode === true => onlineStore should be false
    writeSellerHubState({ onlineStore: nextVacationMode ? false : true });
    setTick((t) => t + 1);
  };

  const handleVacationToggle = (nextVacationMode) => {
    // Turning ON: show modal first. Turning OFF: do it immediately.
    if (nextVacationMode) {
      setVacationModalOpen(true);
      return;
    }
    // Instant UI update + persist
    setVacationModeUI(false);
    setVacationMode(false);
  };

  const confirmVacationOn = () => {
    // Flip the toggle ON using the same state path,
    // then persist optional dates.
    setVacationModeUI(true); // instant
    setVacationMode(true);
    writeSellerHubState({ vacationStart: vacationStart || "", vacationEnd: vacationEnd || "" });
    setVacationModalOpen(false);
  };

  const vacationDays = diffDaysInclusive(vacationStart, vacationEnd);
  const handleStartChange = (nextIso) => {
    setVacationStart(nextIso);
    if (vacationEnd && nextIso && nextIso > vacationEnd) {
      setVacationEnd(nextIso);
    }
  };

  const handleEndChange = (nextIso) => {
    setVacationEnd(nextIso);
    if (vacationStart && nextIso && nextIso < vacationStart) {
      setVacationStart(nextIso);
    }
  };

  const storeTypeLabel =
    profile?.sellerType === "influencer"
      ? "Influencer Store"
      : profile?.sellerType
        ? `${String(profile.sellerType).replace(/_/g, " ")} Store`
        : "Store";

  const liveListings = Number(profile?.liveProducts || products.length || 0);
  const followers = Number(profile?.followers || 0);
  const following = Number(profile?.followings || 0);

  const categories = useMemo(() => {
    const byCat = new Map();
    for (const p of products || []) {
      const key = String(p.category || "Products");
      byCat.set(key, (byCat.get(key) || 0) + 1);
    }

    // Fallback curated grid to match the reference if no products exist yet.
    const fallback = [
      { key: "women-handbags", label: "Women's Handbags", count: 120, image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=700&q=80" },
      { key: "wallets", label: "Wallets", count: 86, image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=700&q=80" },
      { key: "accessories", label: "Accessories", count: 64, image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=700&q=80" },
      { key: "perfumes", label: "Perfumes", count: 32, image: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=700&q=80" },
    ];

    const fromProducts = Array.from(byCat.entries())
      .map(([k, c]) => ({
        key: k,
        label: k,
        count: c,
        image: products?.find((p) => String(p.category || "Products") === k)?.image || "",
      }))
      .slice(0, 4);

    const base = fromProducts.length ? fromProducts : fallback;
    const q = (storeSearch || "").trim().toLowerCase();
    if (!q) return base;
    return base.filter((c) => String(c.label || "").toLowerCase().includes(q));
  }, [products, storeSearch]);

  const handleShareProfile = async () => {
    try {
      const url = typeof window !== "undefined" ? window.location.href : "";
      const title = profile?.name ? `${profile.name} • Restyle` : "Restyle";
      if (navigator?.share) {
        await navigator.share({ title, url });
        return;
      }
      if (navigator?.clipboard?.writeText && url) {
        await navigator.clipboard.writeText(url);
        toast.success("Profile link copied!");
        return;
      }
      toast.info("Sharing not available on this device.");
    } catch {
      toast.info("Could not share right now.");
    }
  };

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  const copyShareUrl = async () => {
    try {
      if (!shareUrl) return;
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Link copied!");
    } catch {
      toast.info("Could not copy link.");
    }
  };

  const shareToWhatsApp = () => {
    if (!shareUrl) return;
    const text = encodeURIComponent(`Check out my store on Restyle: ${shareUrl}`);
    window.open(`https://wa.me/?text=${text}`, "_blank", "noopener,noreferrer");
  };

  const shareToMessages = () => {
    if (!shareUrl) return;
    const body = encodeURIComponent(`Check out my store on Restyle: ${shareUrl}`);
    window.location.href = `sms:&body=${body}`;
  };

  const shareMore = async () => {
    if (!shareUrl) return;
    try {
      if (navigator?.share) {
        await navigator.share({ title: `${profile?.name || "Store"} • Restyle`, url: shareUrl });
      } else {
        await copyShareUrl();
      }
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="min-h-[100dvh] bg-[#F5F5F5] pb-28 font-sans text-neutral-900">
      {/* Share Profile bottom sheet */}
      {shareSheetOpen ? (
        <div className="fixed inset-0 z-[210]">
          <div
            className="absolute inset-0 bg-black/40"
            aria-hidden="true"
            onClick={() => setShareSheetOpen(false)}
          />
          <div className="absolute inset-x-0 bottom-0 mx-auto w-full max-w-[560px] px-4 pb-6 sm:pb-8">
            <div className="rounded-[22px] bg-white shadow-[0_20px_70px_rgba(0,0,0,0.25)]">
              <div className="relative px-5 pt-5 text-center">
                <button
                  type="button"
                  onClick={() => setShareSheetOpen(false)}
                  className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 text-gray-500 hover:bg-gray-100"
                  aria-label="Close"
                >
                  <CloseOutlinedIcon sx={{ fontSize: 22 }} />
                </button>
                <h3 className="text-[18px] font-extrabold text-[#000000]">Share Profile</h3>
                <p className="mt-1 text-[13px] font-medium text-gray-500">Share your store with others</p>
              </div>

              <div className="mt-4 px-5">
                <div className="flex items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="relative h-12 w-12 overflow-hidden rounded-full bg-gradient-to-br from-[#F7246E] to-[#FF6FA0]">
                      <div className="flex h-full w-full items-center justify-center text-[18px] font-extrabold text-white">
                        {initialsFromName(profile?.avatarName || profile?.name || "Seller")}
                      </div>
                    </div>
                    <div className="min-w-0">
                      <p className="text-[14px] font-extrabold text-[#000000] leading-tight">{profile?.name}</p>
                      <p className="mt-0.5 text-[11px] font-bold text-[#F7246E]">{storeTypeLabel}</p>
                      <p className="mt-1 text-[11px] font-medium text-gray-500">
                        {followers.toLocaleString()} Followers <span className="mx-1">•</span> {liveListings} Live Listings
                      </p>
                    </div>
                  </div>
                  <div className="shrink-0 rounded-xl border border-gray-200 bg-white p-2">
                    <QRCodeSVG value={shareUrl || "https://restyle.app"} size={54} />
                  </div>
                </div>
              </div>

              <div className="mt-5 px-5">
                <p className="text-[12px] font-bold text-gray-500">Share via</p>
                <div className="mt-3 grid grid-cols-4 gap-3">
                  <button
                    type="button"
                    onClick={shareToWhatsApp}
                    className="flex flex-col items-center gap-2 rounded-2xl bg-white py-2"
                  >
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366]/10 text-[#25D366]">
                      <WhatsAppIcon />
                    </span>
                    <span className="text-[11px] font-semibold text-gray-600">WhatsApp</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => toast.info("Instagram sharing: copy link & paste in Instagram.")}
                    className="flex flex-col items-center gap-2 rounded-2xl bg-white py-2"
                  >
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E1306C]/10 text-[#E1306C]">
                      <InstagramIcon />
                    </span>
                    <span className="text-[11px] font-semibold text-gray-600">Instagram</span>
                  </button>

                  <button
                    type="button"
                    onClick={shareToMessages}
                    className="flex flex-col items-center gap-2 rounded-2xl bg-white py-2"
                  >
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#22C55E]/10 text-[#22C55E]">
                      <MessageOutlinedIcon />
                    </span>
                    <span className="text-[11px] font-semibold text-gray-600">Messages</span>
                  </button>

                  <button
                    type="button"
                    onClick={shareMore}
                    className="flex flex-col items-center gap-2 rounded-2xl bg-white py-2"
                  >
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-600">
                      <MoreHorizOutlinedIcon />
                    </span>
                    <span className="text-[11px] font-semibold text-gray-600">More</span>
                  </button>
                </div>
              </div>

              <div className="mt-4 px-5 pb-6">
                <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F7246E]/10 text-[#F7246E]">
                        <LinkOutlinedIcon />
                      </span>
                      <div className="min-w-0">
                        <p className="text-[12px] font-extrabold text-[#000000]">Copy link</p>
                        <p className="mt-0.5 truncate text-[12px] font-medium text-gray-500">
                          {shareUrl || "—"}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={copyShareUrl}
                      className="text-[13px] font-extrabold text-[#F7246E] hover:underline"
                    >
                      Copy
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={shareMore}
                  className="mt-3 flex w-full items-center justify-between rounded-2xl border border-gray-200 bg-white px-4 py-4 text-left shadow-sm hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-600">
                      <ShareOutlinedIcon sx={{ fontSize: 20 }} />
                    </span>
                    <div>
                      <p className="text-[13px] font-extrabold text-[#000000]">Share via</p>
                      <p className="mt-0.5 text-[12px] font-medium text-gray-500">More options</p>
                    </div>
                  </div>
                  <KeyboardArrowRightOutlinedIcon className="text-gray-300" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* Vacation modal */}
      {vacationModalOpen ? (
        <div className="fixed inset-0 z-[200]">
          <div
            className="absolute inset-0 bg-black/50"
            aria-hidden="true"
            onClick={() => setVacationModalOpen(false)}
          />
          <div className="absolute inset-0 flex items-center justify-center px-4 py-6">
            <div className="relative w-full max-w-[560px] max-h-[90dvh] overflow-y-auto rounded-[22px] bg-white p-5 shadow-[0_20px_60px_rgba(0,0,0,0.25)] sm:p-7">
              <button
                type="button"
                onClick={() => setVacationModalOpen(false)}
                className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 text-gray-500 hover:bg-gray-100"
                aria-label="Close"
              >
                <CloseOutlinedIcon sx={{ fontSize: 22 }} />
              </button>

              <div className="flex flex-col items-center text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#F7246E]/10">
                  <BeachAccessOutlinedIcon sx={{ fontSize: 28 }} className="text-[#F7246E]" aria-hidden />
                </div>
                <h2 className="mt-4 text-[18px] font-extrabold tracking-tight text-[#000000]">
                  Vacation Mode
                </h2>
                <p className="mt-2 max-w-[420px] text-[13px] leading-snug text-gray-600">
                  Your store will be paused during this period and will resume automatically. During this time,
                  your listings will not be visible to buyers.
                </p>
              </div>

              <div className="mt-5 h-px w-full bg-gray-100" />

              <div className="mt-5">
                <p className="text-[14px] font-extrabold text-[#000000]">
                  Select Dates <span className="font-semibold text-gray-400">(Optional)</span>
                </p>

                <div className="mt-4 flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="mb-2 text-[12px] font-bold text-gray-500">Start Date</p>
                    <DateSelectField
                      value={vacationStart}
                      max={vacationEnd || undefined}
                      onChange={(e) => handleStartChange(e.target.value)}
                    />
                  </div>

                  <div className="shrink-0 pt-6 text-center text-[16px] font-extrabold text-gray-300" aria-hidden>
                    —
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="mb-2 text-[12px] font-bold text-gray-500">
                      End Date <span className="font-semibold text-gray-400">(Optional)</span>
                    </p>
                    <DateSelectField
                      value={vacationEnd}
                      min={vacationStart || undefined}
                      onChange={(e) => handleEndChange(e.target.value)}
                    />
                  </div>
                </div>

                <p
                  className={`mt-3 min-h-[18px] text-center text-[12px] font-semibold text-gray-600 ${
                    vacationDays ? "opacity-100" : "opacity-0"
                  }`}
                  aria-live="polite"
                >
                  Vacation will be active for{" "}
                  <span className="font-extrabold text-[#000000]">{vacationDays || 0}</span>{" "}
                  {vacationDays === 1 ? "day" : "days"}.
                </p>

                <button
                  type="button"
                  onClick={confirmVacationOn}
                  className="mt-6 w-full rounded-2xl bg-gradient-to-r from-[#F7246E] to-[#FF4D87] py-3.5 text-[15px] font-extrabold tracking-wide text-white shadow-[0_10px_24px_rgba(247,36,110,0.22)] active:scale-[0.99]"
                >
                  Turn On Vacation Mode
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* Top bar */}
      <header className="sticky top-0 z-30 bg-[#F5F5F5] px-4 pt-3 md:px-9 md:pt-6">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between">
          <button
            type="button"
            onClick={() => router.push("/")}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-neutral-800 shadow-sm transition hover:bg-gray-50"
            aria-label="Back"
          >
            <ArrowBackOutlinedIcon sx={{ fontSize: 22 }} />
          </button>

          <span className="inline-block h-10 w-10" aria-hidden />
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1200px] px-4 pb-10 md:px-9">
        <div className="mt-4 flex w-full flex-col gap-5 md:gap-6">
          {/* Header block (Image 3 style: avatar left, name + stats right) */}
          <section className="rounded-3xl bg-white/0">
            <div className="flex items-start gap-4 md:gap-5">
              <div className="relative shrink-0">
                <div className="relative h-[92px] w-[92px] overflow-hidden rounded-full bg-gradient-to-br from-[#F7246E] to-[#FF6FA0] shadow-sm ring-4 ring-white md:h-[104px] md:w-[104px]">
              {hub?.avatarUrl ? (
                    <Image src={hub.avatarUrl} alt="" fill className="object-cover" sizes="104px" />
              ) : (
                    <div className="flex h-full w-full items-center justify-center text-[30px] font-extrabold tracking-tight text-white md:text-[32px]">
                  {initialsFromName(profile?.avatarName || profile?.name || "Seller")}
                </div>
              )}
                </div>
                <button
                  type="button"
                  onClick={() => toast.info("Edit profile picture (coming soon).")}
                  className="absolute bottom-1 right-1 flex h-7 w-7 items-center justify-center rounded-full bg-white shadow-[0_8px_20px_rgba(0,0,0,0.12)] ring-1 ring-gray-200 transition hover:bg-gray-50"
                  aria-label="Edit avatar"
                >
                  <EditOutlinedIcon sx={{ fontSize: 15 }} className="text-gray-700" aria-hidden />
                </button>
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-[18px] font-extrabold tracking-tight text-[#000000] md:text-[20px]">
                  {profile?.name}
                </p>
                <p className="mt-0.5 inline-flex rounded-full bg-[#F7246E]/10 px-2.5 py-0.5 text-[11px] font-bold text-[#F7246E]">
                  {storeTypeLabel}
                </p>

                {/* Stats row (right side) */}
                <div className="mt-3 grid grid-cols-3 items-center">
                  <div className="flex flex-col items-center justify-center py-2.5 pr-3">
                    <p className="text-[18px] font-bold leading-none text-[#000000]">{followers.toLocaleString()}</p>
                    <p className="mt-1 text-[12px] font-medium text-gray-500">Followers</p>
                  </div>

                  <div className="flex flex-col items-center justify-center py-2.5 px-3 border-x border-gray-200/80">
                    <p className="text-[18px] font-bold leading-none text-[#000000]">{following.toLocaleString()}</p>
                    <p className="mt-1 text-[12px] font-medium text-gray-500">Following</p>
                  </div>

                  <div className="flex flex-col items-center justify-center py-2.5 pl-3">
                    <div className="flex items-center gap-1">
                      <p className="text-[18px] font-bold leading-none text-[#000000]">{liveListings}</p>
                      <span className="text-[11px] font-extrabold text-[#F7246E]" aria-hidden>
                        (•)
                      </span>
                    </div>
                    <p className="mt-1 text-[12px] font-medium text-gray-500">Live Listings</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Follow button */}
            <button
              type="button"
              onClick={() => {
                setFollowed((p) => !p);
                toast.success(!followed ? "Followed" : "Unfollowed");
              }}
              className="mt-4 w-full rounded-2xl bg-gradient-to-r from-[#F7246E] to-[#FF4D87] py-3.5 text-[15px] font-extrabold tracking-wide text-white shadow-[0_10px_24px_rgba(247,36,110,0.22)] active:scale-[0.99]"
            >
              {followed ? "Following" : "Follow"}
            </button>

            {/* Action chips */}
            <div className="mt-3 grid w-full grid-cols-3 gap-2.5 sm:gap-3">
            <button
              type="button"
              onClick={() => setShareSheetOpen(true)}
              className="flex min-w-0 items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white px-2.5 py-3 text-[11px] font-semibold leading-tight text-gray-900 shadow-sm hover:bg-gray-50 sm:px-4 sm:text-[12px]"
            >
              <ShareOutlinedIcon sx={{ fontSize: 16 }} className="text-[#F7246E]" aria-hidden />
              <span className="whitespace-normal text-center sm:whitespace-nowrap">Share Profile</span>
            </button>
            <Link
              href="/seller/store"
              className="flex min-w-0 items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white px-2.5 py-3 text-[11px] font-semibold leading-tight text-gray-900 shadow-sm hover:bg-gray-50 sm:px-4 sm:text-[12px]"
            >
              <VisibilityOutlinedIcon sx={{ fontSize: 16 }} className="text-[#F7246E]" aria-hidden />
              <span className="whitespace-normal text-center sm:whitespace-nowrap">Store Preview</span>
            </Link>
            <div className="flex min-w-0 items-center justify-between rounded-2xl border border-gray-200 bg-white px-2.5 py-3 shadow-sm sm:px-4">
              <div className="flex min-w-0 flex-1 items-center gap-2">
                <BeachAccessOutlinedIcon sx={{ fontSize: 16 }} className="text-[#F7246E]" aria-hidden />
                <span className="min-w-0 text-[11px] font-semibold leading-tight text-gray-900 sm:text-[12px]">
                  <span className="block sm:hidden">Vacation</span>
                  <span className="block sm:hidden">Mode</span>
                  <span className="hidden sm:inline">Vacation Mode</span>
                </span>
              </div>
              <div className="ml-3 shrink-0 sm:ml-4">
                <VacationToggle checked={vacationModeUI} onChange={handleVacationToggle} />
              </div>
            </div>
            </div>
          </section>

          {/* Boost + Premium cards (stacked below, as per Image 3) */}
          <section className="space-y-3">
          <div className="flex items-center justify-between rounded-2xl bg-gradient-to-r from-[#FFE3EA] to-[#FFF2F6] px-4 py-4 shadow-sm">
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/70">
                <RocketLaunchOutlinedIcon sx={{ fontSize: 22 }} className="text-[#F7246E]" aria-hidden />
              </span>
              <div className="min-w-0">
                <p className="text-[14px] font-extrabold text-[#000000]">Boost Plan</p>
                <p className="mt-0.5 text-[12px] font-medium text-gray-600">Get more views and sell faster</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => router.push("/seller/boost")}
              className="inline-flex items-center gap-1 rounded-xl bg-white px-3 py-2 text-[12px] font-extrabold text-[#F7246E] shadow-sm"
            >
              Boost Now <KeyboardArrowRightOutlinedIcon sx={{ fontSize: 18 }} />
            </button>
          </div>

          <div className="flex items-center justify-between rounded-2xl bg-gradient-to-r from-[#F1ECFF] to-[#F7F4FF] px-4 py-4 shadow-sm">
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/70">
                <WorkspacePremiumOutlinedIcon sx={{ fontSize: 22 }} className="text-[#6B4EFF]" aria-hidden />
              </span>
              <div className="min-w-0">
                <p className="text-[14px] font-extrabold text-[#000000]">Premium Membership</p>
                <p className="mt-0.5 text-[12px] font-medium leading-snug text-gray-600 line-clamp-2">
                  Unlock exclusive features and grow your store
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => router.push("/seller/boost/plans")}
              className="inline-flex shrink-0 items-center gap-1 rounded-xl border border-[#B8A7FF] bg-white px-3 py-2 text-[12px] font-extrabold text-[#6B4EFF] shadow-sm"
            >
              Upgrade <KeyboardArrowRightOutlinedIcon sx={{ fontSize: 18 }} />
            </button>
          </div>
          </section>

          {/* Search + filter */}
          <section className="mt-1 flex items-center gap-3">
          <div className="flex flex-1 items-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
            <SearchOutlinedIcon className="text-gray-400" sx={{ fontSize: 20 }} aria-hidden />
            <input
              type="text"
              placeholder="Search in store"
              value={storeSearch}
              onChange={(e) => setStoreSearch(e.target.value)}
              className="w-full bg-transparent text-[13px] font-medium text-gray-700 outline-none placeholder:text-gray-400"
            />
          </div>
          <button
            type="button"
            onClick={() => toast.info("Filters (coming soon).")}
            className="inline-flex items-center justify-center gap-1.5 rounded-2xl border border-gray-200 bg-white px-4 py-3 text-[12px] font-extrabold text-gray-700 shadow-sm hover:bg-gray-50"
          >
            <TuneOutlinedIcon sx={{ fontSize: 18 }} className="text-gray-500" aria-hidden />
            Filter
          </button>
          </section>

          {/* Category grid */}
          <section className="mt-1 grid grid-cols-2 gap-3 md:grid-cols-2 lg:grid-cols-4 lg:gap-4">
          {categories.map((c) => (
            <button
              key={c.key}
              type="button"
              onClick={() => router.push("/seller/store")}
              className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:bg-gray-50"
            >
              <div className="relative aspect-square w-full bg-gray-50">
                {c.image ? (
                  <Image src={c.image} alt="" fill className="object-cover" sizes="260px" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-[12px] font-semibold text-gray-400">
                    No image
                  </div>
                )}
              </div>
              <div className="px-3 py-3 text-left">
                <p className="line-clamp-1 text-[13px] font-extrabold text-[#000000]">{c.label}</p>
                <p className="mt-0.5 text-[11px] font-medium text-gray-500">{c.count} items</p>
              </div>
            </button>
          ))}
          </section>
        </div>
      </main>

      <SellerProcessBottomNav />
    </div>
  );
}
