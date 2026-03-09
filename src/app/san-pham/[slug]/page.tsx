import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { getCategoryById } from "@/data/categories";
import { getProductBySlug, getRelatedProducts } from "@/data/products";
import type { Product } from "@/types";
import { ProductDetailClient } from "./ProductDetailClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: "Sản phẩm" };
  return {
    title: product.name,
    description: product.shortDescription,
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const category = getCategoryById(product.categoryId);
  const related = getRelatedProducts(product);

  const breadcrumbs = [
    { label: "Sản phẩm", href: "/san-pham" },
    ...(category ? [{ label: category.name, href: `/danh-muc/${category.slug}` }] : []),
    { label: product.name },
  ].filter(Boolean) as { label: string; href?: string }[];

  return (
    <div className="container mx-auto px-4 py-6">
      <Breadcrumbs items={breadcrumbs} />
      <ProductDetailClient
        product={product}
        categoryName={category?.name ?? "Sản phẩm"}
        relatedProducts={related}
      />
    </div>
  );
}
