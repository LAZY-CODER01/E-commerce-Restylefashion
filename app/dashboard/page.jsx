"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import Button from "@/components/Button";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";

function normalizeStatus(raw) {
  if (raw === "approved") return "active";
  return raw;
}

function ListingCard({ product }) {
  const status = normalizeStatus(product.status);
  const isActive = status === "active";
  const isPending = status === "pending";
  const badgeClass = isPending
    ? "bg-amber-100 text-amber-800 border border-amber-200"
    : isActive
      ? "bg-green-100 text-green-800 border border-green-200"
      : "bg-red-50 text-red-700 border border-red-200";

  const badgeText = isPending ? "Pending" : isActive ? "Active" : "Rejected";
  const img = product.imageUrl || product.images?.[0];

  return (
    <div className="bg-white rounded-[24px] border border-gray-100 overflow-hidden flex flex-col sm:flex-row gap-4 p-4 shadow-sm hover:border-brand-pink/20 transition-colors">
      <div className="relative w-full sm:w-36 aspect-square rounded-2xl bg-gray-50 overflow-hidden shrink-0">
        {img ? (
          <img src={img} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 text-[12px] font-bold">
            No image
          </div>
        )}
      </div>
      <div className="flex-1 flex flex-col gap-2 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-brand-dark text-[16px] leading-snug line-clamp-2">{product.title}</h3>
          <span
            className={`text-[11px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full shrink-0 ${badgeClass}`}
          >
            {badgeText}
          </span>
        </div>
        <p className="text-[13px] text-gray-500">
          {product.brand} · {product.category}
        </p>
        <p className="text-[17px] font-extrabold text-brand-pink">₹{product.price}</p>
        {isActive && (
          <Link
            href={`/product/${product._id}`}
            className="text-[13px] font-bold text-brand-pink hover:underline w-fit mt-auto pt-1"
          >
            View on site
          </Link>
        )}
      </div>
    </div>
  );
}

export default function MyListingsDashboard() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.replace("/login?redirect=/dashboard");
      return;
    }

    let cancelled = false;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const { data } = await api.get("/products/my-listings");
        if (!cancelled) setListings(Array.isArray(data) ? data : []);
      } catch (err) {
        if (!cancelled) {
          setError(err.response?.data?.message || "Could not load your listings.");
          setListings([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [user, authLoading, router]);

  const { pending, active, rejected } = useMemo(() => {
    const pending = [];
    const active = [];
    const rejected = [];
    for (const p of listings) {
      const s = normalizeStatus(p.status);
      if (s === "pending") pending.push(p);
      else if (s === "active") active.push(p);
      else if (s === "rejected") rejected.push(p);
    }
    return { pending, active, rejected };
  }, [listings]);

  if (authLoading) {
    return (
      <div className="min-h-[calc(100dvh-80px)] bg-brand-light flex items-center justify-center text-gray-500">
        Loading…
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[calc(100dvh-80px)] bg-brand-light flex items-center justify-center text-gray-500">
        Redirecting to login…
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100dvh-80px)] bg-brand-light font-roboto pb-16">
      <div className="max-w-3xl mx-auto px-4 py-8 sm:py-10">
        <div className="flex items-center gap-3 mb-8">
          <button
            type="button"
            onClick={() => router.back()}
            className="w-10 h-10 rounded-full hover:bg-white border border-gray-200 flex items-center justify-center text-brand-dark transition-colors"
            aria-label="Back"
          >
            <ArrowBackIcon sx={{ fontSize: 22 }} />
          </button>
          <div className="flex-1">
            <h1 className="text-[24px] sm:text-[28px] font-extrabold text-brand-dark leading-tight">My Listings</h1>
            <p className="text-[13px] text-gray-500 font-medium mt-1">
              Track items under review and live on Restyle
            </p>
          </div>
          <Link href="/seller/products/new">
            <Button className="h-11 px-5 rounded-full font-bold text-[14px] gap-1.5 hidden sm:flex">
              <AddIcon sx={{ fontSize: 20 }} />
              New listing
            </Button>
          </Link>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-100 text-red-700 text-[14px] font-medium">
            {error}
          </div>
        )}

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-36 rounded-[24px] bg-white border border-gray-100 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-12">
            <section>
              <div className="flex items-center gap-2 mb-4">
                <span className="h-2 w-2 rounded-full bg-amber-400" />
                <h2 className="text-[14px] font-bold text-brand-dark uppercase tracking-widest">
                  Under review
                </h2>
                <span className="text-[12px] font-bold text-gray-400">({pending.length})</span>
              </div>
              {pending.length === 0 ? (
                <p className="text-[14px] text-gray-500 py-6 pl-1">No listings pending review.</p>
              ) : (
                <div className="flex flex-col gap-4">
                  {pending.map((p) => (
                    <ListingCard key={p._id} product={p} />
                  ))}
                </div>
              )}
            </section>

            <section>
              <div className="flex items-center gap-2 mb-4">
                <span className="h-2 w-2 rounded-full bg-green-500" />
                <h2 className="text-[14px] font-bold text-brand-dark uppercase tracking-widest">
                  Active
                </h2>
                <span className="text-[12px] font-bold text-gray-400">({active.length})</span>
              </div>
              {active.length === 0 ? (
                <p className="text-[14px] text-gray-500 py-6 pl-1">No active listings yet.</p>
              ) : (
                <div className="flex flex-col gap-4">
                  {active.map((p) => (
                    <ListingCard key={p._id} product={p} />
                  ))}
                </div>
              )}
            </section>

            {rejected.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <span className="h-2 w-2 rounded-full bg-red-400" />
                  <h2 className="text-[14px] font-bold text-brand-dark uppercase tracking-widest">
                    Rejected
                  </h2>
                  <span className="text-[12px] font-bold text-gray-400">({rejected.length})</span>
                </div>
                <div className="flex flex-col gap-4">
                  {rejected.map((p) => (
                    <ListingCard key={p._id} product={p} />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}

        <Link href="/seller/products/new" className="sm:hidden fixed bottom-6 right-6 z-30">
          <Button className="h-14 w-14 rounded-full shadow-xl shadow-brand-pink/30 p-0 min-w-0">
            <AddIcon sx={{ fontSize: 28 }} />
          </Button>
        </Link>
      </div>
    </div>
  );
}
