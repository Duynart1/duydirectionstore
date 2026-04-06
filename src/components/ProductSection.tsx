"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";
import Link from "next/link";

// Khuôn đúc nhận 3 thông tin: Tiêu đề lớn, Tiêu đề nhỏ, và Danh sách các danh mục cần lấy
interface ProductSectionProps {
    title: string;
    subtitle: string;
    categories: string[];
}

export default function ProductSection({ title, subtitle, categories }: ProductSectionProps) {
    const [products, setProducts] = useState<any[]>([]);

    useEffect(() => {
        const fetchProducts = async () => {
            // Tự động quét vào Database, bốc ra tối đa 8 sản phẩm khớp danh mục
            const { data } = await supabase
                .from("products")
                .select("*")
                .in("category", categories)
                .order("id", { ascending: false })
                .limit(8);

            if (data) setProducts(data);
        };
        fetchProducts();
    }, [categories]);

    // Nếu danh mục này bạn chưa đăng sản phẩm nào, web sẽ tự động ẩn khối này đi cho đỡ trống
    if (products.length === 0) return null;

    return (
        <section className="py-10 bg-[#f3f4f6]">
            <div className="container mx-auto max-w-7xl px-4">

                {/* Tiêu đề của Khối */}
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-[#1a1e24] uppercase mb-1">{title}</h2>
                    <p className="text-sm text-gray-500">{subtitle}</p>
                </div>

                {/* Lưới Sản phẩm */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    {products.map((p, i) => {
                        const firstImage = p.image_url ? p.image_url.split(",")[0] : "";

                        return (
                            <Link href={`/san-pham/${p.slug || p.id}`} key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 relative group hover:shadow-lg transition duration-300 flex flex-col h-full">

                                {/* Tag Danh mục góc trái */}
                                <span className="absolute top-3 left-3 bg-[#00bfa5] text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm z-10 uppercase tracking-wider">
                                    {p.category}
                                </span>

                                {/* Ảnh sản phẩm */}
                                <div className="w-full aspect-square bg-gray-50 rounded-lg mb-4 overflow-hidden flex items-center justify-center border border-gray-50 relative p-2">
                                    {firstImage ? (
                                        <img src={firstImage} alt={p.name} className="w-full h-full object-contain group-hover:scale-110 transition duration-500" />
                                    ) : (
                                        <span className="text-gray-300 text-xs">Chưa có ảnh</span>
                                    )}
                                </div>

                                {/* Tên & Giá */}
                                <h3 className="font-semibold text-gray-800 text-sm h-10 line-clamp-2 mb-2 group-hover:text-[#008b8b] transition leading-tight">{p.name}</h3>

                                <div className="mt-auto flex items-end justify-between">
                                    <div>
                                        <div className="text-[#6c5ce7] font-black text-lg">{p.price?.toLocaleString()} đ</div>
                                        <div className="text-xs text-gray-400 mt-1">Lượt mua: {Math.floor(Math.random() * 50) + 1}</div> {/* Random lượt mua cho sinh động */}
                                    </div>
                                    {/* Nút Giỏ hàng nhỏ */}
                                    <div className="bg-[#6c5ce7] text-white w-9 h-9 rounded-full flex items-center justify-center hover:bg-[#5a4bcf] transition shadow-md shadow-indigo-200">
                                        🛒
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>

                {/* Nút Xem tất cả */}
                <div className="text-center mt-8">
                    <button className="border border-gray-300 text-gray-600 px-6 py-2 rounded-full hover:border-[#008b8b] hover:text-[#008b8b] transition text-sm font-medium bg-white shadow-sm">
                        Xem tất cả ❯
                    </button>
                </div>

            </div>
        </section>
    );
}