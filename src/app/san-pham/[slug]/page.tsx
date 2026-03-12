import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { supabase } from "@/utils/supabase/client";
import { SupabaseProductDetailClient } from "./SupabaseProductDetailClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { data } = await supabase
    .from("products")
    .select("name,description")
    .eq("slug", slug)
    .single();
  if (!data) return { title: "Sản phẩm" };
  return {
    title: data.name,
    description: (data as any).description ?? undefined,
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { data: product, error } = await supabase
    .from("products")
    .select("id,name,slug,description,image_url,product_variants(id,account_type,duration,price,original_price,is_available)")
    .eq("slug", slug)
    .single();

  if (error || !product) notFound();

  const breadcrumbs = [
    { label: "Sản phẩm", href: "/san-pham" },
    { label: (product as any).name },
  ].filter(Boolean) as { label: string; href?: string }[];

  return (
    <div className="container mx-auto px-4 py-6">
      <Breadcrumbs items={breadcrumbs} />
      <SupabaseProductDetailClient product={product as any} />
    </div>
  );
}
