"use client";

import { useMemo, useState } from "react";
import type { SheetProductGroup } from "@/lib/googleSheets";
import { formatPrice } from "@/lib/utils";

interface SheetProductVariantSelectorProps {
  group: SheetProductGroup;
}

export function SheetProductVariantSelector({
  group,
}: SheetProductVariantSelectorProps) {
  const [selectedAccountType, setSelectedAccountType] = useState<string | null>(
    null
  );
  const [selectedDuration, setSelectedDuration] = useState<string | null>(null);

  const allSelected = !!selectedAccountType && !!selectedDuration;

  const priceInfo = useMemo(() => {
    if (!group.variants.length) {
      return {
        label: "Sản phẩm này tạm hết hàng",
        isRange: false,
      };
    }

    if (!allSelected) {
      const prices = group.variants.map((v) => v.price);
      const min = Math.min(...prices);
      const max = Math.max(...prices);
      if (!Number.isFinite(min) || !Number.isFinite(max)) {
        return {
          label: "Liên hệ",
          isRange: false,
        };
      }
      return {
        label: `${formatPrice(min)} - ${formatPrice(max)}`,
        isRange: true,
      };
    }

    const matched = group.variants.find(
      (v) =>
        v.accountType === selectedAccountType &&
        v.duration === selectedDuration
    );

    if (!matched || !matched.isAvailable) {
      return {
        label: "Sản phẩm này tạm hết hàng",
        isRange: false,
      };
    }

    return {
      label: formatPrice(matched.price),
      isRange: false,
    };
  }, [group.variants, allSelected, selectedAccountType, selectedDuration]);

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm text-slate-500 mb-1">Giá</p>
        <p className="text-2xl font-bold text-emerald-600">
          {priceInfo.label}
        </p>
      </div>

      {/* Loại tài khoản (Cột C) */}
      {group.accountTypes.length > 0 && (
        <div>
          <p className="block text-sm font-medium text-slate-700 mb-2">
            Loại tài khoản
          </p>
          <div className="flex flex-wrap gap-2">
            {group.accountTypes.map((type) => {
              const isSelected = selectedAccountType === type;
              const hasAvailable = group.variants.some((v) => {
                if (!v.isAvailable) return false;
                if (v.accountType !== type) return false;
                if (selectedDuration && v.duration !== selectedDuration) return false;
                return true;
              });
              const disabled = !hasAvailable;
              return (
                <button
                  key={type}
                  type="button"
                  disabled={disabled}
                  onClick={() => {
                    if (disabled) return;
                    setSelectedAccountType(isSelected ? null : type);
                  }}
                  className={`relative px-3 py-2 rounded-full border text-sm font-medium transition-all ${
                    disabled
                      ? "border-slate-200 bg-slate-50 text-slate-400 opacity-50 cursor-not-allowed pointer-events-none"
                      : isSelected
                        ? "border-violet-600 bg-violet-50 text-violet-800 shadow-sm"
                        : "border-slate-200 bg-white text-slate-700 hover:border-violet-400 hover:bg-violet-50/40"
                  }`}
                >
                  <span className="block truncate">{type}</span>
                  {disabled && (
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
      )}

      {/* Thời hạn (Cột D) */}
      {group.durations.length > 0 && (
        <div>
          <p className="block text-sm font-medium text-slate-700 mb-2">
            Thời hạn
          </p>
          <div className="flex flex-wrap gap-2">
            {group.durations.map((duration) => {
              const isSelected = selectedDuration === duration;
              const hasAvailable = group.variants.some((v) => {
                if (!v.isAvailable) return false;
                if (v.duration !== duration) return false;
                if (selectedAccountType && v.accountType !== selectedAccountType) return false;
                return true;
              });
              const disabled = !hasAvailable;
              return (
                <button
                  key={duration}
                  type="button"
                  disabled={disabled}
                  onClick={() => {
                    if (disabled) return;
                    setSelectedDuration(isSelected ? null : duration);
                  }}
                  className={`relative px-3 py-2 rounded-full border text-sm font-medium transition-all ${
                    disabled
                      ? "border-slate-200 bg-slate-50 text-slate-400 opacity-50 cursor-not-allowed pointer-events-none"
                      : isSelected
                        ? "border-violet-600 bg-violet-50 text-violet-800 shadow-sm"
                        : "border-slate-200 bg-white text-slate-700 hover:border-violet-400 hover:bg-violet-50/40"
                  }`}
                >
                  <span className="block truncate">{duration}</span>
                  {disabled && (
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
      )}
    </div>
  );
}

