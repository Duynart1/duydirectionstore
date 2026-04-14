"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

export default function CartPage() {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [total, setTotal] = useState(0);

  // 1. Chỉ tính tổng tiền cho những sản phẩm được TÍCH CHỌN
  const calculateTotal = (items: any[]) => {
    const sum = items
      .filter(item => item.selected)
      .reduce((acc, item) => acc + (item.price * item.qty), 0);
    setTotal(sum);
  };

  // 2. Tải dữ liệu, mặc định cho tích chọn tất cả khi mới vào
  useEffect(() => {
    const savedCart = localStorage.getItem("sk_cart");
    if (savedCart) {
      let items = JSON.parse(savedCart);
      items = items.map((item: any) => ({ ...item, selected: true }));
      setCartItems(items);
      calculateTotal(items);
    }
  }, []);

  // 3. Xử lý khi khách bấm vào ô Checkbox
  const toggleSelection = (id: string) => {
    const updatedCart = cartItems.map(item =>
      item.id === id ? { ...item, selected: !item.selected } : item
    );
    setCartItems(updatedCart);
    calculateTotal(updatedCart);
  };

  // 4. Xóa sản phẩm
  const handleRemoveItem = (id: string) => {
    const updatedCart = cartItems.filter(item => item.id !== id);
    setCartItems(updatedCart);
    calculateTotal(updatedCart);
    // Khi lưu lại bộ nhớ, loại bỏ trạng thái selected để không làm rác data
    const cartToSave = updatedCart.map(({ selected, ...rest }) => rest);
    localStorage.setItem("sk_cart", JSON.stringify(cartToSave));
  };

  // 5. Nâng cấp: Gửi Zalo và Đổi SĐT
  const handleContactAdmin = () => {
    const selectedProducts = cartItems.filter(item => item.selected);

    if (selectedProducts.length === 0) {
      alert("⚠️ Bạn chưa chọn sản phẩm nào để mua!");
      return;
    }

    const orderText = selectedProducts.map(item => {
      const options = [item.service, item.plan, item.duration].filter(Boolean).join(' | ');
      const optionText = options ? `\n   👉 Phân loại: ${options}` : '';
      return `- ${item.name} (x${item.qty}) - ${(item.price * item.qty).toLocaleString()}đ${optionText}`;
    }).join('\n\n');

    const message = `Chào Shop, mình muốn chốt đơn hàng sau:\n\n${orderText}\n\n💰 Tổng cộng: ${total.toLocaleString()}đ`;

    navigator.clipboard.writeText(message).then(() => {
      alert("✅ Đã copy đơn hàng! Bạn chỉ cần 'Dán' vào khung chat Zalo nhé.");
      // Đã cập nhật SĐT Zalo mới
      window.open("https://zalo.me/0369143082", "_blank");
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
                <div key={idx} className="flex gap-4 items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition border border-gray-100">

                  {/* Ô Checkbox */}
                  <input
                    type="checkbox"
                    checked={item.selected}
                    onChange={() => toggleSelection(item.id)}
                    className="w-5 h-5 text-teal-600 bg-gray-100 border-gray-300 rounded focus:ring-teal-500 cursor-pointer"
                  />

                  {/* Ảnh sản phẩm thu nhỏ */}
                  <div className="w-20 h-20 bg-gray-50 rounded-md border border-gray-200 overflow-hidden flex items-center justify-center shrink-0">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                    ) : (
                      <span className="text-[10px] text-gray-400">Chưa có ảnh</span>
                    )}
                  </div>

                  {/* Thông tin sản phẩm */}
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-700">{item.name}</h3>
                    <div className="mt-1 mb-2 text-sm text-gray-600">
                      {item.service && <div><span className="font-medium">Dịch vụ:</span> {item.service}</div>}
                      {item.plan && <div><span className="font-medium">Gói:</span> {item.plan}</div>}
                      {item.duration && <div><span className="font-medium">Thời hạn:</span> {item.duration}</div>}
                    </div>
                    <p className="text-xs text-gray-500 italic">Số lượng: {item.qty}</p>
                  </div>

                  {/* Giá và Nút xóa */}
                  <div className="flex flex-col items-end gap-3">
                    <span className="text-red-500 font-bold text-lg">{(item.price * item.qty).toLocaleString()}đ</span>
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-gray-400 hover:text-red-600 transition p-1"
                      title="Xóa sản phẩm"
                    >
                      🗑️ Xóa
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