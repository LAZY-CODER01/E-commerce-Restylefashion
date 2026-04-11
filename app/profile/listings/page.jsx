"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import PendingOutlinedIcon from "@mui/icons-material/PendingOutlined";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import ViewModuleOutlinedIcon from "@mui/icons-material/ViewModuleOutlined";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";

/* ─── Status badge config ─────────────────────────── */
const STATUS_CONFIG = {
  active: {
    label: "Active",
    bg: "bg-emerald-100",
    text: "text-emerald-700",
    icon: <CheckCircleOutlineOutlinedIcon sx={{ fontSize: 14 }} />,
  },
  approved: {
    label: "Active",
    bg: "bg-emerald-100",
    text: "text-emerald-700",
    icon: <CheckCircleOutlineOutlinedIcon sx={{ fontSize: 14 }} />,
  },
  pending: {
    label: "Pending",
    bg: "bg-amber-100",
    text: "text-amber-700",
    icon: <PendingOutlinedIcon sx={{ fontSize: 14 }} />,
  },
  rejected: {
    label: "Rejected",
    bg: "bg-red-100",
    text: "text-red-600",
    icon: <CancelOutlinedIcon sx={{ fontSize: 14 }} />,
  },
};

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold ${cfg.bg} ${cfg.text}`}
    >
      {cfg.icon}
      {cfg.label}
    </span>
  );
}

/* ─── Single listing card ─────────────────────────── */
function ListingCard({ product }) {
  const discount =
    product.originalPrice && product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0;

  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md border border-gray-100 transition-all duration-300 hover:-translate-y-0.5 flex flex-col">
      {/* Image */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-100">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <ViewModuleOutlinedIcon sx={{ fontSize: 48, color: "#ccc" }} />
          </div>
        )}

        {/* Discount badge */}
        {discount > 0 && (
          <div className="absolute top-2.5 left-2.5 bg-[#F7246E] text-white text-[11px] font-bold px-2 py-1 rounded-full z-10">
            -{discount}%
          </div>
        )}

        {/* View detail overlay */}
        <Link
          href={`/product/${product._id}`}
          className="absolute inset-0 z-20 opacity-0 group-hover:opacity-100 bg-black/10 transition-opacity flex items-end justify-center pb-3"
          aria-label={`View ${product.title}`}
        >
          <span className="bg-white/90 backdrop-blur-sm text-[12px] font-semibold text-brand-dark px-4 py-1.5 rounded-full shadow-sm">
            View Product
          </span>
        </Link>
      </div>

      {/* Content */}
      <div className="p-3 flex flex-col gap-1.5 flex-1">
        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest line-clamp-1">
          {product.brand}
        </p>
        <p className="text-[14px] font-semibold text-brand-dark line-clamp-2 leading-snug">
          {product.title}
        </p>

        <div className="flex items-baseline gap-2 mt-auto pt-1">
          <span className="text-[15px] font-bold text-[#F7246E]">₹{product.price}</span>
          {product.originalPrice && (
            <span className="text-[12px] text-gray-400 line-through">₹{product.originalPrice}</span>
          )}
        </div>

        <div className="flex items-center justify-between mt-2">
          <StatusBadge status={product.status} />
          <span className="text-[11px] text-gray-400 capitalize">{product.condition}</span>
        </div>
      </div>
    </div>
  );
}

/* ─── Empty state ─────────────────────────────────── */
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-28 gap-5 text-center">
      <div className="w-20 h-20 rounded-full bg-[#F7246E]/10 flex items-center justify-center">
        <ViewModuleOutlinedIcon sx={{ fontSize: 40, color: "#F7246E" }} />
      </div>
      <div>
        <h2 className="text-[20px] font-bold text-[#2F2F2F] mb-1">No listings yet</h2>
        <p className="text-[14px] text-gray-500 max-w-xs">
          You haven't listed any products yet. Start selling by adding your first item!
        </p>
      </div>
      <Link
        href="/sell"
        className="flex items-center gap-2 bg-[#F7246E] text-white text-[14px] font-bold px-6 py-3 rounded-full hover:bg-[#F8085A] transition-colors shadow-md hover:shadow-lg active:scale-95"
      >
        <AddCircleOutlineOutlinedIcon sx={{ fontSize: 20 }} />
        Add Your First Listing
      </Link>
    </div>
  );
}

/* ─── Filter tab ──────────────────────────────────── */
const FILTERS = ["All", "Active", "Pending", "Rejected"];

/* ─── Main page ───────────────────────────────────── */
export default function MyListingsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState("All");

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.replace("/");
      return;
    }
    if (user.role !== "Seller" && user.role !== "Influencer" && user.role !== "Admin") {
      router.replace("/profile");
      return;
    }

    const fetchListings = async () => {
      try {
        const { data } = await api.get("/products/my-listings");
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load listings.");
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [user, authLoading, router]);

  /* Filter products by tab */
  const filteredProducts = products.filter((p) => {
    if (activeFilter === "All") return true;
    if (activeFilter === "Active") return p.status === "active" || p.status === "approved";
    if (activeFilter === "Pending") return p.status === "pending";
    if (activeFilter === "Rejected") return p.status === "rejected";
    return true;
  });

  /* Counts for tabs */
  const counts = {
    All: products.length,
    Active: products.filter((p) => p.status === "active" || p.status === "approved").length,
    Pending: products.filter((p) => p.status === "pending").length,
    Rejected: products.filter((p) => p.status === "rejected").length,
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] pb-24">
      {/* ── Header ── */}
      <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-[1440px] mx-auto px-4 md:px-9 h-16 flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors text-[#2F2F2F]"
            aria-label="Go back"
          >
            <ArrowBackOutlinedIcon sx={{ fontSize: 24 }} />
          </button>
          <h1 className="text-[18px] md:text-[22px] font-bold text-[#2F2F2F] flex-1">
            My Listings
          </h1>
          <Link
            href="/sell"
            className="flex items-center gap-1.5 bg-[#F7246E] text-white text-[13px] font-bold px-4 py-2 rounded-full hover:bg-[#F8085A] transition-all shadow-sm active:scale-95"
          >
            <AddCircleOutlineOutlinedIcon sx={{ fontSize: 18 }} />
            <span className="hidden sm:inline">Add Listing</span>
          </Link>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 md:px-9 pt-6">
        {/* ── Filter tabs ── */}
        <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-2 mb-6">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-[13px] font-semibold border transition-all ${
                activeFilter === f
                  ? "bg-[#F7246E] text-white border-[#F7246E] shadow-sm"
                  : "bg-white text-gray-600 border-gray-200 hover:border-[#F7246E] hover:text-[#F7246E]"
              }`}
            >
              {f}
              <span
                className={`text-[11px] font-bold px-1.5 py-0.5 rounded-full ${
                  activeFilter === f ? "bg-white/25 text-white" : "bg-gray-100 text-gray-500"
                }`}
              >
                {counts[f]}
              </span>
            </button>
          ))}
        </div>

        {/* ── Loading ── */}
        {(loading || authLoading) && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse">
                <div className="aspect-[3/4] bg-gray-200" />
                <div className="p-3 flex flex-col gap-2">
                  <div className="h-3 bg-gray-200 rounded w-2/3" />
                  <div className="h-4 bg-gray-200 rounded" />
                  <div className="h-4 bg-gray-100 rounded w-1/2 mt-1" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Error ── */}
        {!loading && error && (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
            <CancelOutlinedIcon sx={{ fontSize: 48, color: "#F7246E" }} />
            <p className="text-[16px] font-semibold text-[#2F2F2F]">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="text-[13px] text-[#F7246E] font-semibold underline"
            >
              Try again
            </button>
          </div>
        )}

        {/* ── Empty ── */}
        {!loading && !error && filteredProducts.length === 0 && (
          <EmptyState />
        )}

        {/* ── Grid ── */}
        {!loading && !error && filteredProducts.length > 0 && (
          <>
            <p className="text-[13px] text-gray-400 font-medium mb-4">
              {filteredProducts.length} {filteredProducts.length === 1 ? "item" : "items"}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-5">
              {filteredProducts.map((product) => (
                <ListingCard key={product._id} product={product} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
