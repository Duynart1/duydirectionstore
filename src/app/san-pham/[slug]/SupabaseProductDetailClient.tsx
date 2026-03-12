"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ProductGallery } from "@/components/product/ProductGallery";
import { Button } from "@/components/ui/Button";
import { addToCart } from "@/lib/cart";
import { cn, formatPrice } from "@/lib/utils";
import {
  SupabaseVariantSelector,
  type SupabaseProductVariant,
} from "@/components/product/SupabaseVariantSelector";
import type { CartItemVariant } from "@/types";
import { PurchaseNotes } from "@/components/product/PurchaseNotes";

type SupabaseProduct = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  product_variants: SupabaseProductVariant[];
};

export function SupabaseProductDetailClient({ product }: { product: SupabaseProduct }) {
  const [quantity, setQuantity] = useState(1);

  const [selectedVariant, setSelectedVariant] = useState<SupabaseProductVariant | null>(null);
  const [canPurchase, setCanPurchase] = useState(false);
  const [priceLabel, setPriceLabel] = useState<string>("");
  const [originalPriceLabel, setOriginalPriceLabel] = useState<string | null>(null);
  const [discount, setDiscount] = useState<number>(0);

  const images = useMemo(() => {
    return [product.image_url || "/images/placeholder-product.svg"];
  }, [product.image_url]);

  const handleAddToCart = () => {
    if (!canPurchase || !selectedVariant) return;

    const variantsForCart: CartItemVariant[] = [
      {
        groupId: "account_type",
        groupLabel: "Loại tài khoản",
        optionId: selectedVariant.account_type,
        optionName: selectedVariant.account_type,
        priceModifier: 0,
      },
      {
        groupId: "duration",
        groupLabel: "Thời hạn",
        optionId: selectedVariant.duration,
        optionName: selectedVariant.duration,
        priceModifier: 0,
      },
    ];

    addToCart({
      productId: product.id,
      productSlug: product.slug,
      productName: product.name,
      productImage: images[0],
      price: selectedVariant.price,
      quantity,
      variants: variantsForCart,
    });

    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("cart-update"));
      const go = window.confirm("Đã thêm vào giỏ. Bạn có muốn đến trang giỏ hàng?");
      if (go) window.location.href = "/gio-hang";
    }
  };

  return (
    <>
      <div className="grid md:grid-cols-[2fr_3fr] gap-8 mb-12">
        <ProductGallery images={images} productName={product.name} />

        <div>
          <p className="text-sm text-slate-500 mb-1">Sản phẩm</p>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-4">{product.name}</h1>

          {/* Giá + Khuyến mãi */}
          <div className="mb-4">
            {selectedVariant ? (
              <div className="flex items-baseline gap-2">
                {originalPriceLabel && discount > 0 && (
                  <span className="text-sm text-slate-400 line-through">
                    {originalPriceLabel}
                  </span>
                )}
                <span className="text-2xl font-bold text-emerald-600">{priceLabel}</span>
                {discount > 0 && (
                  <span className="inline-flex items-center rounded-full bg-red-500 text-white text-xs font-bold px-2 py-0.5">
                    -{discount}%
                  </span>
                )}
              </div>
            ) : (
              <span className="text-2xl font-bold text-emerald-600">
                {priceLabel}
              </span>
            )}
          </div>

          {/* Khung cam kết & hỗ trợ nhanh */}
          <div className="mt-4 mb-6">
            <PurchaseNotes
              notes={{
                title: "Cam kết chính hãng - hỗ trợ nhanh 24/7:",
                lines: [
                  "Tài khoản được bảo hành trong suốt thời gian sử dụng.",
                  "Hỗ trợ kích hoạt, hướng dẫn sử dụng chi tiết qua Zalo/Facebook.",
                  "Hoàn tiền 100% nếu không kích hoạt được dịch vụ theo mô tả.",
                ],
                highlightKeywords: ["bảo hành", "hỗ trợ", "Hoàn tiền 100%"],
              }}
            />
          </div>

          {/* Chọn biến thể */}
          <div className="mb-4">
            <SupabaseVariantSelector
              variants={product.product_variants ?? []}
              onChange={({
                matchedVariant,
                canPurchase,
                priceLabel,
                originalPriceLabel,
                discount,
              }) => {
                setSelectedVariant(matchedVariant);
                setCanPurchase(canPurchase);
                setPriceLabel(priceLabel);
                setOriginalPriceLabel(originalPriceLabel);
                setDiscount(discount);
              }}
            />
          </div>

          {/* Số lượng + nút mua */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-10 h-10 flex items-center justify-center bg-slate-100 hover:bg-slate-200"
              >
                −
              </button>
              <span className="w-12 text-center font-medium">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="w-10 h-10 flex items-center justify-center bg-slate-100 hover:bg-slate-200"
              >
                +
              </button>
            </div>

            <Button
              variant={canPurchase ? "primary" : "outline"}
              onClick={handleAddToCart}
              disabled={!canPurchase}
              className={cn(
                "min-w-[180px]",
                !canPurchase &&
                  "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed hover:bg-slate-100 hover:text-slate-400"
              )}
            >
              Thêm vào giỏ
            </Button>

            <Link href="/gui-yeu-cau">
              <Button variant="outline">Gửi yêu cầu</Button>
            </Link>
          </div>
        </div>
      </div>

      {/* THÔNG TIN SẢN PHẨM */}
      {product.description && (
        <section className="mt-10 rounded-xl bg-slate-50 p-6 md:p-8">
          <h2 className="text-xl font-bold tracking-wide uppercase mb-6 text-slate-900">
            THÔNG TIN SẢN PHẨM
          </h2>
          <div className="whitespace-pre-wrap text-slate-700 leading-relaxed">
            {product.description}
          </div>
        </section>
      )}
    </>
  );
}

