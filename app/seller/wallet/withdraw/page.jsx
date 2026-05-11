"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft, Building2, ChevronRight, Shield, Wallet } from "lucide-react";
import { toast } from "react-toastify";
import SellerProcessBottomNav from "@/components/SellerProcessBottomNav";
import { readSellerHubState, writeSellerHubState } from "@/lib/sellerHubProfile";
import api from "@/lib/api";

const MIN_WITHDRAW = 200;

function formatINR2(n) {
  return Number(n || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatAmountInputDigits(digits) {
  if (!digits) return "";
  const n = parseInt(digits, 10);
  if (!Number.isFinite(n)) return "";
  return n.toLocaleString("en-IN");
}

export default function SellerWithdrawPage() {
  const router = useRouter();
  const [withdrawalBalance, setWithdrawalBalance] = useState(0);
  const [amountDigits, setAmountDigits] = useState("1000");
  const [payoutAccount, setPayoutAccount] = useState("upi");
  const [upiId, setUpiId] = useState("username@upi");
  const [bankLine, setBankLine] = useState("HDFC Bank •••• 1234");
  const [withdrawing, setWithdrawing] = useState(false);

  useEffect(() => {
    const hub = readSellerHubState();
    if (typeof hub.withdrawalUpiId === "string" && hub.withdrawalUpiId.trim()) {
      setUpiId(hub.withdrawalUpiId.trim());
    }
    if (typeof hub.withdrawalBankMasked === "string" && hub.withdrawalBankMasked.trim()) {
      setBankLine(hub.withdrawalBankMasked.trim());
    }
  }, []);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const { data } = await api.get("/wallet");
        if (!alive) return;
        const full = Math.floor(Number(data.balance) || 0);
        const withdrawable = Math.floor(
          Number(data.breakdown?.withdrawable ?? data.balance) || 0
        );
        setWithdrawalBalance(withdrawable);
        writeSellerHubState({ restyleWalletBalance: full });
      } catch {
        const hub = readSellerHubState();
        const w = Number(hub.restyleWalletBalance);
        if (Number.isFinite(w) && w > 0) setWithdrawalBalance(Math.floor(w));
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const amountNumber = useMemo(() => parseInt(amountDigits || "0", 10) || 0, [amountDigits]);

  async function onWithdrawSubmit() {
    if (amountNumber < MIN_WITHDRAW) {
      toast.error(`Minimum withdrawal amount is ₹${MIN_WITHDRAW.toLocaleString("en-IN")}.`);
      return;
    }
    if (amountNumber > withdrawalBalance) {
      toast.error("Amount exceeds withdrawal balance.");
      return;
    }
    setWithdrawing(true);
    try {
      const { data } = await api.post("/wallet/withdraw", { amount: amountNumber });
      const next = Math.floor(Number(data.balance) || 0);
      setWithdrawalBalance(next);
      writeSellerHubState({ restyleWalletBalance: next });
      toast.success("Withdrawal recorded. Funds will be sent to your linked account.");
      router.push("/seller/wallet");
    } catch (e) {
      const msg = e?.response?.data?.message || "Withdrawal failed.";
      toast.error(msg);
    } finally {
      setWithdrawing(false);
    }
  }

  function onAmountChange(e) {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 12);
    setAmountDigits(raw);
  }

  return (
    <div className="min-h-screen bg-white pb-28 font-sans">
      <main className="mx-auto w-full max-w-[1200px] px-4 pt-3 pb-8 md:px-9 md:pt-5">
        <div className="mx-auto w-full max-w-[720px]">
          <header className="relative mb-7 flex min-h-[48px] items-center justify-between gap-3 md:mb-8">
            <button
              type="button"
              onClick={() => router.back()}
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-900 shadow-sm transition hover:bg-gray-50 md:h-11 md:w-11"
              aria-label="Go back"
            >
              <ArrowLeft className="h-5 w-5" strokeWidth={2} />
            </button>
            <h1 className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[17px] font-bold tracking-tight text-gray-900 md:text-xl">
              Withdraw
            </h1>
            <span className="h-10 w-10 shrink-0 md:h-11 md:w-11" aria-hidden />
          </header>

          {/* Withdrawal balance */}
          <section className="mb-8">
            <p className="text-[14px] font-medium text-gray-500">Withdrawal Balance</p>
            <p className="mt-1 text-[32px] font-bold tabular-nums leading-none tracking-tight text-gray-900 sm:text-[36px]">
              ₹ {formatINR2(withdrawalBalance)}
            </p>
          </section>

          {/* Enter amount */}
          <section className="mb-8">
            <h2 className="text-[15px] font-bold text-gray-900">Enter Amount</h2>
            <div className="mt-3 flex items-center gap-2 rounded-lg border border-gray-300 bg-gray-100 px-3 py-2">
              <label className="flex min-w-0 flex-1 items-center">
                <span className="sr-only">Amount in rupees</span>
                <span className="text-lg font-bold text-gray-900 tabular-nums sm:text-xl">₹</span>
                <input
                  type="text"
                  inputMode="numeric"
                  autoComplete="off"
                  value={formatAmountInputDigits(amountDigits)}
                  onChange={onAmountChange}
                  placeholder="0"
                  className="min-w-0 flex-1 border-0 bg-transparent py-1 pr-2 pl-1 text-lg font-bold placeholder:text-gray-400 focus:outline-none focus:ring-0 sm:text-xl"
                />
              </label>
              <button
                type="button"
                disabled={withdrawing}
                className="h-9 shrink-0 rounded-md bg-brand-pink px-4 text-[13px] font-bold leading-none text-white shadow-sm transition hover:bg-brand-pink-hover active:scale-[0.98] disabled:opacity-50 sm:h-9 sm:px-5"
                onClick={onWithdrawSubmit}
              >
                {withdrawing ? "…" : "Withdraw"}
              </button>
            </div>
            <p className="mt-2.5 text-[13px] text-gray-500">
              Minimum withdrawal amount is ₹{MIN_WITHDRAW.toLocaleString("en-IN")}{" "}
              <span className="font-semibold text-emerald-600">(Instant Withdrawal)</span>
            </p>
          </section>

          {/* Your withdrawal account */}
          <section className="mb-8">
            <h2 className="text-[15px] font-bold text-gray-900">Your Withdrawal Account</h2>
            <div className="mt-3 overflow-hidden rounded-2xl border border-gray-200 bg-white">
              <button
                type="button"
                onClick={() => setPayoutAccount("upi")}
                className={`flex w-full items-center gap-3 border-b border-gray-100 px-4 py-4 text-left transition md:px-5 ${
                  payoutAccount === "upi" ? "bg-rose-50/70" : "bg-white"
                }`}
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white">
                  <Image src="/payment-upi.svg" alt="" width={36} height={36} className="h-9 w-9 object-contain" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[14px] font-bold text-gray-900">UPI ID</p>
                  <p className="mt-0.5 truncate text-[13px] text-gray-500">{upiId}</p>
                </div>
                <span
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                    payoutAccount === "upi" ? "border-brand-pink bg-brand-pink" : "border-gray-300 bg-white"
                  }`}
                  aria-hidden
                >
                  {payoutAccount === "upi" ? <span className="h-2 w-2 rounded-full bg-white" /> : null}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setPayoutAccount("bank")}
                className={`flex w-full items-center gap-3 px-4 py-4 text-left transition md:px-5 ${
                  payoutAccount === "bank" ? "bg-rose-50/70" : "bg-white"
                }`}
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-rose-50">
                  <Building2 className="h-5 w-5 text-brand-pink" strokeWidth={2} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[14px] font-bold text-gray-900">Bank Account</p>
                  <p className="mt-0.5 truncate text-[13px] text-gray-500">{bankLine}</p>
                </div>
                <span
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                    payoutAccount === "bank" ? "border-brand-pink bg-brand-pink" : "border-gray-300 bg-white"
                  }`}
                  aria-hidden
                >
                  {payoutAccount === "bank" ? <span className="h-2 w-2 rounded-full bg-white" /> : null}
                </span>
              </button>
            </div>
            <div className="mt-3 flex items-start gap-2.5 rounded-xl bg-[#ede9fe] px-4 py-3 md:px-4 md:py-3.5">
              <Shield className="mt-0.5 h-4 w-4 shrink-0 text-brand-pink" strokeWidth={2} />
              <p className="text-[12px] font-medium leading-snug text-[#4c1d95] md:text-[13px]">
                This account will be used for all your withdrawals
              </p>
            </div>
          </section>

          {/* Choose method */}
          <section className="mb-4">
            <h2 className="text-[15px] font-bold text-gray-900">Choose Withdrawal Method</h2>
            <div className="mt-3 overflow-hidden rounded-2xl border border-gray-200 bg-white">
              {[
                {
                  key: "bank",
                  icon: Building2,
                  title: "Bank Account",
                  sub: "Transfer to bank account",
                },
                {
                  key: "upi",
                  icon: null,
                  isUpiSvg: true,
                  title: "UPI ID",
                  sub: "Transfer to UPI ID",
                },
                {
                  key: "wallet",
                  icon: Wallet,
                  title: "Wallet",
                  sub: "Transfer to wallet balance",
                },
              ].map((row, i, arr) => {
                const RowIcon = row.icon;
                return (
                <button
                  key={row.key}
                  type="button"
                  className={`flex w-full items-center gap-3 px-4 py-4 text-left transition hover:bg-gray-50 md:px-5 ${
                    i < arr.length - 1 ? "border-b border-gray-100" : ""
                  }`}
                  onClick={() => toast.info(`${row.title} flow coming soon.`)}
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-rose-50">
                    {row.isUpiSvg ? (
                      <Image src="/payment-upi.svg" alt="" width={28} height={28} className="h-7 w-7 object-contain" />
                    ) : (
                      RowIcon && <RowIcon className="h-5 w-5 text-brand-pink" strokeWidth={2} />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[14px] font-bold text-gray-900">{row.title}</p>
                    <p className="mt-0.5 text-[13px] text-gray-500">{row.sub}</p>
                  </div>
                  <ChevronRight className="h-5 w-5 shrink-0 text-gray-400" strokeWidth={2} />
                </button>
                );
              })}
            </div>
          </section>
        </div>
      </main>
      <SellerProcessBottomNav />
    </div>
  );
}
