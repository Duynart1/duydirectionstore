import { Suspense } from "react";
import Link from "next/link";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ProductCard } from "@/components/product/ProductCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { supabase } from "@/utils/supabase/client";
export const metadata = {
  title: "Sản phẩm",
  description: "Danh sách sản phẩm số: tài khoản giải trí, phần mềm, khóa học.",
};

export default function ProductListingPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  return (
    <div className="container mx-auto px-4 py-6">
      <Breadcrumbs items={[{ label: "Sản phẩm" }]} />
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Tất cả sản phẩm</h1>
      <Suspense fallback={<ProductGridFallback />}>
        <ProductListWithSearch searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function ProductListWithSearch({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const { data } = await supabase
    .from("products")
    .select("id,name,slug,image_url,created_at,product_variants(price,original_price)")
    .order("created_at", { ascending: false });
  const all = (data ?? []) as any[];
  const query = q?.toLowerCase() ?? "";
  const products = query
    ? all.filter((p) => (p.name as string).toLowerCase().includes(query))
    : all;

  if (products.length === 0) {
    return (
      <EmptyState
        title={q ? "Không tìm thấy sản phẩm" : "Chưa có sản phẩm"}
        description={q ? `Không có kết quả cho "${q}". Thử từ khóa khác.` : undefined}
        actionLabel="Về trang chủ"
        actionHref="/"
      />
    );
  }

  return (
    <>
      {q && (
        <p className="text-slate-600 mb-4">
          Tìm thấy <strong>{products.length}</strong> sản phẩm cho &quot;{q}&quot;
        </p>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </>
  );
}

function ProductGridFallback() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="rounded-xl border border-slate-200 overflow-hidden bg-slate-100 animate-pulse">
          <div className="aspect-square" />
          <div className="p-4 space-y-2">
            <div className="h-4 bg-slate-200 rounded w-3/4" />
            <div className="h-4 bg-slate-200 rounded w-1/2" />
            <div className="h-6 bg-slate-200 rounded w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

