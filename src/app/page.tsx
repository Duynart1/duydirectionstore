import Hero from "@/components/Hero";
import FlashSale from "@/components/FlashSale";
import BestSellers from "@/components/BestSellers";
import ProductSection from "@/components/ProductSection"; // Đã import khuôn đúc
import FeaturedBanner from "@/components/FeaturedBanner";
import NewsAndFooter from "@/components/NewsAndFooter";

export default function Home() {
  return (
    <div className="bg-[#f3f4f6] min-h-screen">
      <Hero />
      <FlashSale />
      <BestSellers />

      {/* KHU VỰC 1: HỌC TẬP / LÀM VIỆC */}
      <ProductSection
        title="Học tập / Làm việc"
        subtitle="Học Tập - Công việc - Đồ họa"
        categories={["Học tập", "Làm việc", "Đồ họa"]}
      />

      {/* KHU VỰC 2: CÔNG CỤ AI */}
      <ProductSection
        title="Công cụ, Tài khoản AI"
        subtitle="Các công cụ AI mạnh mẽ nhất hiện nay với giá ưu đãi"
        categories={["Công cụ AI"]}
      />

      {/* KHU VỰC 3: GIẢI TRÍ */}
      <ProductSection
        title="Giải trí nghe nhạc"
        subtitle="Giải trí thả ga, không lo về giá"
        categories={["Giải trí"]}
      />

      {/* KHU VỰC 4: BẢO MẬT & BẢN QUYỀN */}
      <ProductSection
        title="Phần mềm Bản quyền & VPN"
        subtitle="Bảo mật an toàn, làm việc hiệu quả"
        categories={["Key Win, Office", "Phần mềm VPN", "Diệt Virus", "Dung lượng", "Phần mềm khác"]}
      />

      <FeaturedBanner />
      <NewsAndFooter />
    </div>
  );
}