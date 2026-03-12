import { ProductCard } from "@/components/product/ProductCard";
import { supabase } from "@/utils/supabase/client";

async function getFeaturedFromSupabase() {
  const { data } = await supabase
    .from("products")
    .select("id,name,slug,image_url,created_at,product_variants(price,original_price)")
    .order("created_at", { ascending: false })
    .limit(8);
  return (data ?? []) as any[];
}

export async function PromoProducts() {
  const featured = await getFeaturedFromSupabase();

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Sản phẩm khuyến mãi</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
