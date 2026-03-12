import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/utils/supabase/client";
import { formatPrice } from "@/lib/utils";

async function getSpotlightProduct() {
  const { data } = await supabase
    .from("products")
    .select("id,name,slug,description,image_url,product_variants(price,original_price)")
    .order("created_at", { ascending: false })
    .limit(1);
  return (data ?? [])[0] as any | undefined;
}

export async function FeaturedSpotlight() {
  const main = await getSpotlightProduct();
  if (!main) return null;

  const imageSrc = main.image_url || "/images/placeholder-product.jpg";
  const prices = (main.product_variants ?? []).map((v: any) => v.price).filter((p: number) => Number.isFinite(p));
  const minPrice = prices.length ? Math.min(...prices) : 0;

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
              <p className="text-slate-600 mb-4 line-clamp-2">
                {main.description
                  ? main.description.replace(/<[^>]+>/g, "").slice(0, 140)
                  : "Sản phẩm nổi bật được nhiều khách hàng lựa chọn."}
              </p>
              <div className="flex items-center gap-3 mb-6">
                <span className="text-2xl font-bold text-emerald-600">
                  {prices.length ? `Từ ${formatPrice(minPrice)}` : "Liên hệ"}
                </span>
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
