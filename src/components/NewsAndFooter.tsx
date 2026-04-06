export default function NewsAndFooter() {
    return (
        <>
            {/* Tin tức công nghệ */}
            <section className="py-10 bg-white">
                <div className="container mx-auto max-w-7xl px-4">
                    <h2 className="text-2xl font-bold text-center mb-8 uppercase text-gray-800">Tin tức công nghệ</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition">
                                <div className="h-48 bg-gray-200 flex items-center justify-center"><span className="text-gray-500">Ảnh Bài viết {i}</span></div>
                                <div className="p-4 text-center">
                                    <h3 className="font-semibold text-gray-800 mb-2">Tiêu đề bài viết tin tức số {i}</h3>
                                    <p className="text-sm text-gray-500 mb-4 line-clamp-2">Mô tả ngắn gọn cho bài viết này để khách hàng có thể đọc lướt qua nội dung chính...</p>
                                    <button className="border border-gray-300 text-gray-600 px-4 py-1.5 rounded text-sm hover:bg-gray-50">Xem thêm</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Cam kết cửa hàng */}
            <section className="bg-[#1a1e24] text-white py-8 border-b border-gray-700">
                <div className="container mx-auto max-w-7xl px-4 flex flex-col md:flex-row justify-center items-center gap-8 md:gap-20">
                    <div className="flex items-center gap-4">
                        <span className="text-3xl">🛡️</span>
                        <div>
                            <h4 className="font-bold mb-1">An toàn</h4>
                            <p className="text-xs text-gray-400 max-w-[200px]">Giao dịch mua an toàn, bảo mật thông tin tuyệt đối.</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-3xl">⚡</span>
                        <div>
                            <h4 className="font-bold mb-1">Nhanh chóng</h4>
                            <p className="text-xs text-gray-400 max-w-[200px]">Sản phẩm được giao nhanh chóng sau khi đặt hàng.</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-3xl">🎧</span>
                        <div>
                            <h4 className="font-bold mb-1">Hỗ trợ</h4>
                            <p className="text-xs text-gray-400 max-w-[200px]">Đội ngũ nhân viên trực hỗ trợ khách hàng nhanh nhất.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer chính */}
            <footer className="bg-[#1a1e24] text-gray-300 py-10 text-sm">
                <div className="container mx-auto max-w-7xl px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <h3 className="text-2xl font-bold text-white mb-4 italic"><span className="text-purple-500">SK</span> SHOP TÀI KHOẢN</h3>
                        <p className="mb-2"><strong>Địa chỉ:</strong> 497/24/9G Phan Văn Trị, Phường 5, Quận Gò Vấp, TP HCM</p>
                        <p className="mb-2"><strong>Điện thoại:</strong> 0359.881.860</p>
                        <p><strong>Email:</strong> info@shoptaikhoanvn.com</p>
                    </div>
                    <div>
                        <h4 className="text-white font-bold mb-4 uppercase">Chính Sách</h4>
                        <ul className="space-y-2">
                            <li><a href="#" className="hover:text-white">Chính sách mua hàng</a></li>
                            <li><a href="#" className="hover:text-white">Chính sách bảo hành</a></li>
                            <li><a href="#" className="hover:text-white">Cam kết cửa hàng</a></li>
                            <li><a href="#" className="hover:text-white">Chính sách cộng tác viên</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-bold mb-4 uppercase">Thông tin khác</h4>
                        <ul className="space-y-2">
                            <li><a href="#" className="hover:text-white">Hướng dẫn mua hàng</a></li>
                            <li><a href="#" className="hover:text-white">Quy chế hoạt động</a></li>
                            <li><a href="#" className="hover:text-white">Câu hỏi thường gặp</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-bold mb-4 uppercase">Thông tin mạng xã hội</h4>
                        <div className="flex gap-2 mb-6">
                            <span className="bg-blue-600 w-8 h-8 rounded-full flex items-center justify-center text-white cursor-pointer">f</span>
                            <span className="bg-pink-600 w-8 h-8 rounded-full flex items-center justify-center text-white cursor-pointer">ig</span>
                            <span className="bg-blue-400 w-8 h-8 rounded-full flex items-center justify-center text-white cursor-pointer">Zl</span>
                        </div>
                        <h4 className="text-white font-bold mb-4 uppercase">Hỗ trợ thanh toán</h4>
                        <div className="grid grid-cols-3 gap-2">
                            <div className="bg-white text-black text-[10px] font-bold p-1 text-center rounded">AlePay</div>
                            <div className="bg-white text-blue-500 text-[10px] font-bold p-1 text-center rounded">ZaloPay</div>
                            <div className="bg-white text-red-500 text-[10px] font-bold p-1 text-center rounded">VNPAY</div>
                        </div>
                    </div>
                </div>
                <div className="text-center text-gray-500 mt-10 border-t border-gray-700 pt-6">
                    Copyright 2026 © Bản quyền thuộc về Shop Tài Khoản
                </div>
            </footer>
        </>
    );
}