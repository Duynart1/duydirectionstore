export default function FeaturedBanner() {
    return (
        <section className="py-10 bg-white mt-6">
            <div className="container mx-auto max-w-7xl px-4">
                <h2 className="text-2xl font-bold text-center mb-8 uppercase text-gray-800">Sản phẩm bán chạy</h2>
                <div className="flex flex-col md:flex-row items-center gap-8 bg-gradient-to-r from-blue-50 to-white rounded-2xl p-8">
                    <div className="w-full md:w-1/2">
                        <h3 className="text-red-500 font-semibold mb-2">Nâng cấp Chat GPT Plus chính chủ</h3>
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">Chat GPT Plus là công cụ AI phổ biến nhất hiện nay</h2>
                        <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                            ChatGPT Plus hỗ trợ học tập, làm việc và sáng tạo nội dung hiệu quả. Phiên bản Plus giúp trả lời nhanh hơn, chính xác hơn và sử dụng ổn định trong mọi khung giờ.
                            <br /><br />Shoptaikhoanvn cung cấp dịch vụ nâng cấp ChatGPT Plus chính chủ, giá tốt, an toàn tuyệt đối. Cam kết nâng cấp nhanh, bảo hành trọn đời.
                        </p>
                        <button className="bg-[#1a1e24] text-white px-6 py-3 rounded-md font-semibold hover:bg-gray-800 transition">Mua Tài Khoản ChatGPT Ngay ❯</button>
                    </div>
                    <div className="w-full md:w-1/2 min-h-[300px] bg-gray-200 rounded-xl flex items-center justify-center">
                        <span className="text-gray-500 font-medium">Ảnh minh họa người ngồi máy tính ChatGPT</span>
                    </div>
                </div>
            </div>
        </section>
    );
}