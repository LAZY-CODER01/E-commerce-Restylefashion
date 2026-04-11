import React from "react";

export default function ConditionTag({ condition }) {
  const getStyles = () => {
    const c = condition?.toLowerCase();
    switch (c) {
      case "new":
      case "brand new":
      case "like new":
      case "new without tags":
        return "bg-brand-pink/10 text-brand-pink border-brand-pink/20";
      case "used - very good":
      case "used-very good":
      case "excellent":
      case "gently used":
        return "bg-brand-purple/10 text-brand-purple border-brand-purple/20";
      case "used - good":
      case "used-good":
      case "good":
        return "bg-amber-50 text-amber-900 border-amber-100";
      case "used":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "vintage":
        return "bg-orange-50 text-brand-accent2 border-orange-100";
      default:
        return "bg-brand-light text-brand-dark border-gray-200";
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <h4 className="text-[14px] font-bold text-brand-dark uppercase tracking-tight">Condition</h4>
      <div className={`inline-flex self-start rounded-full border px-4 py-1.5 text-[12px] font-bold uppercase tracking-wider ${getStyles()}`}>
        {condition}
      </div>
    </div>
  );
}
