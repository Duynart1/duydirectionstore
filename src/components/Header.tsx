import Link from 'next/link';

export default function Header() {
    // Danh sách các danh mục chuẩn theo đúng ảnh bạn gửi
    const categories = [
        "Giải trí", "Làm việc", "Học tập", "Công cụ AI", "Đồ họa",
        "Key Win, Office", "Dung lượng", "Phần mềm VPN", "Diệt Virus", "Phần mềm khác"
    ];

    return (
        <header className="w-full relative z-50">
            {/* Top Bar: Logo, Tìm kiếm, Hotline, Giỏ hàng */}
            <div className="bg-[#008b8b] text-white py-3">
                <div className="container mx-auto max-w-7xl px-4 flex justify-between items-center">
                    <Link href="/" className="text-3xl font-bold italic tracking-wider">
                        <span className="text-purple-600">SK</span> SHOP TÀI KHOẢN
                    </Link>

                    <div className="flex-1 max-w-2xl mx-8">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Tìm kiếm tài khoản, khoá học, phần mềm..."
                                className="w-full py-2.5 px-4 rounded-md text-gray-800 focus:outline-none shadow-inner"
                            />
                            <button className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-teal-600">
                                🔍
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center gap-6 text-sm">
                        <div className="flex items-center gap-2">
                            <span className="text-xl">📞</span>
                            <div>
                                <p className="font-semibold text-[11px] uppercase tracking-wide opacity-80">Hotline:</p>
                                <p className="font-bold text-sm">0359.881.860</p>
                            </div>
                        </div>

                        <Link href="/gio-hang" className="flex items-center gap-2 border-l pl-5 border-white/30 hover:text-yellow-300 transition">
                            <span className="text-2xl">🛒</span>
                            <span className="font-semibold">Giỏ hàng</span>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Nav Bar: Thanh menu điều hướng */}
            <nav className="bg-[#007b7b] text-white font-medium shadow-md">
                <div className="container mx-auto max-w-7xl px-4">
                    <ul className="flex items-center gap-8 text-sm">
                        <li><Link href="/" className="py-3 block hover:text-yellow-300 transition">Trang chủ</Link></li>
                        <li><Link href="/gioi-thieu" className="py-3 block hover:text-yellow-300 transition">Giới Thiệu</Link></li>

                        {/* ITEM CÓ MENU XỔ XUỐNG (DROPDOWN) */}
                        <li className="relative group">
                            <Link href="/danh-muc" className="py-3 flex items-center gap-1 hover:text-yellow-300 transition cursor-pointer">
                                Danh mục sản phẩm <span className="text-[10px] ml-1 transition-transform group-hover:rotate-180">▼</span>
                            </Link>

                            {/* Bảng Dropdown - Tự động hiện khi hover */}
                            <div className="absolute left-0 top-full w-56 bg-white rounded-b-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 border border-gray-100 overflow-hidden transform origin-top group-hover:scale-y-100 scale-y-95">
                                <ul className="py-2">
                                    {categories.map((cat, index) => (
                                        <li key={index}>
                                            {/* Tạm thời trỏ link về trang danh mục */}
                                            <Link
                                                href={`/danh-muc`}
                                                className="block px-5 py-2.5 text-gray-700 text-[13px] hover:bg-teal-50 hover:text-teal-600 hover:pl-7 transition-all duration-200 border-b border-gray-50 last:border-0"
                                            >
                                                {cat}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </li>

                        <li><Link href="/huong-dan-mua-hang" className="py-3 block hover:text-yellow-300 transition">Hướng dẫn mua hàng</Link></li>
                        <li><Link href="/blog" className="py-3 block hover:text-yellow-300 transition">Blog</Link></li>
                    </ul>
                </div>
            </nav>
        </header>
    );
}