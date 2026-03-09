"use client";

import type { ProductVariantGroup } from "@/types";

interface VariantSelectorsProps {
  groups: ProductVariantGroup[];
  selected: Record<string, string>;
  onSelect: (groupId: string, optionId: string) => void;
  disabled?: boolean;
}

export function VariantSelectors({
  groups,
  selected,
  onSelect,
  disabled,
}: VariantSelectorsProps) {
  return (
    <div className="space-y-4">
      {groups.map((group) => (
        <div key={group.id}>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            {group.label}
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {group.options.map((opt) => {
              const isSelected = selected[group.id] === opt.id;
              const outOfStock = opt.stock < 1;
              return (
                <button
                  key={opt.id}
                  type="button"
                  disabled={disabled || outOfStock}
                  onClick={() => onSelect(group.id, opt.id)}
                  className={`relative w-full px-3 py-2 rounded-xl border text-sm font-medium transition-all ${
                    outOfStock
                      ? "border-slate-200 bg-slate-50 text-slate-400 line-through cursor-not-allowed"
                      : isSelected
                        ? "border-violet-600 bg-violet-50 text-violet-800 shadow-sm"
                        : "border-slate-200 bg-white text-slate-700 hover:border-violet-400 hover:bg-violet-50/40"
                  }`}
                >
                  <span className="block truncate">{opt.name}</span>
                  {outOfStock && (
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-x-2 top-1/2 h-[2px] bg-red-500/70 rotate-[-16deg]"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
