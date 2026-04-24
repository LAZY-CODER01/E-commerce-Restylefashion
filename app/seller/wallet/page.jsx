"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Wallet } from "lucide-react";
import SellerProcessBottomNav from "@/components/SellerProcessBottomNav";
import { readSellerHubState } from "@/lib/sellerHubProfile";

export default function SellerWalletPage() {
  const router = useRouter();
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    const hub = readSellerHubState();
    setBalance(Math.max(0, Math.floor(Number(hub.restyleWalletBalance) || 0)));
  }, []);

  return (
    <div className="min-h-screen bg-brand-light pb-24 font-sans">
      <div className="mx-auto max-w-2xl px-4 py-8">
        <div className="mb-4 flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-700 shadow-sm transition hover:bg-gray-50"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5" strokeWidth={2} />
          </button>
        </div>
        <div className="mb-2 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-gray-500">
          <Wallet className="h-4 w-4 text-brand-pink" strokeWidth={2} aria-hidden />
          Wallet
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-brand-dark sm:text-3xl">Earnings &amp; balance</h1>
        <p className="mt-2 text-sm text-gray-500">
          Track payouts and view your full performance on the seller dashboard.
        </p>

        <div className="mt-8 rounded-[28px] border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400">Restyle wallet</p>
          <p className="mt-1 text-3xl font-bold tabular-nums text-brand-dark sm:text-4xl">
            ₹{balance.toLocaleString("en-IN")}
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Used for boost purchases. Top up from the boost flow, or pay for boosts with this balance when
            you have enough.
          </p>
          <div className="mt-4 flex h-20 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-50/80 to-white">
            <Image
              src="/seller-wallet.png"
              alt=""
              width={64}
              height={64}
              className="h-14 w-14 object-contain opacity-90"
            />
          </div>
        </div>

        <Link
          href="/seller/dashboard"
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white py-4 text-sm font-bold text-brand-dark shadow-sm transition hover:border-brand-pink/30 hover:bg-rose-50/50"
        >
          Open seller dashboard
          <ArrowUpRight className="h-4 w-4" strokeWidth={2.25} />
        </Link>
      </div>
      <SellerProcessBottomNav />
    </div>
  );
}
