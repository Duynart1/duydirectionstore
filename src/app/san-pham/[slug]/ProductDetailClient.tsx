"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import type { Product } from "@/types";
import type { CartItemVariant } from "@/types";
import { ProductGallery } from "@/components/product/ProductGallery";
import { VariantSelectors } from "@/components/product/VariantSelectors";
import { RelatedProducts } from "@/components/product/RelatedProducts";
import { PurchaseNotes } from "@/components/product/PurchaseNotes";
import { Button } from "@/components/ui/Button";
import { formatPrice, cn } from "@/lib/utils";
import { addToCart } from "@/lib/cart";

interface ProductDetailClientProps {
  product: Product;
  categoryName: string;
  relatedProducts: Product[];
}

export function ProductDetailClient({
  product,
  categoryName,
  relatedProducts,
}: ProductDetailClientProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});

  const currentPrice = useMemo(() => {
    if (!product.variantGroups?.length) return product.price;
    let price = product.price;
    for (const g of product.variantGroups) {
      const optId = selectedVariants[g.id];
      if (!optId) return null;
      const opt = g.options.find((o) => o.id === optId);
      if (!opt) return null;
      price += opt.priceModifier;
    }
    return price;
  }, [product.price, product.variantGroups, selectedVariants]);

  const variantPriceRange = useMemo(() => {
    if (!product.variantGroups?.length) return null;
    const group = product.variantGroups[0];
    if (!group.options.length) return null;
    const prices = group.options.map((opt) => product.price + opt.priceModifier);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    return { min, max };
  }, [product.price, product.variantGroups]);

  const variantOptionsForCart = useMemo((): CartItemVariant[] => {
    if (!product.variantGroups) return [];
    return product.variantGroups
      .map((g) => {
        const optId = selectedVariants[g.id];
        const opt = g.options.find((o) => o.id === optId);
        if (!opt) return null;
        return {
          groupId: g.id,
          groupLabel: g.label,
          optionId: opt.id,
          optionName: opt.name,
          priceModifier: opt.priceModifier,
        };
      })
      .filter(Boolean) as CartItemVariant[];
  }, [product.variantGroups, selectedVariants]);

  const hasVariantGroups = !!product.variantGroups?.length;
  const allVariantsSelected =
    !hasVariantGroups || product.variantGroups!.every((g) => selectedVariants[g.id]);

  const canAddToCart = product.inStock && (!hasVariantGroups || allVariantsSelected);

  const handleClearSelection = () => {
    setSelectedVariants({});
  };

  const handleAddToCart = () => {
    if (!canAddToCart) return;
    addToCart({
      productId: product.id,
      productSlug: product.slug,
      productName: product.name,
      productImage: product.images[0] || "/images/placeholder-product.svg",
      price: (currentPrice ?? product.price),
      quantity,
      variants: variantOptionsForCart,
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
        <ProductGallery images={product.images} productName={product.name} />

        <div>
          <p className="text-sm text-slate-500 mb-1">{categoryName}</p>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-4">{product.name}</h1>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl font-bold text-emerald-600">
              {currentPrice != null
                ? formatPrice(currentPrice)
                : variantPriceRange
                  ? `${formatPrice(variantPriceRange.min)} – ${formatPrice(
                      variantPriceRange.max
                    )}`
                  : formatPrice(product.price)}
            </span>
          </div>
          <p className="text-slate-600 mb-4">{product.shortDescription}</p>

          {product.variantGroups && product.variantGroups.length > 0 && (
            <div className="mb-6">
              {product.purchaseNotes && (
                <PurchaseNotes notes={product.purchaseNotes} />
              )}
              {allVariantsSelected && currentPrice != null && (
                <div className="flex items-center justify-between mt-1 mb-3 text-sm">
                  <span className="text-slate-700">
                    Gói đăng ký:{" "}
                    <span className="font-semibold text-slate-900">
                      {/* hiển thị tên option đầu tiên được chọn (giả sử 1 group) */}
                      {(() => {
                        const g = product.variantGroups![0];
                        const optId = selectedVariants[g.id];
                        const opt = g.options.find((o) => o.id === optId);
                        return opt ? `${opt.name} (${formatPrice(currentPrice)})` : "";
                      })()}
                    </span>
                  </span>
                  <button
                    type="button"
                    className="text-xs font-semibold text-red-600 hover:text-red-700"
                    onClick={handleClearSelection}
                  >
                    XÓA
                  </button>
                </div>
              )}
              <VariantSelectors
                groups={product.variantGroups}
                selected={selectedVariants}
                onSelect={(groupId, optionId) =>
                  setSelectedVariants((prev) => ({ ...prev, [groupId]: optionId }))
                }
                disabled={!product.inStock}
                basePrice={product.price}
              />
            </div>
          )}

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
              variant={canAddToCart ? "primary" : "outline"}
              onClick={handleAddToCart}
              disabled={!canAddToCart}
              className={cn(
                "min-w-[180px]",
                !canAddToCart &&
                  "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed hover:bg-slate-100 hover:text-slate-400"
              )}
            >
              Thêm vào giỏ
            </Button>
            <Link href="/gui-yeu-cau">
              <Button variant="outline">Gửi yêu cầu</Button>
            </Link>
          </div>

          <div className="flex gap-4 text-sm text-slate-500">
            <span>Đã bán: {product.soldCount}</span>
            {product.rating != null && <span>⭐ {product.rating}</span>}
            {product.inStock ? (
              <span className="text-emerald-600 font-medium">Còn hàng</span>
            ) : (
              <span className="text-red-600 font-medium">Hết hàng</span>
            )}
          </div>
        </div>
      </div>

      {product.description && (
        <div className="mb-12">
          <h2 className="text-xl font-bold text-slate-800 mb-4">Mô tả sản phẩm</h2>
          <div
            className="prose prose-slate max-w-none"
            dangerouslySetInnerHTML={{ __html: product.description }}
          />
        </div>
      )}

      <RelatedProducts products={relatedProducts} />
    </>
  );
}
