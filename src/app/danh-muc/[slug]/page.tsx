import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ProductCard } from "@/components/product/ProductCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { getCategoryBySlug } from "@/data/categories";
import { supabase } from "@/utils/supabase/client";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) return { title: "Danh mục" };
  return {
    title: category.name,
    description: category.description || `Sản phẩm thuộc danh mục ${category.name}`,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) notFound();

  const { data } = await supabase
    .from("products")
    .select("id,name,slug,image_url,created_at,product_variants(price,original_price)")
    .eq("category_id", category.id)
    .order("created_at", { ascending: false });
  const products = (data ?? []) as any[];

  const breadcrumbs = [{ label: category.name }];

  return (
    <div className="container mx-auto px-4 py-6">
      <Breadcrumbs items={breadcrumbs} />
      <h1 className="text-2xl font-bold text-slate-800 mb-2">{category.name}</h1>
      {category.description && (
        <p className="text-slate-600 mb-6">{category.description}</p>
      )}
      {products.length === 0 ? (
        <EmptyState
          title="Chưa có sản phẩm trong danh mục này"
          description="Hãy xem các danh mục khác hoặc quay lại trang chủ."
          actionLabel="Xem tất cả sản phẩm"
          actionHref="/san-pham"
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
