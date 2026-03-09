import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/types";
import { formatPrice } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  showCategory?: boolean;
}

export function ProductCard({ product, showCategory = true }: ProductCardProps) {
  const discount =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0;
  const imageSrc = product.images[0] || "/images/placeholder-product.svg";

  return (
    <article className="group relative bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg hover:border-emerald-200 transition-all duration-300 flex flex-col h-full">
      {/* Shine effect - diagonal light sweep on hover */}
      <div
        className="absolute inset-0 z-10 pointer-events-none rounded-xl overflow-hidden"
        aria-hidden
      >
        <div
          className="absolute top-0 left-0 h-full w-1/2 -translate-x-full skew-x-[-25deg] bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-500 ease-out group-hover:translate-x-[300%]"
        />
      </div>
      <Link href={`/san-pham/${product.slug}`} className="block relative aspect-square bg-slate-100">
        <Image
          src={imageSrc}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition duration-300"
          sizes="(max-width: 768px) 50vw, 25vw"
          unoptimized
        />
        {discount > 0 && (
          <span className="absolute top-2 left-2 rounded bg-red-500 text-white text-xs font-bold px-2 py-0.5">
            -{discount}%
          </span>
        )}
        {!product.inStock && (
          <span className="absolute inset-0 bg-slate-900/50 flex items-center justify-center">
            <span className="bg-slate-800 text-white px-3 py-1 rounded text-sm font-medium">
              Hết hàng
            </span>
          </span>
        )}
      </Link>
      <div className="p-4 flex-1 flex flex-col">
        {showCategory && (
          <span className="text-xs text-slate-500 mb-1 line-clamp-1">Danh mục</span>
        )}
        <h3 className="font-semibold text-slate-800 line-clamp-2 mb-2 group-hover:text-emerald-600 transition">
          <Link href={`/san-pham/${product.slug}`}>{product.name}</Link>
        </h3>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg font-bold text-emerald-600">{formatPrice(product.price)}</span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-sm text-slate-400 line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>
        <div className="flex items-center justify-between text-sm text-slate-500 mt-auto">
          <span>Đã bán: {product.soldCount}</span>
          {product.rating != null && (
            <span className="flex items-center gap-0.5">
              ⭐ {product.rating}
            </span>
          )}
        </div>
        <div className="mt-3 flex gap-2">
          <Link
            href={`/san-pham/${product.slug}`}
            className="flex-1 text-center py-2 rounded-lg border border-slate-300 text-sm font-medium hover:bg-slate-50 transition"
          >
            Xem chi tiết
          </Link>
          {product.variantGroups && product.variantGroups.length > 0 ? (
            <Link
              href={`/san-pham/${product.slug}`}
              className="flex-1 text-center py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition"
            >
              Chọn tùy chọn
            </Link>
          ) : (
            <Link
              href={`/san-pham/${product.slug}`}
              className="flex-1 text-center py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition"
            >
              Xem chi tiết
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
