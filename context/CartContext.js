"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";

const CartContext = createContext(null);

function safeParseArray(value) {
  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item) => item != null && typeof item === "object");
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

  const userKey = String(user?.email ?? user?.id ?? user?._id ?? "guest");
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

  /** Change quantity by delta; removes line if quantity drops below 1. */
  const incrementCartItem = (itemOrId, delta) => {
    const id = typeof itemOrId === "object" ? getId(itemOrId) : itemOrId;
    if (!id || !Number.isFinite(delta)) return;
    setCart((prev) => {
      const idx = prev.findIndex((c) => getId(c) === id);
      if (idx < 0) return prev;
      const cur = prev[idx];
      const curQty = Math.max(1, Number(cur?.qty ?? cur?.quantity ?? 1) || 1);
      const nextQty = curQty + delta;
      if (nextQty < 1) return prev.filter((c) => getId(c) !== id);
      const next = [...prev];
      next[idx] = { ...cur, qty: nextQty };
      return next;
    });
  };

  const setCartItemQuantity = (itemOrId, qty) => {
    const id = typeof itemOrId === "object" ? getId(itemOrId) : itemOrId;
    if (!id) return;
    const q = Math.floor(Number(qty));
    if (!Number.isFinite(q) || q < 1) {
      setCart((prev) => prev.filter((c) => getId(c) !== id));
      return;
    }
    setCart((prev) => {
      const idx = prev.findIndex((c) => getId(c) === id);
      if (idx < 0) return prev;
      const next = [...prev];
      next[idx] = { ...next[idx], qty: q };
      return next;
    });
  };

  const deleteFromWishlist = (itemOrId) => {
    const id = typeof itemOrId === "object" ? getId(itemOrId) : itemOrId;
    if (!id) return;
    setWishlist((prev) => prev.filter((w) => getId(w) !== id));
  };

  /** Empties the entire cart (called after successful payment). */
  const clearCart = () => setCart([]);

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
      incrementCartItem,
      setCartItemQuantity,
      clearCart,
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

