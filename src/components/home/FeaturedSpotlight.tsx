import Link from "next/link";
import Image from "next/image";
import { getFeaturedProducts } from "@/data/products";
import { formatPrice } from "@/lib/utils";

export function FeaturedSpotlight() {
  const featured = getFeaturedProducts();
  const main = featured[0];
  if (!main) return null;

  const imageSrc = main.images[0] || "/images/placeholder-product.jpg";

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Sản phẩm nổi bật</h2>
        <div className="rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
          <div className="grid md:grid-cols-2 gap-0">
            <div className="relative aspect-square md:aspect-auto md:min-h-[320px]">
              <Image
                src={imageSrc}
                alt={main.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                unoptimized
              />
            </div>
            <div className="p-8 flex flex-col justify-center">
              <h3 className="text-2xl font-bold text-slate-800 mb-2">{main.name}</h3>
              <p className="text-slate-600 mb-4 line-clamp-2">{main.shortDescription}</p>
              <div className="flex items-center gap-3 mb-6">
                <span className="text-2xl font-bold text-emerald-600">{formatPrice(main.price)}</span>
                {main.originalPrice && (
                  <span className="text-slate-400 line-through">{formatPrice(main.originalPrice)}</span>
                )}
              </div>
              <Link
                href={`/san-pham/${main.slug}`}
                className="inline-flex items-center justify-center rounded-lg bg-emerald-600 text-white px-6 py-3 font-semibold hover:bg-emerald-700 transition w-fit"
              >
                Xem chi tiết & chọn mua
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
