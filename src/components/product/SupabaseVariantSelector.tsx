"use client";

import { useMemo, useState } from "react";
import { formatPrice } from "@/lib/utils";

export type SupabaseProductVariant = {
  id: string;
  account_type: string;
  duration: string;
  price: number;
  original_price: number | null;
  is_available: boolean;
};

export type SupabaseVariantSelection = {
  accountType: string | null;
  duration: string | null;
};

export function SupabaseVariantSelector({
  variants,
  onChange,
}: {
  variants: SupabaseProductVariant[];
  onChange?: (args: {
    selection: SupabaseVariantSelection;
    matchedVariant: SupabaseProductVariant | null;
    canPurchase: boolean;
    priceLabel: string;
    originalPriceLabel: string | null;
    discount: number;
  }) => void;
}) {
  const [accountType, setAccountType] = useState<string | null>(null);
  const [duration, setDuration] = useState<string | null>(null);

  const accountTypes = useMemo(() => {
    const s = new Set<string>();
    for (const v of variants) if (v.account_type) s.add(v.account_type);
    return Array.from(s);
  }, [variants]);

  const durations = useMemo(() => {
    const s = new Set<string>();
    for (const v of variants) if (v.duration) s.add(v.duration);
    return Array.from(s);
  }, [variants]);

  const matchedVariant = useMemo(() => {
    if (!accountType || !duration) return null;
    return (
      variants.find((v) => v.account_type === accountType && v.duration === duration) ?? null
    );
  }, [variants, accountType, duration]);

  const priceLabel = useMemo(() => {
    if (!variants.length) return "Sản phẩm này tạm hết hàng";

    if (!accountType || !duration) {
      const prices = variants.map((v) => v.price).filter((p) => Number.isFinite(p));
      if (!prices.length) return "Liên hệ";
      const min = Math.min(...prices);
      const max = Math.max(...prices);
      return min === max ? formatPrice(min) : `${formatPrice(min)} - ${formatPrice(max)}`;
    }

    if (!matchedVariant || !matchedVariant.is_available) {
      return "Sản phẩm này tạm hết hàng";
    }

    return formatPrice(matchedVariant.price);
  }, [variants, accountType, duration, matchedVariant]);

  const originalPriceLabel = useMemo(() => {
    if (!matchedVariant || !matchedVariant.original_price) return null;
    return formatPrice(matchedVariant.original_price);
  }, [matchedVariant]);

  const discount = useMemo(() => {
    if (!matchedVariant || !matchedVariant.original_price) return 0;
    const op = matchedVariant.original_price;
    const p = matchedVariant.price;
    return op > p ? Math.round(((op - p) / op) * 100) : 0;
  }, [matchedVariant]);

  const canPurchase = !!accountType && !!duration && !!matchedVariant && matchedVariant.is_available;

  useMemo(() => {
    onChange?.({
      selection: { accountType, duration },
      matchedVariant,
      canPurchase,
      priceLabel,
      originalPriceLabel,
      discount,
    });
    return null;
  }, [
    onChange,
    accountType,
    duration,
    matchedVariant,
    canPurchase,
    priceLabel,
    originalPriceLabel,
    discount,
  ]);

  const isOptionAvailable = (nextAccountType: string | null, nextDuration: string | null) => {
    // If both selected, check exact match and is_available
    if (nextAccountType && nextDuration) {
      const row = variants.find(
        (v) => v.account_type === nextAccountType && v.duration === nextDuration
      );
      return !!row && row.is_available;
    }

    // Partial selection: option is available if there exists at least 1 available row
    return variants.some((v) => {
      if (!v.is_available) return false;
      if (nextAccountType && v.account_type !== nextAccountType) return false;
      if (nextDuration && v.duration !== nextDuration) return false;
      return true;
    });
  };

  return (
    <div className="space-y-4">
      {accountTypes.length > 0 && (
        <div>
          <p className="block text-sm font-medium text-slate-700 mb-2">Loại tài khoản</p>
          <div className="flex flex-wrap gap-2">
            {accountTypes.map((t) => {
              const selected = accountType === t;
              const disabled = !isOptionAvailable(t, duration);
              return (
                <button
                  key={t}
                  type="button"
                  disabled={disabled}
                  onClick={() => {
                    if (disabled) return;
                    setAccountType((prev) => (prev === t ? null : t));
                  }}
                  className={`relative px-3 py-2 rounded-full border text-sm font-medium transition-all ${
                    disabled
                      ? "border-slate-200 bg-slate-50 text-slate-400 opacity-50 cursor-not-allowed pointer-events-none"
                      : selected
                        ? "border-violet-600 bg-violet-50 text-violet-800 shadow-sm"
                        : "border-slate-200 bg-white text-slate-700 hover:border-violet-400 hover:bg-violet-50/40"
                  }`}
                >
                  <span className="block truncate">{t}</span>
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

      {durations.length > 0 && (
        <div>
          <p className="block text-sm font-medium text-slate-700 mb-2">Thời hạn</p>
          <div className="flex flex-wrap gap-2">
            {durations.map((d) => {
              const selected = duration === d;
              const disabled = !isOptionAvailable(accountType, d);
              return (
                <button
                  key={d}
                  type="button"
                  disabled={disabled}
                  onClick={() => {
                    if (disabled) return;
                    setDuration((prev) => (prev === d ? null : d));
                  }}
                  className={`relative px-3 py-2 rounded-full border text-sm font-medium transition-all ${
                    disabled
                      ? "border-slate-200 bg-slate-50 text-slate-400 opacity-50 cursor-not-allowed pointer-events-none"
                      : selected
                        ? "border-violet-600 bg-violet-50 text-violet-800 shadow-sm"
                        : "border-slate-200 bg-white text-slate-700 hover:border-violet-400 hover:bg-violet-50/40"
                  }`}
                >
                  <span className="block truncate">{d}</span>
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

