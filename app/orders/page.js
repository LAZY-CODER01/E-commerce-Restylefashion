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

export default function OrdersPage() {
  const { cart, cartCount, deleteFromCart } = useCart();

  const subtotal = cart.reduce((sum, it) => {
    const price = Number(it?.price ?? it?.salePrice ?? it?.amount ?? 0);
    const qty = Number(it?.qty ?? 1);
    return sum + price * qty;
  }, 0);

  return (
    <main className="font-['Roboto'] bg-white">
      <div className="mx-auto w-full max-w-7xl px-4 md:px-9 py-10 md:py-12">
        <div className="grid grid-cols-4 md:grid-cols-12 gap-6 md:gap-9">
          {/* Left: items */}
          <section className="col-span-4 md:col-span-8">
            <div className="flex items-end justify-between gap-4">
              <div>
                <h1 className="text-[22px] md:text-[28px] font-extrabold tracking-tight text-[#2F2F2F]">
                  Orders Bag
                </h1>
                <p className="mt-1 text-[14px] text-[#2F2F2F]/70">
                  {cartCount} item{cartCount === 1 ? "" : "s"} in your bag
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
              {cart.length === 0 ? (
                <div className="rounded-2xl border border-black/10 bg-[#FAFAFA] p-9">
                  <p className="text-[14px] font-medium text-[#2F2F2F]/75">
                    Your bag is empty. Add something you love.
                  </p>
                </div>
              ) : (
                cart.map((item) => {
                  const id = item?.id ?? item?._id ?? item?.sku ?? item?.slug ?? item?.productId;
                  const title = item?.name ?? item?.title ?? "Item";
                  const price = item?.price ?? item?.salePrice ?? item?.amount;
                  const qty = Number(item?.qty ?? 1);

                  return (
                    <article
                      key={id ?? title}
                      className="rounded-2xl border border-black/10 bg-white p-4 md:p-9"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <p className="text-[16px] font-bold text-[#2F2F2F] truncate">
                            {title}
                          </p>
                          <p className="mt-1 text-[14px] text-[#2F2F2F]/70">
                            {formatMoney(price)}{" "}
                            {qty > 1 ? (
                              <span className="text-[#2F2F2F]/55">× {qty}</span>
                            ) : null}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => deleteFromCart(id)}
                          className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-black/10 bg-white px-4 text-[14px] font-semibold text-[#2F2F2F] hover:bg-black/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F8085A] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                          aria-label={`Remove ${title}`}
                        >
                          <DeleteOutlineOutlinedIcon sx={{ fontSize: 20, color: "#F7246E" }} />
                          Remove
                        </button>
                      </div>
                    </article>
                  );
                })
              )}
            </div>
          </section>

          {/* Right: summary */}
          <aside className="col-span-4 md:col-span-4">
            <div className="rounded-2xl border border-black/10 bg-[#FAFAFA] p-4 md:p-9">
              <h2 className="text-[16px] font-extrabold text-[#2F2F2F]">
                Order Summary
              </h2>

              <div className="mt-4 space-y-2 text-[14px] text-[#2F2F2F]/80">
                <div className="flex items-center justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#2F2F2F]">
                    {formatMoney(subtotal)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Shipping</span>
                  <span className="font-semibold text-[#2F2F2F]">—</span>
                </div>
              </div>

              <div className="mt-4 h-px bg-black/10" />

              <div className="mt-4 flex items-center justify-between text-[14px]">
                <span className="font-semibold text-[#2F2F2F]">Total</span>
                <span className="text-[18px] font-extrabold text-[#2F2F2F]">
                  {formatMoney(subtotal)}
                </span>
              </div>

              <button
                type="button"
                className="mt-6 w-full h-12 rounded-xl px-4 text-[14px] font-bold text-white shadow-sm transition-opacity hover:opacity-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F8085A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAFAFA]"
                style={{
                  background: "linear-gradient(90deg, #F7246E 0%, #913CF0 100%)",
                }}
                disabled={cart.length === 0}
              >
                Proceed to Checkout
              </button>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

