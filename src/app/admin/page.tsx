"use client";
import { useState, useMemo, useRef } from "react";
import { supabase } from "@/utils/supabase/client";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

export default function AdminShopeeLayout() {
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState("Giải trí");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [images, setImages] = useState<string[]>([]);

    const [serviceTypes, setServiceTypes] = useState("Nâng cấp chính chủ, Tài khoản dùng chung");
    const [plans, setPlans] = useState("Super, Super Family, Max");
    const [durations, setDurations] = useState("1 Tháng, 6 Tháng, 12 Tháng, 24 Tháng");

    // ĐÃ LOẠI BỎ CHỨC NĂNG CHỌN MÀU TÙY CHỈNH.
    const [commitment, setCommitment] = useState("");

    const fileInputRef = useRef<HTMLInputElement>(null);

    // HÀM TẠO SLUG SEO TỰ ĐỘNG
    const generateSlug = (str: string) => {
        return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[đĐ]/g, "d").replace(/([^0-9a-z-\s])/g, '').replace(/(\s+)/g, '-').replace(/-+/g, '-').replace(/^-+|-+$/g, '');
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;
        const remainingSlots = 9 - images.length;
        const filesToProcess = Array.from(files).slice(0, remainingSlots);
        const base64Promises = filesToProcess.map(file => {
            return new Promise<string>((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result as string);
                reader.readAsDataURL(file);
            });
        });
        const newBase64Images = await Promise.all(base64Promises);
        setImages(prev => [...prev, ...newBase64Images]);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleAddProduct = async () => {
        if (!name || !price) {
            alert("Vui lòng nhập đủ tên và giá!"); return;
        }
        setLoading(true);

        const productSlug = generateSlug(name); // Tự động tạo slug

        // Gói dữ liệu options, loại bỏ các state màu sắc tùy chỉnh.
        const optionsData = {
            services: serviceTypes.split(",").map(s => s.trim()),
            plans: plans.split(",").map(s => s.trim()),
            durations: durations.split(",").map(s => s.trim()),
            commitmentData: { html: commitment } // Chỉ lưu mã HTML
        };

        const { error } = await supabase.from("products").insert([{
            name, slug: productSlug, price: parseInt(price), category,
            image_url: images.join(","), description, options: optionsData
        }]);

        if (error) alert("Lỗi: " + error.message);
        else {
            alert("✅ Đã lưu sản phẩm và áp dụng khung cam kết mới!");
            setName(""); setPrice(""); setImages([]); setDescription(""); setCommitment("");
        }
        setLoading(false);
    };

    const quillModules = useMemo(() => ({
        toolbar: [
            [{ 'header': [1, 2, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['link', 'image', 'video'],
            ['clean']
        ]
    }), []);

    return (
        <div className="bg-[#f6f6f6] min-h-screen pb-24 text-sm text-gray-700 Arial">
            <style dangerouslySetInnerHTML={{
                __html: `
        .ql-editor { font-family: Arial, sans-serif !important; font-size: 15px; }
        .ql-toolbar.ql-snow .ql-picker.ql-header { width: 160px !important; }
      `}} />

            <div className="max-w-[1200px] mx-auto mt-6 px-4 flex flex-col lg:flex-row gap-6">
                <div className="w-full lg:w-[70%] flex flex-col gap-6">

                    <div className="bg-white rounded shadow-sm p-6">
                        <h2 className="text-lg font-medium mb-6">Thông tin cơ bản</h2>
                        <div className="space-y-4">
                            <div className="flex gap-4">
                                <div className="w-1/4 text-right mt-2">Hình ảnh (Max 9)</div>
                                <div className="w-3/4">
                                    <input type="file" multiple accept="image/*" ref={fileInputRef} onChange={handleImageUpload} className="hidden" />
                                    <div className="flex flex-wrap gap-2">
                                        {images.map((img, i) => (
                                            <div key={i} className="relative w-16 h-16">
                                                <img src={img} className="w-full h-full object-cover border rounded" />
                                                <button onClick={() => { const newImg = [...images]; newImg.splice(i, 1); setImages(newImg); }} className="absolute -top-2 -right-2 bg-red-500 text-white w-4 h-4 rounded-full text-xs flex items-center justify-center">x</button>
                                            </div>
                                        ))}
                                        {images.length < 9 && <div onClick={() => fileInputRef.current?.click()} className="w-16 h-16 border-dashed border-red-500 border bg-red-50 flex items-center justify-center cursor-pointer text-red-500">+</div>}
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-1/4 text-right mt-2">Tên SP</div>
                                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Tên sản phẩm..." className="w-3/4 border p-2 rounded outline-none focus:border-teal-500" />
                            </div>
                            <div className="flex gap-4">
                                <div className="w-1/4 text-right mt-2">Danh mục</div>
                                <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-3/4 border p-2 rounded outline-none focus:border-teal-500 bg-white">
                                    <option value="Học tập">Học tập</option><option value="Làm việc">Làm việc</option><option value="Công cụ AI">Công cụ AI</option><option value="Giải trí">Giải trí</option><option value="Đồ họa">Đồ họa</option><option value="Key Win, Office">Key Win, Office</option><option value="Dung lượng">Dung lượng</option><option value="Phần mềm VPN">Phần mềm VPN</option><option value="Diệt Virus">Diệt Virus</option><option value="Phần mềm khác">Phần mềm khác</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded shadow-sm p-6">
                        <h2 className="text-lg font-medium mb-6 text-purple-700">Cấu hình các Gói & Thời hạn</h2>
                        <div className="space-y-4">
                            <div className="flex gap-4"><div className="w-1/4 text-right mt-2 font-bold">Loại dịch vụ</div><input value={serviceTypes} onChange={(e) => setServiceTypes(e.target.value)} placeholder="Ngăn cách dấu phẩy..." className="w-3/4 border p-2 rounded outline-none focus:border-teal-500" /></div>
                            <div className="flex gap-4"><div className="w-1/4 text-right mt-2 font-bold">Các Gói</div><input value={plans} onChange={(e) => setPlans(e.target.value)} placeholder="Ngăn cách dấu phẩy..." className="w-3/4 border p-2 rounded outline-none focus:border-teal-500" /></div>
                            <div className="flex gap-4"><div className="w-1/4 text-right mt-2 font-bold">Thời hạn</div><input value={durations} onChange={(e) => setDurations(e.target.value)} placeholder="Ngăn cách dấu phẩy..." className="w-3/4 border p-2 rounded outline-none focus:border-teal-500" /></div>
                        </div>
                    </div>

                    {/* KHUNG SETUP CAM KẾT (ĐÃ GỌN GÀNG, CHỈ CÒN SOẠN THẢO) */}
                    <div className="bg-white rounded shadow-sm p-6 border-l-4 border-orange-400">
                        <h2 className="text-lg font-medium mb-1 text-orange-600">⚡ Khung Cam Kết & Hỗ Trợ Nhanh</h2>
                        <p className="text-xs text-gray-500 mb-6">Mẹo: Bôi đen TẤT CẢ các dòng và bấm nút "Danh sách (Bullet list)" để tạo dấu ✔ cho toàn bộ chữ thẳng tắp.</p>
                        <ReactQuill theme="snow" value={commitment} onChange={setCommitment} modules={quillModules} className="h-40 mb-10" placeholder="Viết nội dung cam kết vào đây..." />
                    </div>

                    <div className="bg-white rounded shadow-sm p-6">
                        <h2 className="text-lg font-medium mb-4">Mô tả sản phẩm (Chi tiết)</h2>
                        <ReactQuill theme="snow" value={description} onChange={setDescription} modules={quillModules} className="h-64 mb-12" />
                        <div className="flex gap-4 mt-4">
                            <div className="w-1/4 text-right mt-2 font-bold">Giá hiển thị (đ)</div>
                            <input value={price} onChange={(e) => setPrice(e.target.value)} type="number" className="w-3/4 border p-2 rounded outline-none focus:border-teal-500" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="fixed bottom-0 left-0 right-0 bg-white p-4 border-t flex justify-end gap-4 z-50">
                <button onClick={handleAddProduct} disabled={loading} className="px-10 py-2 bg-[#ee4d2d] text-white rounded font-bold shadow-md">
                    {loading ? "Đang lưu..." : "LƯU & HIỂN THỊ"}
                </button>
            </div>
        </div>
    );
}