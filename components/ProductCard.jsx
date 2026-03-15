import React from "react";
import Image from "next/image";
import Link from "next/link";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";

export default function ProductCard({
  id = "1",
  title = "Vintage Denim Jacket",
  brand = "Levi's",
  price = "45",
  originalPrice = "90",
  imageUrl = "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  size = "M",
}) {
  return (
    <div className="group flex flex-col gap-3 rounded-card transition-all duration-300 hover:-translate-y-1 hover:shadow-drawer bg-white p-3 cursor-pointer">
      {/* Image Container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg bg-gray-100">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
        />
        {/* Wishlist Button */}
        <button
          aria-label="Add to wishlist"
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-brand-dark backdrop-blur-sm transition-colors hover:bg-brand-pink hover:text-white"
        >
          <FavoriteBorderOutlinedIcon fontSize="small" />
        </button>

        {/* Size Badge */}
        <div className="absolute bottom-3 left-3 rounded bg-white/90 px-2 py-1 text-[11px] font-bold text-brand-dark backdrop-blur-sm">
          {size}
        </div>
      </div>

      {/* Content */}
      <Link href={`/product/${id}`} className="flex flex-col gap-1 px-1">
        <h3 className="text-[13px] font-semibold text-gray-500 uppercase tracking-wide">
          {brand}
        </h3>
        <p className="line-clamp-1 text-[15px] font-medium text-brand-dark">
          {title}
        </p>

        <div className="mt-1 flex items-center gap-2">
          <span className="text-[16px] font-bold text-brand-pink">${price}</span>
          {originalPrice && (
            <span className="text-[13px] font-medium text-gray-400 line-through">
              ${originalPrice}
            </span>
          )}
        </div>
      </Link>
    </div>
  );
}
