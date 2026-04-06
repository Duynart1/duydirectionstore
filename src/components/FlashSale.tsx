"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";

export default function FlashSale() {
    const [products, setProducts] = useState<any[]>([]);

    useEffect(() => {
        const fetchProducts = async () => {
            const { data } = await supabase.from("products").select("*").limit(4);
            if (data) setProducts(data);
        };
        fetchProducts();
    }, []);

    // Hàm xử lý khi khách bấm thêm vào giỏ
    const handleAddToCart = (product: any) => {
        const existingCart = localStorage.getItem("sk_cart");
        let cart = existingCart ? JSON.parse(existingCart) : [];

        // Kiểm tra xem sản phẩm đã có trong giỏ chưa
        const existingItem = cart.find((item: any) => item.id === product.id);
        if (existingItem) {
            existingItem.qty += 1;
        } else {
            cart.push({ ...product, qty: 1 });
        }

        localStorage.setItem("sk_cart", JSON.stringify(cart));
        alert(`Đã thêm "${product.name}" vào giỏ hàng!`);
    };

    return (
        <section className="bg-gradient-to-r from-teal-500 to-blue-500 py-8 mt-6">
            <div className="container mx-auto max-w-7xl px-4 text-white text-center">
                <h2 className="text-2xl font-bold mb-6">Sản phẩm mới cập nhật 🔥</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {products.map((p, i) => (
                        <div key={i} className="bg-white text-gray-800 rounded-lg p-4 shadow-md relative">
                            <div className="w-full h-32 bg-gray-100 rounded mb-3 flex items-center justify-center text-gray-400">Ảnh SP</div>
                            <h3 className="font-bold text-sm h-10 line-clamp-2">{p.name}</h3>
                            <div className="text-red-600 font-bold text-lg mt-2">{p.price?.toLocaleString()} đ</div>
                            <button
                                onClick={() => handleAddToCart(p)}
                                className="mt-3 w-full bg-teal-600 text-white py-2 rounded text-sm font-bold hover:bg-teal-700 transition"
                            >
                                Thêm vào giỏ
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}