"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

export default function PinkHeader({ title, showBack = false, backHref = null }) {
  const router = useRouter();

  return (
    <header className="relative">
      <div
        className="h-[112px] w-full bg-gradient-to-r from-[#F7246E] via-[#FF2E7E] to-[#FF4D87]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-25"
        aria-hidden
        style={{
          background:
            "radial-gradient(650px 220px at 20% 0%, rgba(255,255,255,0.55), transparent 60%), radial-gradient(520px 180px at 80% 10%, rgba(255,255,255,0.45), transparent 55%)",
        }}
      />

      <div className="absolute inset-x-0 top-0 mx-auto flex max-w-[560px] items-center justify-center px-4 pt-8">
        {showBack ? (
          <button
            type="button"
            onClick={() => (backHref ? router.push(backHref) : router.back())}
            className="absolute left-4 top-7 flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md transition active:scale-[0.98]"
            aria-label="Back"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        ) : null}
        <h1 className="text-[20px] font-semibold tracking-tight text-white">{title}</h1>
      </div>
    </header>
  );
}

