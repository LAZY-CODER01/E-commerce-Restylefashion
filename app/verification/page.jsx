"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import Input from "@/components/Input";
import Button from "@/components/Button";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { toast } from "react-toastify";

const emptyPayout = {
  accountName: "",
  accountNumber: "",
  ifsc: "",
  routingCode: "",
};

export default function VerificationPage() {
  const { user, setUser } = useAuth();
  const [subtitle, setSubtitle] = useState(null);
  const [payoutOpen, setPayoutOpen] = useState(false);
  const [payout, setPayout] = useState(emptyPayout);
  const [savingPayout, setSavingPayout] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const { data } = await api.get("/auth/profile");
        if (cancelled) return;
        setUser(data);
        setSubtitle(data.sellerProfileStatus === "approved" ? "approved" : "pending");
      } catch {
        if (!cancelled) setSubtitle("pending");
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [setUser]);

  const bodyText =
    subtitle === "approved"
      ? "We are reviewing your listing. It will be live within 24 hours."
      : "We are reviewing your profile and listing. It will be completed and live within 24 hours.";

  const showBankSection = Boolean(user && user.hasBankDetailsAdded !== true);

  const payoutValid =
    payout.accountName.trim() &&
    payout.accountNumber.trim() &&
    (payout.ifsc.trim() || payout.routingCode.trim());

  const handleSavePayout = async (e) => {
    e.preventDefault();
    if (!payoutValid || savingPayout) return;
    setSavingPayout(true);
    try {
      const { data } = await api.put("/auth/banking-details", {
        accountName: payout.accountName.trim(),
        accountNumber: payout.accountNumber.trim(),
        ifsc: payout.ifsc.trim(),
        routingCode: payout.routingCode.trim(),
      });
      if (data.token) {
        localStorage.setItem("restyle_token", data.token);
      }
      const { token: _t, ...profile } = data;
      setUser(profile);
      setPayout(emptyPayout);
      setPayoutOpen(false);
      toast.success("Payout details saved.");
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not save payout details.");
    } finally {
      setSavingPayout(false);
    }
  };

  const primaryBtn =
    "flex items-center justify-center gap-2 w-full sm:w-auto min-h-[52px] px-8 rounded-full font-bold text-[15px] bg-brand-pink text-white hover:bg-brand-pink-hover shadow-lg shadow-brand-pink/20 transition-all";
  const secondaryBtn =
    "flex items-center justify-center w-full sm:w-auto min-h-[52px] px-8 rounded-full font-bold text-[15px] text-brand-dark bg-transparent hover:bg-brand-light border-2 border-gray-200 hover:border-brand-pink/30 transition-all";

  return (
    <div className="min-h-[calc(100dvh-80px)] bg-brand-light flex items-center justify-center p-6 font-roboto">
      <div className="w-full max-w-lg bg-white rounded-[32px] border border-gray-100 shadow-sm p-10 sm:p-12 text-center animate-fadeIn">
        <div className="mx-auto mb-6 w-16 h-16 rounded-full bg-brand-pink/10 flex items-center justify-center text-brand-pink">
          <CheckCircleOutlineIcon sx={{ fontSize: 40 }} />
        </div>
        <h1 className="text-[24px] sm:text-[26px] font-extrabold text-brand-dark leading-tight mb-4">
          Listing submitted
        </h1>
        <p className="text-[15px] text-gray-600 leading-relaxed font-medium mb-6 min-h-[3rem]">
          {subtitle === null ? "Loading…" : bodyText}
        </p>

        {showBankSection && (
          <div className="mb-8 text-left border border-gray-100 rounded-[20px] overflow-hidden bg-gray-50/50">
            <button
              type="button"
              onClick={() => setPayoutOpen((o) => !o)}
              className="w-full flex items-center justify-between gap-3 px-4 py-3.5 text-left font-bold text-[14px] text-brand-dark hover:bg-brand-light/80 transition-colors"
            >
              <span>Add payout details</span>
              <ExpandMoreIcon
                sx={{ fontSize: 28, transition: "transform 0.2s" }}
                style={{ transform: payoutOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                className="text-brand-pink shrink-0"
              />
            </button>
            {payoutOpen && (
              <form onSubmit={handleSavePayout} className="px-4 pb-4 pt-1 space-y-4 border-t border-gray-100 bg-white">
                <p className="text-[12px] text-gray-500 font-medium">
                  Where we should send your earnings. IFSC or routing code (or both).
                </p>
                <div className="grid grid-cols-1 gap-4">
                  <Input
                    label="Account name"
                    placeholder="Name as on bank account"
                    value={payout.accountName}
                    onChange={(e) => setPayout({ ...payout, accountName: e.target.value })}
                  />
                  <Input
                    label="Account number"
                    placeholder="Account number"
                    value={payout.accountNumber}
                    onChange={(e) => setPayout({ ...payout, accountNumber: e.target.value })}
                  />
                  <Input
                    label="IFSC"
                    placeholder="e.g. HDFC0001234"
                    value={payout.ifsc}
                    onChange={(e) => setPayout({ ...payout, ifsc: e.target.value })}
                  />
                  <Input
                    label="Routing code"
                    placeholder="If applicable"
                    value={payout.routingCode}
                    onChange={(e) => setPayout({ ...payout, routingCode: e.target.value })}
                  />
                </div>
                <Button
                  type="submit"
                  fullWidth
                  disabled={!payoutValid || savingPayout}
                  className="h-[48px] rounded-full font-bold text-[14px]"
                >
                  {savingPayout ? "Saving…" : "Save payout details"}
                </Button>
              </form>
            )}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center items-stretch sm:items-center">
          <Link href="/dashboard" className={primaryBtn}>
            <Inventory2Icon sx={{ fontSize: 22 }} />
            View My Listings
          </Link>
          <Link href="/seller/dashboard" className={secondaryBtn}>
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
