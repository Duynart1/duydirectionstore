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

    if (!matched) {
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
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() =>
                    setSelectedAccountType(
                      isSelected ? null : type
                    )
                  }
                  className={`px-3 py-2 rounded-full border text-sm font-medium transition-all ${
                    isSelected
                      ? "border-violet-600 bg-violet-50 text-violet-800 shadow-sm"
                      : "border-slate-200 bg-white text-slate-700 hover:border-violet-400 hover:bg-violet-50/40"
                  }`}
                >
                  {type}
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
              return (
                <button
                  key={duration}
                  type="button"
                  onClick={() =>
                    setSelectedDuration(
                      isSelected ? null : duration
                    )
                  }
                  className={`px-3 py-2 rounded-full border text-sm font-medium transition-all ${
                    isSelected
                      ? "border-violet-600 bg-violet-50 text-violet-800 shadow-sm"
                      : "border-slate-200 bg-white text-slate-700 hover:border-violet-400 hover:bg-violet-50/40"
                  }`}
                >
                  {duration}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

