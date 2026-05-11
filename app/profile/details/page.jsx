"use client";

import "react-day-picker/style.css";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import KeyboardArrowRightOutlinedIcon from "@mui/icons-material/KeyboardArrowRightOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import WcRoundedIcon from "@mui/icons-material/WcRounded";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import { DayPicker } from "react-day-picker";
import { format, parse, isValid as isValidDate } from "date-fns";
import { enGB } from "date-fns/locale";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import { toast } from "react-toastify";

const BRAND_PINK = "#F7246E";

const GENDER_OPTIONS = [
  { value: "female", label: "Female" },
  { value: "male", label: "Male" },
  { value: "other", label: "Other" },
  { value: "unspecified", label: "Prefer not to say" },
];

function initialsFromName(fullName) {
  if (!fullName?.trim()) return "U";
  const p = fullName.trim().split(/\s+/).filter(Boolean);
  if (p.length >= 2) return `${p[0][0]}${p[1][0]}`.toUpperCase();
  const w = p[0];
  return w.length >= 2 ? w.slice(0, 2).toUpperCase() : `${w[0]}`.toUpperCase();
}

/** Calendar YYYY-MM-DD from API (avoids timezone shifting the stored birth date). */
function isoToYmd(isoLike) {
  if (!isoLike) return "";
  const s = String(isoLike);
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(s);
  if (m) return `${m[1]}-${m[2]}-${m[3]}`;
  const d = new Date(isoLike);
  if (Number.isNaN(d.getTime())) return "";
  return format(d, "yyyy-MM-dd");
}

/** Display like "12 Aug 1996" (matches reference — en-GB keeps day + short month readable). */
function formatDobDisplay(isoLike) {
  const ymd = isoToYmd(isoLike);
  if (!ymd) return "—";
  const d = parse(ymd, "yyyy-MM-dd", new Date());
  if (!isValidDate(d)) return "—";
  return format(d, "d MMM yyyy", { locale: enGB });
}

function parseTypedDobToYmd(raw) {
  const t = (raw || "").trim();
  if (!t) return null;
  const patterns = [
    "yyyy-MM-dd",
    "d/M/yyyy",
    "dd/MM/yyyy",
    "d-M-yyyy",
    "dd-MM-yyyy",
    "d MMM yyyy",
    "dd MMM yyyy",
  ];
  for (const p of patterns) {
    try {
      const d = parse(t, p, new Date());
      if (isValidDate(d)) return format(d, "yyyy-MM-dd");
    } catch {
      /* try next */
    }
  }
  const fallback = new Date(t);
  if (!Number.isNaN(fallback.getTime())) return format(fallback, "yyyy-MM-dd");
  return null;
}

function genderLabel(value) {
  const norm = typeof value === "string" ? value.trim().toLowerCase() : "";
  if (!norm || norm === "unspecified") return "—";
  const f = GENDER_OPTIONS.find((o) => o.value === norm);
  return f ? f.label : "—";
}

function normalizeStoredGender(raw) {
  const g = typeof raw === "string" ? raw.trim().toLowerCase() : "";
  return ["female", "male", "other", "unspecified"].includes(g) ? g : "";
}

/** Mock: soft pink tile with subtle pink outline. */
function IconWrap({ children }) {
  return (
    <div
      className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-lg border border-pink-200/90 bg-[#FFF5F8]"
      style={{ color: BRAND_PINK }}
    >
      {children}
    </div>
  );
}

/** Square, professional DOB sheet: month/year dropdowns only (no overlapping nav arrows). */
function DobEditFieldModern({ dobText, dobYmd, onTextChange, onPickYmd, onBlurText }) {
  const [open, setOpen] = useState(false);

  const selected = dobYmd ? parse(dobYmd, "yyyy-MM-dd", new Date()) : undefined;
  const validSelected = selected && isValidDate(selected) ? selected : undefined;

  const today = useMemo(() => {
    const t = new Date();
    t.setHours(23, 59, 59, 999);
    return t;
  }, []);

  const minBirth = useMemo(() => {
    const t = new Date();
    t.setFullYear(t.getFullYear() - 120, 0, 1);
    t.setHours(0, 0, 0, 0);
    return t;
  }, []);

  const endCalendarMonth = useMemo(() => {
    const t = new Date();
    t.setHours(23, 59, 59, 999);
    return t;
  }, []);

  const pickerVars = useMemo(
    () => ({
      "--rdp-accent-color": BRAND_PINK,
      "--rdp-accent-background-color": "#FFF5F8",
      "--rdp-day_button-border-radius": "0px",
      "--rdp-day_button-border": "1px solid #e5e7eb",
      "--rdp-day_button-height": "40px",
      "--rdp-day_button-width": "100%",
      "--rdp-day-height": "40px",
      "--rdp-day-width": "100%",
      "--rdp-selected-border": "none",
      "--rdp-outside-opacity": "0.45",
      "--rdp-nav-height": "auto",
    }),
    []
  );

  return (
    <div className="relative flex items-stretch gap-2">
      <input
        type="text"
        value={dobText}
        onChange={(e) => onTextChange(e.target.value)}
        onBlur={onBlurText}
        placeholder="DD/MM/YYYY or tap calendar"
        className="min-w-0 flex-1 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-[15px] font-semibold text-gray-900 outline-none focus:border-[#F7246E]"
        autoComplete="bday"
      />
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center self-center rounded-lg border border-gray-300 bg-white text-[#F7246E] shadow-sm transition hover:border-gray-400 hover:bg-gray-50 active:scale-95"
        aria-label="Open calendar"
        aria-expanded={open}
        aria-haspopup="dialog"
      >
        <CalendarMonthOutlinedIcon sx={{ fontSize: 24 }} />
      </button>

      {open ? (
        <>
          <style
            dangerouslySetInnerHTML={{
              __html: `
            .profile-dob-sheet .rdp-month_caption {
              display: flex;
              flex-direction: row;
              flex-wrap: wrap;
              gap: 0.5rem;
              width: 100%;
              height: auto !important;
              min-height: unset !important;
              margin-bottom: 0.75rem;
              align-items: flex-start;
            }
            .profile-dob-sheet .rdp-dropdowns {
              display: flex;
              flex: 1 1 100%;
              gap: 0.5rem;
              align-items: stretch;
            }
            .profile-dob-sheet .rdp-dropdown_root {
              flex: 1;
              min-width: 120px;
              min-height: 42px;
              position: relative;
            }
            .profile-dob-sheet .rdp-caption_label {
              display: flex !important;
              width: 100%;
              justify-content: center;
              border: 1px solid #d1d5db;
              border-radius: 2px;
              padding: 0.55rem 0.75rem;
              background: #f9fafb;
              font-size: 0.8125rem;
              font-weight: 600;
              color: #111827;
            }
            .profile-dob-sheet .rdp-month_grid {
              width: 100%;
              border: 1px solid #e5e7eb;
            }
            .profile-dob-sheet .rdp-weekday {
              opacity: 1;
              font-size: 11px;
              font-weight: 700;
              letter-spacing: 0.04em;
              color: #6b7280;
              border-bottom: 1px solid #e5e7eb;
              padding: 0.4rem 0;
            }
            .profile-dob-sheet .rdp-day {
              border-right: 1px solid #ececec;
              border-bottom: 1px solid #ececec;
            }
            .profile-dob-sheet .rdp-selected .rdp-day_button {
              font-weight: 700;
            }`,
            }}
          />
          <div className="fixed inset-0 z-[280] flex items-start justify-center px-3 pt-14 sm:items-center sm:pt-0">
            <button
              type="button"
              className="absolute inset-0 cursor-default bg-black/50"
              aria-label="Close calendar"
              onClick={() => setOpen(false)}
            />
            <div
              role="dialog"
              aria-modal="true"
              aria-label="Choose date of birth"
              className="profile-dob-sheet relative mt-2 w-full max-w-[360px] rounded-sm border border-gray-300 bg-white shadow-2xl sm:mt-0"
              style={pickerVars}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-gray-200 bg-neutral-50 px-4 py-3">
                <p className="text-[14px] font-bold tracking-tight text-neutral-900">Date of birth</p>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-sm px-3 py-1.5 text-[13px] font-semibold text-neutral-600 hover:bg-white"
                >
                  Close
                </button>
              </div>

              <div className="p-4">
                <DayPicker
                  mode="single"
                  selected={validSelected}
                  defaultMonth={validSelected ?? new Date(new Date().getFullYear() - 25, 0)}
                  startMonth={minBirth}
                  endMonth={endCalendarMonth}
                  captionLayout="dropdown"
                  reverseYears
                  hideNavigation
                  fixedWeeks
                  onSelect={(d) => {
                    if (!d) return;
                    onPickYmd(format(d, "yyyy-MM-dd"));
                    setOpen(false);
                  }}
                  disabled={{
                    before: minBirth,
                    after: today,
                  }}
                  className="w-full !max-w-none [--rdp-accent-color:#F7246E]"
                  classNames={{
                    root: "!m-0 !w-full !max-w-none",
                    months: "!w-full !max-w-none",
                    month: "!w-full space-y-3 !max-w-none",
                    weekdays: "flex w-full justify-between",
                    weekday: "flex-1",
                    week: "flex w-full mt-0 justify-between",
                    day: "relative flex-1 basis-0 flex items-stretch justify-center p-0 last:border-r-0 min-w-0",
                    day_button:
                      "!m-0 !h-10 !w-full rounded-none text-[13px] font-medium text-neutral-800 hover:bg-neutral-100 aria-disabled:opacity-35",
                    selected: "!bg-[#F7246E] hover:!bg-[#F7246E] !text-white",
                    disabled: "opacity-35",
                    outside: "text-neutral-400",
                    hidden: "opacity-0 pointer-events-none invisible",
                    today: "!font-semibold !ring-1 !ring-inset !ring-neutral-900/15",
                  }}
                />
                <p className="mt-3 text-center text-[12px] leading-relaxed text-neutral-500">
                  {"Choose month & year, tap a day—or type the date in the field."}
                </p>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}

export default function ProfileDetailsPage() {
  const router = useRouter();
  const { user, setUser, loading: authLoading, logout } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [listingCount, setListingCount] = useState(null);

  const [draft, setDraft] = useState({
    fullName: "",
    mobile: "",
    dobText: "",
    dobYmd: "",
    gender: "",
  });

  const isSeller = user?.role === "Seller" || user?.role === "Influencer";

  const storeTitle = useMemo(() => {
    const b = user?.businessName?.trim();
    if (b) return b;
    const first = user?.fullName?.trim()?.split(/\s+/)[0] || "Your";
    return `${first}'s Closet`;
  }, [user?.businessName, user?.fullName]);

  const sellerSinceLabel = useMemo(() => {
    if (!user?.createdAt) return "—";
    const d = new Date(user.createdAt);
    if (Number.isNaN(d.getTime())) return "—";
    return format(d, "MMM yyyy");
  }, [user?.createdAt]);

  useEffect(() => {
    if (!user) return;
    const ymd = isoToYmd(user.dateOfBirth);
    const dobDisp = user.dateOfBirth ? formatDobDisplay(user.dateOfBirth) : "";
    setDraft({
      fullName: user.fullName || "",
      mobile: user.mobile || "",
      dobText: dobDisp === "—" ? "" : dobDisp,
      dobYmd: ymd,
      gender: normalizeStoredGender(user.gender),
    });
  }, [user]);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.replace("/auth?next=/profile/details");
      return;
    }
    if (!isSeller) {
      setListingCount(null);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const { data } = await api.get("/products/my-listings");
        if (!cancelled) setListingCount(Array.isArray(data) ? data.length : 0);
      } catch {
        if (!cancelled) setListingCount(0);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user, authLoading, router, isSeller]);

  useEffect(() => {
    if (!draft.dobYmd) return;
    const display = formatDobDisplay(`${draft.dobYmd}T12:00:00`);
    if (display !== "—" && display !== draft.dobText) {
      setDraft((p) => ({ ...p, dobText: display }));
    }
  }, [draft.dobYmd]);

  const resetDraftFromUser = () => {
    if (!user) return;
    const ymd = isoToYmd(user.dateOfBirth);
    const dobDisp = user.dateOfBirth ? formatDobDisplay(user.dateOfBirth) : "";
    setDraft({
      fullName: user.fullName || "",
      mobile: user.mobile || "",
      dobText: dobDisp === "—" ? "" : dobDisp,
      dobYmd: ymd,
      gender: normalizeStoredGender(user.gender),
    });
  };

  const saveProfile = async () => {
    const name = draft.fullName.trim();
    if (!name) {
      toast.error("Full name is required.");
      return;
    }

    let payloadDob = draft.dobYmd || parseTypedDobToYmd(draft.dobText);
    if (draft.dobText?.trim() && !payloadDob) {
      toast.error("Please enter a valid date of birth (or use the calendar).");
      return;
    }
    if (!draft.dobText?.trim()) payloadDob = null;

    setSaving(true);
    try {
      await api.put("/auth/profile", {
        fullName: name,
        mobile: draft.mobile.trim(),
        dateOfBirth: payloadDob,
        gender: draft.gender || "",
      });
      const { data: fresh } = await api.get("/auth/profile");
      setUser((prev) => ({ ...prev, ...fresh }));
      toast.success("Profile saved.");
      setEditing(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not save profile.");
    } finally {
      setSaving(false);
    }
  };

  const startEditing = () => {
    resetDraftFromUser();
    setEditing(true);
  };

  const cancelEditing = () => {
    resetDraftFromUser();
    setEditing(false);
  };

  if (authLoading || !user) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-white">
        <p className="animate-pulse text-[14px] font-medium text-gray-400">Loading…</p>
      </div>
    );
  }

  const displayDob = formatDobDisplay(user?.dateOfBirth);
  const displayGender = genderLabel(user?.gender);

  return (
    <div className="min-h-[100dvh] bg-white pb-28 font-sans">
      <header className="sticky top-0 z-30 border-b border-gray-100 bg-white">
        <div className="mx-auto grid max-w-[1280px] grid-cols-[auto_1fr_auto] items-center gap-2 px-3 py-2 md:px-6">
          <button
            type="button"
            onClick={() => router.back()}
            className="-ml-1 rounded-full p-2 text-gray-800 hover:bg-gray-100"
            aria-label="Back"
          >
            <ArrowBackOutlinedIcon sx={{ fontSize: 22 }} />
          </button>
          <h1 className="text-center text-[17px] font-bold text-gray-900">Profile Details</h1>
          <div className="flex min-w-[132px] items-center justify-end gap-2 sm:gap-3">
            {editing ? (
              <>
                <button
                  type="button"
                  onClick={cancelEditing}
                  disabled={saving}
                  className="rounded-lg px-2 py-2 text-[14px] font-semibold text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => saveProfile()}
                  disabled={saving}
                  className="rounded-lg px-3 py-2 text-[14px] font-bold disabled:opacity-50"
                  style={{ color: BRAND_PINK }}
                >
                  {saving ? "Saving…" : "Save"}
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={startEditing}
                className="rounded-lg py-2 pl-3 pr-1 text-[15px] font-semibold"
                style={{ color: BRAND_PINK }}
              >
                Edit
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1280px] px-4 pt-8 md:px-6">
        <div className="mx-auto mb-8 flex h-[88px] w-[88px] items-center justify-center rounded-full bg-[#F7246E] text-[28px] font-bold text-white shadow-md ring-4 ring-pink-100 md:h-[100px] md:w-[100px] md:text-[32px]">
          {user.avatar ? (
            <div className="relative h-full w-full overflow-hidden rounded-full">
              <Image src={user.avatar} alt="" fill className="object-cover" sizes="88px" />
            </div>
          ) : (
            <span aria-hidden>{initialsFromName(user.fullName)}</span>
          )}
        </div>

        <div className="mx-auto max-w-2xl overflow-hidden rounded-2xl border border-gray-200/90 bg-white shadow-[0_1px_8px_rgba(0,0,0,0.06)]">
          <ProfileRow
            icon={<PersonOutlineOutlinedIcon sx={{ fontSize: 22 }} />}
            label="Full Name"
            value={editing ? null : user.fullName || "—"}
            editing={editing}
            input={
              <input
                type="text"
                value={draft.fullName}
                onChange={(e) => setDraft((p) => ({ ...p, fullName: e.target.value }))}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-[15px] font-semibold text-gray-900 outline-none focus:border-[#F7246E]"
                placeholder="Full name"
              />
            }
          />
          <ProfileRow
            icon={<EmailOutlinedIcon sx={{ fontSize: 22 }} />}
            label="Email Address"
            value={user.email || "—"}
            editing={false}
          />
          <ProfileRow
            icon={<PhoneOutlinedIcon sx={{ fontSize: 22 }} />}
            label="Phone Number"
            value={editing ? null : user.mobile || "—"}
            editing={editing}
            input={
              <input
                type="tel"
                value={draft.mobile}
                onChange={(e) => setDraft((p) => ({ ...p, mobile: e.target.value }))}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-[15px] font-semibold text-gray-900 outline-none focus:border-[#F7246E]"
                placeholder="+91 98765 43210"
              />
            }
          />
          <ProfileRow
            icon={<CalendarMonthOutlinedIcon sx={{ fontSize: 22 }} />}
            label="Date of Birth"
            value={editing ? null : displayDob}
            editing={editing}
            input={
              <DobEditFieldModern
                dobText={draft.dobText}
                dobYmd={draft.dobYmd}
                onTextChange={(v) => setDraft((p) => ({ ...p, dobText: v }))}
                onPickYmd={(ymd) =>
                  setDraft((p) => ({
                    ...p,
                    dobYmd: ymd,
                    dobText: ymd ? formatDobDisplay(`${ymd}T12:00:00`) : "",
                  }))
                }
                onBlurText={() => {
                  const y = parseTypedDobToYmd(draft.dobText);
                  if (y) setDraft((p) => ({ ...p, dobYmd: y, dobText: formatDobDisplay(`${y}T12:00:00`) }));
                }}
              />
            }
          />
          <ProfileRow
            icon={<WcRoundedIcon sx={{ fontSize: 22 }} />}
            label="Gender"
            value={editing ? null : displayGender}
            editing={editing}
            input={
              <div className="relative">
                <select
                  value={draft.gender || ""}
                  onChange={(e) => setDraft((p) => ({ ...p, gender: e.target.value }))}
                  className="w-full appearance-none rounded-lg border border-gray-200 bg-gray-50 py-3 pl-3 pr-10 text-[15px] font-semibold text-gray-900 outline-none focus:border-[#F7246E]"
                >
                  <option value="">Select gender</option>
                  {GENDER_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
                <KeyboardArrowDownRoundedIcon
                  className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                  sx={{ fontSize: 22 }}
                  aria-hidden
                />
              </div>
            }
            last
          />
        </div>

        {editing && (
          <button
            type="button"
            onClick={() => saveProfile()}
            disabled={saving}
            className="mx-auto mt-6 block w-full max-w-2xl rounded-2xl py-4 text-[16px] font-bold text-white shadow-lg shadow-[#F7246E]/25 transition active:scale-[0.98] disabled:opacity-60"
            style={{ backgroundColor: BRAND_PINK }}
          >
            {saving ? "Saving…" : "Save changes"}
          </button>
        )}

        {isSeller && (
          <section className={`mx-auto mt-8 max-w-2xl ${editing ? "opacity-60" : ""}`}>
            <h2 className="mb-3 text-[15px] font-bold text-gray-900">My Store</h2>
            <div className="flex items-center gap-3 overflow-hidden rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
              <IconWrap>
                <StorefrontOutlinedIcon sx={{ fontSize: 22 }} />
              </IconWrap>
              <div className="min-w-0 flex-1">
                <p className="text-[16px] font-bold text-gray-900">{storeTitle}</p>
                <p className="mt-0.5 text-[13px] text-gray-500">
                  Seller since {sellerSinceLabel}
                  {listingCount != null ? ` • ${listingCount} Listings` : ""}
                </p>
              </div>
              <Link
                href="/profile/listings"
                className="flex shrink-0 items-center gap-0.5 text-[14px] font-semibold"
                style={{ color: BRAND_PINK }}
              >
                View Store
                <KeyboardArrowRightOutlinedIcon sx={{ fontSize: 20, color: BRAND_PINK }} />
              </Link>
            </div>
          </section>
        )}

        <button
          type="button"
          onClick={() => {
            logout();
            toast.success("Logged out");
          }}
          className="mx-auto mt-10 block w-full max-w-2xl rounded-2xl border-2 py-3.5 text-[16px] font-bold transition-colors hover:bg-[#FFF5F8]"
          style={{ borderColor: BRAND_PINK, color: BRAND_PINK }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

function ProfileRow({ icon, label, value, editing, input, last, hideChevron }) {
  const display = value == null || value === "" ? "—" : value;
  const isEmptyDash = display === "—";

  return (
    <div
      className={`flex min-h-[64px] items-center gap-3 px-4 py-3 ${last ? "" : "border-b border-gray-100"}`}
    >
      <IconWrap>{icon}</IconWrap>
      <div className="min-w-0 flex-1 py-0.5">
        <p className="text-[13px] font-medium leading-snug tracking-wide text-gray-500">{label}</p>
        {editing && input ? (
          <div className="mt-2">{input}</div>
        ) : (
          <p
            className={`mt-1 text-[16px] font-semibold leading-snug tracking-tight ${
              isEmptyDash ? "font-medium text-gray-400" : "text-neutral-950"
            }`}
          >
            {display}
          </p>
        )}
      </div>
      {!hideChevron && !editing ? (
        <KeyboardArrowRightOutlinedIcon className="shrink-0 text-gray-300" sx={{ fontSize: 22 }} aria-hidden />
      ) : null}
    </div>
  );
}
