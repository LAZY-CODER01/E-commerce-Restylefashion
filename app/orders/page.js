"use client";

import { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { useCart } from "@/context/CartContext";
const FREE_SHIPPING_MIN = 1000;
const SHIPPING_FEE = 49;
const PLACEHOLDER_IMG =
  "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=320&q=80";

function formatMoney(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return "—";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

function getLineId(item) {
  return String(item?.id ?? item?._id ?? item?.sku ?? item?.slug ?? item?.productId ?? "");
}

function sellerLabel(item) {
  if (item?.businessName) return String(item.businessName);
  if (item?.sellerName) return String(item.sellerName);
  if (item?.seller && typeof item.seller === "object") {
    return item.seller.fullName || item.seller.name || "Restyle seller";
  }
  return "Restyle seller";
}

function computeTotals(cart) {
  const items = Array.isArray(cart) ? cart : [];
  let subtotal = 0;
  let savings = 0;
  for (const it of items) {
    const unit = Number(it?.price ?? it?.salePrice ?? it?.amount ?? 0);
    const orig = Number(it?.originalPrice ?? it?.mrp ?? unit);
    const qty = Math.max(1, Number(it?.qty ?? it?.quantity ?? 1) || 1);
    subtotal += unit * qty;
    if (orig > unit) savings += (orig - unit) * qty;
  }
  const shipping = subtotal === 0 ? 0 : subtotal >= FREE_SHIPPING_MIN ? 0 : SHIPPING_FEE;
  const total = subtotal + shipping;
  return { subtotal, savings, shipping, total };
}

function deliveryHint(subtotal) {
  if (subtotal <= 0) return "Add items to see delivery options.";
  if (subtotal >= FREE_SHIPPING_MIN) return "FREE delivery by Tomorrow — order within 2 hrs";
  return `Delivery in 4–6 business days · Add ${formatMoney(FREE_SHIPPING_MIN - subtotal)} more for FREE delivery`;
}

function CartLineCard({ item, onInc, onDec, onRemove, cartSubtotal }) {
  const id = getLineId(item);
  const title = item?.title ?? item?.name ?? "Product";
  const brand = item?.brand ?? "";
  const price = Number(item?.price ?? item?.salePrice ?? item?.amount ?? 0);
  const qty = Math.max(1, Number(item?.qty ?? item?.quantity ?? 1) || 1);
  const img = item?.imageUrl || item?.images?.[0] || PLACEHOLDER_IMG;
  const size = item?.selectedSize || item?.size;
  const hint = deliveryHint(cartSubtotal);

  return (
    <article className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="flex flex-col gap-4 p-4 sm:flex-row sm:gap-6 sm:p-6">
        <div className="relative mx-auto h-44 w-36 shrink-0 overflow-hidden rounded-xl bg-gray-50 sm:mx-0 sm:h-48 sm:w-40">
          <Image src={img} alt={title} fill className="object-cover" sizes="160px" />
        </div>

        <div className="min-w-0 flex-1">
          {brand ? (
            <p className="text-[11px] font-bold uppercase tracking-widest text-gray-500">{brand}</p>
          ) : null}
          <h2 className="mt-1 text-[16px] font-bold leading-snug text-brand-dark sm:text-[17px]">{title}</h2>
          {size ? (
            <p className="mt-1 text-[13px] font-medium text-gray-500">
              Size: <span className="text-brand-dark">{size}</span>
            </p>
          ) : null}
          <p className="mt-1 text-[12px] text-gray-500">
            Sold by <span className="font-semibold text-brand-dark/80">{sellerLabel(item)}</span>
          </p>
          <p className="mt-3 text-[20px] font-extrabold text-brand-dark">{formatMoney(price)}</p>
          <p className="mt-2 text-[13px] font-medium text-emerald-700">{hint}</p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <span className="text-[12px] font-bold uppercase tracking-wide text-gray-500">Qty</span>
            <div className="inline-flex items-center rounded-lg border border-gray-200 bg-gray-50">
              <button
                type="button"
                aria-label="Decrease quantity"
                className="flex h-10 w-10 items-center justify-center text-lg font-bold text-brand-dark transition hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-pink/40"
                onClick={() => onDec(item)}
              >
                −
              </button>
              <span className="min-w-[2.5rem] text-center text-[15px] font-bold text-brand-dark">{qty}</span>
              <button
                type="button"
                aria-label="Increase quantity"
                className="flex h-10 w-10 items-center justify-center text-lg font-bold text-brand-dark transition hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-pink/40"
                onClick={() => onInc(item)}
              >
                +
              </button>
            </div>

            <button
              type="button"
              onClick={() => onRemove(id)}
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 text-[13px] font-bold text-gray-600 transition hover:border-brand-pink/40 hover:text-brand-pink focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-pink/40"
            >
              <DeleteOutlineOutlinedIcon sx={{ fontSize: 20 }} />
              Remove
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

function OrderSummaryCard({ subtotal, savings, shipping, total, checkoutEnabled }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6 shadow-sm md:p-8">
      <h2 className="text-[17px] font-extrabold tracking-tight text-brand-dark">Order Summary</h2>

      <div className="mt-6 space-y-3 text-[14px] text-brand-dark/80">
        <div className="flex justify-between gap-4">
          <span>Subtotal</span>
          <span className="font-semibold text-brand-dark">{formatMoney(subtotal)}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span>Shipping</span>
          <span className="font-semibold text-brand-dark">
            {subtotal <= 0 ? "—" : shipping === 0 ? <span className="text-emerald-700">FREE</span> : formatMoney(shipping)}
          </span>
        </div>
        {savings > 0 ? (
          <div className="flex justify-between gap-4 text-emerald-700">
            <span>Discount (on MRP)</span>
            <span className="font-semibold">−{formatMoney(savings)}</span>
          </div>
        ) : null}
      </div>

      <div className="my-5 h-px bg-gray-200" />

      <div className="flex items-center justify-between">
        <span className="text-[15px] font-bold text-brand-dark">Total</span>
        <span className="text-[22px] font-extrabold text-brand-dark">{formatMoney(total)}</span>
      </div>

      {subtotal > 0 && subtotal < FREE_SHIPPING_MIN ? (
        <p className="mt-3 text-center text-[12px] font-medium text-gray-500">
          Add {formatMoney(FREE_SHIPPING_MIN - subtotal)} more for free shipping
        </p>
      ) : null}

      <button
        type="button"
        disabled={!checkoutEnabled}
        className="mt-8 flex h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#F7246E] to-[#913CF0] text-[15px] font-extrabold uppercase tracking-wide text-white shadow-lg shadow-brand-pink/30 transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-45 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-pink/50 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50"
      >
        <LockOutlinedIcon sx={{ fontSize: 20 }} aria-hidden />
        Proceed to checkout
      </button>

      <p className="mt-3 text-center text-[11px] font-medium text-gray-400">Secure payment · SSL encrypted</p>
    </div>
  );
}

export default function OrdersPage() {
  const { cart, cartCount, deleteFromCart, incrementCartItem } = useCart();

  const cartItems = Array.isArray(cart) ? cart : [];
  const { subtotal, savings, shipping, total } = useMemo(() => computeTotals(cartItems), [cartItems]);

  return (
    <main className="min-h-screen bg-white font-sans pb-16">
      <div className="mx-auto w-full max-w-[1280px] px-4 py-8 md:px-9 md:py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-9">
          <div className="lg:col-span-8">
            <section aria-labelledby="orders-bag-heading">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h1
                    id="orders-bag-heading"
                    className="text-[24px] font-extrabold tracking-tight text-brand-dark md:text-[28px]"
                  >
                    Orders Bag
                  </h1>
                  <p className="mt-1 text-[14px] font-medium text-gray-500">
                    {cartCount} {cartCount === 1 ? "item" : "items"} in your bag
                  </p>
                </div>
                <Link
                  href="/"
                  className="text-[14px] font-semibold text-brand-pink hover:text-brand-pink-hover hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-pink/40 focus-visible:ring-offset-2"
                >
                  Continue shopping
                </Link>
              </div>

              <div className="mt-6 space-y-4">
                {cartItems.length === 0 ? (
                  <div className="rounded-2xl border border-gray-200 bg-gray-50 px-6 py-12 text-center shadow-sm md:py-14">
                    <p className="text-[15px] font-medium text-gray-600">Your bag is empty. Add something you love.</p>
                  </div>
                ) : (
                  cartItems.map((item) => (
                    <CartLineCard
                      key={getLineId(item) || item.title}
                      item={item}
                      cartSubtotal={subtotal}
                      onInc={(it) => incrementCartItem(it, 1)}
                      onDec={(it) => incrementCartItem(it, -1)}
                      onRemove={deleteFromCart}
                    />
                  ))
                )}
              </div>
            </section>
          </div>

          <aside className="lg:col-span-4">
            <div className="lg:sticky lg:top-24">
              <OrderSummaryCard
                subtotal={subtotal}
                savings={savings}
                shipping={shipping}
                total={total}
                checkoutEnabled={cartItems.length > 0}
              />
              <p className="mt-4 hidden text-[12px] leading-relaxed text-gray-400 lg:block">
                Prices and delivery are indicative. Final totals are confirmed at checkout.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
