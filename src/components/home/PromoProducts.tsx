import { getFeaturedProducts } from "@/data/products";
import { ProductCard } from "@/components/product/ProductCard";

export function PromoProducts() {
  const featured = getFeaturedProducts();

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
