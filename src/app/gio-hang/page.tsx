"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

export default function CartPage() {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [total, setTotal] = useState(0);

  // 1. Hàm tính tổng tiền
  const calculateTotal = (items: any[]) => {
    const sum = items.reduce((acc, item) => acc + (item.price * item.qty), 0);
    setTotal(sum);
  };

  // 2. Lấy dữ liệu từ bộ nhớ khi mở trang
  useEffect(() => {
    const savedCart = localStorage.getItem("sk_cart");
    if (savedCart) {
      const items = JSON.parse(savedCart);
      setCartItems(items);
      calculateTotal(items);
    }
  }, []);

  // 3. Hàm XÓA sản phẩm
  const handleRemoveItem = (id: string) => {
    const updatedCart = cartItems.filter(item => item.id !== id);
    setCartItems(updatedCart);
    calculateTotal(updatedCart);
    localStorage.setItem("sk_cart", JSON.stringify(updatedCart));
  };

  // 4. Hàm Copy đơn hàng và gửi Zalo
  const handleContactAdmin = () => {
    if (cartItems.length === 0) return;

    const orderText = cartItems.map(item => `- ${item.name} (x${item.qty}) - ${(item.price * item.qty).toLocaleString()}đ`).join('\n');
    const message = `Chào Shop, mình muốn mua các sản phẩm sau:\n${orderText}\n\nTổng cộng: ${total.toLocaleString()}đ`;

    navigator.clipboard.writeText(message).then(() => {
      alert("✅ Đã copy đơn hàng! Hãy 'Dán' vào tin nhắn Zalo cho Shop nhé.");
      window.open("https://zalo.me/0359881860", "_blank");
    });
  };

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        <h1 className="text-2xl font-bold mb-8 text-gray-800 flex items-center gap-2">
          🛒 Giỏ hàng của bạn
        </h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400 mb-6">Giỏ hàng đang trống trơn...</p>
            <Link href="/" className="bg-teal-600 text-white px-6 py-2 rounded-full hover:bg-teal-700 transition">
              Quay lại mua sắm
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-8">
              {cartItems.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-700">{item.name}</h3>
                    <p className="text-xs text-gray-500 italic">Số lượng: {item.qty}</p>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className="text-red-500 font-bold">{(item.price * item.qty).toLocaleString()}đ</span>
                    {/* NÚT XÓA */}
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-gray-400 hover:text-red-600 transition p-2"
                      title="Xóa sản phẩm"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-6 flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="text-gray-700">
                <span className="text-lg">Tổng tiền tạm tính:</span>
                <span className="text-2xl font-black text-red-600 ml-3">{total.toLocaleString()}đ</span>
              </div>
              <button
                onClick={handleContactAdmin}
                className="w-full md:w-auto bg-teal-600 text-white px-10 py-4 rounded-xl font-black hover:bg-teal-700 shadow-xl shadow-teal-100 transition transform hover:-translate-y-1 active:scale-95"
              >
                GỬI ĐƠN QUA ZALO NGAY ❯
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}