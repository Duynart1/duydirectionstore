"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";
import Link from "next/link";

interface ProductSectionProps {
    title: string;
    subtitle: string;
    categories: string[];
}

export default function ProductSection({ title, subtitle, categories }: ProductSectionProps) {
    const [products, setProducts] = useState<any[]>([]);

    useEffect(() => {
        const fetchProducts = async () => {
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

    if (products.length === 0) return null;

    return (
        <section className="py-10 bg-[#f3f4f6]">
            <div className="container mx-auto max-w-7xl px-4">

                {/* Tiêu đề của Khối */}
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-[#1a1e24] uppercase mb-1">{title}</h2>
                    <p className="text-sm text-gray-500">{subtitle}</p>
                </div>

                {/* Lưới Sản phẩm - Giãn cách rộng hơn một chút cho thoáng */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-8">
                    {products.map((p, i) => {
                        const firstImage = p.image_url ? p.image_url.split(",")[0] : "";

                        return (
                            // THIẾT KẾ MỚI: Bỏ hẳn viền và nền, chỉ là một cột flex
                            <Link
                                href={`/san-pham/${p.slug || p.id}`}
                                key={i}
                                className="group flex flex-col h-full block cursor-pointer"
                            >
                                {/* 1. VÙNG ẢNH SẢN PHẨM (Bo tròn, chiếm trọn width) */}
                                <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-gray-100 shadow-sm border border-gray-100/50">

                                    {/* Hiệu ứng ánh sáng quét (Chỉ quét trong vùng ảnh) */}
                                    <div className="absolute top-0 -left-[150%] w-[150%] h-full bg-gradient-to-r from-transparent via-white/60 to-transparent -skew-x-12 group-hover:left-[150%] transition-all duration-[800ms] ease-in-out z-20 pointer-events-none"></div>

                                    {/* Ảnh chính */}
                                    {firstImage ? (
                                        <img src={firstImage} alt={p.name} className="w-full h-full object-cover z-10 relative" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">Chưa có ảnh</div>
                                    )}

                                    {/* Tag Danh mục góc trái (Làm mỏng và sang hơn) */}
                                    <span className="absolute top-2 left-2 bg-emerald-500/90 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-sm z-30 uppercase tracking-wide">
                                        {p.category}
                                    </span>

                                    {/* Nút phóng to ảo góc phải dưới (Icon hai mũi tên chéo như ảnh mẫu) */}
                                    <div className="absolute bottom-2 right-2 w-7 h-7 bg-black/60 backdrop-blur-md rounded-full flex items-center justify-center z-30 text-white/90">
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"></path>
                                        </svg>
                                    </div>
                                </div>

                                {/* 2. VÙNG THÔNG TIN (Nằm ngoài ảnh, mỏng nhẹ, tinh tế) */}
                                <div className="pt-3 pb-1 flex flex-col flex-1 relative">

                                    {/* Vạch đen trang trí dưới đáy chạy ra khi hover (chỉ dài bằng 1/3 chữ) */}
                                    <div className="absolute bottom-0 left-0 h-[2px] bg-black w-0 z-30 transition-all duration-500 ease-out group-hover:w-16 rounded-full"></div>

                                    <span className="text-gray-400 uppercase text-[10px] tracking-widest font-medium mb-1">
                                        TÀI KHOẢN GIẢI TRÍ
                                    </span>

                                    {/* Tiêu đề màu đen chuẩn mực */}
                                    <h3 className="font-semibold text-gray-900 text-[15px] line-clamp-2 leading-snug mb-2 group-hover:text-[#6002ee] transition-colors">
                                        {p.name}
                                    </h3>

                                    <div className="mt-auto flex items-end justify-between">
                                        <div>
                                            {/* Giá tiền to, màu đen */}
                                            <div className="text-gray-900 font-bold text-[17px]">{p.price?.toLocaleString()} đ</div>
                                            {/* Text "đã bán" mảnh và nhỏ */}
                                            <div className="text-[12px] text-gray-500 mt-0.5">{Math.floor(Math.random() * 50) + 1} đã bán</div>
                                        </div>

                                        {/* Nút Giỏ hàng hình tròn màu tím đậm */}
                                        <button
                                            onClick={(e) => e.preventDefault()}
                                            className="bg-[#6002ee] text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#5001c9] transition-all duration-300 shadow-md hover:scale-110 active:scale-95 shrink-0"
                                        >
                                            <svg className="w-[15px] h-[15px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>

                {/* Nút Xem tất cả */}
                <div className="text-center mt-10">
                    <button className="border border-gray-300 text-gray-600 px-6 py-2 rounded-full hover:border-[#6002ee] hover:text-[#6002ee] transition text-sm font-medium bg-white shadow-sm">
                        Xem tất cả ❯
                    </button>
                </div>

            </div>
        </section>
    );
}