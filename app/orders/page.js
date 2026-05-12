"use client";

import { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useCart } from "@/context/CartContext";

const PLATFORM_FEE = 199;
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

function computeTotals(cart) {
  const items = Array.isArray(cart) ? cart : [];
  let subtotal = 0;
  for (const it of items) {
    const unit = Number(it?.price ?? it?.salePrice ?? it?.amount ?? 0);
    const qty = Math.max(1, Number(it?.qty ?? it?.quantity ?? 1) || 1);
    subtotal += unit * qty;
  }
  const platformFee = items.length > 0 ? PLATFORM_FEE : 0;
  const shipping = 0;
  const total = subtotal + platformFee + shipping;
  return { subtotal, platformFee, shipping, total, itemCount: items.reduce((s, it) => s + Math.max(1, Number(it?.qty ?? it?.quantity ?? 1) || 1), 0) };
}

function CartItemCard({ item, onInc, onDec, onRemove, isWishlisted, onToggleWishlist }) {
  const id = getLineId(item);
  const productHref = id ? `/product/${id}` : "#";
  const title = item?.title ?? item?.name ?? "Product";
  const price = Number(item?.price ?? item?.salePrice ?? item?.amount ?? 0);
  const qty = Math.max(1, Number(item?.qty ?? item?.quantity ?? 1) || 1);
  const img = item?.imageUrl || item?.images?.[0] || PLACEHOLDER_IMG;
  const size = item?.selectedSize || item?.size || "";
  const color = item?.selectedColor || item?.color || "";
  const condition = item?.condition || "";

  return (
    <div className="py-5">
      <div className="flex gap-4">
        {/* Image */}
        <Link href={productHref} className="relative block h-[140px] w-[120px] shrink-0 overflow-hidden rounded-xl bg-[#F8F8F8] sm:h-[160px] sm:w-[140px]">
          <Image src={img} alt={title} fill className="object-contain p-2" sizes="140px" />
          <button
            type="button"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onToggleWishlist(item); }}
            className="absolute right-2 top-2 z-10"
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            {isWishlisted ? (
              <FavoriteRoundedIcon sx={{ fontSize: 22, color: "#FF2147" }} />
            ) : (
              <FavoriteBorderOutlinedIcon sx={{ fontSize: 22, color: "#555" }} />
            )}
          </button>
        </Link>

        {/* Content */}
        <div className="flex min-w-0 flex-1 flex-col">
          <Link href={productHref} className="hover:underline">
            <h2 className="text-[16px] font-semibold leading-snug text-[#111] sm:text-[17px]">{title}</h2>
          </Link>

          {(size || color) && (
            <p className="mt-1 text-[13px] text-[#888]">
              {size}{size && color ? "  |  " : ""}{color}
            </p>
          )}

          {condition && (
            <span className="mt-2 inline-block w-fit rounded-md border border-green-200 bg-green-50 px-2.5 py-0.5 text-[11px] font-semibold text-green-700">
              {condition}
            </span>
          )}

          <p className="mt-3 text-[17px] font-bold text-[#111]">{formatMoney(price)}</p>
        </div>
      </div>

      {/* Qty + Delete */}
      <div className="mt-4 flex items-center gap-5 pl-0 sm:pl-[156px]">
        <div className="flex items-center rounded-lg border border-[#E0E0E0]">
          <button
            type="button"
            onClick={() => onDec(item)}
            className="flex h-10 w-10 items-center justify-center text-[18px] font-bold text-[#333] transition hover:bg-gray-50"
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span className="flex h-10 w-10 items-center justify-center border-x border-[#E0E0E0] text-[15px] font-bold text-[#111]">
            {qty}
          </span>
          <button
            type="button"
            onClick={() => onInc(item)}
            className="flex h-10 w-10 items-center justify-center text-[18px] font-bold text-[#333] transition hover:bg-gray-50"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>

        <button
          type="button"
          onClick={() => onRemove(id)}
          className="text-[13px] font-bold uppercase tracking-wide text-[#333] underline underline-offset-2 transition hover:text-[#FF2147]"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

function PriceDetails({ subtotal, platformFee, shipping, total, itemCount }) {
  return (
    <div className="border-t border-[#EEEEEE] pt-6">
      <h2 className="text-[14px] font-bold uppercase tracking-wider text-[#111]">
        Price Details
      </h2>

      <div className="mt-5 space-y-3.5 text-[14px]">
        <div className="flex items-center justify-between">
          <span className="text-[#555]">Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"})</span>
          <span className="font-medium text-[#111]">{formatMoney(subtotal)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1 text-[#555]">
            Platform Fee
            <InfoOutlinedIcon sx={{ fontSize: 15, color: "#999" }} />
          </span>
          <span className="font-medium text-[#111]">{formatMoney(platformFee)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[#555]">Shipping Fee</span>
          <span className="font-semibold text-green-600">FREE</span>
        </div>
      </div>

      <div className="my-5 border-t border-dashed border-[#D5D5D5]" />

      <div className="flex items-start justify-between">
        <span className="text-[16px] font-bold text-[#111]">Total Amount</span>
        <div className="text-right">
          <span className="text-[20px] font-bold text-[#111]">{formatMoney(total)}</span>
          <p className="mt-0.5 text-[12px] text-[#888]">(GST included)</p>
        </div>
      </div>
    </div>
  );
}

export default function OrdersPage() {
  const router = useRouter();
  const { cart, wishlist, deleteFromCart, incrementCartItem, toggleWishlist } = useCart();

  const cartItems = Array.isArray(cart) ? cart : [];
  const { subtotal, platformFee, shipping, total, itemCount } = useMemo(() => computeTotals(cartItems), [cartItems]);

  const isWishlisted = (item) => {
    const id = getLineId(item);
    return wishlist.some((w) => getLineId(w) === id);
  };

  return (
    <main className="min-h-screen bg-white pb-6">
      <div className="mx-auto w-full max-w-[1280px] px-4 md:px-6">
        {/* Header */}
        <header className="flex items-center gap-3 border-b border-[#F0F0F0] py-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="-ml-2 rounded-full p-2 text-gray-800 hover:bg-gray-100"
            aria-label="Back"
          >
            <ArrowBackOutlinedIcon sx={{ fontSize: 22 }} />
          </button>
          <h1 className="text-[20px] font-bold tracking-tight text-[#111]">MY CART</h1>
        </header>

        {/* Content */}
        <div className="grid grid-cols-1 gap-0 lg:grid-cols-12 lg:gap-10">
          {/* Cart Items */}
          <div className="lg:col-span-7">
            {cartItems.length === 0 ? (
              <div className="py-16 text-center">
                <p className="text-[15px] text-[#888]">Your cart is empty</p>
                <Link href="/" className="mt-4 inline-block text-[14px] font-semibold text-pink-500">
                  Continue Shopping
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-[#F0F0F0]">
                {cartItems.map((item) => (
                  <CartItemCard
                    key={getLineId(item) || item.title}
                    item={item}
                    isWishlisted={isWishlisted(item)}
                    onToggleWishlist={toggleWishlist}
                    onInc={(it) => incrementCartItem(it, 1)}
                    onDec={(it) => incrementCartItem(it, -1)}
                    onRemove={deleteFromCart}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Price + Checkout */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-24">
              {cartItems.length > 0 && (
                <>
                  <PriceDetails
                    subtotal={subtotal}
                    platformFee={platformFee}
                    shipping={shipping}
                    total={total}
                    itemCount={itemCount}
                  />

                  <Link
                    href="/checkout"
                    className="mt-7 flex h-[52px] w-full items-center justify-center rounded-xl bg-gradient-to-r from-[#F7246E] to-[#FF6B9D] text-[15px] font-bold uppercase tracking-wider text-white shadow-lg shadow-pink-200/50 transition hover:opacity-95 active:scale-[0.98]"
                  >
                    Proceed to Checkout
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
