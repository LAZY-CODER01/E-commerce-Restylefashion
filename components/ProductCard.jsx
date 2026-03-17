import React from "react";
import Image from "next/image";
import Link from "next/link";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import StarIcon from "@mui/icons-material/Star";

export default function ProductCard({
  id = "1",
  title = "Vintage Denim Jacket",
  brand = "Levi's",
  price = "45",
  originalPrice = "90",
  imageUrl = "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  size = "M",
  rating = 4.5,
}) {
  return (
    <div className="group relative flex flex-col gap-3 transition-all duration-300 hover:-translate-y-1 p-0 cursor-pointer">
      <Link href={`/product/${id}`} className="absolute inset-0 z-10" aria-label={`View ${title}`} />
      
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
          className="absolute right-3 top-3 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-brand-dark backdrop-blur-sm transition-colors hover:bg-brand-pink hover:text-white"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <FavoriteBorderOutlinedIcon fontSize="small" />
        </button>

        {/* Size Badge */}
        <div className="absolute bottom-3 left-3 z-20 rounded bg-white/90 px-2 py-1 text-[11px] font-bold text-brand-dark backdrop-blur-sm">
          {size}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-1 px-1">
        <h3 className="text-[13px] font-semibold text-gray-500 uppercase tracking-wide">
          {brand}
        </h3>
        <p className="line-clamp-1 text-[15px] font-medium text-brand-dark">
          {title}
        </p>

        {/* Rating Stars */}
        <div className="flex items-center gap-1 text-brand-pink">
          {[...Array(5)].map((_, i) => (
            <StarIcon 
              key={i} 
              sx={{ fontSize: 14 }} 
              className={i < Math.floor(rating) ? "text-brand-pink" : "text-gray-200"}
            />
          ))}
          <span className="text-[11px] text-gray-400 ml-1">({rating})</span>
        </div>

        <div className="mt-1 flex items-center gap-2">
          <span className="text-[16px] font-bold text-brand-pink">₹{price}</span>
          {originalPrice && (
            <span className="text-[13px] font-medium text-gray-400 line-through">
              ₹{originalPrice}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
