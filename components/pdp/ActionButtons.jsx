"use client";

import React from "react";
import Button from "@/components/Button";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteIcon from "@mui/icons-material/Favorite";

export default function ActionButtons({ isWishlisted, onWishlistToggle, onBuyNow, onAddToCart }) {
  return (
    <div className="flex flex-col gap-3">
      {/* Add to Cart - Primary Brand Magenta */}
      <Button 
        onClick={onAddToCart}
        variant="primary"
        fullWidth
        className="h-[48px] text-[15px] font-bold"
      >
        Add to Cart
      </Button>

      {/* Buy Now - Outlined Secondary */}
      <Button 
        onClick={onBuyNow}
        variant="outlined"
        fullWidth
        className="h-[48px] text-[15px] font-bold border-brand-pink text-brand-pink bg-transparent"
      >
        Buy Now
      </Button>

      {/* Wishlist Link */}
      <button
        onClick={onWishlistToggle}
        className="flex items-center justify-center gap-2 py-3 text-[14px] font-semibold text-brand-dark hover:text-brand-pink transition-all duration-200"
      >
        {isWishlisted ? (
          <>
            <FavoriteIcon className="text-brand-pink animate-pulse" />
            <span className="text-brand-pink font-bold">Saved to Wishlist</span>
          </>
        ) : (
          <>
            <FavoriteBorderOutlinedIcon />
            <span>Add to Wishlist</span>
          </>
        )}
      </button>
    </div>
  );
}
