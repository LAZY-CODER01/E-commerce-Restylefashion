"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Wallet, TrendingUp, History } from "lucide-react";
import SellerProcessBottomNav from "@/components/SellerProcessBottomNav";
import api from "@/lib/api";

export default function SellerWalletPage() {
  const router = useRouter();
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchWallet = async () => {
      try {
        const { data } = await api.get("/wallet");
        if (isMounted) {
          setBalance(data.balance || 0);
          setTransactions(data.transactions || []);
        }
      } catch (err) {
        console.error("Failed to fetch wallet data:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchWallet();
    return () => { isMounted = false; };
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
          {loading ? (
             <div className="mt-1 h-10 w-32 animate-pulse rounded bg-gray-200" />
          ) : (
            <p className="mt-1 text-3xl font-bold tabular-nums text-brand-dark sm:text-4xl">
              ₹{balance.toLocaleString("en-IN")}
            </p>
          )}
          <p className="mt-2 text-sm text-gray-500">
            Available funds from your completed sales. These funds can be used for boosts or withdrawn to your bank account.
          </p>
          {/* <div className="mt-4 flex h-20 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-50/80 to-white">
            <Image
              src="/seller-wallet.png"
              alt=""
              width={64}
              height={64}
              className="h-14 w-14 object-contain opacity-90"
            />
          </div> */}
        </div>

        {/* Transactions Ledger */}
        <div className="mt-8">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-brand-dark">
            <History className="h-5 w-5 text-gray-400" />
            Recent Transactions
          </h2>
          {loading ? (
             <div className="space-y-3">
               {[1, 2, 3].map(i => (
                 <div key={i} className="h-20 w-full animate-pulse rounded-2xl bg-white border border-gray-100" />
               ))}
             </div>
          ) : transactions.length === 0 ? (
            <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center text-gray-500 shadow-sm">
              No transactions yet. List items to start earning!
            </div>
          ) : (
            <div className="space-y-3">
              {transactions.map((tx) => (
                <div key={tx._id} className="flex items-center justify-between rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition hover:shadow-md">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                      <TrendingUp className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-brand-dark">{tx.description}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {new Date(tx.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-emerald-600 tabular-nums">
                      +₹{tx.amount.toLocaleString("en-IN")}
                    </p>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-600/70">
                      Credit
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <Link
          href="/seller/dashboard"
          className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white py-4 text-sm font-bold text-brand-dark shadow-sm transition hover:border-brand-pink/30 hover:bg-rose-50/50"
        >
          Open seller dashboard
          <ArrowUpRight className="h-4 w-4" strokeWidth={2.25} />
        </Link>
      </div>
      <SellerProcessBottomNav />
    </div>
  );
}
