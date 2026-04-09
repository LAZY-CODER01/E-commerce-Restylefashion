import React from "react";
import clsx from "clsx";

/**
 * Speech-bubble validation message. Default: floats below the field (absolute)
 * so showing/hiding does not shift other inputs or buttons.
 */
export default function ValidationTooltip({
  message,
  className = "",
  /** false = in-flow (legacy); true = overlay below field, no layout shift */
  floating = true,
}) {
  if (!message) return null;

  const bubble = (
    <div className="relative inline-flex max-w-full min-w-0 flex-col items-stretch">
      <div
        className="pointer-events-none absolute -top-[7px] left-5 z-[1] h-3 w-3 rotate-45 border-l border-t border-gray-200 bg-white"
        aria-hidden
      />
      <div className="relative inline-flex max-w-full min-w-0 items-start gap-2 rounded-lg border border-gray-200 bg-white px-2.5 py-2 shadow-[0_2px_10px_rgba(0,0,0,0.12)]">
        <span
          className="mt-0.5 flex h-[20px] w-[20px] shrink-0 items-center justify-center rounded-[3px] bg-[#f97316] text-[12px] font-bold leading-none text-white"
          aria-hidden
        >
          !
        </span>
        <span className="min-w-0 max-w-[min(100%,16rem)] text-[12px] leading-snug text-gray-900 break-words">
          {message}
        </span>
      </div>
    </div>
  );

  if (!floating) {
    return (
      <div
        className={clsx(
          "relative z-10 mt-2 w-max max-w-full min-w-0",
          className
        )}
        role="alert"
      >
        {bubble}
      </div>
    );
  }

  return (
    <div
      className={clsx(
        "pointer-events-auto absolute left-0 top-full z-[60] mt-1.5 w-max max-w-full min-w-0",
        className
      )}
      role="alert"
    >
      {bubble}
    </div>
  );
}
