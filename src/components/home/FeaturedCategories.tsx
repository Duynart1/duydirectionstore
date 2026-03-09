import Link from "next/link";
import { getCategoryTree } from "@/data/categories";

export function FeaturedCategories() {
  const tree = getCategoryTree();

  return (
    <section className="py-12 bg-slate-50">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Danh mục nổi bật</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {tree.map((cat) => (
            <Link
              key={cat.id}
              href={`/danh-muc/${cat.slug}`}
              className="flex flex-col items-center justify-center p-4 rounded-xl bg-white border border-slate-200 hover:border-emerald-500 hover:shadow-md transition text-center"
            >
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-2xl mb-2">
                📁
              </div>
              <span className="font-medium text-slate-800 text-sm line-clamp-2">{cat.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
