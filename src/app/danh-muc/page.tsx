"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";

// TỪ ĐIỂN CHUYỂN ĐỔI
const categoryMap: Record<string, string> = {
    "giai-tri": "Giải trí",
    "lam-viec": "Làm việc",
    "hoc-tap": "Học tập",
    "cong-cu-ai": "Công cụ AI",
    "do-hoa": "Đồ họa",
    "key-win-office": "Key Win, Office",
    "dung-luong": "Dung lượng",
    "phan-mem-vpn": "Phần mềm VPN",
    "diet-virus": "Diệt Virus",
    "phan-mem-khac": "Phần mềm khác"
};

const categoryList = Object.keys(categoryMap).map(key => ({
    slug: key,
    name: categoryMap[key]
}));

export default function AllProductsPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            // Lấy toàn bộ sản phẩm không cần bộ lọc
            const { data } = await supabase.from("products").select("*");
            if (data) setProducts(data);
            setLoading(false);
        };
        fetchProducts();
    }, []);

    return (
        <div className="bg-[#f3f4f6] min-h-screen py-8">
            <div className="container mx-auto max-w-[1200px] px-4">

                <div className="text-sm text-gray-500 mb-6 flex gap-2 items-center">
                    <a href="/" className="hover:text-teal-600 transition">Trang chủ</a>
                    <span>/</span>
                    <span className="text-gray-800 font-medium">Tất cả sản phẩm</span>
                </div>

                <div className="flex flex-col md:flex-row gap-8">

                    {/* SIDEBAR BÊN TRÁI */}
                    <div className="w-full md:w-[250px] shrink-0">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden sticky top-4">
                            <h3 className="bg-gray-50 border-b border-gray-100 p-4 font-bold text-gray-800">Danh mục sản phẩm</h3>
                            <ul className="py-2 text-sm text-gray-700">
                                <li>
                                    <a href="/danh-muc" className="block px-5 py-3 transition border-l-4 bg-purple-50 text-purple-700 font-bold border-purple-600">
                                        Tất cả sản phẩm
                                    </a>
                                </li>
                                {categoryList.map((cat) => (
                                    <li key={cat.slug}>
                                        <a href={`/danh-muc/${cat.slug}`} className="block px-5 py-3 hover:bg-gray-50 transition border-l-4 border-transparent">
                                            {cat.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* MAIN SẢN PHẨM PHÍA BÊN PHẢI */}
                    <div className="flex-1">
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-2xl font-bold text-gray-800">Tất cả sản phẩm</h1>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <span>Sắp xếp:</span>
                                <select className="border border-gray-300 rounded p-1.5 focus:outline-none focus:border-teal-500">
                                    <option>Thứ tự theo mức độ phổ biến</option>
                                    <option>Giá: Từ thấp đến cao</option>
                                    <option>Giá: Từ cao đến thấp</option>
                                </select>
                            </div>
                        </div>

                        {loading ? (
                            <div className="py-20 text-center font-bold text-teal-600">⏳ Đang tải sản phẩm...</div>
                        ) : products.length === 0 ? (
                            <div className="py-20 text-center text-gray-500 bg-white rounded-lg border border-gray-100">Chưa có sản phẩm nào.</div>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-10">
                                {products.map((p) => (
                                    <a href={`/san-pham/${p.slug || p.id}`} key={p.id} className="bg-white rounded-lg border border-gray-100 p-3 shadow-sm hover:shadow-md transition group block relative">
                                        <div className="w-full aspect-square bg-gray-50 rounded mb-3 flex items-center justify-center overflow-hidden border border-gray-100">
                                            {p.image_url ? (
                                                <img src={p.image_url.split(",")[0]} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" alt={p.name} />
                                            ) : (
                                                <span className="text-xs text-gray-400">Chưa có ảnh</span>
                                            )}
                                        </div>
                                        <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-1 line-clamp-1">{p.category}</div>
                                        <h3 className="font-bold text-sm text-gray-800 mb-2 line-clamp-2 min-h-[40px] group-hover:text-purple-600 transition">{p.name}</h3>
                                        <div className="text-red-500 font-bold text-lg mb-2">{p.price?.toLocaleString()} <span className="underline text-sm">đ</span></div>

                                        <div className="flex justify-between items-center mt-auto pt-2 border-t border-gray-50">
                                            <div className="flex flex-col">
                                                <span className="text-xs text-gray-500">{p.sold || 0} đã bán</span>
                                                <span className="text-yellow-400 text-xs mt-0.5">★★★★★</span>
                                            </div>
                                            <button className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center hover:bg-purple-700 transition">
                                                🛒
                                            </button>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}