export default function Hero() {
    // Danh sách các danh mục bên trái
    const categories = [
        "Giải trí", "Làm việc", "Học tập", "Công cụ AI", "Đồ họa",
        "Key Win, Office", "Dung lượng", "Phần mềm VPN", "Diệt Virut", "Phần mềm khác"
    ];

    return (
        <section className="bg-white py-6">
            <div className="container mx-auto max-w-7xl px-4">
                <div className="flex flex-col md:flex-row gap-4">

                    {/* Cột 1: Menu dọc (Bên trái) */}
                    <div className="w-full md:w-1/4 border border-gray-200 rounded-md shadow-sm hidden md:block">
                        <ul className="py-2">
                            {categories.map((cat, index) => (
                                <li key={index} className="px-5 py-2.5 hover:bg-gray-50 cursor-pointer text-sm text-gray-700 border-b last:border-0 transition-colors">
                                    {cat}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Cột 2: Banner chính to (Ở giữa) */}
                    <div className="w-full md:w-2/4">
                        {/* Tạm thời tôi để khung màu xám, sau này bạn sẽ thay bằng thẻ <img> */}
                        <div className="w-full h-full min-h-[350px] bg-gray-200 rounded-lg flex items-center justify-center border hover:shadow-md transition">
                            <span className="text-gray-500 font-medium">Ảnh Banner Chính (Chèn sau)</span>
                        </div>
                    </div>

                    {/* Cột 3: Hai Banner nhỏ (Bên phải) */}
                    <div className="w-full md:w-1/4 flex flex-col gap-4">
                        <div className="w-full flex-1 min-h-[167px] bg-gray-200 rounded-lg flex items-center justify-center border hover:shadow-md transition">
                            <span className="text-gray-500 font-medium text-sm">Ảnh Banner Nhỏ 1</span>
                        </div>
                        <div className="w-full flex-1 min-h-[167px] bg-gray-200 rounded-lg flex items-center justify-center border hover:shadow-md transition">
                            <span className="text-gray-500 font-medium text-sm">Ảnh Banner Nhỏ 2</span>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}