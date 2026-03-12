"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { siteSettings } from "@/data/siteSettings";
import { getCartCount } from "@/lib/cart";
import { formatPrice } from "@/lib/utils";
import { supabase } from "@/utils/supabase/client";
import { Menu, X } from "lucide-react";
type HeaderProduct = {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
  product_variants?: { price: number; original_price: number | null }[];
};

export function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  const [allProducts, setAllProducts] = useState<HeaderProduct[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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

  useEffect(() => {
    let ignore = false;
    async function load() {
      const { data } = await supabase
        .from("products")
        .select("id,name,slug,image_url,product_variants(price,original_price)")
        .order("created_at", { ascending: false })
        .limit(100);
      if (ignore) return;
      setAllProducts((data ?? []) as HeaderProduct[]);
    }
    load();
    return () => {
      ignore = true;
    };
  }, []);

  const suggestions: HeaderProduct[] = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return allProducts
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          ((p as any).description || "").toLowerCase().includes(q)
      )
      .slice(0, 8);
  }, [searchQuery, allProducts]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/san-pham?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsFocused(false);
      setIsMobileMenuOpen(false);
    }
  };

  const handleSelectSuggestion = (slug: string) => {
    setIsFocused(false);
    setSearchQuery("");
    setIsMobileMenuOpen(false);
    router.push(`/san-pham/${slug}`);
  };

  const showSuggestions = isFocused && suggestions.length > 0;

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
      <div className="container mx-auto px-4 py-3">
        {/* Top bar: logo + search (desktop) + cart + hamburger (mobile) */}
        <div className="flex items-center justify-between gap-3">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="h-10 w-10 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-lg">
              {siteSettings.siteName.charAt(0)}
            </div>
            <span className="font-semibold text-lg text-slate-800 hidden sm:inline">
              {siteSettings.siteName}
            </span>
          </Link>

          {/* Search - desktop only */}
          <div className="hidden md:block flex-1 max-w-md mx-4" ref={wrapperRef}>
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
                      product.image_url || "/images/placeholder-product.svg";
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
                            {product.product_variants && product.product_variants.length > 0 && (
                              <p className="text-xs text-emerald-600 font-semibold">
                                {(() => {
                                  const prices = product.product_variants!
                                    .map((v) => v.price)
                                    .filter((p) => Number.isFinite(p));
                                  if (!prices.length) return "Liên hệ";
                                  const min = Math.min(...prices);
                                  return `Từ ${formatPrice(min)}`;
                                })()}
                              </p>
                            )}
                          </div>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>

          {/* Cart + Hamburger */}
          <div className="flex items-center gap-2">
            <Link
              href="/gio-hang"
              className="relative flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition"
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

            {/* Hamburger - mobile only */}
            <button
              type="button"
              className="md:hidden inline-flex items-center justify-center h-10 w-10 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700"
              onClick={() => {
                setIsMobileMenuOpen(true);
                setIsFocused(false);
              }}
              aria-label="Mở menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 md:hidden">
          <div className="absolute inset-y-0 right-0 w-full max-w-xs bg-white shadow-xl flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
              <span className="font-semibold text-slate-800">Menu</span>
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-slate-100 text-slate-700"
                aria-label="Đóng menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Search inside drawer */}
            <div className="px-4 py-3 border-b border-slate-200" ref={wrapperRef}>
              <form onSubmit={handleSearch}>
                <div className="flex rounded-lg overflow-hidden border border-slate-300 focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-emerald-500 bg-white">
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    placeholder="Tìm sản phẩm..."
                    className="flex-1 px-3 py-2 text-sm outline-none"
                  />
                  <button
                    type="submit"
                    className="px-3 py-2 bg-slate-100 text-slate-600 hover:bg-slate-200 transition text-sm"
                  >
                    Tìm
                  </button>
                </div>
              </form>

              {showSuggestions && (
                <div className="mt-2 rounded-lg border border-slate-200 bg-white shadow-sm max-h-64 overflow-y-auto">
                  <ul>
                    {suggestions.map((product) => {
                      const imageSrc =
                        product.image_url || "/images/placeholder-product.svg";
                      return (
                        <li key={product.id}>
                          <button
                            type="button"
                            onClick={() => handleSelectSuggestion(product.slug)}
                            className="w-full flex items-center gap-3 px-3 py-2 hover:bg-emerald-50 text-left"
                          >
                            <div className="relative w-8 h-8 rounded-full overflow-hidden bg-slate-100 shrink-0">
                              <Image
                                src={imageSrc}
                                alt={product.name}
                                fill
                                className="object-cover"
                                sizes="32px"
                                unoptimized
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-slate-800 line-clamp-1">
                                {product.name}
                              </p>
                              {product.product_variants && product.product_variants.length > 0 && (
                                <p className="text-xs text-emerald-600 font-semibold">
                                  {(() => {
                                    const prices = product.product_variants!
                                      .map((v) => v.price)
                                      .filter((p) => Number.isFinite(p));
                                    if (!prices.length) return "Liên hệ";
                                    const min = Math.min(...prices);
                                    return `Từ ${formatPrice(min)}`;
                                  })()}
                                </p>
                              )}
                            </div>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>

            {/* Menu items */}
            <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-1 text-sm">
              <button
                type="button"
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 text-slate-800 font-medium"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  router.push("/");
                }}
              >
                Trang chủ
              </button>
              <button
                type="button"
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 text-slate-800 font-medium"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  router.push("/san-pham");
                }}
              >
                Tất cả sản phẩm
              </button>
              <button
                type="button"
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 text-slate-800"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  router.push("/danh-muc/giai-tri");
                }}
              >
                Tài khoản giải trí
              </button>
              <button
                type="button"
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 text-slate-800"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  router.push("/danh-muc/phan-mem");
                }}
              >
                Phần mềm & Office
              </button>
              <button
                type="button"
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 text-slate-800"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  router.push("/blog");
                }}
              >
                Blog
              </button>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
