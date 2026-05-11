"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, CreditCard, ChevronRight } from "lucide-react";
import { toast } from "react-toastify";
import SellerProcessBottomNav from "@/components/SellerProcessBottomNav";
import api from "@/lib/api";
import { readSellerHubState, writeSellerHubState } from "@/lib/sellerHubProfile";

function getAuthToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("restyle_token") || localStorage.getItem("token");
}

const PINK = "#F7246E";
const PINK_SOFT = "#FFF0F5";

const FILTER_TABS = [
  { id: "all", label: "All" },
  { id: "earning", label: "Earnings" },
  { id: "withdrawal", label: "Withdrawals" },
  { id: "refund", label: "Refunds" },
  { id: "bonus", label: "Bonuses" },
  { id: "topup", label: "Money Added" },
  { id: "pending", label: "Pending" },
];

function formatINR2(n) {
  return Number(n || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatINR0(n) {
  return Number(n || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

function formatTxDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function categorySubtitle(cat) {
  switch (cat) {
    case "earning":
      return "Earnings";
    case "withdrawal":
      return "Withdrawal";
    case "refund":
      return "Refund";
    case "bonus":
      return "Bonus";
    case "topup":
      return "Money Added";
    case "pending":
      return "Pending";
    default:
      return "Wallet";
  }
}

function isPendingTx(tx) {
  return tx.settlementStatus === "pending" || tx.normalizedCategory === "pending";
}

function amountPresentation(tx) {
  const amt = Math.abs(Number(tx.amount) || 0);
  const pending = isPendingTx(tx);
  const credit = tx.type === "credit";

  if (pending) {
    return { text: `₹${formatINR2(amt)}`, className: "text-amber-600 font-bold tabular-nums" };
  }
  if (credit) {
    return {
      text: `+ ₹${formatINR2(amt)}`,
      className: "text-emerald-600 font-bold tabular-nums",
    };
  }
  return {
    text: `− ₹${formatINR2(amt)}`,
    className: "text-gray-900 font-bold tabular-nums",
  };
}

function txMatchesFilter(tx, filterId) {
  if (filterId === "all") return true;
  if (filterId === "pending") return isPendingTx(tx);
  return tx.normalizedCategory === filterId;
}

function getLocalLedger(hub) {
  const ledger = hub?.localWalletLedger;
  return Array.isArray(ledger) ? ledger : [];
}

function localCreditSum(ledger) {
  return ledger.reduce(
    (s, tx) => s + (tx?.type === "credit" ? Math.abs(Number(tx.amount) || 0) : 0),
    0
  );
}

/** Dedup by _id, newest first */
function mergeTransactions(serverTxs, localLedger) {
  const byId = new Map();
  const server = Array.isArray(serverTxs) ? serverTxs : [];
  for (const tx of server) {
    if (tx?._id != null) byId.set(String(tx._id), tx);
  }
  for (const tx of localLedger) {
    if (tx?._id != null) byId.set(String(tx._id), tx);
  }
  return Array.from(byId.values()).sort((a, b) => {
    const da = new Date(a.createdAt || 0).getTime();
    const db = new Date(b.createdAt || 0).getTime();
    return db - da;
  });
}

export default function SellerWalletPage() {
  const router = useRouter();
  const [balance, setBalance] = useState(0);
  const [breakdown, setBreakdown] = useState({ withdrawable: 0, pending: 0, bonus: 0 });
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterId, setFilterId] = useState("all");
  const [showAll, setShowAll] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [addDigits, setAddDigits] = useState("");
  const [addSubmitting, setAddSubmitting] = useState(false);

  /**
   * @param {object} data — API wallet payload
   * @param {{ clearLocalLedger?: boolean }} [opts] — set true after successful POST /wallet/topup (server now includes that credit)
   */
  const applyPayload = useCallback((data, opts = {}) => {
    const { clearLocalLedger = false } = opts;
    const hub = readSellerHubState();
    let ledger = getLocalLedger(hub);
    if (clearLocalLedger) {
      ledger = [];
    }
    const serverB = Number(data.balance) || 0;
    const localSum = localCreditSum(ledger);
    const mergedBalance = serverB + localSum;

    if (data.breakdown) {
      const w = Number(data.breakdown.withdrawable) || 0;
      setBreakdown({
        withdrawable: w + localSum,
        pending: Number(data.breakdown.pending) || 0,
        bonus: Number(data.breakdown.bonus) || 0,
      });
    } else {
      setBreakdown({ withdrawable: mergedBalance, pending: 0, bonus: 0 });
    }

    setBalance(mergedBalance);
    setTransactions(mergeTransactions(data.transactions, ledger));

    writeSellerHubState({
      serverWalletBalance: serverB,
      localWalletLedger: ledger,
      restyleWalletBalance: Math.max(0, Math.floor(mergedBalance)),
    });
  }, []);

  const applyHubFallback = useCallback(() => {
    const hub = readSellerHubState();
    const ledger = getLocalLedger(hub);
    let serverB = Number(hub.serverWalletBalance);
    if (!Number.isFinite(serverB)) {
      const ls = localCreditSum(ledger);
      const rw = Math.max(0, Math.floor(Number(hub.restyleWalletBalance) || 0));
      serverB = Math.max(0, rw - ls);
    }
    const merged = serverB + localCreditSum(ledger);
    const display = Math.max(merged, Math.max(0, Math.floor(Number(hub.restyleWalletBalance) || 0)));
    setBalance(display);
    setBreakdown({ withdrawable: display, pending: 0, bonus: 0 });
    setTransactions(mergeTransactions([], ledger));
    writeSellerHubState({
      serverWalletBalance: serverB,
      localWalletLedger: ledger,
      restyleWalletBalance: Math.floor(display),
    });
  }, []);

  const refreshWallet = useCallback(async () => {
    const { data } = await api.get("/wallet");
    applyPayload(data);
  }, [applyPayload]);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        await refreshWallet();
      } catch (e) {
        console.error(e);
        if (alive) applyHubFallback();
        if (alive && !getAuthToken()) {
          toast.info("Showing wallet on this device. Log in to load your account wallet.");
        } else {
          toast.error("Could not load wallet from server. Showing saved balance on this device if any.");
        }
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [refreshWallet, applyHubFallback]);

  useEffect(() => {
    const onHubWallet = () => {
      void (async () => {
        try {
          await refreshWallet();
        } catch {
          applyHubFallback();
        }
      })();
    };
    window.addEventListener("restyle-wallet-hub-updated", onHubWallet);
    return () => window.removeEventListener("restyle-wallet-hub-updated", onHubWallet);
  }, [refreshWallet, applyHubFallback]);

  const filtered = useMemo(
    () => transactions.filter((tx) => txMatchesFilter(tx, filterId)),
    [transactions, filterId]
  );

  const visibleList = showAll ? filtered : filtered.slice(0, 6);

  const applyLocalTopup = useCallback((n) => {
    const hub = readSellerHubState();
    let serverB = Number(hub.serverWalletBalance);
    if (!Number.isFinite(serverB)) {
      const prevLedger = getLocalLedger(hub);
      const ls = localCreditSum(prevLedger);
      const rw = Math.max(0, Math.floor(Number(hub.restyleWalletBalance) || 0));
      serverB = Math.max(0, rw - ls);
    }
    const prevLedger = getLocalLedger(hub);
    const entry = {
      _id: `local_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      description: "Money added to wallet",
      amount: n,
      type: "credit",
      normalizedCategory: "topup",
      settlementStatus: "completed",
      createdAt: new Date().toISOString(),
    };
    const ledger = [entry, ...prevLedger].slice(0, 100);
    const localSum = localCreditSum(ledger);
    const merged = serverB + localSum;

    writeSellerHubState({
      serverWalletBalance: serverB,
      localWalletLedger: ledger,
      restyleWalletBalance: Math.max(0, Math.floor(merged)),
    });
    setBalance(merged);
    setBreakdown({ withdrawable: merged, pending: 0, bonus: 0 });
    setTransactions((txs) => mergeTransactions(txs, [entry]));
  }, []);

  const onAddMoney = async () => {
    const n = parseInt(addDigits.replace(/\D/g, ""), 10) || 0;
    if (n < 1) {
      toast.error("Enter an amount of at least ₹1.");
      return;
    }
    const token = getAuthToken();

    const finishOk = (message) => {
      toast.success(message);
      setAddOpen(false);
      setAddDigits("");
    };

    if (!token) {
      setAddSubmitting(true);
      try {
        applyLocalTopup(n);
        finishOk(
          `₹${formatINR0(n)} added on this device. Log in with the same browser to sync to your account when the server is available.`
        );
      } finally {
        setAddSubmitting(false);
      }
      return;
    }

    setAddSubmitting(true);
    try {
      const { data } = await api.post("/wallet/topup", { amount: n });
      applyPayload(data, { clearLocalLedger: true });
      finishOk(`₹${formatINR0(n)} added to your wallet.`);
    } catch (e) {
      const status = e?.response?.status;
      const msg = e?.response?.data?.message;
      if (status === 401) {
        toast.error("Session expired. Log in again, then add money.");
        return;
      }
      const offline = !e?.response || status === 502 || status === 503 || status === 404;
      if (offline) {
        applyLocalTopup(n);
        finishOk(
          `₹${formatINR0(n)} saved on this device. Start the API server or check your connection — then refresh to sync.`
        );
        return;
      }
      toast.error(msg || e?.message || "Add money failed.");
    } finally {
      setAddSubmitting(false);
    }
  };

  return (
    <div className="min-h-dvh bg-white pb-[calc(5.5rem+env(safe-area-inset-bottom,0px))] font-sans lg:bg-[#F7F7FB] lg:pb-28">
      <div className="mx-auto w-full max-w-[1280px] px-4 pt-3 sm:px-5 sm:pt-4 md:px-6 md:pt-5 lg:px-8 lg:pt-8 lg:pb-2">
        {/* Header — centered title on small screens; left-aligned row on lg */}
        <header className="relative mb-5 flex h-12 items-center justify-between sm:mb-6 lg:mb-8 lg:h-14">
          <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3 lg:flex-initial lg:gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-gray-900 transition hover:bg-gray-100 lg:h-11 lg:w-11 lg:bg-white lg:shadow-sm"
              aria-label="Go back"
            >
              <ArrowLeft className="h-6 w-6" strokeWidth={2} />
            </button>
            <h1 className="hidden truncate text-[17px] font-bold tracking-tight text-gray-900 sm:block lg:text-2xl lg:tracking-tight">
              Wallet
            </h1>
          </div>
          <h1 className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[17px] font-bold tracking-tight text-gray-900 sm:hidden">
            Wallet
          </h1>
          <button
            type="button"
            onClick={() => setAddOpen(true)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-gray-900 transition hover:bg-gray-100 lg:h-11 lg:w-11 lg:bg-white lg:shadow-sm"
            aria-label="Add money"
          >
            <CreditCard className="h-6 w-6 lg:h-7 lg:w-7" strokeWidth={2} />
          </button>
        </header>

        <div className="mx-auto flex w-full max-w-[520px] flex-col gap-8 lg:max-w-none lg:flex-row lg:items-start lg:gap-8 xl:gap-10">
          {/* Balance card */}
          <section
            className="relative w-full shrink-0 overflow-hidden rounded-2xl border border-rose-100 px-4 pb-5 pt-5 shadow-sm sm:px-5 sm:pb-6 sm:pt-6 lg:sticky lg:top-24 lg:max-w-md lg:rounded-3xl lg:px-6 lg:pb-7 lg:pt-7 xl:max-w-lg"
            style={{ backgroundColor: PINK_SOFT }}
          >
            <div className="flex gap-3 sm:gap-4 lg:gap-5">
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-medium text-gray-500 lg:text-sm">Available Balance</p>
                {loading ? (
                  <div className="mt-2 h-9 w-40 animate-pulse rounded-lg bg-white/80 lg:h-11 lg:w-48" />
                ) : (
                  <p className="mt-1 text-[28px] font-bold leading-tight tracking-tight text-gray-900 tabular-nums sm:text-[32px] md:text-[34px] lg:text-[36px] xl:text-[40px]">
                    ₹{formatINR2(balance)}
                  </p>
                )}

                <div className="mt-5 space-y-2.5 text-[13px] lg:mt-6 lg:space-y-3 lg:text-sm">
                  <div className="flex items-center justify-between gap-2 text-gray-600">
                    <span>Withdrawal</span>
                    <span className="shrink-0 font-semibold tabular-nums text-gray-900">
                      ₹{formatINR2(breakdown.withdrawable)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2 text-gray-600">
                    <span>Pending</span>
                    <span className="shrink-0 font-semibold tabular-nums text-gray-900">
                      ₹{formatINR2(breakdown.pending)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium text-gray-600">
                      Bonus <span className="text-gray-400">|</span>{" "}
                      <span style={{ color: PINK }} className="font-semibold">
                        Rewards
                      </span>
                    </span>
                    <span className="shrink-0 font-semibold tabular-nums text-gray-900">
                      ₹{formatINR2(breakdown.bonus)}
                    </span>
                  </div>
                </div>
                <p className="mt-2 text-[11px] leading-snug text-gray-500 lg:text-xs">
                  (use to unlock exclusive features and plans)
                </p>
              </div>

              <div className="pointer-events-none relative mt-1 h-[92px] w-[80px] shrink-0 sm:mt-2 sm:h-[100px] sm:w-[88px] lg:h-[120px] lg:w-[108px] xl:h-[132px] xl:w-[120px]">
                <Image
                  src="/seller-wallet.png"
                  alt=""
                  width={140}
                  height={140}
                  className="h-full w-full object-contain object-right drop-shadow-md"
                />
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3 sm:mt-6 sm:gap-4 lg:mt-7">
              <button
                type="button"
                onClick={() => setAddOpen(true)}
                className="rounded-xl py-3.5 text-[14px] font-bold text-white shadow-md transition hover:opacity-95 active:scale-[0.98] lg:py-4 lg:text-[15px]"
                style={{ backgroundColor: PINK, boxShadow: "0 8px 20px rgba(247, 36, 110, 0.35)" }}
              >
                Add Money
              </button>
              <Link
                href="/seller/wallet/withdraw"
                className="flex items-center justify-center rounded-xl border-2 bg-white py-3.5 text-[14px] font-bold transition hover:bg-rose-50/80 active:scale-[0.98] lg:py-4 lg:text-[15px]"
                style={{ borderColor: PINK, color: PINK }}
              >
                Withdraw
              </Link>
            </div>
          </section>

          {/* Recent transactions */}
          <section className="min-w-0 flex-1 lg:mt-0">
            <div className="mb-3 flex flex-wrap items-end justify-between gap-2 sm:mb-4">
              <h2 className="text-[16px] font-bold text-gray-900 lg:text-lg xl:text-xl">Recent Transactions</h2>
              <button
                type="button"
                onClick={() => setShowAll((v) => !v)}
                className="text-[13px] font-semibold transition hover:opacity-80 lg:text-sm"
                style={{ color: PINK }}
              >
                {showAll ? "Show less" : "View All"}
              </button>
            </div>

            <div className="-mx-1 mb-4 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:mx-0 lg:flex-wrap lg:overflow-visible">
              {FILTER_TABS.map((tab) => {
                const active = filterId === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setFilterId(tab.id)}
                    className={`shrink-0 rounded-full border px-3.5 py-2 text-[12px] font-bold transition sm:px-4 sm:text-[13px] lg:py-2.5 lg:text-[13px] ${
                      active
                        ? "border-transparent text-white shadow-sm"
                        : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 lg:bg-white"
                    }`}
                    style={active ? { backgroundColor: PINK } : undefined}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white shadow-sm lg:rounded-3xl lg:shadow-md">
              {loading ? (
                <div className="divide-y divide-gray-100 p-2 lg:p-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex animate-pulse gap-3 px-3 py-4 lg:px-5 lg:py-5">
                      <div className="h-12 flex-1 rounded-lg bg-gray-100 lg:h-14" />
                      <div className="h-12 w-28 rounded-lg bg-gray-100 lg:h-14 lg:w-32" />
                    </div>
                  ))}
                </div>
              ) : visibleList.length === 0 ? (
                <p className="px-4 py-12 text-center text-[14px] text-gray-500 lg:py-16 lg:text-[15px]">
                  No transactions in this category yet.
                </p>
              ) : (
                <ul className="divide-y divide-gray-100">
                  {visibleList.map((tx) => {
                    const sub = categorySubtitle(tx.normalizedCategory);
                    const { text: amtText, className: amtClass } = amountPresentation(tx);
                    return (
                      <li key={tx._id}>
                        <button
                          type="button"
                          className="flex w-full items-center gap-3 px-4 py-4 text-left transition hover:bg-gray-50/80 sm:gap-4 lg:px-6 lg:py-5"
                          onClick={() =>
                            toast.info(
                              `${tx.description} · ${sub} · ${amtText} · ${formatTxDate(tx.createdAt)}`
                            )
                          }
                        >
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-[14px] font-bold text-gray-900 lg:text-[15px]">
                              {tx.description}
                            </p>
                            <p className="mt-0.5 text-[12px] text-gray-500 lg:text-sm">{sub}</p>
                          </div>
                          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                            <div className="text-right">
                              <p className={`text-[14px] leading-tight lg:text-[15px] ${amtClass}`}>{amtText}</p>
                              <p className="mt-0.5 text-[11px] text-gray-400 lg:text-xs">
                                {formatTxDate(tx.createdAt)}
                              </p>
                            </div>
                            <ChevronRight
                              className="h-5 w-5 text-gray-300 lg:h-6 lg:w-6"
                              strokeWidth={2}
                              aria-hidden
                            />
                          </div>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </section>
        </div>
      </div>

      <SellerProcessBottomNav />

      {/* Add money sheet */}
      {addOpen ? (
        <div className="fixed inset-0 z-[200] flex items-end justify-center sm:items-center sm:p-4">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            aria-label="Close"
            onClick={() => !addSubmitting && setAddOpen(false)}
          />
          <div className="relative z-10 w-full rounded-t-3xl border border-gray-100 bg-white p-5 shadow-2xl sm:max-w-md sm:rounded-3xl sm:p-6 lg:max-w-lg lg:p-8">
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-gray-200 sm:hidden" />
            <h3 className="text-lg font-bold text-gray-900">Add money</h3>
            <p className="mt-1 text-[13px] text-gray-500">Amount will be credited to your Restyle wallet.</p>
            <label className="mt-5 block">
              <span className="sr-only">Amount in rupees</span>
              <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
                <span className="text-lg font-bold text-gray-800">₹</span>
                <input
                  type="text"
                  inputMode="numeric"
                  autoComplete="off"
                  placeholder="0"
                  value={
                    addDigits
                      ? parseInt(addDigits, 10).toLocaleString("en-IN")
                      : ""
                  }
                  onChange={(e) => {
                    const raw = e.target.value.replace(/\D/g, "").slice(0, 8);
                    setAddDigits(raw);
                  }}
                  className="min-w-0 flex-1 border-0 bg-transparent text-lg font-bold text-gray-900 outline-none placeholder:text-gray-400"
                />
              </div>
            </label>
            <div className="mt-5 flex gap-3">
              <button
                type="button"
                disabled={addSubmitting}
                onClick={() => setAddOpen(false)}
                className="flex-1 rounded-xl border border-gray-200 py-3.5 text-[14px] font-bold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={addSubmitting}
                onClick={onAddMoney}
                className="flex-1 rounded-xl py-3.5 text-[14px] font-bold text-white transition disabled:opacity-50"
                style={{ backgroundColor: PINK }}
              >
                {addSubmitting ? "Adding…" : "Add"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
