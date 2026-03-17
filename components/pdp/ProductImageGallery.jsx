"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function ProductImageGallery({ images = [] }) {
  const [activeImage, setActiveImage] = useState(0);

  if (!images.length) return null;

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4">
      {/* Thumbnails - Left on desktop, bottom on mobile */}
      <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto hide-scrollbar pb-2 md:pb-0 md:max-h-[500px]">
        {images.map((img, idx) => (
          <button
            key={idx}
            onMouseEnter={() => setActiveImage(idx)}
            onClick={() => setActiveImage(idx)}
            className={`relative h-16 w-12 md:h-14 md:w-14 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
              activeImage === idx ? "border-brand-pink shadow-sm" : "border-gray-100 hover:border-gray-300"
            }`}
          >
            <Image
              src={img}
              alt={`Thumbnail ${idx + 1}`}
              fill
              className="object-cover"
              sizes="64px"
            />
          </button>
        ))}
      </div>

      {/* Main Image */}
      <div className="relative flex-1 aspect-square w-full overflow-hidden rounded-card">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="h-full w-full"
          >
            <Image
              src={images[activeImage]}
              alt="Product Image"
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
