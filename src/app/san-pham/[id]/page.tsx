"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase/client";
import Link from "next/link";

export default function ProductDetail() {
    const params = useParams();
    const router = useRouter();
    const idOrSlug = params.id as string;

    const [product, setProduct] = useState<any>(null);
    const [selectedService, setSelectedService] = useState("");
    const [selectedPlan, setSelectedPlan] = useState("");
    const [selectedDuration, setSelectedDuration] = useState("");

    const [quantity, setQuantity] = useState(1);

    const [loading, setLoading] = useState(true);
    const [showToast, setShowToast] = useState(false);

    // MỚI: State bật/tắt Popup Đánh giá
    const [showReviewModal, setShowReviewModal] = useState(false);

    const outOfStockItems = ["Family Gemini Pro", "Gemini Pro + Youtube Premium", "Google AntiGravity Pro"];

    useEffect(() => {
        const fetchProduct = async () => {
            if (!idOrSlug) return;
            const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug);

            let query = supabase.from("products").select("*");
            if (isUUID) query = query.eq("id", idOrSlug);
            else query = query.eq("slug", idOrSlug);

            const { data } = await query.single();
            if (data) {
                setProduct(data);
            }
            setLoading(false);
        };
        fetchProduct();
    }, [idOrSlug]);

    const toggleOption = (current: string, setter: any, value: string) => {
        setter(current === value ? "" : value);
    };

    const hasServices = product?.options?.services?.length > 0 && product.options.services[0] !== "";
    const hasPlans = product?.options?.plans?.length > 0 && product.options.plans[0] !== "";
    const hasDurations = product?.options?.durations?.length > 0 && product.options.durations[0] !== "";

    const isFullySelected =
        (!hasServices || selectedService !== "") &&
        (!hasPlans || selectedPlan !== "") &&
        (!hasDurations || selectedDuration !== "");

    const basePrice = product?.price || 0;
    const maxPrice = basePrice + (basePrice * 0.5);
    const displayPrice = isFullySelected
        ? (basePrice * quantity).toLocaleString() + " đ"
        : `${basePrice.toLocaleString()} đ - ${maxPrice.toLocaleString()} đ`;

    const handleAddToCart = (redirect: boolean = false) => {
        if (!isFullySelected || !product) return;

        const cartItem = {
            id: product.id + (selectedPlan || "") + (selectedDuration || ""),
            name: product.name,
            price: product.price,
            service: selectedService,
            plan: selectedPlan,
            duration: selectedDuration,
            qty: quantity,
            image: product.image_url ? product.image_url.split(",")[0] : ""
        };

        const existingCart = JSON.parse(localStorage.getItem("sk_cart") || "[]");
        const existingItemIndex = existingCart.findIndex((item: any) => item.id === cartItem.id);

        if (existingItemIndex >= 0) {
            existingCart[existingItemIndex].qty += quantity;
        } else {
            existingCart.push(cartItem);
        }

        localStorage.setItem("sk_cart", JSON.stringify(existingCart));

        if (redirect) {
            router.push("/gio-hang");
        } else {
            setShowToast(true);
            setTimeout(() => setShowToast(false), 2500);
        }
    };

    const handleBuyNowDirect = () => {
        if (!isFullySelected || !product) return;

        const options = [selectedService, selectedPlan, selectedDuration].filter(Boolean).join(' | ');
        const optionText = options ? `\n   👉 Phân loại: ${options}` : '';
        const message = `Chào Shop, mình muốn chốt đơn hàng nhanh:\n\n- ${product.name} (x${quantity})\n💰 Thành tiền: ${(product.price * quantity).toLocaleString()}đ${optionText}\n\nShop hỗ trợ cấp tài khoản giúp mình nhé!`;

        navigator.clipboard.writeText(message).then(() => {
            alert("✅ Đã copy thông tin! Khung chat Zalo sẽ mở ra, bạn chỉ cần bấm 'Dán' để gửi shop chốt đơn nhé.");
            window.open("https://zalo.me/0369143082", "_blank");
        });
    };

    if (loading) return <div className="p-20 text-center text-xl font-bold text-teal-600">⏳ Đang tải thông tin sản phẩm...</div>;
    if (!product) return <div className="p-20 text-center text-xl font-bold text-red-500">❌ Không tìm thấy sản phẩm này!</div>;

    const commitData = product.options?.commitmentData;
    const coverImage = product.image_url ? product.image_url.split(",")[0] : "";

    // DỮ LIỆU ĐÁNH GIÁ MẪU (Giao diện giả lập)
    const mockReviews = [
        { id: 1, name: "Thành Nôm", text: "sản phẩm bên sốp tôi mua sử dụng phù hợp cho sinh viên và người làm việc online như chúng tôi", adminReply: "Sốp cảm ơn sự tin yêu của quý khách hàng, mong được quý khách hàng ủng hộ thêm các sản phẩm khác của shop ạ" },
        { id: 2, name: "Bình Béo", text: "tôi mua và sử dụng, trải nghiệm dv tốt Gemini có thể tóm tắt thông tin khá nhanh và dễ hiểu như tôi muốn", adminReply: "Sốp cảm ơn sự tin yêu của quý khách hàng, mong được quý khách hàng ủng hộ thêm các sản phẩm khác của shop ạ" },
        { id: 3, name: "Vỹ Lâm", text: "sau khinh mình mua Gemini bên sốp, Mình mới dùng Gemini một thời gian và thấy khá ổn, trả lời nhanh và dễ hiểu. Sẽ ủng hộ", adminReply: "Sốp cảm ơn sự tin yêu của quý khách hàng, mong được quý khách hàng ủng hộ thêm các sản phẩm khác của shop ạ" }
    ];

    return (
        <div className="bg-[#f3f4f6] min-h-screen py-10 Arial relative pb-32">

            {/* THÔNG BÁO TRƯỢT (TOAST) */}
            <div className={`fixed top-5 left-1/2 -translate-x-1/2 z-[70] transition-all duration-300 ease-out ${showToast ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10 pointer-events-none'}`}>
                <div className="bg-teal-600 text-white px-6 py-3 rounded-full shadow-lg font-medium flex items-center gap-2 border border-teal-500">
                    <span className="text-xl">🛒</span> Đã thêm vào giỏ hàng!
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
        .commitment-box * { background-color: transparent !important; }
        .commitment-box ul { list-style: none; padding-left: 0; margin-top: 10px; margin-bottom: 0; }
        .commitment-box ul li { position: relative; padding-left: 28px; margin-bottom: 12px; font-size: 15.5px; color: #374151; line-height: 1.6; }
        .commitment-box ul li::before { content: '✔'; position: absolute; left: 0; top: 1px; color: #6b21a8; font-weight: 900; font-size: 16px; }
        .commitment-box p { margin-bottom: 12px; line-height: 1.6; font-size: 15.5px; }
        .commitment-box p:last-child { margin-bottom: 0; }
        .commitment-box a { display: inline-block; background-color: #2563eb; color: white !important; padding: 6px 16px; border-radius: 20px; text-decoration: none; font-weight: bold; margin-top: 8px; transition: background 0.3s; }
        .commitment-box a:hover { background-color: #1d4ed8; }
      `}} />

            <div className="max-w-[1200px] mx-auto p-6 bg-white rounded-xl shadow-lg border border-gray-100">
                <div className="flex flex-col md:flex-row gap-10">

                    <div className="w-full md:w-[45%]">
                        <div className="w-full aspect-square bg-gray-50 rounded-xl overflow-hidden border border-gray-200 flex items-center justify-center p-4">
                            {coverImage ?
                                (<img src={coverImage} className="w-full h-full object-contain" alt={product.name} />) :
                                (<span className="text-gray-400">Chưa có ảnh</span>)
                            }
                        </div>
                    </div>

                    <div className="w-full md:w-[55%]">
                        <div className="inline-block bg-[#00bfa5] text-white text-xs font-bold px-3 py-1 rounded mb-3 uppercase tracking-wider">
                            {product.category}
                        </div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-4 leading-tight">{product.name}</h1>
                        <div className="text-3xl text-purple-600 font-black mb-6">{displayPrice}</div>

                        {commitData && commitData.html && commitData.html !== "<p><br></p>" && (
                            <div className="border border-orange-400 bg-gradient-to-br from-orange-100 via-orange-50 to-[#fff8f3] rounded-2xl p-6 pt-5 mb-8 shadow-sm">
                                <div className="inline-flex items-center gap-2 bg-white text-orange-700 text-[13px] font-bold px-4 py-1.5 rounded-full border border-orange-400 shadow-sm mb-4">
                                    <span className="text-orange-500">⚡</span> Cam kết & Hỗ trợ nhanh
                                </div>
                                <div className="commitment-box" dangerouslySetInnerHTML={{ __html: commitData.html }}></div>
                            </div>
                        )}

                        {hasServices && (
                            <div className="mb-5"><p className="font-bold mb-3 text-gray-700 text-sm">LOẠI DỊCH VỤ:</p><div className="flex gap-3 flex-wrap">
                                {product.options.services.map((s: string) => {
                                    const isOutOfStock = outOfStockItems.includes(s);
                                    return (
                                        <button key={s} disabled={isOutOfStock} onClick={() => toggleOption(selectedService, setSelectedService, s)}
                                            className={`relative px-5 py-2.5 border rounded-md text-sm font-medium transition overflow-hidden
                                        ${isOutOfStock ? 'opacity-40 cursor-not-allowed bg-gray-50 border-gray-200 text-gray-400' : selectedService === s ? 'border-purple-600 bg-purple-50 text-purple-700' : 'border-gray-300 text-gray-600 hover:border-purple-400'}`}>
                                            {s}
                                            {isOutOfStock && (
                                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                                    <svg className="w-full h-full text-gray-400 opacity-60" viewBox="0 0 100 100" preserveAspectRatio="none">
                                                        <line x1="0" y1="0" x2="100" y2="100" stroke="currentColor" strokeWidth="2" />
                                                        <line x1="100" y1="0" x2="0" y2="100" stroke="currentColor" strokeWidth="2" />
                                                    </svg>
                                                </div>
                                            )}
                                        </button>
                                    )
                                })}
                            </div></div>
                        )}

                        {hasPlans && (
                            <div className="mb-5"><p className="font-bold mb-3 text-gray-700 text-sm">GÓI ĐĂNG KÝ:</p><div className="flex gap-3 flex-wrap">
                                {product.options.plans.map((p: string) => {
                                    const isOutOfStock = outOfStockItems.includes(p);
                                    return (
                                        <button key={p} disabled={isOutOfStock} onClick={() => toggleOption(selectedPlan, setSelectedPlan, p)}
                                            className={`relative px-5 py-2.5 border rounded-md text-sm font-medium transition overflow-hidden
                                        ${isOutOfStock ? 'opacity-40 cursor-not-allowed bg-gray-50 border-gray-200 text-gray-400' : selectedPlan === p ? 'border-purple-600 bg-purple-50 text-purple-700' : 'border-gray-300 text-gray-600 hover:border-purple-400'}`}>
                                            {p}
                                            {isOutOfStock && (
                                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                                    <svg className="w-full h-full text-gray-400 opacity-60" viewBox="0 0 100 100" preserveAspectRatio="none">
                                                        <line x1="0" y1="0" x2="100" y2="100" stroke="currentColor" strokeWidth="2" />
                                                        <line x1="100" y1="0" x2="0" y2="100" stroke="currentColor" strokeWidth="2" />
                                                    </svg>
                                                </div>
                                            )}
                                        </button>
                                    )
                                })}
                            </div></div>
                        )}

                        {hasDurations && (
                            <div className="mb-6"><p className="font-bold mb-3 text-gray-700 text-sm">THỜI HẠN:</p><div className="flex gap-3 flex-wrap">
                                {product.options.durations.map((d: string) => {
                                    const isOutOfStock = outOfStockItems.includes(d);
                                    return (
                                        <button key={d} disabled={isOutOfStock} onClick={() => toggleOption(selectedDuration, setSelectedDuration, d)}
                                            className={`relative px-5 py-2.5 border rounded-md text-sm font-medium transition overflow-hidden
                                        ${isOutOfStock ? 'opacity-40 cursor-not-allowed bg-gray-50 border-gray-200 text-gray-400' : selectedDuration === d ? 'border-purple-600 bg-purple-50 text-purple-700' : 'border-gray-300 text-gray-600 hover:border-purple-400'}`}>
                                            {d}
                                            {isOutOfStock && (
                                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                                    <svg className="w-full h-full text-gray-400 opacity-60" viewBox="0 0 100 100" preserveAspectRatio="none">
                                                        <line x1="0" y1="0" x2="100" y2="100" stroke="currentColor" strokeWidth="2" />
                                                        <line x1="100" y1="0" x2="0" y2="100" stroke="currentColor" strokeWidth="2" />
                                                    </svg>
                                                </div>
                                            )}
                                        </button>
                                    )
                                })}
                            </div></div>
                        )}

                        <div className="flex items-center gap-4 mb-8">
                            <span className="font-bold text-gray-700 text-sm">SỐ LƯỢNG:</span>
                            <div className="flex items-center border border-gray-300 rounded-md bg-white">
                                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-4 py-2 hover:bg-gray-100 font-bold text-gray-600 transition">-</button>
                                <input type="number" value={quantity} readOnly className="w-14 text-center border-l border-r border-gray-300 py-2 font-semibold text-gray-800 outline-none" />
                                <button onClick={() => setQuantity(q => q + 1)} className="px-4 py-2 hover:bg-gray-100 font-bold text-gray-600 transition">+</button>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button
                                disabled={!isFullySelected}
                                onClick={() => handleAddToCart(false)}
                                className={`flex-1 py-4 font-bold rounded-xl transition flex justify-center items-center gap-2
                                ${isFullySelected ? 'bg-[#e2e8f0] text-gray-700 hover:bg-gray-300 cursor-pointer' : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'}`}
                            >
                                🛒 THÊM VÀO GIỎ {isFullySelected ? '' : '(Chọn loại)'}
                            </button>

                            <button
                                disabled={!isFullySelected}
                                onClick={() => handleAddToCart(true)}
                                className={`flex-1 py-4 font-bold rounded-xl transition flex justify-center items-center gap-2 text-white
                                ${isFullySelected ? 'bg-[#ff7f7f] hover:bg-[#ff6666] shadow-md shadow-red-200 cursor-pointer' : 'bg-gray-300 cursor-not-allowed'}`}
                            >
                                🚀 MUA NGAY
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mt-16 border-t border-gray-100 pt-10">
                    <h2 className="text-2xl font-bold mb-6 text-gray-800 uppercase text-center">Thông tin chi tiết sản phẩm</h2>
                    <div className="prose max-w-none text-gray-600" dangerouslySetInnerHTML={{ __html: product.description }}></div>
                </div>

                {/* --- BẮT ĐẦU PHẦN ĐÁNH GIÁ (MỚI) --- */}
                <div className="mt-16 border-t border-gray-200 pt-10">
                    <h2 className="text-2xl font-bold mb-2 text-[#1e1b4b] border-b pb-2">Đánh giá (9)</h2>
                    <h3 className="font-semibold text-gray-700 mb-6">9 đánh giá cho {product.name}</h3>

                    {/* Bảng tóm tắt đánh giá */}
                    <div className="bg-[#f8fafc] border border-gray-200 rounded-lg p-6 flex flex-col md:flex-row items-center gap-8 mb-10">
                        {/* Cột trái: Điểm số */}
                        <div className="flex flex-col items-center justify-center min-w-[150px]">
                            <div className="text-5xl font-bold text-yellow-500 mb-1">5.00</div>
                            <div className="text-yellow-400 text-lg mb-1">★★★★★</div>
                            <div className="text-sm text-blue-600 hover:underline cursor-pointer">9 đánh giá của khách hàng</div>
                        </div>

                        {/* Cột giữa: Thanh tiến trình */}
                        <div className="flex-1 w-full space-y-2">
                            {[5, 4, 3, 2, 1].map((star) => (
                                <div key={star} className="flex items-center gap-3 text-sm">
                                    <span className="w-4">{star}</span>
                                    <span className="text-gray-600 text-xs">★</span>
                                    <div className="flex-1 h-3 bg-gray-200 rounded-sm overflow-hidden">
                                        <div className={`h-full bg-yellow-400 ${star === 5 ? 'w-full' : 'w-0'}`}></div>
                                    </div>
                                    <span className="w-10 text-blue-600 text-xs font-medium">{star === 5 ? '100%' : '0%'}</span>
                                    <span className="text-gray-500 text-xs w-20">| {star === 5 ? '9' : '0'} đánh giá</span>
                                </div>
                            ))}
                        </div>

                        {/* Cột phải: Nút đánh giá */}
                        <div className="flex flex-col justify-center min-w-[150px]">
                            <button
                                onClick={() => setShowReviewModal(true)}
                                className="bg-[#0ea5e9] hover:bg-blue-600 text-white font-bold py-2.5 px-6 rounded shadow transition"
                            >
                                ĐÁNH GIÁ NGAY
                            </button>
                        </div>
                    </div>

                    {/* Danh sách bình luận (Mockup theo ảnh) */}
                    <div className="space-y-8 mb-8">
                        {mockReviews.map((review) => (
                            <div key={review.id} className="border-b border-gray-100 pb-6 border-dashed">
                                <h4 className="font-bold text-[15px] text-gray-800 mb-1">{review.name}</h4>
                                <div className="text-yellow-400 text-sm mb-2">★★★★★</div>
                                <p className="text-gray-700 text-[15px] mb-2">{review.text}</p>
                                <div className="flex gap-2 text-xs text-blue-600 font-medium mb-4 cursor-pointer">
                                    <span className="hover:underline">Trả lời</span>
                                    <span className="text-gray-400">-</span>
                                    <span className="hover:underline flex items-center gap-1">👍 thích</span>
                                </div>

                                {/* Phản hồi của Admin */}
                                <div className="ml-8 border-l-2 border-gray-200 pl-4">
                                    <div className="flex flex-wrap items-center gap-2 mb-1">
                                        <span className="font-bold text-[14px] text-gray-800">Shoptaikhoan</span>
                                        <span className="text-green-600 text-[12px] flex items-center gap-1">
                                            <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" /></svg>
                                            Đã mua hàng tại Shop Tài Khoản
                                        </span>
                                        <span className="bg-yellow-400 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">QUẢN TRỊ VIÊN</span>
                                    </div>
                                    <p className="text-gray-700 text-[14px] mb-2">{review.adminReply}</p>
                                    <div className="flex gap-2 text-xs text-blue-600 font-medium cursor-pointer">
                                        <span className="hover:underline">Trả lời</span>
                                        <span className="text-gray-400">-</span>
                                        <span className="hover:underline flex items-center gap-1">👍 thích</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Phân trang đánh giá */}
                    <div className="flex gap-2 mb-12">
                        <button className="w-8 h-8 flex items-center justify-center bg-gray-200 text-gray-600 rounded text-sm hover:bg-gray-300">1</button>
                        <button className="w-8 h-8 flex items-center justify-center bg-gray-100 text-gray-600 rounded text-sm hover:bg-gray-200">2</button>
                        <button className="w-8 h-8 flex items-center justify-center bg-gray-100 text-gray-600 rounded text-sm hover:bg-gray-200">3</button>
                        <button className="w-8 h-8 flex items-center justify-center bg-gray-100 text-gray-600 rounded text-sm hover:bg-gray-200">→</button>
                    </div>

                    {/* Khu vực Thảo luận (Hỏi đáp) */}
                    <div className="bg-[#f8fafc] border border-gray-200 rounded-lg p-0 overflow-hidden mb-8">
                        <textarea className="w-full h-24 p-4 text-sm bg-transparent border-b border-gray-200 focus:outline-none resize-none" placeholder="Mời bạn tham gia thảo luận, vui lòng nhập tiếng Việt có dấu."></textarea>
                        <div className="p-3 bg-white flex flex-wrap md:flex-nowrap items-center gap-4">
                            <div className="flex gap-4">
                                <label className="flex items-center gap-1 text-sm font-medium"><input type="radio" name="gender" defaultChecked /> Anh</label>
                                <label className="flex items-center gap-1 text-sm font-medium"><input type="radio" name="gender" /> Chị</label>
                            </div>
                            <input type="text" placeholder="Họ tên (bắt buộc)" className="flex-1 border border-gray-300 rounded px-3 py-1.5 text-sm" />
                            <input type="email" placeholder="Email" className="flex-1 border border-gray-300 rounded px-3 py-1.5 text-sm" />
                            <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold px-6 py-1.5 rounded text-sm transition">GỬI</button>
                        </div>
                    </div>

                    <h3 className="font-bold text-gray-800 border-b pb-2 mb-4">1 bình luận</h3>
                    <div className="border border-gray-200 rounded p-4 flex gap-4 bg-gray-50">
                        <div className="w-10 h-10 bg-gray-300 text-gray-500 font-bold flex items-center justify-center rounded uppercase shrink-0">TV</div>
                        <div className="w-full">
                            <div className="font-bold text-gray-800 text-[14px]">Tuấn Vũ</div>
                            <p className="text-gray-700 text-[14px] mt-1 mb-2">gói Gemini AI pro là gói Google AI plus hiện nay hả shop ?</p>
                            <div className="flex gap-2 text-xs text-blue-600 font-medium mb-3 cursor-pointer">
                                <span className="hover:underline">Trả lời</span>
                                <span className="text-gray-400">-</span>
                                <span className="hover:underline flex items-center gap-1">👍 1 thích</span>
                            </div>

                            <div className="bg-gray-100 p-3 rounded border border-gray-200">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="font-bold text-[13px] text-gray-800">Shoptaikhoan</span>
                                    <span className="bg-yellow-400 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">QUẢN TRỊ VIÊN</span>
                                </div>
                                <p className="text-gray-700 text-[13px] mb-2">Dạ nó là Gói Gemini Pro - Google AI Pro ạ, còn gói Plus là tương đương với gói Google One ạ</p>
                                <div className="flex gap-2 text-xs text-blue-600 font-medium cursor-pointer">
                                    <span className="hover:underline">Trả lời</span>
                                    <span className="text-gray-400">-</span>
                                    <span className="hover:underline flex items-center gap-1">👍 thích</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* --- KẾT THÚC PHẦN ĐÁNH GIÁ --- */}
            </div>

            {/* THANH KHUNG NỔI CHỐT ĐƠN DƯỚI ĐÁY */}
            <div className="fixed bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 w-[95%] max-w-[1000px] bg-white rounded-2xl shadow-[0_15px_40px_-10px_rgba(0,0,0,0.25)] border border-gray-100 z-[60] p-3 md:p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_-10px_rgba(0,0,0,0.3)]">
                <div className="flex items-center justify-between gap-4 px-2">
                    <div className="hidden md:flex items-center gap-4 flex-1">
                        {coverImage ? (
                            <img src={coverImage} className="w-14 h-14 rounded-lg border border-gray-200 object-cover" />
                        ) : (
                            <div className="w-14 h-14 bg-gray-100 rounded-lg border border-gray-200"></div>
                        )}
                        <div>
                            <h4 className="font-bold text-gray-800 line-clamp-1 text-lg">{product.name}</h4>
                            <div className={`text-sm ${isFullySelected ? 'text-gray-500' : 'text-red-500 italic'}`}>
                                {isFullySelected ? [selectedService, selectedPlan, selectedDuration].filter(Boolean).join(" / ") : "Vui lòng chọn đầy đủ phân loại..."}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between w-full md:w-auto md:justify-end gap-6 flex-1 md:flex-none">
                        <div className="text-right">
                            <div className="text-2xl font-black text-[#e30019]">{displayPrice}</div>
                        </div>
                        <button
                            disabled={!isFullySelected}
                            onClick={handleBuyNowDirect}
                            className={`px-8 py-3.5 rounded-lg font-bold text-white text-lg flex items-center justify-center transition-all whitespace-nowrap
                            ${isFullySelected ? 'bg-[#e30019] hover:bg-red-700 shadow-lg shadow-red-200 cursor-pointer' : 'bg-gray-300 cursor-not-allowed'}`}
                        >
                            Mua Ngay
                        </button>
                    </div>
                </div>
            </div>

            {/* --- POPUP (MODAL) VIẾT ĐÁNH GIÁ --- */}
            {showReviewModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4">
                    <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in-up">
                        {/* Header Modal */}
                        <div className="flex justify-between items-center p-4 border-b border-gray-100">
                            <h3 className="font-bold text-gray-800 text-lg">Đánh giá {product.name}</h3>
                            <button
                                onClick={() => setShowReviewModal(false)}
                                className="text-gray-400 hover:text-red-500 transition text-2xl leading-none"
                            >
                                &times;
                            </button>
                        </div>

                        {/* Body Modal */}
                        <div className="p-6">
                            <textarea
                                className="w-full h-24 border border-gray-300 rounded p-3 text-sm focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 mb-3 resize-none"
                                placeholder="Mời bạn chia sẻ thêm một số cảm nhận..."
                            ></textarea>

                            <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-4">
                                <button className="text-blue-500 font-medium text-sm flex items-center gap-1 hover:underline">
                                    📷 Gửi ảnh thực tế
                                </button>
                                <span className="text-gray-400 text-xs">0 ký tự (Tối thiểu 10)</span>
                            </div>

                            <div className="flex items-center gap-4 mb-6">
                                <span className="text-sm font-bold text-gray-800 w-24 leading-tight">Bạn cảm thấy thế nào về sản phẩm? <br /><span className="text-xs font-normal text-gray-500">(Chọn sao)</span></span>
                                <div className="flex flex-1 justify-between text-center">
                                    {['Rất tệ', 'Tệ', 'Bình thường', 'Tốt', 'Rất tốt'].map((label, idx) => (
                                        <div key={idx} className="flex flex-col items-center cursor-pointer group">
                                            <span className="text-2xl text-yellow-400 group-hover:scale-110 transition-transform">★</span>
                                            <span className="text-[10px] text-gray-500 mt-1">{label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex gap-3 mb-6">
                                <input type="text" placeholder="Họ tên (bắt buộc)" className="flex-1 border border-gray-300 rounded p-2 text-sm focus:outline-none focus:border-blue-400" />
                                <input type="text" placeholder="Số điện thoại (Bắt buộc)" className="flex-1 border border-gray-300 rounded p-2 text-sm focus:outline-none focus:border-blue-400" />
                                <input type="email" placeholder="Email" className="flex-1 border border-gray-300 rounded p-2 text-sm focus:outline-none focus:border-blue-400" />
                            </div>

                            <div className="text-center">
                                <button className="bg-[#0ea5e9] hover:bg-blue-600 text-white font-bold py-2.5 px-8 rounded shadow transition">
                                    GỬI ĐÁNH GIÁ
                                </button>
                            </div>
                        </div>

                        {/* Footer Modal với Link Chính sách */}
                        <div className="bg-gray-50 p-4 border-t border-gray-100 text-[12px] text-gray-600 text-center">
                            <span className="underline">Lưu ý:</span> để đánh giá được phê duyệt, vui lòng tham khảo{' '}
                            <Link href="/chinh-sach-doi-tra" className="text-blue-500 hover:underline">
                                Chính Sách Đổi Trả, Hoàn Tiền & Bảo Hành Tại Shop Tài Khoản
                            </Link>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}