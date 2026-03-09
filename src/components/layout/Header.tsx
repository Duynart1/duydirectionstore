"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { siteSettings } from "@/data/siteSettings";
import { getCartCount } from "@/lib/cart";
import { products } from "@/data/products";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types";

export function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  const router = useRouter();
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setCartCount(getCartCount());
    const handler = () => setCartCount(getCartCount());
    window.addEventListener("cart-update", handler);
    return () => window.removeEventListener("cart-update", handler);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const suggestions: Product[] = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return products
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q)
      )
      .slice(0, 8);
  }, [searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/san-pham?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsFocused(false);
    }
  };

  const handleSelectSuggestion = (slug: string) => {
    setIsFocused(false);
    setSearchQuery("");
    router.push(`/san-pham/${slug}`);
  };

  const showSuggestions = isFocused && suggestions.length > 0;

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="h-10 w-10 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-lg">
              {siteSettings.siteName.charAt(0)}
            </div>
            <span className="font-semibold text-lg text-slate-800">{siteSettings.siteName}</span>
          </Link>

          <div className="relative flex-1 w-full md:max-w-md" ref={wrapperRef}>
            <form onSubmit={handleSearch}>
              <div className="flex rounded-lg overflow-hidden border border-slate-300 focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-emerald-500 bg-white">
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  placeholder="Tìm sản phẩm..."
                  className="flex-1 px-4 py-2 text-sm outline-none"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-100 text-slate-600 hover:bg-slate-200 transition"
                >
                  Tìm
                </button>
              </div>
            </form>

            {showSuggestions && (
              <div className="absolute left-0 right-0 mt-1 rounded-xl border border-slate-200 bg-white shadow-lg overflow-hidden">
                <ul className="max-h-72 overflow-y-auto">
                  {suggestions.map((product) => {
                    const imageSrc =
                      product.images[0] || "/images/placeholder-product.svg";
                    return (
                      <li key={product.id}>
                        <button
                          type="button"
                          onClick={() => handleSelectSuggestion(product.slug)}
                          className="w-full flex items-center gap-3 px-3 py-2 hover:bg-emerald-50 text-left"
                        >
                          <div className="relative w-9 h-9 rounded-full overflow-hidden bg-slate-100 shrink-0">
                            <Image
                              src={imageSrc}
                              alt={product.name}
                              fill
                              className="object-cover"
                              sizes="36px"
                              unoptimized
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-800 line-clamp-1">
                              {product.name}
                            </p>
                            <p className="text-xs text-emerald-600 font-semibold">
                              {formatPrice(product.price)}
                            </p>
                          </div>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/gio-hang"
              className="relative flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition"
            >
              <span className="text-xl" aria-hidden>
                🛒
              </span>
              <span className="hidden sm:inline text-sm font-medium">Giỏ hàng</span>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 min-w-5 flex items-center justify-center rounded-full bg-emerald-600 text-white text-xs font-bold">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
