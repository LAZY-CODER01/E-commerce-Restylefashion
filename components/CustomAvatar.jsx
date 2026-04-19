"use client";

import React from "react";
import { Pencil } from "lucide-react";
import clsx from "clsx";

const sizeClass = {
  sm: "h-12 w-12 text-lg",
  md: "h-16 w-16 text-xl",
  lg: "h-24 w-24 text-2xl md:h-28 md:w-28 md:text-3xl",
};

/** First letter of first name + first letter of last name (e.g. "Avinash Singh" → AS). Not seller type. */
export function nameToAvatarInitials(fullName) {
  const s = String(fullName || "").trim();
  if (!s) return "?";
  const parts = s.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    const a = parts[0][0] || "";
    const b = parts[parts.length - 1][0] || "";
    return `${a}${b}`.toUpperCase();
  }
  const w = parts[0];
  if (w.length >= 2) return w.slice(0, 2).toUpperCase();
  return `${w[0]}`.toUpperCase();
}

/**
 * @param {object} props
 * @param {string} props.name — full name for initials (first + last word); ignores seller type
 * @param {number} [props.duplicateIndex] — appended when set (e.g. 2 → "AS2")
 * @param {"sm"|"md"|"lg"} [props.size="lg"]
 * @param {boolean} [props.verified]
 * @param {() => void} [props.onEditClick]
 */
export default function CustomAvatar({
  name = "",
  duplicateIndex,
  size = "lg",
  className,
  verified = false,
  onEditClick,
}) {
  let initials = nameToAvatarInitials(name);
  if (duplicateIndex != null && duplicateIndex !== "") {
    initials = `${initials}${duplicateIndex}`;
  }

  return (
    <div className={clsx("relative inline-flex shrink-0", className)}>
      <div
        className={clsx(
          "flex items-center justify-center rounded-2xl bg-neutral-900 font-bold tracking-tight text-white shadow-sm",
          sizeClass[size] || sizeClass.lg
        )}
        aria-hidden
      >
        {initials}
      </div>
      {verified && (
        <span
          className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white shadow ring-2 ring-white"
          title="Verified"
          aria-label="Verified seller"
        >
          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      )}
      <button
        type="button"
        onClick={onEditClick}
        className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-white text-neutral-900 shadow-md ring-1 ring-neutral-200 transition hover:bg-neutral-50 focus-visible:outline focus-visible:ring-2 focus-visible:ring-neutral-400"
        aria-label="Edit profile photo"
      >
        <Pencil className="h-3.5 w-3.5" strokeWidth={2} />
      </button>
    </div>
  );
}
