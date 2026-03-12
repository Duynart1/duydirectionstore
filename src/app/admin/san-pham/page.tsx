"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/utils/supabase/client";

type ProductRow = {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
  created_at: string;
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    let ignore = false;
    async function run() {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from("products")
        .select("id,name,slug,image_url,created_at")
        .order("created_at", { ascending: false });

      if (ignore) return;
      if (error) {
        setError(error.message);
        setProducts([]);
      } else {
        setProducts((data ?? []) as ProductRow[]);
      }
      setLoading(false);
    }
    run();
    return () => {
      ignore = true;
    };
  }, []);

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return products;
    return products.filter((p) => p.name.toLowerCase().includes(q));
  }, [products, searchQuery]);

  const content = useMemo(() => {
    if (loading) {
      return (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 text-slate-600">
          Đang tải danh sách sản phẩm...
        </div>
      );
    }

    if (error) {
      return (
        <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-800">
          {error}
        </div>
      );
    }

    if (!filteredProducts.length) {
      return (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 text-slate-600">
          {products.length ? "Không tìm thấy sản phẩm phù hợp." : "Chưa có sản phẩm nào."}
        </div>
      );
    }

    return (
      <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px]">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr className="text-left text-xs font-semibold text-slate-500">
                <th className="px-4 py-3">Sản phẩm</th>
                <th className="px-4 py-3">Slug</th>
                <th className="px-4 py-3">Ngày tạo</th>
                <th className="px-4 py-3 w-[220px]"></th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((p) => (
                <tr key={p.id} className="border-b border-slate-100">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-2xl border border-slate-200 bg-slate-50 overflow-hidden shrink-0">
                        {p.image_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={p.image_url}
                            alt={p.name}
                            className="h-full w-full object-cover"
                          />
                        ) : null}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{p.name}</p>
                        <p className="text-xs text-slate-500">ID: {p.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-700">/san-pham/{p.slug}</td>
                  <td className="px-4 py-4 text-sm text-slate-600">
                    {new Date(p.created_at).toLocaleString()}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/sua-san-pham/${p.id}`}
                        className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold border border-slate-200 bg-white hover:bg-slate-50 text-slate-800"
                      >
                        Sửa
                      </Link>
                      <Link
                        href={`/san-pham/${p.slug}`}
                        className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold border border-slate-200 bg-white hover:bg-slate-50 text-slate-800"
                      >
                        Xem
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }, [loading, error, products.length, filteredProducts]);

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
              Sản phẩm
            </h1>
            <p className="text-slate-600 mt-1">Quản lý danh sách sản phẩm trên Supabase.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm sản phẩm..."
              className="w-[260px] max-w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-400"
            />
            <Link
              href="/admin/them-san-pham"
              className="inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm"
            >
              + Thêm sản phẩm
            </Link>
          </div>
        </div>

        {content}
      </div>
    </div>
  );
}

