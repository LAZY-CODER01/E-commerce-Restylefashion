"use client";

import React, { use, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import TuneOutlinedIcon from "@mui/icons-material/TuneOutlined";
import { toast } from "react-toastify";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

function initialsFromName(fullName) {
  if (!fullName?.trim()) return "S";
  const p = fullName.trim().split(/\s+/).filter(Boolean);
  if (p.length >= 2) return `${p[0][0]}${p[1][0]}`.toUpperCase();
  const w = p[0];
  return w.length >= 2 ? w.slice(0, 2).toUpperCase() : `${w[0]}`.toUpperCase();
}

export default function InfluencerProfile({ params }) {
  const router = useRouter();
  const unwrappedParams = use(params);
  const { id } = unwrappedParams;
  const { user, setUser } = useAuth();

  const [influencer, setInfluencer] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [storeSearch, setStoreSearch] = useState("");
  const [followingActionLoading, setFollowingActionLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.get(`/auth/influencer/${id}`),
      api.get("/products", { params: { sellerId: id, limit: 100 } })
    ])
      .then(([infRes, prodRes]) => {
        setInfluencer(infRes.data);
        setProducts(prodRes.data.products || []);
      })
      .catch((error) => {
        toast.error("Failed to load profile.");
      })
      .finally(() => setLoading(false));
  }, [id]);

  const categories = useMemo(() => {
    const byCat = new Map();
    for (const p of products || []) {
      const key = String(p.category || "Products");
      byCat.set(key, (byCat.get(key) || 0) + 1);
    }

    const fallback = [
      { key: "women-handbags", label: "Women's Handbags", count: 120, image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=700&q=80" },
      { key: "wallets", label: "Wallets", count: 86, image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=700&q=80" },
      { key: "accessories", label: "Accessories", count: 64, image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=700&q=80" },
      { key: "perfumes", label: "Perfumes", count: 32, image: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=700&q=80" },
    ];

    const fromProducts = Array.from(byCat.entries())
      .map(([k, c]) => ({
        key: k,
        label: k.charAt(0).toUpperCase() + k.slice(1),
        count: c,
        image: products?.find((p) => String(p.category || "Products") === k)?.imageUrl || 
               products?.find((p) => String(p.category || "Products") === k)?.images?.[0] || "",
      }))
      .slice(0, 4);

    const base = fromProducts.length ? fromProducts : fallback;
    const q = (storeSearch || "").trim().toLowerCase();
    if (!q) return base;
    return base.filter((c) => String(c.label || "").toLowerCase().includes(q));
  }, [products, storeSearch]);

  const storeTypeLabel =
    influencer?.sellerType === "influencer"
      ? "Influencer Store"
      : influencer?.sellerType
        ? `${String(influencer.sellerType).replace(/_/g, " ")} Store`
        : "Store";

  const liveListings = Number(influencer?.itemsListed || products.length || 0);
  const followers = Number(influencer?.followersCount || 0);
  const following = Number(influencer?.followingCount || 0);

  const isFollowed = user?.following?.includes(id) || false;

  const handleFollowToggle = async () => {
    if (!user) {
      toast.info("Please log in to follow sellers.");
      router.push("/auth/login");
      return;
    }
    if (user._id === id) {
      toast.info("You cannot follow your own store.");
      return;
    }

    try {
      setFollowingActionLoading(true);
      const { data } = await api.post(`/auth/influencer/${id}/follow`);
      // Update local context
      setUser(data.user);
      // Update local influencer state so the UI reflects instantly
      setInfluencer(prev => ({
        ...prev,
        followersCount: data.influencerFollowersCount
      }));
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update follow status.");
    } finally {
      setFollowingActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-[#F5F5F5] font-sans">
        <p className="animate-pulse text-[14px] font-medium text-gray-400">Loading profile...</p>
      </div>
    );
  }

  if (!influencer) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-[#F5F5F5] font-sans">
        <p className="text-[14px] font-medium text-gray-500">Influencer not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-[#F5F5F5] pb-28 font-sans text-neutral-900">
      <header className="sticky top-0 z-30 bg-[#F5F5F5] px-4 pt-3 md:px-9 md:pt-6">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-neutral-800 shadow-sm transition hover:bg-gray-50"
            aria-label="Back"
          >
            <ArrowBackOutlinedIcon sx={{ fontSize: 22 }} />
          </button>
          <span className="text-[16px] font-bold text-gray-900">Store Preview</span>
          <span className="inline-block h-10 w-10" aria-hidden />
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1200px] px-4 pb-10 md:px-9 mt-4">
        <div className="flex flex-col items-center gap-4 md:gap-5 rounded-[24px] bg-white p-6 shadow-sm">
          <div className="relative h-[92px] w-[92px] overflow-hidden rounded-full bg-gradient-to-br from-[#F7246E] to-[#FF6FA0] shadow-sm ring-4 ring-[#FFF0F6] md:h-[104px] md:w-[104px]">
            {influencer?.avatar ? (
              <Image src={influencer.avatar} alt={influencer.fullName} fill className="object-cover" sizes="104px" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-[30px] font-extrabold tracking-tight text-white md:text-[32px]">
                {initialsFromName(influencer?.fullName || influencer?.businessName || "Seller")}
              </div>
            )}
          </div>

          <div className="flex flex-col items-center">
            <p className="text-[20px] font-extrabold tracking-tight text-[#000000] md:text-[24px]">
              {influencer?.businessName || influencer?.fullName}
            </p>
            <p className="mt-1 inline-flex rounded-full bg-[#FFF0F6] px-3 py-0.5 text-[12px] font-bold text-[#F7246E]">
              {storeTypeLabel}
            </p>
          </div>

          <div className="mt-2 grid w-full grid-cols-3 items-center divide-x divide-gray-100">
            <div className="flex flex-col items-center justify-center py-2 px-3">
              <p className="text-[18px] font-bold leading-none text-[#000000]">{followers.toLocaleString()}</p>
              <p className="mt-1.5 text-[12px] font-medium text-gray-500">Followers</p>
            </div>

            <div className="flex flex-col items-center justify-center py-2 px-3">
              <p className="text-[18px] font-bold leading-none text-[#000000]">{following.toLocaleString()}</p>
              <p className="mt-1.5 text-[12px] font-medium text-gray-500">Following</p>
            </div>

            <div className="flex flex-col items-center justify-center py-2 px-3">
              <p className="text-[18px] font-bold leading-none text-[#000000]">{liveListings.toLocaleString()}</p>
              <p className="mt-1.5 text-[12px] font-medium text-gray-500">Live Listings</p>
            </div>
          </div>
          
          <button
            type="button"
            onClick={handleFollowToggle}
            disabled={followingActionLoading}
            className={`mt-2 w-full max-w-[400px] rounded-[16px] py-3.5 text-[15px] font-bold tracking-wide shadow-sm active:scale-[0.99] transition-colors ${
              isFollowed 
                ? "bg-gray-100 text-gray-800 border border-gray-200" 
                : "bg-[#F7246E] text-white"
            } ${followingActionLoading ? "opacity-70 cursor-not-allowed" : ""}`}
          >
            {isFollowed ? "Following" : "Follow"}
          </button>
        </div>

        <section className="mt-6 flex items-center gap-3">
          <div className="flex flex-1 items-center gap-2 rounded-[16px] border border-gray-100 bg-white px-4 py-3 shadow-sm">
            <SearchOutlinedIcon className="text-gray-400" sx={{ fontSize: 20 }} aria-hidden />
            <input
              type="text"
              placeholder="Search in store"
              value={storeSearch}
              onChange={(e) => setStoreSearch(e.target.value)}
              className="w-full bg-transparent text-[13px] font-medium text-gray-700 outline-none placeholder:text-gray-400"
            />
          </div>
          <button
            type="button"
            onClick={() => toast.info("Filters (coming soon).")}
            className="inline-flex items-center justify-center gap-1.5 rounded-[16px] border border-gray-100 bg-white px-4 py-3 text-[13px] font-bold text-gray-700 shadow-sm hover:bg-gray-50"
          >
            <TuneOutlinedIcon sx={{ fontSize: 18 }} className="text-gray-500" aria-hidden />
            Filter
          </button>
        </section>

        <section className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-2 lg:grid-cols-4 lg:gap-4">
          {categories.map((c) => (
            <button
              key={c.key}
              type="button"
              className="overflow-hidden rounded-[16px] border border-gray-100 bg-white shadow-sm transition hover:bg-gray-50"
            >
              <div className="relative aspect-square w-full bg-gray-50">
                {c.image ? (
                  <Image src={c.image} alt="" fill className="object-cover" sizes="260px" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-[12px] font-semibold text-gray-400">
                    No image
                  </div>
                )}
              </div>
              <div className="px-4 py-3 text-center">
                <p className="line-clamp-1 text-[13px] font-bold text-[#000000]">{c.label}</p>
                <p className="mt-0.5 text-[12px] font-medium text-gray-500">{c.count} items</p>
              </div>
            </button>
          ))}
        </section>
      </main>
    </div>
  );
}
