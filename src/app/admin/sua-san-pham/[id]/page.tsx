"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase/client";

type VariantDraft = {
  id: string; // existing uuid OR local temp id (new:...)
  account_type: string;
  duration: string;
  price: string;
  is_available: boolean;
};

type ProductRow = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
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
  return input
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
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

  const { error: uploadError } = await supabase.storage
    .from("products")
    .upload(path, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type || undefined,
    });

  if (uploadError) {
    console.error("[admin][edit-product] Upload error", {
      message: uploadError.message,
      name: uploadError.name,
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
      path,
    });
    throw uploadError;
  }

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
      setLoading(true);
      setError(null);
      setSuccess(null);

      const { data: product, error: productError } = await supabase
        .from("products")
        .select("id,name,slug,description,image_url")
        .eq("id", productId)
        .single();

      if (ignore) return;
      if (productError) {
        setError(productError.message);
        setLoading(false);
        return;
      }

      const p = product as ProductRow;
      setName(p.name ?? "");
      setSlug(p.slug ?? "");
      setSlugTouched(true);
      setDescription(p.description ?? "");
      setCurrentImageUrl(p.image_url ?? null);

      const { data: variantRows, error: variantsError } = await supabase
        .from("product_variants")
        .select("id,product_id,account_type,duration,price,original_price,is_available")
        .eq("product_id", productId)
        .order("account_type", { ascending: true })
        .order("duration", { ascending: true });

      if (ignore) return;
      if (variantsError) {
        setError(variantsError.message);
        setLoading(false);
        return;
      }

      const vs = ((variantRows ?? []) as VariantRow[]).map((v) => ({
        id: v.id,
        account_type: v.account_type ?? "",
        duration: v.duration ?? "",
        price: String(v.price ?? 0),
        original_price: v.original_price != null ? String(v.original_price) : "",
        is_available: !!v.is_available,
      }));

      setVariants(
        vs.length
          ? vs
          : [{
              id: uid("new:"),
              account_type: "",
              duration: "",
              price: "",
              original_price: "",
              is_available: true,
            }]
      );

      setLoading(false);
    }

    run();
    return () => {
      ignore = true;
    };
  }, [productId]);

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
      {
        id: uid("new:"),
        account_type: "",
        duration: "",
        price: "",
        original_price: "",
        is_available: true,
      },
    ]);
  };

  const handleRemoveVariant = (id: string) => {
    setVariants((prev) => prev.filter((v) => v.id !== id));
  };

  const handleUpdateVariant = (id: string, patch: Partial<VariantDraft>) => {
    setVariants((prev) => prev.map((v) => (v.id === id ? { ...v, ...patch } : v)));
  };

  const canUpdate = useMemo(() => {
    if (!name.trim()) return false;
    if (!slug.trim()) return false;
    const hasAtLeastOneVariant = variants.length > 0;
    if (!hasAtLeastOneVariant) return false;
    const allValid = variants.every((v) => {
      if (!v.account_type.trim()) return false;
      if (!v.duration.trim()) return false;
      const price = Number(v.price);
      return Number.isInteger(price) && price >= 0;
    });
    return allValid;
  }, [name, slug, variants]);

  const handleUpdate = async () => {
    setError(null);
    setSuccess(null);
    setSaving(true);
    try {
      if (!productId) throw new Error("Thiếu id sản phẩm.");
      if (!canUpdate) throw new Error("Vui lòng nhập đầy đủ thông tin trước khi cập nhật.");

      // 1. Lấy dữ liệu form hiện tại
      const nameToSave = name.trim();
      const slugToSave = slug.trim();
      const descriptionToSave = description.trim() || null;

      // 2. Xử lý ảnh: bắt đầu với ảnh cũ
      let finalImageUrl: string | null = currentImageUrl ?? null;

      if (imageFile) {
        try {
          const { publicUrl } = await uploadProductImage(imageFile);
          finalImageUrl = publicUrl;
          setCurrentImageUrl(publicUrl);
        } catch (uploadErr: any) {
          console.error("[admin][edit-product] Upload image failed", uploadErr);
          throw new Error("Upload ảnh thất bại. Vui lòng thử lại.");
        }
      }

      console.log("=== CHUẨN BỊ UPDATE ===");
      console.log("ID Sản phẩm:", productId);
      console.log("Dữ liệu gửi đi:", {
        name: nameToSave,
        slug: slugToSave,
        description: descriptionToSave,
        image_url: finalImageUrl,
      });

      // 3. Cập nhật bảng products (kèm select để kiểm tra kết quả)
      const { data: updatedProduct, error: updateError } = await supabase
        .from("products")
        .update({
          name: nameToSave,
          slug: slugToSave,
          description: descriptionToSave,
          image_url: finalImageUrl,
        })
        .eq("id", productId)
        .select();

      console.log("=== KẾT QUẢ TỪ SUPABASE ===", { updatedProduct, updateError });

      if (updateError) {
        console.error("Lỗi Supabase:", updateError);
        throw new Error("Cập nhật sản phẩm thất bại. Vui lòng xem log để debug.");
      }

      if (!updatedProduct || (Array.isArray(updatedProduct) && updatedProduct.length === 0)) {
        console.error("LỖI: Không cập nhật được dòng nào (Có thể sai ID).");
        throw new Error("Không tìm thấy sản phẩm để cập nhật (sai ID?).");
      }

      // 4. Cập nhật bảng product_variants: xoá hết cũ rồi insert lại từ state
      const normalizedVariants = variants.map((v) => ({
        product_id: productId,
        account_type: v.account_type.trim(),
        duration: v.duration.trim(),
        price: Number(v.price),
        original_price: v.original_price.trim()
          ? Number(v.original_price)
          : null,
        is_available: v.is_available,
      }));

      console.log("[admin][edit-product] Variants payload:", normalizedVariants);

      // Xoá toàn bộ biến thể cũ của sản phẩm
      const { error: deleteError } = await supabase
        .from("product_variants")
        .delete()
        .eq("product_id", productId);
      if (deleteError) {
        console.error("[admin][edit-product] Delete old variants failed", deleteError);
        throw deleteError;
      }

      if (normalizedVariants.length) {
        const { error: insertError } = await supabase
          .from("product_variants")
          .insert(normalizedVariants);
        if (insertError) {
          console.error("[admin][edit-product] Insert variants failed", insertError);
          throw insertError;
        }
      }

      setSuccess("Đã cập nhật sản phẩm thành công.");
      router.push("/admin/san-pham");
    } catch (e: any) {
      setError(e?.message ?? "Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-slate-50">
        <div className="container mx-auto px-4 py-8 max-w-5xl">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 text-slate-600">
            Đang tải dữ liệu sản phẩm...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
              Sửa sản phẩm
            </h1>
            <p className="text-slate-600 mt-1">
              Cập nhật thông tin và biến thể sản phẩm.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/admin/san-pham"
              className="inline-flex items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold border border-slate-200 bg-white hover:bg-slate-50 text-slate-800"
            >
              Quay lại
            </Link>
            <button
              type="button"
              onClick={handleUpdate}
              disabled={saving || !canUpdate}
              className={`inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold transition-all ${
                saving || !canUpdate
                  ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                  : "bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm"
              }`}
            >
              {saving ? "Đang cập nhật..." : "Cập nhật"}
            </button>
          </div>
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

          {/* Ảnh */}
          <section className="rounded-3xl bg-white border border-slate-200 shadow-sm p-5 md:p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Ảnh sản phẩm</h2>

            {(imagePreview || currentImageUrl) && (
              <div className="mb-4 space-y-2">
                <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imagePreview ?? currentImageUrl ?? ""}
                    alt="Ảnh sản phẩm"
                    className="w-full h-56 object-cover"
                  />
                </div>
                <p className="text-xs text-slate-500">
                  {imageFile ? `Ảnh mới: ${imageFile.name} (${formatBytes(imageFile.size)})` : "Ảnh hiện tại"}
                </p>
              </div>
            )}

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
                <div className="py-8 text-center">
                  <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-white border border-slate-200 text-slate-700">
                    <span className="text-xl" aria-hidden>
                      ⬆
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-slate-800">
                    {currentImageUrl ? "Click để thay ảnh" : "Chọn ảnh sản phẩm"}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    hoặc kéo thả ảnh vào đây (PNG/JPG/WebP)
                  </p>
                </div>
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
                Sửa / thêm / xóa biến thể hiện có.
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
                        value={v.original_price ?? ""}
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
            <p className="text-xs text-slate-500">Lưu ý: Giá bán lưu dạng số nguyên (VND).</p>
            <button
              type="button"
              onClick={handleUpdate}
              disabled={saving || !canUpdate}
              className={`inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold transition-all ${
                saving || !canUpdate
                  ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                  : "bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm"
              }`}
            >
              {saving ? "Đang cập nhật..." : "Cập nhật"}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

