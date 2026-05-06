import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { formatINR } from "@/data/sellerDashboardMock";

export default function OrderListItem({ order, href = "#" }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-2xl bg-white px-3 py-3 shadow-sm transition hover:bg-gray-50"
      aria-label={`Order ${order.id}`}
    >
      <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-gray-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={order.image} alt="" className="h-full w-full object-cover" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-[13px] font-semibold text-gray-900">#{order.id}</p>
        <p className="mt-0.5 text-[12px] font-medium text-gray-500 line-clamp-1">
          {order.productName}
        </p>
        <p className="mt-1 text-[11px] font-medium text-gray-400">{order.dateTime}</p>
      </div>

      <div className="flex items-center gap-2">
        <p className="text-[13px] font-semibold text-gray-900">₹{formatINR(order.amount)}</p>
        <ChevronRight className="h-5 w-5 text-gray-300" aria-hidden />
      </div>
    </Link>
  );
}

