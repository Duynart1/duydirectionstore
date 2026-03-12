"use client";

import { useMemo, useState } from "react";
import { supabase } from "@/utils/supabase/client";

type VariantDraft = {
  id: string;
  account_type: string;
  duration: string;
  price: string; // keep as string for input control
  original_price: string;
  is_available: boolean;
};

function slugify(input: string) {
  return input
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

function uid() {
  return Math.random().toString(16).slice(2) + Date.now().toString(16);
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

  const { error: uploadError } = await supabase.storage
    .from("products")
    .upload(path, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type || undefined,
    });

  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from("products").getPublicUrl(path);
  return { publicUrl: data.publicUrl, storagePath: path };
}

export default function AdminAddProductPage() {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [description, setDescription] = useState("");

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [variants, setVariants] = useState<VariantDraft[]>([
    {
      id: uid(),
      account_type: "",
      duration: "",
      price: "",
      original_price: "",
      is_available: true,
    },
  ]);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useMemo(() => {
    if (slugTouched) return null;
    setSlug(slugify(name));
    return null;
  }, [name, slugTouched]);

  const canSave = useMemo(() => {
    if (!name.trim()) return false;
    if (!slug.trim()) return false;
    if (!imageFile) return false;
    const hasAtLeastOneVariant = variants.length > 0;
    if (!hasAtLeastOneVariant) return false;
    const allValid = variants.every((v) => {
      if (!v.account_type.trim()) return false;
      if (!v.duration.trim()) return false;
      const price = Number(v.price);
      return Number.isInteger(price) && price >= 0;
    });
    return allValid;
  }, [name, slug, imageFile, variants]);

  const handlePickImage = (file: File | null) => {
    setError(null);
    setSuccess(null);
    setImageFile(file);
    if (!file) {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
      setImagePreview(null);
      return;
    }
    const url = URL.createObjectURL(file);
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(url);
  };

  const handleAddVariant = () => {
    setVariants((prev) => [
      ...prev,
      { id: uid(), account_type: "", duration: "", price: "", is_available: true },
    ]);
  };

  const handleRemoveVariant = (id: string) => {
    setVariants((prev) => prev.filter((v) => v.id !== id));
  };

  const handleUpdateVariant = (id: string, patch: Partial<VariantDraft>) => {
    setVariants((prev) => prev.map((v) => (v.id === id ? { ...v, ...patch } : v)));
  };

  const resetForm = () => {
    setName("");
    setSlug("");
    setSlugTouched(false);
    setDescription("");
    handlePickImage(null);
    setVariants([
      { id: uid(), account_type: "", duration: "", price: "", original_price: "", is_available: true },
    ]);
  };

  const handleSave = async () => {
    setError(null);
    setSuccess(null);
    setSaving(true);
    try {
      if (!canSave) throw new Error("Vui lòng nhập đầy đủ thông tin trước khi lưu.");
      if (!imageFile) throw new Error("Vui lòng chọn ảnh sản phẩm.");

      // Step 1: Upload image
      const { publicUrl } = await uploadProductImage(imageFile);

      // Step 2: Insert product
      const { data: insertedProduct, error: productError } = await supabase
        .from("products")
        .insert({
          name: name.trim(),
          slug: slug.trim(),
          description: description.trim() || null,
          image_url: publicUrl,
        })
        .select("id")
        .single();

      if (productError) throw productError;
      const productId = insertedProduct.id as string;

      // Step 3: Insert variants
      const payload = variants.map((v) => ({
        product_id: productId,
        account_type: v.account_type.trim(),
        duration: v.duration.trim(),
        price: Number(v.price),
        original_price: v.original_price.trim()
          ? Number(v.original_price)
          : null,
        is_available: v.is_available,
      }));

      const { error: variantsError } = await supabase.from("product_variants").insert(payload);
      if (variantsError) throw variantsError;

      setSuccess("Đã lưu sản phẩm thành công.");
      resetForm();
    } catch (e: any) {
      setError(e?.message ?? "Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="flex items-start justify-between gap-6 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
              Thêm sản phẩm mới
            </h1>
            <p className="text-slate-600 mt-1">
              Tạo sản phẩm và biến thể, upload ảnh lên Supabase Storage.
            </p>
          </div>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || !canSave}
            className={`inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold transition-all ${
              saving || !canSave
                ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                : "bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm"
            }`}
          >
            {saving ? "Đang lưu..." : "Lưu sản phẩm"}
          </button>
        </div>

        {(error || success) && (
          <div
            className={`mb-6 rounded-2xl border px-4 py-3 text-sm ${
              error
                ? "border-red-200 bg-red-50 text-red-800"
                : "border-emerald-200 bg-emerald-50 text-emerald-800"
            }`}
          >
            {error ?? success}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          {/* Thông tin chung */}
          <section className="rounded-3xl bg-white border border-slate-200 shadow-sm p-5 md:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900">Thông tin chung</h2>
              <span className="text-xs font-semibold text-slate-500">
                * Bắt buộc
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-2">
                  Tên sản phẩm *
                </label>
                <input
                  value={name}
                  onChange={(e) => {
                    setError(null);
                    setSuccess(null);
                    setName(e.target.value);
                  }}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-400"
                  placeholder="Ví dụ: Netflix Premium 4K"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-semibold text-slate-800">
                    Slug (đường dẫn) *
                  </label>
                  {!slugTouched && (
                    <span className="text-xs text-slate-500">
                      Tự sinh theo tên
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 shrink-0">
                    /san-pham/
                  </span>
                  <input
                    value={slug}
                    onChange={(e) => {
                      setError(null);
                      setSuccess(null);
                      setSlugTouched(true);
                      setSlug(e.target.value);
                    }}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-400"
                    placeholder="netflix-premium-4k"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-2">
                  Mô tả
                </label>
                <textarea
                  value={description}
                  onChange={(e) => {
                    setError(null);
                    setSuccess(null);
                    setDescription(e.target.value);
                  }}
                  rows={6}
                  className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-400"
                  placeholder="Mô tả ngắn gọn về sản phẩm..."
                />
              </div>
            </div>
          </section>

          {/* Upload ảnh */}
          <section className="rounded-3xl bg-white border border-slate-200 shadow-sm p-5 md:p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Ảnh sản phẩm *</h2>

            <div
              className="rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50 p-4"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const f = e.dataTransfer.files?.[0];
                if (f) handlePickImage(f);
              }}
            >
              <label className="block cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0] ?? null;
                    handlePickImage(f);
                  }}
                />

                {imagePreview ? (
                  <div className="space-y-3">
                    <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-56 object-cover"
                      />
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-600">
                      <span className="truncate">{imageFile?.name}</span>
                      <span className="shrink-0 ml-2">{formatBytes(imageFile?.size ?? 0)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-700">
                        Click để đổi ảnh
                      </span>
                      <span className="text-xs text-slate-500">hoặc kéo thả</span>
                    </div>
                  </div>
                ) : (
                  <div className="py-10 text-center">
                    <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-white border border-slate-200 text-slate-700">
                      <span className="text-xl" aria-hidden>
                        ⬆
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-slate-800">
                      Kéo thả ảnh vào đây
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      hoặc click để chọn file (PNG/JPG/WebP)
                    </p>
                  </div>
                )}
              </label>
            </div>
          </section>
        </div>

        {/* Biến thể */}
        <section className="mt-6 rounded-3xl bg-white border border-slate-200 shadow-sm p-5 md:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Biến thể sản phẩm</h2>
              <p className="text-sm text-slate-600 mt-1">
                Mỗi biến thể tương ứng 1 dòng trong bảng <span className="font-semibold">product_variants</span>.
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddVariant}
              className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold border border-slate-200 bg-white hover:bg-slate-50 text-slate-800"
            >
              + Thêm biến thể mới
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] border-separate border-spacing-y-3">
              <thead>
                <tr className="text-left text-xs font-semibold text-slate-500">
                  <th className="px-3">Loại tài khoản *</th>
                  <th className="px-3">Thời hạn *</th>
                  <th className="px-3">Giá gốc</th>
                  <th className="px-3">Giá bán *</th>
                  <th className="px-3">Còn hàng</th>
                  <th className="px-3 w-[84px]"></th>
                </tr>
              </thead>
              <tbody>
                {variants.map((v) => (
                  <tr key={v.id} className="bg-slate-50">
                    <td className="px-3 py-3 rounded-l-2xl">
                      <input
                        value={v.account_type}
                        onChange={(e) => handleUpdateVariant(v.id, { account_type: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-400"
                        placeholder="Ví dụ: Dùng chung / Dùng riêng"
                      />
                    </td>
                    <td className="px-3 py-3">
                      <input
                        value={v.duration}
                        onChange={(e) => handleUpdateVariant(v.id, { duration: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-400"
                        placeholder="Ví dụ: 1 tháng / 6 tháng"
                      />
                    </td>
                    <td className="px-3 py-3">
                      <input
                        type="number"
                        inputMode="numeric"
                        value={v.original_price}
                        onChange={(e) =>
                          handleUpdateVariant(v.id, { original_price: e.target.value })
                        }
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-400"
                        placeholder="80000"
                        min={0}
                      />
                    </td>
                    <td className="px-3 py-3">
                      <input
                        type="number"
                        inputMode="numeric"
                        value={v.price}
                        onChange={(e) => handleUpdateVariant(v.id, { price: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-400"
                        placeholder="65000"
                        min={0}
                      />
                    </td>
                    <td className="px-3 py-3">
                      <label className="inline-flex items-center gap-2 text-sm text-slate-700 select-none">
                        <input
                          type="checkbox"
                          checked={v.is_available}
                          onChange={(e) =>
                            handleUpdateVariant(v.id, { is_available: e.target.checked })
                          }
                          className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-200"
                        />
                        <span>{v.is_available ? "Còn" : "Hết"}</span>
                      </label>
                    </td>
                    <td className="px-3 py-3 rounded-r-2xl">
                      <button
                        type="button"
                        onClick={() => handleRemoveVariant(v.id)}
                        className="text-sm font-semibold text-red-600 hover:text-red-700"
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex items-center justify-between gap-4">
            <p className="text-xs text-slate-500">
              Lưu ý: Giá bán lưu dạng số nguyên (VND).
            </p>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving || !canSave}
              className={`inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold transition-all ${
                saving || !canSave
                  ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                  : "bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm"
              }`}
            >
              {saving ? "Đang lưu..." : "Lưu sản phẩm"}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

