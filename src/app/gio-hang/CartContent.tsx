"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import type { CartItem } from "@/types";
import { getCart, updateQuantity, removeFromCart, getCartSubtotal } from "@/lib/cart";
import { formatPrice } from "@/lib/utils";
import { EmptyState } from "@/components/ui/EmptyState";

export function CartContent() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setItems(getCart());
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const handler = () => setItems(getCart());
    window.addEventListener("cart-update", handler);
    return () => window.removeEventListener("cart-update", handler);
  }, [mounted]);

  const handleQuantity = (item: CartItem, delta: number) => {
    const newQty = item.quantity + delta;
    if (newQty < 1) {
      removeFromCart(item.productId, item.variants);
    } else {
      updateQuantity(item.productId, item.variants, newQty);
    }
    setItems(getCart());
  };

  const handleRemove = (item: CartItem) => {
    removeFromCart(item.productId, item.variants);
    setItems(getCart());
  };

  if (!mounted) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-24 bg-slate-100 rounded" />
        <div className="h-24 bg-slate-100 rounded" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <EmptyState
        title="Giỏ hàng trống"
        description="Bạn chưa thêm sản phẩm nào. Hãy mua sắm và thêm vào giỏ."
        actionLabel="Mua sắm ngay"
        actionHref="/san-pham"
      />
    );
  }

  const subtotal = getCartSubtotal();

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-4">
        {items.map((item) => (
          <div
            key={`${item.productId}-${JSON.stringify(item.variants)}`}
            className="flex gap-4 p-4 rounded-xl border border-slate-200 bg-white"
          >
            <div className="relative w-24 h-24 shrink-0 rounded-lg overflow-hidden bg-slate-100">
              <Image
                src={item.productImage}
                alt={item.productName}
                fill
                className="object-cover"
                sizes="96px"
                unoptimized
              />
            </div>
            <div className="flex-1 min-w-0">
              <Link
                href={`/san-pham/${item.productSlug}`}
                className="font-medium text-slate-800 hover:text-emerald-600 line-clamp-2"
              >
                {item.productName}
              </Link>
              {item.variants.length > 0 && (
                <p className="text-sm text-slate-500 mt-1">
                  {item.variants.map((v) => v.optionName).join(" · ")}
                </p>
              )}
              <p className="text-emerald-600 font-semibold mt-1">{formatPrice(item.price)}</p>
            </div>
            <div className="flex flex-col items-end justify-between">
              <div className="flex items-center gap-1 border border-slate-300 rounded-lg overflow-hidden">
                <button
                  type="button"
                  onClick={() => handleQuantity(item, -1)}
                  className="w-8 h-8 flex items-center justify-center hover:bg-slate-100"
                >
                  −
                </button>
                <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                <button
                  type="button"
                  onClick={() => handleQuantity(item, 1)}
                  className="w-8 h-8 flex items-center justify-center hover:bg-slate-100"
                >
                  +
                </button>
              </div>
              <button
                type="button"
                onClick={() => handleRemove(item)}
                className="text-sm text-red-600 hover:underline mt-2"
              >
                Xóa
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="lg:col-span-1">
        <div className="sticky top-24 p-6 rounded-xl border border-slate-200 bg-slate-50">
          <h3 className="font-semibold text-slate-800 mb-4">Tóm tắt</h3>
          <p className="flex justify-between text-slate-600 mb-2">
            <span>Tạm tính ({items.reduce((s, i) => s + i.quantity, 0)} sản phẩm)</span>
            <span className="font-semibold text-slate-800">{formatPrice(subtotal)}</span>
          </p>
          <p className="text-sm text-slate-500 mb-4">
            Thanh toán và giao hàng được xử lý qua liên hệ với admin (Zalo / chuyển khoản).
          </p>
          <Link
            href="/gui-yeu-cau"
            className="block w-full text-center py-3 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition"
          >
            Gửi yêu cầu
          </Link>
        </div>
      </div>
    </div>
  );
}
