"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Store } from "lucide-react";
import {
  getSellerProfileSsrPlaceholder,
  getSellerStoreId,
  mergeSellerProfileFromStorage,
  readSellerProductsForStore,
} from "@/lib/sellerHubProfile";

export default function SellerStorePreviewPage() {
  const [mounted, setMounted] = useState(false);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const bump = () => setTick((t) => t + 1);
    window.addEventListener("seller-products-updated", bump);
    window.addEventListener("focus", bump);
    return () => {
      window.removeEventListener("seller-products-updated", bump);
      window.removeEventListener("focus", bump);
    };
  }, []);

  const { profile, products } = useMemo(() => {
    if (!mounted) {
      return { profile: getSellerProfileSsrPlaceholder(), products: [] };
    }
    const sid = getSellerStoreId();
    return {
      profile: mergeSellerProfileFromStorage(),
      products: readSellerProductsForStore(sid),
    };
  }, [mounted, tick]);

  return (
    <div className="min-h-screen bg-neutral-100 px-4 py-8 font-sans text-neutral-900">
      <div className="mx-auto flex max-w-4xl flex-col gap-6">
        <div className="flex items-center gap-4">
          <Link
            href="/seller/profile"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-neutral-200 bg-white text-neutral-700 shadow-sm transition hover:bg-neutral-50"
            aria-label="Back to profile"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <p className="flex items-center gap-2 text-sm font-semibold text-neutral-500">
              <Store className="h-4 w-4" />
              Store preview
            </p>
            <h1 className="text-2xl font-bold tracking-tight">{profile.name}</h1>
            <p className="text-sm text-neutral-500">
              Only listings you added from this account ({products.length} live).
            </p>
          </div>
        </div>

        {products.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-neutral-300 bg-white p-12 text-center text-neutral-500">
            No live products yet. Add a listing to see it here.
            <div className="mt-4">
              <Link
                href="/seller/products/new"
                className="font-semibold text-rose-600 underline decoration-rose-300"
              >
                Create listing
              </Link>
            </div>
          </div>
        ) : (
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {products.map((item, idx) => {
              const key = `${item.productId || item.id || "p"}-${item.createdAt || idx}`;
              const pid = item.productId || item.id;
              const inner = (
                <>
                  <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-neutral-100">
                    {item.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.image} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs text-neutral-400">
                        No image
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 font-semibold text-neutral-900">{item.title}</p>
                    {item.category ? (
                      <p className="mt-1 text-xs uppercase tracking-wide text-neutral-400">
                        {item.category}
                      </p>
                    ) : null}
                    <p className="mt-2 text-lg font-bold text-neutral-900">
                      ₹{item.price}
                    </p>
                  </div>
                </>
              );
              return (
                <li key={key}>
                  {pid ? (
                    <Link
                      href={`/product/${pid}`}
                      className="flex gap-4 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm transition hover:border-neutral-300"
                    >
                      {inner}
                    </Link>
                  ) : (
                    <div className="flex gap-4 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
                      {inner}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
