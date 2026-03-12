"use client";

import { useState } from "react";
import Link from "next/link";
import { getCategoryTree } from "@/data/categories";

export function MegaMenu() {
  const [openId, setOpenId] = useState<string | null>(null);
  const tree = getCategoryTree();

  return (
    <nav className="hidden md:block bg-slate-700 text-white" aria-label="Danh mục">
      <div className="container mx-auto px-4">
        <ul className="flex flex-wrap items-center gap-1 py-2">
          <li>
            <Link
              href="/san-pham"
              className="block px-4 py-2 rounded hover:bg-slate-600 transition font-medium"
            >
              Tất cả sản phẩm
            </Link>
          </li>
          {tree.map((cat) => (
            <li
              key={cat.id}
              className="relative"
              onMouseEnter={() => setOpenId(cat.id)}
              onMouseLeave={() => setOpenId(null)}
            >
              {cat.children && cat.children.length > 0 ? (
                <>
                  <button
                    type="button"
                    onClick={() => setOpenId(openId === cat.id ? null : cat.id)}
                    className="flex items-center gap-1 px-4 py-2 rounded hover:bg-slate-600 transition font-medium"
                    aria-expanded={openId === cat.id}
                    aria-haspopup="true"
                  >
                    {cat.name}
                    <span className="text-xs">▼</span>
                  </button>
                  {openId === cat.id && (
                    <div className="absolute left-0 top-full pt-1 z-50 min-w-[200px]">
                      <div className="bg-white text-slate-800 rounded-lg shadow-lg border border-slate-200 py-2">
                        <Link
                          href={`/danh-muc/${cat.slug}`}
                          className="block px-4 py-2 hover:bg-emerald-50 hover:text-emerald-700 font-medium"
                          onClick={() => setOpenId(null)}
                        >
                          Tất cả {cat.name}
                        </Link>
                        {cat.children?.map((child) => (
                          <Link
                            key={child.id}
                            href={`/danh-muc/${child.slug}`}
                            className="block px-4 py-2 hover:bg-emerald-50 hover:text-emerald-700 text-sm"
                            onClick={() => setOpenId(null)}
                          >
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <Link
                  href={`/danh-muc/${cat.slug}`}
                  className="block px-4 py-2 rounded hover:bg-slate-600 transition font-medium"
                >
                  {cat.name}
                </Link>
              )}
            </li>
          ))}
          <li>
            <Link
              href="/blog"
              className="block px-4 py-2 rounded hover:bg-slate-600 transition font-medium"
            >
              Blog
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
