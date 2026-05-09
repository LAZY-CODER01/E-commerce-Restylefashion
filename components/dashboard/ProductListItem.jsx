import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { formatINR } from "@/data/sellerDashboardMock";

export default function ProductListItem({
  product,
  href,
  rightSlot,
  subtitleSlot,
  badgeSlot,
}) {
  const Wrapper = href ? Link : "div";
  const wrapperProps = href
    ? { href, className: "block" }
    : { className: "block" };

  return (
    <Wrapper
      {...wrapperProps}
      className={[
        "flex items-center gap-3 rounded-2xl bg-white px-3 py-3 shadow-sm",
        href ? "transition hover:bg-gray-50" : "",
      ].join(" ")}
    >
      <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-gray-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={product.image} alt="" className="h-full w-full object-cover" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-[13px] font-semibold text-gray-900 line-clamp-1">{product.name}</p>
        {subtitleSlot ? (
          subtitleSlot
        ) : (
          <p className="mt-0.5 text-[12px] font-medium text-gray-500">₹{formatINR(product.price)}</p>
        )}
      </div>

      <div className="flex items-center gap-3">
        {badgeSlot || null}
        {rightSlot || (href ? <ChevronRight className="h-5 w-5 text-gray-300" aria-hidden /> : null)}
      </div>
    </Wrapper>
  );
}

