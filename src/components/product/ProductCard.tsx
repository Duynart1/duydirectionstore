"use client";
import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";

export type SupabaseProductCardVariant = {
  price: number;
  original_price: number | null;
};

export type SupabaseProductCardData = {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
  created_at?: string;
  product_variants?: SupabaseProductCardVariant[];
  variantGroups?: any[];
};

interface ProductCardProps {
  product: SupabaseProductCardData;
}

export function ProductCard({ product }: ProductCardProps) {
  // LOGIC DỮ LIỆU BẢO TOÀN 100%
  const variants = product.product_variants ?? [];
  const prices = variants.map((v) => v.price).filter((p) => Number.isFinite(p));
  let minPrice = 0;
  let minOriginalPrice: number | null = null;
  if (prices.length) {
    minPrice = Math.min(...prices);
    const minVariant = variants.find((v) => v.price === minPrice) ?? null;
    minOriginalPrice = minVariant?.original_price ?? null;
  }
  const discount =
    minOriginalPrice && minOriginalPrice > minPrice
      ? Math.round(((minOriginalPrice - minPrice) / minOriginalPrice) * 100)
      : 0;
  const imageSrc = product.image_url || "/images/placeholder-product.svg";

  return (
    <Link
      href={`/san-pham/${product.slug}`}
      // Khung đứng im vững chãi, chỉ hiện viền và đổ bóng khi hover
      className="group relative bg-white rounded-xl border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-xl hover:border-gray-300 overflow-hidden flex flex-col h-full block"
    >
      {/* 1. HIỆU ỨNG ÁNH SÁNG QUÉT CHÉO (Dùng class chuẩn 100% của Tailwind để chống lỗi) */}
      <div className="absolute inset-0 z-40 pointer-events-none overflow-hidden rounded-xl">
        <div className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/70 to-transparent -skew-x-12 scale-x-150 group-hover:left-full transition-all duration-700 ease-in-out"></div>
      </div>

      {/* 2. ĐƯỜNG KẺ ĐEN CHẠY DƯỚI CHÂN (Chắc chắn hoạt động với z-50) */}
      <div className="absolute bottom-0 left-0 h-[3px] bg-black w-0 z-50 transition-all duration-500 ease-out group-hover:w-full"></div>

      {/* PHẦN ẢNH SẢN PHẨM */}
      <div className="relative aspect-square bg-slate-50 p-3 overflow-hidden">
        <div className="relative w-full h-full rounded-lg overflow-hidden border border-gray-100">
          <Image
            src={imageSrc}
            alt={product.name}
            fill
            // ĐÃ XÓA TÍNH NĂNG ZOOM (Không còn class group-hover:scale... nào ở đây nữa)
            className="object-cover"
            sizes="(max-width: 768px) 50vw, 25vw"
            unoptimized
          />
        </div>
        {discount > 0 && (
          <span className="absolute top-2 left-2 bg-[#6b21a8] text-white font-extrabold text-[11px] px-2 py-1 rounded-full shadow-md z-10">
            -{discount}%
          </span>
        )}
      </div>

      {/* PHẦN THÔNG TIN */}
      <div className="p-4 flex-1 flex flex-col bg-white relative z-10">
        <span className="text-gray-400 uppercase text-[9px] tracking-wider font-semibold mb-1">
          TÀI KHOẢN GIẢI TRÍ
        </span>
        <h3 className="text-gray-800 font-semibold text-[15px] leading-snug line-clamp-2 min-h-[44px] group-hover:text-[#6b21a8] transition-colors mb-2">
          {product.name}
        </h3>

        <div className="mt-auto flex items-end justify-between pt-2">
          <div className="flex flex-col">
            <span className="text-black font-extrabold text-[16px]">
              {prices.length ? formatPrice(minPrice) + " đ" : "Liên hệ"}
            </span>
            {minOriginalPrice && minOriginalPrice > minPrice && (
              <span className="text-sm text-slate-400 line-through">
                {formatPrice(minOriginalPrice)} đ
              </span>
            )}
          </div>

          {/* NÚT GIỎ HÀNG */}
          <button
            onClick={(e) => e.preventDefault()}
            // Nút bấm sẽ búng to lên nhẹ nhàng khi rê chuột vào để kích thích click
            className="relative bg-[#6b21a8] text-white w-9 h-9 rounded-full flex items-center justify-center hover:bg-[#581c87] hover:scale-110 active:scale-90 transition-all duration-300 shadow-md shrink-0 z-50"
          >
            <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
          </button>
        </div>
      </div>
    </Link>
  );
}