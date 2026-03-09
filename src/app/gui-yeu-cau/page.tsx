import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { RequestForm } from "@/components/RequestForm";

export const metadata = {
  title: "Gửi yêu cầu",
  description: "Gửi yêu cầu mua hàng tới admin qua Zalo hoặc sao chép nội dung.",
};

export default function RequestPage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <Breadcrumbs items={[{ label: "Gửi yêu cầu" }]} />
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Gửi yêu cầu mua hàng</h1>
      <RequestForm />
    </div>
  );
}
