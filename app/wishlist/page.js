"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { useCart } from "@/context/CartContext";

const PLACEHOLDER =
  "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80";

function formatMoney(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return "—";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

function lineId(item) {
  return String(item?.id ?? item?._id ?? item?.sku ?? item?.slug ?? item?.productId ?? "");
}

function WishlistDetailCard({ item, index, onAddToBag, onRemove }) {
  const id = lineId(item);
  const title = item?.title ?? item?.name ?? "Product";
  const brand = item?.brand ?? "";
  const desc = item?.description ? String(item.description).slice(0, 120) : "";
  const price = Number(item?.price ?? item?.salePrice ?? item?.amount ?? 0);
  const img = item?.imageUrl || item?.images?.[0] || PLACEHOLDER;

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, delay: index * 0.05 }}
      className="w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
    >
      <div className="flex w-full flex-col gap-4 p-4 sm:flex-row sm:items-center sm:gap-5 sm:p-5">
        <div className="relative mx-auto aspect-[3/4] w-full max-w-[140px] shrink-0 overflow-hidden rounded-lg bg-gray-50 sm:mx-0 sm:max-w-[112px] md:max-w-[128px]">
          <Image src={img} alt={title} fill className="object-cover" sizes="(max-width: 640px) 140px, 128px" priority={index === 0} />
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
          <div className="min-w-0 flex-1">
            {brand ? (
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-500">{brand}</p>
            ) : (
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-400">Restyle listing</p>
            )}
            <h2 className="mt-1 text-[17px] font-bold leading-snug tracking-tight text-brand-dark sm:text-[18px] md:text-[19px]">
              {title}
            </h2>
            {desc ? (
              <p className="mt-2 line-clamp-2 text-[13px] leading-snug text-gray-500">{desc}</p>
            ) : (
              <p className="mt-2 text-[13px] leading-snug text-gray-400">Curated pre-loved fashion on Restyle.</p>
            )}
            <p className="mt-3 text-[20px] font-extrabold tracking-tight text-brand-dark sm:text-[21px]">
              {formatMoney(price)}
            </p>
          </div>

          <div className="flex shrink-0 flex-row flex-nowrap items-center justify-end gap-1.5 self-end sm:self-center sm:gap-2">
            <button
              type="button"
              onClick={() => onAddToBag({ ...item, qty: 1 })}
              className="inline-flex h-10 min-h-[40px] items-center justify-center whitespace-nowrap rounded-lg bg-gradient-to-r from-[#F7246E] to-[#913CF0] px-3.5 text-[12px] font-bold text-white shadow-md shadow-brand-pink/25 transition hover:opacity-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-pink/50 focus-visible:ring-offset-2 sm:px-4"
            >
              Add to Bag
            </button>
            <button
              type="button"
              onClick={() => onRemove(id)}
              className="inline-flex h-10 min-h-[40px] items-center justify-center gap-1 whitespace-nowrap rounded-lg border-2 border-gray-200 bg-white px-2.5 text-[12px] font-bold text-gray-700 transition hover:border-brand-pink/50 hover:text-brand-pink focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-pink/40 sm:px-3"
              aria-label={`Remove ${title} from wishlist`}
            >
              <DeleteOutlineOutlinedIcon sx={{ fontSize: 18 }} className="text-gray-500" />
              Remove
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

export default function WishlistPage() {
  const router = useRouter();
  const { wishlist, wishlistCount, deleteFromWishlist, addToBag } = useCart();
  const items = Array.isArray(wishlist) ? wishlist : [];

  return (
    <main className="min-h-screen bg-white font-sans pb-16">
      <div className="mx-auto w-full max-w-5xl px-4 py-6 md:px-8 md:py-8">
        <header className="flex flex-wrap items-start justify-between gap-x-4 gap-y-3">
          <div className="flex min-w-0 flex-1 items-start gap-3 sm:gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="-ml-1 mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[#2F2F2F] transition hover:bg-black/5 md:h-12 md:w-12"
              aria-label="Go back"
            >
              <ArrowBackOutlinedIcon sx={{ fontSize: 26 }} />
            </button>
            <div className="min-w-0">
              <h1 className="text-[22px] font-extrabold tracking-tight text-brand-dark md:text-[28px]">
                Wishlist
              </h1>
              <p className="mt-0.5 text-[13px] font-medium text-gray-500 md:text-[14px]">
                {wishlistCount} item{wishlistCount === 1 ? "" : "s"} saved
              </p>
            </div>
          </div>
          <Link
            href="/"
            className="shrink-0 self-center text-[14px] font-semibold text-brand-pink hover:text-brand-pink-hover hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-pink/40 focus-visible:ring-offset-2"
          >
            Continue shopping
          </Link>
        </header>

        <div className="mt-6 space-y-4">
          {items.length === 0 ? (
            <div className="rounded-xl border border-gray-200 bg-gray-50 px-5 py-12 text-center">
              <p className="text-[14px] font-medium text-gray-600">
                Your wishlist is empty. Save products to see them here.
              </p>
              <Link
                href="/"
                className="mt-5 inline-block text-[14px] font-bold text-brand-pink hover:text-brand-pink-hover hover:underline"
              >
                Discover listings
              </Link>
            </div>
          ) : (
            items.map((item, index) => (
              <WishlistDetailCard
                key={lineId(item) || `${item.title}-${index}`}
                item={item}
                index={index}
                onAddToBag={addToBag}
                onRemove={deleteFromWishlist}
              />
            ))
          )}
        </div>
      </div>
    </main>
  );
}
