"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { getCart, getCartSubtotal } from "@/lib/cart";
import { siteSettings } from "@/data/siteSettings";
import { formatPrice } from "@/lib/utils";
import { EmptyState } from "@/components/ui/EmptyState";
import type { CartItem } from "@/types";

function buildRequestMessage(form: {
  fullName: string;
  phone: string;
  zalo: string;
  email: string;
  note: string;
}, items: CartItem[]): string {
  const lines: string[] = [
    "=== YÊU CẦU MUA HÀNG ===",
    "",
    "Thông tin khách hàng:",
    `- Họ tên: ${form.fullName}`,
    `- Số điện thoại: ${form.phone}`,
    `- Zalo: ${form.zalo}`,
    `- Email: ${form.email}`,
    form.note ? `- Ghi chú: ${form.note}` : "",
    "",
    "Danh sách sản phẩm:",
    ...items.map((i) => {
      const variantStr = i.variants.length > 0
        ? ` (${i.variants.map((v) => v.optionName).join(", ")})`
        : "";
      return `- ${i.productName}${variantStr} x ${i.quantity} = ${formatPrice(i.price * i.quantity)}`;
    }),
    "",
    `Tổng cộng: ${formatPrice(getCartSubtotal())}`,
    "",
    "---",
    `Gửi từ ${siteSettings.siteName}`,
  ];
  return lines.filter(Boolean).join("\n");
}

export function RequestForm() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    zalo: "",
    email: "",
    note: "",
  });

  useEffect(() => {
    setItems(getCart());
    setMounted(true);
  }, []);

  const subtotal = getCartSubtotal();
  const message = buildRequestMessage(form, items);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message);
    alert("Đã sao chép nội dung yêu cầu vào clipboard.");
  };

  const zaloUrl = (() => {
    const num = siteSettings.zalo.replace(/\D/g, "");
    const text = encodeURIComponent(message);
    return `https://zalo.me/${num}?text=${text}`;
  })();

  const mailtoUrl = `mailto:${siteSettings.email}?subject=${encodeURIComponent(`Yêu cầu mua hàng - ${siteSettings.siteName}`)}&body=${encodeURIComponent(message)}`;

  if (!mounted) {
    return <div className="animate-pulse h-64 bg-slate-100 rounded" />;
  }

  if (items.length === 0) {
    return (
      <EmptyState
        title="Chưa có sản phẩm trong giỏ"
        description="Thêm sản phẩm vào giỏ hàng rồi quay lại trang này để gửi yêu cầu."
        actionLabel="Xem sản phẩm"
        actionHref="/san-pham"
      />
    );
  }

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <div>
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Thông tin liên hệ</h2>
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-slate-700 mb-1">
              Họ và tên *
            </label>
            <input
              id="fullName"
              type="text"
              required
              value={form.fullName}
              onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Nguyễn Văn A"
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1">
              Số điện thoại *
            </label>
            <input
              id="phone"
              type="tel"
              required
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="0901234567"
            />
          </div>
          <div>
            <label htmlFor="zalo" className="block text-sm font-medium text-slate-700 mb-1">
              Zalo
            </label>
            <input
              id="zalo"
              type="text"
              value={form.zalo}
              onChange={(e) => setForm((f) => ({ ...f, zalo: e.target.value }))}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Số Zalo hoặc tên Zalo"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="email@example.com"
            />
          </div>
          <div>
            <label htmlFor="note" className="block text-sm font-medium text-slate-700 mb-1">
              Ghi chú
            </label>
            <textarea
              id="note"
              rows={3}
              value={form.note}
              onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Yêu cầu thêm về giao hàng, thời hạn..."
            />
          </div>
        </form>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Giỏ hàng của bạn</h2>
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3 mb-6">
          {items.map((item) => (
            <div
              key={`${item.productId}-${JSON.stringify(item.variants)}`}
              className="flex gap-3 text-sm"
            >
              <div className="relative w-14 h-14 shrink-0 rounded overflow-hidden bg-white">
                <Image
                  src={item.productImage}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="56px"
                  unoptimized
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-slate-800 line-clamp-2">{item.productName}</p>
                {item.variants.length > 0 && (
                  <p className="text-slate-500 text-xs">
                    {item.variants.map((v) => v.optionName).join(", ")}
                  </p>
                )}
                <p className="text-slate-600">
                  {item.quantity} x {formatPrice(item.price)} = {formatPrice(item.price * item.quantity)}
                </p>
              </div>
            </div>
          ))}
          <p className="pt-2 border-t border-slate-200 font-semibold text-slate-800 flex justify-between">
            <span>Tổng cộng</span>
            <span>{formatPrice(subtotal)}</span>
          </p>
        </div>

        <h3 className="text-lg font-semibold text-slate-800 mb-3">Gửi yêu cầu</h3>
        <p className="text-sm text-slate-600 mb-4">
          Điền thông tin bên trái, sau đó chọn một trong các cách sau để gửi cho admin.
        </p>
        <div className="space-y-3">
          <a
            href={zaloUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition"
          >
            Gửi qua Zalo admin
          </a>
          <button
            type="button"
            onClick={handleCopy}
            className="w-full py-3 rounded-lg border-2 border-slate-300 font-medium hover:bg-slate-50 transition"
          >
            Sao chép nội dung yêu cầu
          </button>
          <a
            href={mailtoUrl}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-lg border-2 border-slate-300 font-medium hover:bg-slate-50 transition"
          >
            Gửi email cho admin
          </a>
        </div>

        <div className="mt-6 p-4 rounded-lg bg-slate-100 text-sm text-slate-600">
          <p className="font-medium text-slate-800 mb-1">Nội dung sẽ gửi (xem trước):</p>
          <pre className="whitespace-pre-wrap font-sans text-xs max-h-48 overflow-y-auto">
            {message}
          </pre>
        </div>
      </div>
    </div>
  );
}
