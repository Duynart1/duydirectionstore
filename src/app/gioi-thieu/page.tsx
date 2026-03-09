import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { siteSettings } from "@/data/siteSettings";

export const metadata = {
  title: "Giới thiệu",
  description: `Giới thiệu về ${siteSettings.siteName} - cửa hàng sản phẩm số uy tín.`,
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-6 max-w-3xl">
      <Breadcrumbs items={[{ label: "Giới thiệu" }]} />
      <h1 className="text-3xl font-bold text-slate-800 mb-6">Giới thiệu</h1>
      <div className="prose prose-slate max-w-none space-y-4">
        <p>
          <strong>{siteSettings.siteName}</strong> là nơi cung cấp sản phẩm số uy tín: tài khoản giải trí
          (Netflix, Spotify, YouTube Premium...), tài khoản phần mềm (Microsoft 365, Adobe...), và khóa học
          trực tuyến (Udemy, Coursera...).
        </p>
        <p>
          Chúng tôi cam kết giao hàng nhanh, bảo hành rõ ràng và hỗ trợ khách hàng tận tâm. Bạn chọn sản phẩm,
          thêm vào giỏ, gửi yêu cầu qua Zalo hoặc email — admin sẽ liên hệ và hướng dẫn thanh toán chuyển khoản,
          sau đó giao tài khoản trong thời gian cam kết.
        </p>
        <p>
          Mọi thắc mắc vui lòng liên hệ hotline <strong>{siteSettings.hotline}</strong> hoặc Zalo{" "}
          <strong>{siteSettings.zalo}</strong>.
        </p>
      </div>
    </div>
  );
}
