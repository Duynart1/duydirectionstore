"use client";
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Header() {
    // isSticky: Quản lý việc hiển thị "Tấm B"
    const [isSticky, setIsSticky] = useState(false);
    // isAtTop: Kiểm tra xem có đang ở đỉnh trang không để tắt hiệu ứng trượt
    const [isAtTop, setIsAtTop] = useState(true);

    useEffect(() => {
        const handleScroll = () => {
            const currentScroll = window.scrollY;

            // Cập nhật trạng thái đang ở đỉnh trang
            setIsAtTop(currentScroll <= 0);

            if (currentScroll <= 0) {
                // Khi chạm đỉnh trang (0px): Tắt Tấm B ngay lập tức để hợp nhất với Tấm A
                setIsSticky(false);
            } else if (currentScroll > 400) {
                // Khi lăn quá 400px: Kích hoạt Tấm B rơi xuống
                setIsSticky(true);
            }
            // LƯU Ý: Ở khoảng giữa từ 1px đến 400px, code không làm gì cả.
            // Điều này giúp Tấm B giữ nguyên trạng thái dính khi cuộn ngược lên!
        };

        // Chạy thử 1 lần ngay khi load trang để lấy vị trí đúng
        handleScroll();

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // 1. GÓI TOÀN BỘ GIAO DIỆN VÀO 1 BIẾN ĐỂ TẠO 2 TẤM VẢI GIỐNG HỆT NHAU
    const headerContent = (
        <>
            <div className="bg-[#008b8b] text-white py-3">
                <div className="container mx-auto max-w-7xl px-4 flex justify-between items-center">

                    <Link href="/" className="flex items-center gap-3">
                        <img src="/logo-DD(1).png" alt="Logo" className="h-12 w-auto object-contain scale-[1.5] origin-left" />
                        <span className="text-2xl font-bold italic tracking-wider text-white ml-2">
                            DUY DIRECTION
                        </span>
                    </Link>

                    <div className="flex-1 max-w-2xl mx-8">
                        <div className="relative">
                            {/* ĐÃ SỬA: Thêm bg-white để nền ô tìm kiếm có màu trắng */}
                            <input
                                type="text"
                                placeholder="Tìm kiếm tài khoản, khóa học, phần mềm..."
                                className="w-full py-2.5 px-4 rounded-md bg-white text-gray-800 focus:outline-none shadow-inner"
                            />
                            <button className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-teal-600">
                                🔍
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <span className="text-xl">📞</span>
                            <div>
                                <div className="text-[10px] uppercase font-bold text-teal-100">Hotline:</div>
                                {/* ĐÃ SỬA: Dùng thẻ <a> và href="tel:..." để tạo link gọi điện nhanh */}
                                <a href="tel:0369143082" className="font-bold hover:text-teal-200 transition">
                                    0369.143.082
                                </a>
                            </div>
                        </div>
                        <div className="w-px h-8 bg-teal-600"></div>
                        <Link href="/gio-hang" className="flex items-center gap-2 hover:text-teal-200 transition">
                            <span className="text-2xl">🛒</span>
                            <span className="font-bold">Giỏ hàng</span>
                        </Link>
                    </div>
                </div>
            </div>

            <div className="bg-[#007b7b] text-white">
                <div className="container mx-auto max-w-7xl px-4 flex items-center gap-6 font-medium text-sm">
                    <Link href="/" className="py-3 hover:text-teal-200 transition">Trang chủ</Link>
                    <Link href="/gioi-thieu" className="py-3 hover:text-teal-200 transition">Giới Thiệu</Link>
                    <Link href="/danh-muc" className="py-3 hover:text-teal-200 transition">Danh mục sản phẩm ▾</Link>
                    <Link href="/huong-dan" className="py-3 hover:text-teal-200 transition">Hướng dẫn mua hàng</Link>
                    <Link href="/blog" className="py-3 hover:text-teal-200 transition">Blog</Link>
                </div>
            </div>
        </>
    );

    return (
        <>
            {/* TẤM VẢI A: Header tĩnh luôn nằm vững chãi ở đầu trang */}
            <header className="relative z-50 w-full">
                {headerContent}
            </header>

            {/* TẤM VẢI B: Header nổi (Ghost) xử lý hiệu ứng trượt và tàng hình */}
            <header
                className={`fixed top-0 left-0 w-full z-[100] shadow-2xl transform 
                ${isSticky ? 'translate-y-0' : '-translate-y-full'} 
                ${isAtTop ? 'transition-none' : 'transition-transform duration-500 ease-in-out'}`}
            >
                {headerContent}
            </header>
        </>
    );
}