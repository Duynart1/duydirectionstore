import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { CartContent } from "./CartContent";

export const metadata = {
  title: "Giỏ hàng",
  description: "Xem và chỉnh sửa giỏ hàng của bạn.",
};

export default function CartPage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <Breadcrumbs items={[{ label: "Giỏ hàng" }]} />
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Giỏ hàng</h1>
      <CartContent />
    </div>
  );
}
