import { fetchSheetProductGroups } from "@/lib/googleSheets";
import { SheetProductVariantSelector } from "@/components/product/SheetProductVariantSelector";

export default async function SheetDemoPage() {
  const groups = await fetchSheetProductGroups();

  // Demo: lấy nhóm đầu tiên trong Google Sheets để hiển thị
  const group = groups[0];

  if (!group) {
    return (
      <div className="container mx-auto px-4 py-6">
        <p className="text-slate-600">
          Chưa có dữ liệu sản phẩm khả dụng trong Google Sheets.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-4">
        {group.title}
      </h1>
      <SheetProductVariantSelector group={group} />
    </div>
  );
}

