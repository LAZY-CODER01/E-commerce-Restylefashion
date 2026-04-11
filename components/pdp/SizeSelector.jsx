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

/** Inches — same reference as seller listing (tops); fit may vary by brand and fabric. */
const SIZE_CHART_ROWS = [
  { size: "XS", chest: "32-34", waist: "26-28", hips: "32-34", length: "25-26", shoulder: "15-16" },
  { size: "S", chest: "35-37", waist: "28-30", hips: "35-37", length: "26-27", shoulder: "16-17" },
  { size: "M", chest: "38-40", waist: "31-33", hips: "38-40", length: "27-28", shoulder: "17-18" },
  { size: "L", chest: "41-43", waist: "34-36", hips: "41-43", length: "28-29", shoulder: "18-19" },
  { size: "XL", chest: "44-46", waist: "37-39", hips: "44-46", length: "29-30", shoulder: "19-20" },
];

export default function SizeSelector({ sizes = [], selectedSize, onSizeSelect }) {
  const [isHowToMeasureOpen, setIsHowToMeasureOpen] = useState(false);
  const [isSizeChartOpen, setIsSizeChartOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            <h4 className="text-[14px] font-bold uppercase tracking-tight text-brand-dark">Select Size</h4>
            {/* <button
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
            </button> */}
          </div>
          <button
            type="button"
            onClick={() => setIsSizeChartOpen(true)}
            className="shrink-0 cursor-pointer text-[12px] font-bold uppercase tracking-wide text-brand-pink hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-pink"
            aria-label="Open size chart"
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

      {isSizeChartOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="pdp-size-chart-title"
        >
          <div className="absolute inset-0 cursor-default bg-black/45" aria-hidden />
          <div
            className="relative z-[101] max-h-[min(90vh,720px)] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsSizeChartOpen(false)}
              className="absolute right-4 top-4 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-brand-pink transition hover:bg-brand-pink/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-pink"
              aria-label="Close"
            >
              <span className="text-2xl font-light leading-none">&times;</span>
            </button>

            <h2
              id="pdp-size-chart-title"
              className="pr-10 text-center text-lg font-bold tracking-tight text-brand-dark sm:text-xl"
            >
              SIZE CHART (in inches)
            </h2>
            <p className="mt-2 text-center text-[13px] leading-relaxed text-gray-500">
              Refer to the sizing chart to help you find your best fit. Garment sizes may vary based
              on brand, fabric and design.
            </p>

            <div className="mt-6 overflow-x-auto rounded-xl border border-gray-100">
              <table className="w-full min-w-[520px] border-collapse text-left text-[12px] sm:text-[13px]">
                <thead>
                  <tr className="bg-brand-pink text-white">
                    <th className="px-3 py-2.5 font-bold sm:px-4">Size</th>
                    <th className="px-3 py-2.5 font-bold sm:px-4">Chest</th>
                    <th className="px-3 py-2.5 font-bold sm:px-4">Waist</th>
                    <th className="px-3 py-2.5 font-bold sm:px-4">Hips</th>
                    <th className="px-3 py-2.5 font-bold sm:px-4">Length (Top)</th>
                    <th className="px-3 py-2.5 font-bold sm:px-4">Shoulder</th>
                  </tr>
                </thead>
                <tbody>
                  {SIZE_CHART_ROWS.map((row, i) => (
                    <tr
                      key={row.size}
                      className={i % 2 === 0 ? "bg-brand-pink/[0.06]" : "bg-white"}
                    >
                      <td className="px-3 py-2 font-bold text-brand-pink sm:px-4">{row.size}</td>
                      <td className="px-3 py-2 text-brand-dark sm:px-4">{row.chest}</td>
                      <td className="px-3 py-2 text-brand-dark sm:px-4">{row.waist}</td>
                      <td className="px-3 py-2 text-brand-dark sm:px-4">{row.hips}</td>
                      <td className="px-3 py-2 text-brand-dark sm:px-4">{row.length}</td>
                      <td className="px-3 py-2 text-brand-dark sm:px-4">{row.shoulder}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-8">
              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-brand-pink/40" />
                <h3 className="text-center text-[13px] font-bold uppercase tracking-[0.2em] text-brand-dark sm:text-[15px]">
                  How to measure
                </h3>
                <div className="h-px flex-1 bg-brand-pink/40" />
              </div>

              <div className="mt-6 flex flex-col items-stretch gap-4 sm:flex-row sm:items-start sm:gap-5 md:gap-6">
                <div className="mx-auto flex w-full max-w-[165px] shrink-0 justify-center sm:mx-0 sm:w-[34%] sm:max-w-[200px] md:max-w-[220px]">
                  <img
                    src="/skelton.png"
                    alt="Diagram showing across shoulder, bust, waist, hips, and sleeve length"
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
        </div>
      )}

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
                  src="/skelton.png"
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
