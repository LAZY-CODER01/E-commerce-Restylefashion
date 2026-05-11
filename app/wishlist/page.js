"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
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
    cartCount,
    deleteFromWishlist,
    addToBag,
  } = useCart();

  const items = Array.isArray(wishlist)
    ? wishlist
    : [];

  return (
    <main className="min-h-screen bg-white pb-28">
      {/* CONTAINER */}
      <div className="mx-auto w-full max-w-[430px] px-5 pt-6">
        {/* HEADER */}
        <header className="flex items-center justify-between">
          {/* BACK */}
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

          {/* TITLE */}
          <div className="text-center">
            <h1 className="text-[30px] font-bold tracking-[-1.5px] text-black">
              My Wishlist
            </h1>
          </div>

          {/* CART */}
          <button
            onClick={() => router.push("/cart")}
            className="relative flex h-10 w-10 items-center justify-center"
          >
            <ShoppingBagOutlinedIcon
              sx={{
                fontSize: 30,
                color: "#111",
              }}
            />

            {cartCount > 0 && (
              <span className="absolute right-0 top-0 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#FF2147] px-1 text-[11px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </button>
        </header>

        {/* SUBTITLE */}
        <p className="mt-8 text-[18px] font-medium text-[#707070]">
          Items you love, all in one place.
        </p>

        {/* LIST */}
        <div className="mt-7 flex flex-col gap-5">
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

      {/* BOTTOM NAV */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-[#F1F1F1] bg-white">
        <div className="mx-auto flex h-[78px] max-w-[430px] items-center justify-around">
          <div className="flex flex-col items-center gap-1 text-[#444]">
            <span className="text-[24px]">⌂</span>
            <span className="text-[13px]">
              Home
            </span>
          </div>

          <div className="flex flex-col items-center gap-1 text-[#444]">
            <span className="text-[24px]">
              ⌕
            </span>
            <span className="text-[13px]">
              Search
            </span>
          </div>

          <div className="flex flex-col items-center gap-1 text-[#444]">
            <span className="text-[24px]">
              ⊞
            </span>
            <span className="text-[13px]">
              Sell
            </span>
          </div>

          <div className="flex flex-col items-center gap-1 text-[#FF2147]">
            <FavoriteRoundedIcon
              sx={{ fontSize: 27 }}
            />

            <span className="text-[13px] font-medium">
              Wishlist
            </span>
          </div>

          <div className="flex flex-col items-center gap-1 text-[#444]">
            <span className="text-[24px]">
              ◯
            </span>
            <span className="text-[13px]">
              Profile
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}