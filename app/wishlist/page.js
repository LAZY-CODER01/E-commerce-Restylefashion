"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";

import { useCart } from "@/context/CartContext";

const PLACEHOLDER =
  "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80";

function formatMoney(value) {
  const n = Number(value);

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

function lineId(item) {
  return String(
    item?.id ??
      item?._id ??
      item?.productId ??
      ""
  );
}

function WishlistCard({
  item,
  onRemove,
  onAddToBag,
}) {
  const id = lineId(item);

  const title =
    item?.title ??
    item?.name ??
    "Oversized Cotton Shirt";

  const image =
    item?.imageUrl ||
    item?.images?.[0] ||
    PLACEHOLDER;

  const price = Number(
    item?.price ?? 2550
  );

  return (
    <motion.div
      layout
      initial={{
        opacity: 0,
        y: 15,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.3,
      }}
      className="relative flex gap-4 rounded-[22px] border border-[#F3F3F3] bg-white p-3 shadow-[0_2px_10px_rgba(0,0,0,0.03)]"
    >
      {/* IMAGE */}
      <div className="relative h-[122px] w-[122px] shrink-0 overflow-hidden rounded-[18px] bg-[#FAFAFA]">
        <Image
          src={image}
          alt={title}
          fill
          className="object-contain p-2"
        />
      </div>

      {/* HEART */}
      <button
        onClick={() => onRemove(id)}
        className="absolute left-[112px] top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-md"
      >
        <FavoriteRoundedIcon
          sx={{
            fontSize: 21,
            color: "#FF2147",
          }}
        />
      </button>

      {/* CONTENT */}
      <div className="flex flex-1 flex-col py-1 pr-1">
        <div>
          <h2 className="line-clamp-2 text-[20px] font-semibold leading-[28px] tracking-[-0.3px] text-[#111111]">
            {title}
          </h2>

          <div className="mt-2 flex items-center gap-2 text-[15px] font-medium text-[#707070]">
            <span>
              {item?.selectedSize ||
                item?.size ||
                "S"}
            </span>

            <span>|</span>

            <span>
              {item?.selectedColor ||
                item?.color ||
                "White"}
            </span>
          </div>

          <div className="mt-6 flex items-center justify-between">
            <p className="text-[16px] font-bold tracking-[-0.8px] text-black">
              {formatMoney(price)}
            </p>

            <button
              onClick={() =>
                onAddToBag({
                  ...item,
                  qty: 1,
                })
              }
              className="h-10 min-w-[120px] rounded-[14px] bg-[#FFF4F6] px-4 text-[14px] font-semibold text-[#444]"
            >
              Add to Bag
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function WishlistPage() {
  const router = useRouter();

  const {
    wishlist,
    deleteFromWishlist,
    addToBag,
  } = useCart();

  const items = Array.isArray(wishlist)
    ? wishlist
    : [];

  return (
    <main className="min-h-screen bg-white pb-10">
      <div className="mx-auto w-full max-w-[1280px] px-5 pt-6">
        {/* HEADER */}
        <header className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="flex h-10 w-10 items-center justify-center"
          >
            <ArrowBackIosNewRoundedIcon
              sx={{
                fontSize: 22,
                color: "#111",
              }}
            />
          </button>

          <h1 className="text-[22px] font-medium tracking-[-0.5px] text-black">
            My Wishlist
          </h1>
        </header>

        {/* SUBTITLE */}
        <p className="mt-4 text-[15px] text-[#707070]">
          Items you love, all in one place.
        </p>

        {/* LIST */}
        <div className="mt-6 flex flex-col gap-5">
          {items.length === 0 ? (
            <div className="rounded-[22px] border border-[#F3F3F3] bg-white p-10 text-center">
              <p className="text-[16px] text-[#666]">
                Your wishlist is empty
              </p>

              <Link
                href="/"
                className="mt-4 inline-block text-pink-500"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            items.map((item, index) => (
              <WishlistCard
                key={
                  lineId(item) ||
                  index
                }
                item={item}
                onRemove={
                  deleteFromWishlist
                }
                onAddToBag={addToBag}
              />
            ))
          )}
        </div>
      </div>
    </main>
  );
}