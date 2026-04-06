"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase/client";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

type VariantDraft = {
  id: string;
  account_type: string;
  duration: string;
  price: string;
  original_price: string;
  is_available: boolean;
};

type ProductRow = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  category?: string;
  options?: any;
};

type VariantRow = {
  id: string;
  product_id: string;
  account_type: string;
  duration: string;
  price: number;
  original_price: number | null;
  is_available: boolean;
};

function slugify(input: string) {
  return input.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
}

function uid(prefix = "") {
  return `${prefix}${Math.random().toString(16).slice(2)}${Date.now().toString(16)}`;
}

function formatBytes(bytes: number) {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const idx = Math.min(units.length - 1, Math.floor(Math.log(bytes) / Math.log(1024)));
  const n = bytes / 1024 ** idx;
  return `${n.toFixed(n >= 10 || idx === 0 ? 0 : 1)} ${units[idx]}`;
}

async function uploadProductImage(file: File) {
  const ext = file.name.split(".").pop()?.toLowerCase() || "png";
  const path = `products/${Date.now()}-${uid()}.${ext}`;

  const { error: uploadError } = await supabase.storage.from("products").upload(path, file, { cacheControl: "3600", upsert: false, contentType: file.type || undefined });
  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from("products").getPublicUrl(path);
  return { publicUrl: data.publicUrl, storagePath: path };
}

export default function AdminEditProductPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const productId = params?.id;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [description, setDescription] = useState("");

  // TÍNH NĂNG MỚI
  const [category, setCategory] = useState("Giải trí");
  const [commitment, setCommitment] = useState("");

  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [variants, setVariants] = useState<VariantDraft[]>([]);

  useMemo(() => {
    if (slugTouched) return null;
    setSlug(slugify(name));
    return null;
  }, [name, slugTouched]);

  useEffect(() => {
    if (!productId) return;
    let ignore = false;

    async function run() {
      setLoading(true); setError(null); setSuccess(null);

      // Đã thêm việc gọi Category và Options từ DB
      const { data: product, error: productError } = await supabase
        .from("products")
        .select("id,name,slug,description,image_url,category,options")
        .eq("id", productId)
        .single();

      if (ignore) return;
      if (productError) { setError(productError.message); setLoading(false); return; }

      const p = product as ProductRow;
      setName(p.name ?? "");
      setSlug(p.slug ?? "");
      setSlugTouched(true);
      setDescription(p.description ?? "");
      setCurrentImageUrl(p.image_url ?? null);

      setCategory(p.category ?? "Giải trí");
      setCommitment(p.options?.commitmentData?.html ?? "");

      const { data: variantRows, error: variantsError } = await supabase
        .from("product_variants")
        .select("id,product_id,account_type,duration,price,original_price,is_available")
        .eq("product_id", productId)
        .order("account_type", { ascending: true })
        .order("duration", { ascending: true });

      if (ignore) return;
      if (variantsError) { setError(variantsError.message); setLoading(false); return; }

      const vs = ((variantRows ?? []) as VariantRow[]).map((v) => ({
        id: v.id,
        account_type: v.account_type ?? "",
        duration: v.duration ?? "",
        price: String(v.price ?? 0),
        original_price: v.original_price != null ? String(v.original_price) : "",
        is_available: !!v.is_available,
      }));

      setVariants(vs.length ? vs : [{ id: uid("new:"), account_type: "", duration: "", price: "", original_price: "", is_available: true }]);
      setLoading(false);
    }
    run();
    return () => { ignore = true; };
  }, [productId]);

  const handlePickImage = (file: File | null) => {
    setError(null); setSuccess(null); setImageFile(file);
    if (!file) { if (imagePreview) URL.revokeObjectURL(imagePreview); setImagePreview(null); return; }
    const url = URL.createObjectURL(file);
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(url);
  };

  const handleAddVariant = () => setVariants((prev) => [...prev, { id: uid("new:"), account_type: "", duration: "", price: "", original_price: "", is_available: true }]);
  const handleRemoveVariant = (id: string) => setVariants((prev) => prev.filter((v) => v.id !== id));
  const handleUpdateVariant = (id: string, patch: Partial<VariantDraft>) => setVariants((prev) => prev.map((v) => (v.id === id ? { ...v, ...patch } : v)));

  const canUpdate = useMemo(() => {
    if (!name.trim() || !slug.trim()) return false;
    const hasAtLeastOneVariant = variants.length > 0;
    if (!hasAtLeastOneVariant) return false;
    return variants.every((v) => {
      if (!v.account_type.trim() || !v.duration.trim()) return false;
      const price = Number(v.price);
      return Number.isInteger(price) && price >= 0;
    });
  }, [name, slug, variants]);

  const handleUpdate = async () => {
    setError(null); setSuccess(null); setSaving(true);
    try {
      if (!productId) throw new Error("Thiếu id sản phẩm.");
      if (!canUpdate) throw new Error("Vui lòng nhập đầy đủ thông tin.");

      const nameToSave = name.trim();
      const slugToSave = slug.trim();
      const descriptionToSave = description.trim() || null;

      let finalImageUrl: string | null = currentImageUrl ?? null;
      if (imageFile) {
        const { publicUrl } = await uploadProductImage(imageFile);
        finalImageUrl = publicUrl;
        setCurrentImageUrl(publicUrl);
      }

      const { data: updatedProduct, error: updateError } = await supabase
        .from("products")
        .update({
          name: nameToSave,
          slug: slugToSave,
          description: descriptionToSave,
          image_url: finalImageUrl,
          category: category,
          options: { commitmentData: { html: commitment } }
        })
        .eq("id", productId)
        .select();

      if (updateError) throw new Error("Cập nhật sản phẩm thất bại.");
      if (!updatedProduct || (Array.isArray(updatedProduct) && updatedProduct.length === 0)) throw new Error("Không tìm thấy sản phẩm.");

      const normalizedVariants = variants.map((v) => ({
        product_id: productId,
        account_type: v.account_type.trim(),
        duration: v.duration.trim(),
        price: Number(v.price),
        original_price: v.original_price.trim() ? Number(v.original_price) : null,
        is_available: v.is_available,
      }));

      const { error: deleteError } = await supabase.from("product_variants").delete().eq("product_id", productId);
      if (deleteError) throw deleteError;

      if (normalizedVariants.length) {
        const { error: insertError } = await supabase.from("product_variants").insert(normalizedVariants);
        if (insertError) throw insertError;
      }

      setSuccess("Đã cập nhật sản phẩm thành công.");
      setTimeout(() => router.push("/admin"), 1000); // Đã sửa trỏ về lại Dashboard chính
    } catch (e: any) {
      setError(e?.message ?? "Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setSaving(false);
    }
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

  if (loading) {
    return <div className="min-h-[calc(100vh-64px)] bg-slate-50"><div className="container mx-auto px-4 py-8 max-w-5xl"><div className="rounded-3xl border border-slate-200 bg-white p-6 text-slate-600">Đang tải dữ liệu sản phẩm...</div></div></div>;
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50">
      <style dangerouslySetInnerHTML={{
        __html: `
        .ql-editor { font-family: inherit !important; font-size: 14px; min-height: 150px; }
        .ql-toolbar.ql-snow .ql-picker.ql-header { width: 160px !important; }
        .ql-container.ql-snow { border-bottom-left-radius: 0.75rem; border-bottom-right-radius: 0.75rem; border-color: #e2e8f0; }
        .ql-toolbar.ql-snow { border-top-left-radius: 0.75rem; border-top-right-radius: 0.75rem; border-color: #e2e8f0; background: #f8fafc; }
        .ql-editor:focus { border-color: #34d399; outline: none; }
      `}} />

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
          <div><h1 className="text-2xl md:text-3xl font-bold text-slate-900">Sửa sản phẩm</h1><p className="text-slate-600 mt-1">Cập nhật thông tin và biến thể sản phẩm.</p></div>
          <div className="flex items-center gap-2">
            <Link href="/admin" className="inline-flex items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold border border-slate-200 bg-white hover:bg-slate-50 text-slate-800">Quay lại</Link>
            <button type="button" onClick={handleUpdate} disabled={saving || !canUpdate} className={`inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold transition-all ${saving || !canUpdate ? "bg-slate-200 text-slate-500 cursor-not-allowed" : "bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm"}`}>
              {saving ? "Đang cập nhật..." : "Cập nhật"}
            </button>
          </div>
        </div>

        {(error || success) && <div className={`mb-6 rounded-2xl border px-4 py-3 text-sm ${error ? "border-red-200 bg-red-50 text-red-800" : "border-emerald-200 bg-emerald-50 text-emerald-800"}`}>{error ?? success}</div>}

        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <div className="flex flex-col gap-6">
            <section className="rounded-3xl bg-white border border-slate-200 shadow-sm p-5 md:p-6">
              <div className="flex items-center justify-between mb-4"><h2 className="text-lg font-bold text-slate-900">Thông tin chung</h2><span className="text-xs font-semibold text-slate-500">* Bắt buộc</span></div>
              <div className="space-y-4">
                <div><label className="block text-sm font-semibold text-slate-800 mb-2">Tên sản phẩm *</label><input value={name} onChange={(e) => { setError(null); setSuccess(null); setName(e.target.value); }} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-400" /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center justify-between mb-2"><label className="block text-sm font-semibold text-slate-800">Slug (đường dẫn) *</label>{!slugTouched && <span className="text-xs text-slate-500">Tự sinh theo tên</span>}</div>
                    <input value={slug} onChange={(e) => { setError(null); setSuccess(null); setSlugTouched(true); setSlug(e.target.value); }} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-400" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-800 mb-2">Danh mục *</label>
                    <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-400">
                      <option value="Học tập">Học tập</option><option value="Làm việc">Làm việc</option><option value="Công cụ AI">Công cụ AI</option><option value="Giải trí">Giải trí</option><option value="Đồ họa">Đồ họa</option><option value="Key Win, Office">Key Win, Office</option><option value="Dung lượng">Dung lượng</option><option value="Phần mềm VPN">Phần mềm VPN</option><option value="Diệt Virus">Diệt Virus</option><option value="Phần mềm khác">Phần mềm khác</option>
                    </select>
                  </div>
                </div>
                <div><label className="block text-sm font-semibold text-slate-800 mb-2">Mô tả</label><ReactQuill theme="snow" value={description} onChange={setDescription} modules={quillModules} placeholder="Mô tả ngắn gọn về sản phẩm..." /></div>
              </div>
            </section>

            <section className="rounded-3xl bg-white border border-slate-200 shadow-sm p-5 md:p-6 border-l-4 border-l-orange-400">
              <h2 className="text-lg font-bold text-orange-600 mb-1">⚡ Khung Cam Kết & Hỗ Trợ</h2>
              <p className="text-xs text-slate-500 mb-4">Bôi đen các dòng và bấm nút "Danh sách (Bullet list)" để tạo dấu ✔ tự động hiển thị trên web.</p>
              <ReactQuill theme="snow" value={commitment} onChange={setCommitment} modules={quillModules} placeholder="Nâng cấp trên tài khoản chính chủ..." />
            </section>
          </div>

          <div>
            <section className="rounded-3xl bg-white border border-slate-200 shadow-sm p-5 md:p-6 sticky top-4">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Ảnh sản phẩm</h2>
              {(imagePreview || currentImageUrl) && (
                <div className="mb-4 space-y-2">
                  <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white"><img src={imagePreview ?? currentImageUrl ?? ""} alt="Ảnh sản phẩm" className="w-full h-56 object-cover" /></div>
                  <p className="text-xs text-slate-500">{imageFile ? `Ảnh mới: ${imageFile.name} (${formatBytes(imageFile.size)})` : "Ảnh hiện tại"}</p>
                </div>
              )}
              <div className="rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50 p-4" onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files?.[0]; if (f) handlePickImage(f); }}>
                <label className="block cursor-pointer">
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0] ?? null; handlePickImage(f); }} />
                  <div className="py-8 text-center"><div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-white border border-slate-200 text-slate-700"><span className="text-xl" aria-hidden>⬆</span></div><p className="text-sm font-semibold text-slate-800">{currentImageUrl ? "Click để thay ảnh" : "Chọn ảnh sản phẩm"}</p><p className="text-xs text-slate-500 mt-1">hoặc kéo thả ảnh vào đây (PNG/JPG/WebP)</p></div>
                </label>
              </div>
            </section>
          </div>
        </div>

        <section className="mt-6 rounded-3xl bg-white border border-slate-200 shadow-sm p-5 md:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div><h2 className="text-lg font-bold text-slate-900">Biến thể sản phẩm</h2><p className="text-sm text-slate-600 mt-1">Sửa / thêm / xóa biến thể hiện có.</p></div>
            <button type="button" onClick={handleAddVariant} className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold border border-slate-200 bg-white hover:bg-slate-50 text-slate-800">+ Thêm biến thể mới</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] border-separate border-spacing-y-3">
              <thead><tr className="text-left text-xs font-semibold text-slate-500"><th className="px-3">Loại tài khoản *</th><th className="px-3">Thời hạn *</th><th className="px-3">Giá gốc</th><th className="px-3">Giá bán *</th><th className="px-3">Còn hàng</th><th className="px-3 w-[84px]"></th></tr></thead>
              <tbody>
                {variants.map((v) => (
                  <tr key={v.id} className="bg-slate-50">
                    <td className="px-3 py-3 rounded-l-2xl"><input value={v.account_type} onChange={(e) => handleUpdateVariant(v.id, { account_type: e.target.value })} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-400" /></td>
                    <td className="px-3 py-3"><input value={v.duration} onChange={(e) => handleUpdateVariant(v.id, { duration: e.target.value })} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-400" /></td>
                    <td className="px-3 py-3"><input type="number" value={v.original_price ?? ""} onChange={(e) => handleUpdateVariant(v.id, { original_price: e.target.value })} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-400" /></td>
                    <td className="px-3 py-3"><input type="number" value={v.price} onChange={(e) => handleUpdateVariant(v.id, { price: e.target.value })} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-400" /></td>
                    <td className="px-3 py-3"><label className="inline-flex items-center gap-2 text-sm text-slate-700 select-none"><input type="checkbox" checked={v.is_available} onChange={(e) => handleUpdateVariant(v.id, { is_available: e.target.checked })} className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-200" /><span>{v.is_available ? "Còn" : "Hết"}</span></label></td>
                    <td className="px-3 py-3 rounded-r-2xl"><button type="button" onClick={() => handleRemoveVariant(v.id)} className="text-sm font-semibold text-red-600 hover:text-red-700">Xóa</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex items-center justify-between gap-4">
            <p className="text-xs text-slate-500">Lưu ý: Giá bán lưu dạng số nguyên (VND).</p>
            <button type="button" onClick={handleUpdate} disabled={saving || !canUpdate} className={`inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold transition-all ${saving || !canUpdate ? "bg-slate-200 text-slate-500 cursor-not-allowed" : "bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm"}`}>
              {saving ? "Đang cập nhật..." : "Cập nhật"}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}