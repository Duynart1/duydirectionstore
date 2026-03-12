import Link from "next/link";
import { getCategoryTree } from "@/data/categories";
import { supabase } from "@/utils/supabase/client";
import { ProductCard } from "@/components/product/ProductCard";

async function getProductsByCategoryFromSupabase(categoryId: string) {
  const { data } = await supabase
    .from("products")
    .select("id,name,slug,image_url,created_at,product_variants(price,original_price)")
    .eq("category_id", categoryId)
    .order("created_at", { ascending: false })
    .limit(4);
  return (data ?? []) as any[];
}

export async function ProductSections() {
  const tree = getCategoryTree();

  return (
    <section className="py-12 bg-slate-50">
      <div className="container mx-auto px-4">
        {(
          await Promise.all(
            tree.slice(0, 3).map(async (cat) => ({
              cat,
              products: await getProductsByCategoryFromSupabase(cat.id),
            }))
          )
        ).map(({ cat, products: categoryProducts }) => {
          if (categoryProducts.length === 0) return null;
          return (
            <div key={cat.id} className="mb-12 last:mb-0">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-800">{cat.name}</h2>
                <Link
                  href={`/danh-muc/${cat.slug}`}
                  className="text-emerald-600 font-medium hover:underline"
                >
                  Xem tất cả →
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {categoryProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
