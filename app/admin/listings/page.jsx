"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";

// Icons
import DashboardIcon from "@mui/icons-material/Dashboard";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import PeopleIcon from "@mui/icons-material/People";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import HourglassTopIcon from "@mui/icons-material/HourglassTop";
import StoreIcon from "@mui/icons-material/Store";
import RefreshIcon from "@mui/icons-material/Refresh";

const NAV_ITEMS = [
  { title: "Dashboard", path: "/admin/dashboard", icon: <DashboardIcon sx={{ fontSize: 22 }} /> },
  { title: "Listings", path: "/admin/listings", icon: <Inventory2Icon sx={{ fontSize: 22 }} /> },
  { title: "Orders", path: "/admin/orders", icon: <LocalShippingIcon sx={{ fontSize: 22 }} /> },
  { title: "Sellers", path: "/admin/sellers", icon: <PeopleIcon sx={{ fontSize: 22 }} /> },
];

const STATUS_TABS = [
  { label: "Pending", value: "pending", color: "text-amber-500 bg-amber-50 border-amber-200" },
  { label: "Active", value: "active", color: "text-green-600 bg-green-50 border-green-200" },
  { label: "Rejected", value: "rejected", color: "text-red-500 bg-red-50 border-red-200" },
];

function StatusBadge({ status }) {
  const normalized = status === "approved" ? "active" : status;
  const map = {
    pending: "bg-amber-50 text-amber-600 border border-amber-200",
    active: "bg-green-50 text-green-600 border border-green-200",
    rejected: "bg-red-50 text-red-500 border border-red-200",
  };
  const display =
    normalized === "pending" ? "Pending" : normalized === "active" ? "Active" : "Rejected";
  return (
    <span className={`text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${map[normalized] || map.pending}`}>
      {display}
    </span>
  );
}

export default function AdminListingsPage() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("pending");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});
  const [selectedProduct, setSelectedProduct] = useState(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/products/admin/pending?status=${activeTab}`);
      setProducts(data);
    } catch (err) {
      console.error("Failed to fetch products", err);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleAction = async (productId, status) => {
    setActionLoading((prev) => ({ ...prev, [productId]: status }));
    try {
      await api.patch(`/products/admin/${productId}/status`, { status });
      // Remove from current list and close detail panel if open
      setProducts((prev) => prev.filter((p) => p._id !== productId));
      if (selectedProduct?._id === productId) setSelectedProduct(null);
    } catch (err) {
      console.error("Action failed", err);
    } finally {
      setActionLoading((prev) => {
        const next = { ...prev };
        delete next[productId];
        return next;
      });
    }
  };

  const pendingCount = activeTab === "pending" ? products.length : 0;

  return (
    <div className="min-h-[calc(100vh-80px)] bg-brand-light flex font-roboto w-full overflow-hidden">

      {/* SIDEBAR */}
      <aside className="hidden lg:flex w-[240px] bg-brand-light flex-col border-r border-gray-200/50 h-[calc(100vh-80px)] shrink-0 py-8 pr-4 overflow-y-auto">
        <nav className="flex flex-col font-bold text-[14px] gap-2">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.title}
                href={item.path}
                className={`group flex items-center gap-4 px-6 py-4 rounded-[20px] transition-all duration-200 border border-transparent ${
                  isActive
                    ? "bg-brand-pink text-white shadow-lg shadow-brand-pink/20 font-extrabold"
                    : "text-gray-500 bg-transparent hover:bg-white hover:text-brand-pink hover:shadow-md hover:border-gray-100"
                }`}
              >
                <span className={`${isActive ? "text-white" : "text-gray-400 group-hover:text-brand-pink"} transition-colors`}>
                  {item.icon}
                </span>
                {item.title}
                {item.title === "Listings" && pendingCount > 0 && (
                  <span className="ml-auto bg-brand-pink text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {pendingCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* MAIN */}
      <main className="flex-1 flex flex-col px-4 md:px-9 py-6 md:py-8 overflow-y-auto h-[calc(100vh-80px)] w-full">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-[24px] md:text-[28px] font-extrabold text-brand-dark">Product Listings</h2>
            <p className="text-[13px] text-gray-400 font-medium mt-1">Review and approve seller submissions</p>
          </div>
          <button
            onClick={fetchProducts}
            className="flex items-center gap-2 bg-white hover:bg-gray-50 transition px-5 py-2.5 rounded-full border border-gray-100 shadow-sm text-brand-dark text-[13px] font-bold group"
          >
            <RefreshIcon sx={{ fontSize: 18 }} className="text-gray-400 group-hover:text-brand-pink transition-colors" />
            Refresh
          </button>
        </div>

        {/* Status Tabs */}
        <div className="flex gap-3 mb-8 flex-wrap">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`px-6 py-2.5 rounded-full text-[13px] font-bold border transition-all ${
                activeTab === tab.value
                  ? tab.color
                  : "bg-white text-gray-400 border-gray-200 hover:border-gray-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex gap-6 flex-1 min-h-0">
          {/* Product List */}
          <div className={`flex flex-col gap-4 overflow-y-auto ${selectedProduct ? "w-full lg:w-[420px] shrink-0" : "w-full"}`}>
            {loading ? (
              <div className="flex flex-col gap-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-white rounded-[24px] h-[120px] animate-pulse border border-gray-100" />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-16 h-16 bg-brand-pink/10 rounded-full flex items-center justify-center text-brand-pink mb-4">
                  <CheckCircleOutlineIcon sx={{ fontSize: 32 }} />
                </div>
                <h3 className="text-[16px] font-bold text-brand-dark mb-2">All caught up!</h3>
                <p className="text-[13px] text-gray-400">No {activeTab} listings at the moment.</p>
              </div>
            ) : (
              products.map((product) => (
                <div
                  key={product._id}
                  onClick={() => setSelectedProduct(product._id === selectedProduct?._id ? null : product)}
                  className={`bg-white rounded-[24px] border p-5 flex gap-4 cursor-pointer hover:shadow-md transition-all duration-200 ${
                    selectedProduct?._id === product._id
                      ? "border-brand-pink shadow-md shadow-brand-pink/10"
                      : "border-gray-100 hover:border-gray-200"
                  }`}
                >
                  {/* Thumbnail */}
                  <div className="w-[80px] h-[80px] rounded-[16px] overflow-hidden shrink-0 bg-gray-50 border border-gray-100 relative">
                    {product.imageUrl ? (
                      <Image src={product.imageUrl} alt={product.title} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <StoreIcon sx={{ fontSize: 24 }} />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex flex-col flex-1 min-w-0 gap-1">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-[15px] font-bold text-brand-dark truncate">{product.title}</h3>
                      <StatusBadge status={product.status} />
                    </div>
                    <p className="text-[12px] text-gray-400 font-medium truncate">
                      {product.brand} · {product.category}
                    </p>
                    <p className="text-[12px] text-gray-400 font-medium">
                      by <span className="font-bold text-brand-dark">{product.seller?.fullName}</span>
                      {product.seller?.businessName && (
                        <span className="text-gray-400"> ({product.seller.businessName})</span>
                      )}
                    </p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-[15px] font-extrabold text-brand-pink">₹{product.price}</span>
                      <span className="text-[11px] text-gray-300 font-medium">
                        {new Date(product.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Detail Panel */}
          {selectedProduct && (
            <div className="hidden lg:flex flex-1 flex-col bg-white rounded-[32px] border border-gray-100 overflow-hidden shadow-sm animate-fadeIn">
              {/* Product Images */}
              <div className="relative h-[280px] bg-gray-50 flex overflow-x-auto gap-3 p-4">
                {selectedProduct.images?.length > 0 ? (
                  selectedProduct.images.map((img, i) => (
                    <div key={i} className="relative h-full aspect-square rounded-[20px] overflow-hidden shrink-0 border border-gray-100">
                      <Image src={img} alt={`img-${i}`} fill className="object-cover" />
                    </div>
                  ))
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-200">
                    <StoreIcon sx={{ fontSize: 48 }} />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex flex-col flex-1 p-8 gap-6 overflow-y-auto">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-[22px] font-extrabold text-brand-dark">{selectedProduct.title}</h2>
                    <p className="text-[13px] text-gray-400 font-medium mt-1">{selectedProduct.brand} · {selectedProduct.category} · {selectedProduct.condition}</p>
                  </div>
                  <StatusBadge status={selectedProduct.status} />
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[24px] font-extrabold text-brand-pink">₹{selectedProduct.price}</span>
                  {selectedProduct.originalPrice && (
                    <span className="text-[15px] text-gray-400 line-through font-medium">₹{selectedProduct.originalPrice}</span>
                  )}
                </div>

                {selectedProduct.description && (
                  <div className="bg-brand-light rounded-[20px] p-5">
                    <p className="text-[13px] text-gray-600 leading-relaxed font-medium">{selectedProduct.description}</p>
                  </div>
                )}

                {/* Seller Info */}
                <div className="border border-gray-100 rounded-[20px] p-5 flex flex-col gap-2">
                  <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Seller</h4>
                  <div className="flex gap-1">
                    <span className="text-[13px] font-bold text-brand-dark">{selectedProduct.seller?.fullName}</span>
                    {selectedProduct.seller?.businessName && (
                      <span className="text-[13px] text-gray-400"> · {selectedProduct.seller.businessName}</span>
                    )}
                  </div>
                  <span className="text-[12px] text-gray-400">{selectedProduct.seller?.email}</span>
                  {selectedProduct.seller?.sellerType && (
                    <span className="text-[11px] font-bold uppercase tracking-widest text-brand-pink bg-brand-pink/5 px-3 py-1 rounded-full w-fit mt-1">
                      {selectedProduct.seller.sellerType}
                    </span>
                  )}
                </div>

                {/* Sizes */}
                {selectedProduct.sizes?.length > 0 && (
                  <div>
                    <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Available Sizes</h4>
                    <div className="flex gap-2 flex-wrap">
                      {selectedProduct.sizes.map((s) => (
                        <span key={s} className="h-9 w-12 flex items-center justify-center border border-gray-200 rounded-xl text-[12px] font-bold text-brand-dark">{s}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions — only show when pending */}
                {selectedProduct.status === "pending" && (
                  <div className="flex gap-4 mt-auto pt-4">
                    <button
                      onClick={() => handleAction(selectedProduct._id, "rejected")}
                      disabled={!!actionLoading[selectedProduct._id]}
                      className="flex-1 h-[52px] rounded-full border-2 border-red-200 text-red-500 font-bold text-[15px] hover:bg-red-50 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <CancelOutlinedIcon sx={{ fontSize: 20 }} />
                      {actionLoading[selectedProduct._id] === "rejected" ? "Rejecting..." : "Reject"}
                    </button>
                    <button
                      onClick={() => handleAction(selectedProduct._id, "active")}
                      disabled={!!actionLoading[selectedProduct._id]}
                      className="flex-1 h-[52px] rounded-full bg-brand-pink text-white font-bold text-[15px] hover:bg-brand-pink/90 transition-all shadow-lg shadow-brand-pink/20 flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <CheckCircleOutlineIcon sx={{ fontSize: 20 }} />
                      {actionLoading[selectedProduct._id] === "active" ? "Approving..." : "Approve"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Mobile: Inline Action Buttons below each card */}
          {selectedProduct && selectedProduct.status === "pending" && (
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 flex gap-4 z-50 shadow-xl">
              <button
                onClick={() => handleAction(selectedProduct._id, "rejected")}
                disabled={!!actionLoading[selectedProduct._id]}
                className="flex-1 h-[52px] rounded-full border-2 border-red-200 text-red-500 font-bold hover:bg-red-50 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <CancelOutlinedIcon sx={{ fontSize: 20 }} />
                Reject
              </button>
              <button
                onClick={() => handleAction(selectedProduct._id, "active")}
                disabled={!!actionLoading[selectedProduct._id]}
                className="flex-1 h-[52px] rounded-full bg-brand-pink text-white font-bold shadow-lg shadow-brand-pink/20 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <CheckCircleOutlineIcon sx={{ fontSize: 20 }} />
                Approve
              </button>
            </div>
          )}
        </div>

      </main>
    </div>
  );
}
