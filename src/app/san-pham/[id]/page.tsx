"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/utils/supabase/client";

export default function ProductDetail() {
    const params = useParams();
    const idOrSlug = params.id as string;

    const [product, setProduct] = useState<any>(null);
    const [selectedService, setSelectedService] = useState("");
    const [selectedPlan, setSelectedPlan] = useState("");
    const [selectedDuration, setSelectedDuration] = useState("");
    const [loading, setLoading] = useState(true);

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
                if (data.options) {
                    if (data.options.services) setSelectedService(data.options.services[0]);
                    if (data.options.plans) setSelectedPlan(data.options.plans[0]);
                    if (data.options.durations) setSelectedDuration(data.options.durations[0]);
                }
            }
            setLoading(false);
        };
        fetchProduct();
    }, [idOrSlug]);

    if (loading) return <div className="p-20 text-center text-xl font-bold text-teal-600">⏳ Đang tải thông tin sản phẩm...</div>;
    if (!product) return <div className="p-20 text-center text-xl font-bold text-red-500">❌ Không tìm thấy sản phẩm này!</div>;

    const commitData = product.options?.commitmentData;

    return (
        <div className="bg-[#f3f4f6] min-h-screen py-10 Arial">

            <style dangerouslySetInnerHTML={{
                __html: `
        /* ĐÃ SỬA: CỐ ĐỊNH GRADIENT CANVA CHO KHUNG CAM KẾT (135deg để chéo) */
        .commitment-box {
           background: linear-gradient(135deg, #fed7aa 0%, #ffffff 50%, #fed7aa 100%) !important;
        }

        /* FIX BACKGROUND TRẮNG KHI COPY PASTE */
        .commitment-box * { background-color: transparent !important; }
        
        /* ĐÃ SỬA: TO CHỮ, CĂN LIST THẲNG TẮP VÀO TRONG */
        .commitment-box ul { list-style: none; padding-left: 0; margin-top: 10px; margin-bottom: 0; }
        .commitment-box ul li { position: relative; padding-left: 28px; margin-bottom: 12px; font-size: 15.5px; color: #374151; line-height: 1.6; }
        .commitment-box ul li::before {
           content: '✔';
           position: absolute;
           left: 0;
           top: 1px;
           color: #6b21a8; /* Cố định màu tím chuẩn image_38.png */
           font-weight: 900;
           font-size: 16px;
        }
        .commitment-box p { margin-bottom: 12px; line-height: 1.6; font-size: 15.5px; }
        .commitment-box p:last-child { margin-bottom: 0; }
        
        .commitment-box a {
           display: inline-block;
           background-color: #2563eb;
           color: white !important;
           padding: 6px 16px;
           border-radius: 20px;
           text-decoration: none;
           font-weight: bold;
           margin-top: 8px;
           transition: background 0.3s;
        }
        .commitment-box a:hover { background-color: #1d4ed8; }
      `}} />

            <div className="max-w-[1200px] mx-auto p-6 bg-white rounded-xl shadow-lg border border-gray-100">
                <div className="flex flex-col md:flex-row gap-10">

                    <div className="w-full md:w-[45%]">
                        <div className="w-full aspect-square bg-gray-50 rounded-xl overflow-hidden border border-gray-200 flex items-center justify-center p-4">
                            {product.image_url ? (
                                <img src={product.image_url.split(",")[0]} className="w-full h-full object-contain" alt={product.name} />
                            ) : (
                                <span className="text-gray-400">Chưa có ảnh</span>
                            )}
                        </div>
                    </div>

                    <div className="w-full md:w-[55%]">
                        <div className="inline-block bg-[#00bfa5] text-white text-xs font-bold px-3 py-1 rounded mb-3 uppercase tracking-wider">
                            {product.category}
                        </div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-4 leading-tight">{product.name}</h1>
                        <div className="text-3xl text-purple-600 font-black mb-6">{product.price?.toLocaleString()} <span className="underline text-xl align-top">đ</span></div>

                        {/* ĐÃ SỬA: KHUNG CAM KẾT HOÀN TOÀN CỐ ĐỊNH, KHÔNG DÙNG INLINE STYLE MÀU SẮC NỮA */}
                        {commitData && commitData.html && commitData.html !== "<p><br></p>" && (
                            <div className="commitment-box border border-orange-100 rounded-2xl p-6 mb-8 shadow-sm">

                                {/* ĐÃ SỬA: TIÊU ĐỀ BADGE NỔI BẬT HƠN NỮA */}
                                <div className="inline-flex items-center gap-2 bg-white text-orange-600 text-[13px] font-bold px-4 py-1.5 rounded-full border border-orange-200 shadow-sm mb-4">
                                    <span className="text-orange-500">⚡</span> Cam kết & Hỗ trợ nhanh
                                </div>

                                <div dangerouslySetInnerHTML={{ __html: commitData.html }}></div>
                            </div>
                        )}

                        {product.options?.services && product.options.services.length > 0 && product.options.services[0] !== "" && (
                            <div className="mb-5"><p className="font-bold mb-3 text-gray-700 text-sm">LOẠI DỊCH VỤ:</p><div className="flex gap-3 flex-wrap">{product.options.services.map((s: string) => (<button key={s} onClick={() => setSelectedService(s)} className={`px-5 py-2.5 border rounded-md text-sm font-medium transition ${selectedService === s ? 'border-purple-600 bg-purple-50 text-purple-700' : 'border-gray-300 text-gray-600 hover:border-purple-400'}`}>{s}</button>))}</div></div>
                        )}

                        {product.options?.plans && product.options.plans.length > 0 && product.options.plans[0] !== "" && (
                            <div className="mb-5"><p className="font-bold mb-3 text-gray-700 text-sm">GÓI ĐĂNG KÝ:</p><div className="flex gap-3 flex-wrap">{product.options.plans.map((p: string) => (<button key={p} onClick={() => setSelectedPlan(p)} className={`px-5 py-2.5 border rounded-md text-sm font-medium transition ${selectedPlan === p ? 'border-purple-600 bg-purple-50 text-purple-700' : 'border-gray-300 text-gray-600 hover:border-purple-400'}`}>{p}</button>))}</div></div>
                        )}

                        {product.options?.durations && product.options.durations.length > 0 && product.options.durations[0] !== "" && (
                            <div className="mb-8"><p className="font-bold mb-3 text-gray-700 text-sm">THỜI HẠN:</p><div className="flex gap-3 flex-wrap">{product.options.durations.map((d: string) => (<button key={d} onClick={() => setSelectedDuration(d)} className={`px-5 py-2.5 border rounded-md text-sm font-medium transition ${selectedDuration === d ? 'border-purple-600 bg-purple-50 text-purple-700' : 'border-gray-300 text-gray-600 hover:border-purple-400'}`}>{d}</button>))}</div></div>
                        )}

                        <div className="flex gap-4">
                            <button className="flex-1 py-4 bg-[#e2e8f0] text-gray-600 font-bold rounded-xl hover:bg-gray-300 transition flex justify-center items-center gap-2">🛒 THÊM VÀO GIỎ</button>
                            <button className="flex-1 py-4 bg-[#ff7f7f] text-white font-bold rounded-xl hover:bg-[#ff6666] transition shadow-md shadow-red-200 flex justify-center items-center gap-2">🚀 MUA NGAY</button>
                        </div>
                    </div>
                </div>

                <div className="mt-16 border-t border-gray-100 pt-10">
                    <h2 className="text-2xl font-bold mb-6 text-gray-800 uppercase text-center">Thông tin chi tiết sản phẩm</h2>
                    <div className="prose max-w-none text-gray-600" dangerouslySetInnerHTML={{ __html: product.description }}></div>
                </div>
            </div>
        </div>
    );
}