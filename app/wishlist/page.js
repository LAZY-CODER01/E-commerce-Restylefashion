"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";

function formatMoney(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return "—";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

export default function WishlistPage() {
  const { wishlist, wishlistCount, deleteFromWishlist, addToBag } = useCart();

  return (
    <main className="font-['Roboto'] bg-white">
      <div className="mx-auto w-full max-w-7xl px-4 md:px-9 py-10 md:py-12">
        <div className="grid grid-cols-4 md:grid-cols-12 gap-6 md:gap-9">
          <section className="col-span-4 md:col-span-12">
            <div className="flex items-end justify-between gap-4">
              <div>
                <h1 className="text-[22px] md:text-[28px] font-extrabold tracking-tight text-[#2F2F2F]">
                  Wishlist
                </h1>
                <p className="mt-1 text-[14px] text-[#2F2F2F]/70">
                  {wishlistCount} item{wishlistCount === 1 ? "" : "s"} saved
                </p>
              </div>
              <Link
                href="/"
                className="text-[14px] font-semibold text-[#F7246E] hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F8085A] focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-md px-2 py-1"
              >
                Continue shopping
              </Link>
            </div>

            <div className="mt-6 space-y-4">
              {wishlist.length === 0 ? (
                <div className="rounded-2xl border border-black/10 bg-[#FAFAFA] p-9">
                  <p className="text-[14px] font-medium text-[#2F2F2F]/75">
                    Your wishlist is empty. Save products to see them here.
                  </p>
                </div>
              ) : (
                wishlist.map((item) => {
                  const id = item?.id ?? item?._id ?? item?.sku ?? item?.slug ?? item?.productId;
                  const title = item?.title ?? item?.name ?? "Item";
                  const brand = item?.brand;
                  const price = item?.price ?? item?.salePrice ?? item?.amount;

                  return (
                    <article
                      key={id ?? title}
                      className="rounded-2xl border border-black/10 bg-white p-4 md:p-9"
                    >
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div className="min-w-0">
                          {brand ? (
                            <p className="text-[12px] font-bold tracking-widest text-[#2F2F2F]/55 uppercase">
                              {brand}
                            </p>
                          ) : null}
                          <p className="mt-1 text-[16px] font-bold text-[#2F2F2F] truncate">
                            {title}
                          </p>
                          <p className="mt-1 text-[14px] text-[#2F2F2F]/70">
                            {formatMoney(price)}
                          </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                          <button
                            type="button"
                            onClick={() => {
                              addToBag({ ...item, qty: 1 });
                            }}
                            className="h-12 rounded-xl px-6 text-[14px] font-bold text-white shadow-sm transition-opacity hover:opacity-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F8085A] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                            style={{
                              background: "linear-gradient(90deg, #F7246E 0%, #913CF0 100%)",
                            }}
                          >
                            Add to Bag
                          </button>

                          <button
                            type="button"
                            onClick={() => deleteFromWishlist(id)}
                            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-black/10 bg-white px-4 text-[14px] font-semibold text-[#2F2F2F] hover:bg-black/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F8085A] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                            aria-label={`Remove ${title}`}
                          >
                            <DeleteOutlineOutlinedIcon sx={{ fontSize: 20, color: "#F7246E" }} />
                            Remove
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

