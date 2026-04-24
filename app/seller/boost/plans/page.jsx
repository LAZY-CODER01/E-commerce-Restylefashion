"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Layers } from "lucide-react";
import { readSellerHubState } from "@/lib/sellerHubProfile";
import SellerProcessBottomNav from "@/components/SellerProcessBottomNav";

function formatRupee(n) {
  if (n == null || Number.isNaN(Number(n))) return "—";
  return `₹${Number(n).toLocaleString("en-IN")}`;
}

function formatDate(ts) {
  if (!ts) return "—";
  try {
    return new Date(ts).toLocaleString();
  } catch {
    return "—";
  }
}

export default function SellerBoostPlansPage() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const hub = readSellerHubState();
    setHistory(Array.isArray(hub.boostHistory) ? hub.boostHistory : []);
  }, []);

  return (
    <div className="min-h-screen bg-neutral-100 px-4 py-8 pb-24 font-sans text-neutral-900">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6 flex items-center gap-4">
          <Link
            href="/seller/profile"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-neutral-200 bg-white text-neutral-700 shadow-sm transition hover:bg-neutral-50"
            aria-label="Back to profile"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <p className="flex items-center gap-2 text-sm font-semibold text-neutral-500">
              <Layers className="h-4 w-4" />
              Boost &amp; plans
            </p>
            <h1 className="text-2xl font-bold tracking-tight">Your boost purchases</h1>
            <p className="text-sm text-neutral-500">
              Amounts you paid to boost visibility for this profile (this device).
            </p>
          </div>
        </div>

        {history.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-neutral-300 bg-white p-10 text-center text-neutral-500">
            No boosts yet.{" "}
            <Link href="/seller/boost" className="font-semibold text-rose-600 underline">
              View boost packages and prices
            </Link>
            .
          </div>
        ) : (
          <ul className="flex flex-col gap-3">
            {history.map((row, i) => (
              <li
                key={`${row.at}-${i}`}
                className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-neutral-200 bg-white px-5 py-4 shadow-sm"
              >
                <div>
                  <p className="font-semibold text-neutral-900">{row.label}</p>
                  <p className="text-xs text-neutral-500">{formatDate(row.at)}</p>
                  {row.method ? (
                    <p className="mt-1 text-[11px] uppercase tracking-wide text-neutral-400">
                      {row.method}
                    </p>
                  ) : null}
                </div>
                <p className="text-xl font-bold tabular-nums text-neutral-950">
                  {formatRupee(row.amount)}
                </p>
              </li>
            ))}
          </ul>
        )}

        <p className="mt-8 text-center text-sm text-neutral-500">
          <Link href="/seller/boost" className="font-semibold text-rose-600 underline">
            Manage ads — buy another boost
          </Link>
        </p>
      </div>
      <SellerProcessBottomNav />
    </div>
  );
}
