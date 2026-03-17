import React from "react";

export default function ConditionTag({ condition }) {
  const getStyles = () => {
    switch (condition?.toLowerCase()) {
      case "like new":
        return "bg-brand-pink/10 text-brand-pink border-brand-pink/20";
      case "gently used":
        return "bg-brand-purple/10 text-brand-purple border-brand-purple/20";
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
