"use client";

import React, { useState } from "react";

const MEASUREMENT_STEPS = [
  {
    label: "Across Shoulder",
    text: "Measure horizontally between the tips of your shoulders.",
  },
  {
    label: "Bust",
    text: "Measure horizontally around the fullest part of your chest.",
  },
  {
    label: "Waist",
    text: "Measure horizontally around your waist without tightening the tape.",
  },
  {
    label: "Hips",
    text: "Standing with feet together, measure around the fullest part of your hips.",
  },
  {
    label: "Sleeve Length",
    text: "Measure from the shoulder bone to the wrist bone.",
  },
];

export default function SizeSelector({ sizes = [], selectedSize, onSizeSelect }) {
  const [isHowToMeasureOpen, setIsHowToMeasureOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            <h4 className="text-[14px] font-bold uppercase tracking-tight text-brand-dark">Select Size</h4>
            <button
              type="button"
              onClick={() => setIsHowToMeasureOpen(true)}
              className="inline-flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center rounded-full border border-brand-pink/40 text-brand-pink transition hover:border-brand-pink hover:bg-brand-pink/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-pink"
              aria-label="How to measure"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden>
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                <path
                  d="M12 16v-5M12 8h.01"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
          <button
            type="button"
            className="shrink-0 text-[12px] font-bold uppercase tracking-wide text-brand-pink hover:underline"
          >
            Size Chart
          </button>
        </div>
        <div className="flex flex-wrap gap-3">
          {sizes.map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => onSizeSelect(size)}
              className={`flex h-[48px] min-w-[48px] items-center justify-center rounded-xl border text-[14px] font-bold transition-all duration-200 ${
                selectedSize === size
                  ? "border-brand-pink bg-brand-pink text-white shadow-sm"
                  : "border-gray-200 bg-white text-brand-dark hover:border-brand-pink hover:text-brand-pink"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {isHowToMeasureOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="how-to-measure-title"
        >
          <button
            type="button"
            className="absolute inset-0 cursor-default bg-black/45"
            aria-label="Close"
            onClick={() => setIsHowToMeasureOpen(false)}
          />
          <div
            className="relative z-[101] max-h-[min(92vh,780px)] w-full max-w-[min(100%,28rem)] overflow-y-auto rounded-2xl bg-white p-4 shadow-2xl sm:max-w-3xl sm:p-6 md:p-7"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsHowToMeasureOpen(false)}
              className="absolute right-3 top-3 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-brand-pink transition hover:bg-brand-pink/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-pink sm:right-4 sm:top-4"
              aria-label="Close"
            >
              <span className="text-2xl font-light leading-none">&times;</span>
            </button>

            <h2
              id="how-to-measure-title"
              className="pr-10 text-center text-base font-bold uppercase tracking-[0.15em] text-brand-dark sm:text-lg md:text-xl"
            >
              How to measure
            </h2>

            <div className="mt-4 flex flex-col items-stretch gap-4 sm:mt-5 sm:flex-row sm:items-start sm:gap-5 md:gap-6">
              <div className="mx-auto flex w-full max-w-[165px] shrink-0 justify-center sm:mx-0 sm:w-[34%] sm:max-w-[200px] md:max-w-[220px]">
                <img
                  src="/how-to-measure-diagram.png"
                  alt="Diagram: across shoulder, bust, waist, hips, and sleeve length"
                  className="h-auto max-h-[260px] w-full object-contain object-top sm:max-h-[min(42vh,320px)] md:max-h-[340px]"
                />
              </div>
              <ul className="min-w-0 flex-1 space-y-2.5 text-[12px] leading-relaxed text-gray-600 sm:space-y-3 sm:pt-0.5 sm:text-[13px] md:text-[14px] md:leading-snug">
                {MEASUREMENT_STEPS.map(({ label, text }) => (
                  <li key={label}>
                    <span className="font-bold text-brand-pink">{label}</span>
                    <span className="text-gray-500"> — {text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
