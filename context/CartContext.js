"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";

const CartContext = createContext(null);

function safeParseArray(value) {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function getId(item) {
  return item?.id ?? item?._id ?? item?.sku ?? item?.slug ?? item?.productId ?? null;
}

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  const userKey = user?.email || user?.id || user?._id || "guest";
  const CART_KEY = `restyle_cart_${userKey}`;
  const WISHLIST_KEY = `restyle_wishlist_${userKey}`;

  useEffect(() => {
    // Load per-user storage, with fallback to legacy keys.
    const legacyCart = safeParseArray(localStorage.getItem("restyle_cart") || "[]");
    const legacyWishlist = safeParseArray(localStorage.getItem("restyle_wishlist") || "[]");

    const nextCart = safeParseArray(localStorage.getItem(CART_KEY) || "[]");
    const nextWishlist = safeParseArray(localStorage.getItem(WISHLIST_KEY) || "[]");

    setCart(nextCart.length ? nextCart : legacyCart);
    setWishlist(nextWishlist.length ? nextWishlist : legacyWishlist);
  }, [CART_KEY, WISHLIST_KEY]);

  useEffect(() => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart, CART_KEY]);

  useEffect(() => {
    try {
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
    } catch {
      // ignore
    }
  }, [wishlist, WISHLIST_KEY]);

  const addToBag = (item) => {
    const id = getId(item);
    if (!id) return;
    const addQty = Math.max(1, Number(item?.qty ?? item?.quantity ?? 1) || 1);
    setCart((prev) => {
      const idx = prev.findIndex((p) => getId(p) === id);
      if (idx >= 0) {
        const next = [...prev];
        const existing = next[idx];
        const qty = Number(existing?.qty ?? existing?.quantity ?? 1);
        next[idx] = { ...existing, qty: qty + addQty };
        return next;
      }
      return [...prev, { ...item, qty: addQty }];
    });
    // auto-remove from wishlist if present
    setWishlist((prev) => prev.filter((w) => getId(w) !== id));
  };

  const toggleWishlist = (item) => {
    const id = getId(item);
    if (!id) return;
    setWishlist((prev) => {
      const exists = prev.some((w) => getId(w) === id);
      return exists ? prev.filter((w) => getId(w) !== id) : [...prev, item];
    });
  };

  const deleteFromCart = (itemOrId) => {
    const id = typeof itemOrId === "object" ? getId(itemOrId) : itemOrId;
    if (!id) return;
    setCart((prev) => prev.filter((c) => getId(c) !== id));
  };

  const deleteFromWishlist = (itemOrId) => {
    const id = typeof itemOrId === "object" ? getId(itemOrId) : itemOrId;
    if (!id) return;
    setWishlist((prev) => prev.filter((w) => getId(w) !== id));
  };

  const value = useMemo(
    () => ({
      cart,
      wishlist,
      cartCount: cart.reduce((sum, it) => sum + Number(it?.qty ?? it?.quantity ?? 1), 0),
      wishlistCount: wishlist.length,
      addToBag,
      toggleWishlist,
      deleteFromCart,
      deleteFromWishlist,
    }),
    [cart, wishlist]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

