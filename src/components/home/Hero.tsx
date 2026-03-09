import Link from "next/link";

export function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-emerald-700 to-emerald-900 text-white overflow-hidden">
      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        <div className="max-w-2xl">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
            Sản phẩm số chính hãng
            <br />
            Giao nhanh – Bảo hành tận tâm
          </h1>
          <p className="text-lg text-emerald-100 mb-8">
            Tài khoản giải trí, phần mềm, khóa học với giá tốt. Chọn sản phẩm, gửi yêu cầu, admin hỗ trợ 24/7.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/san-pham"
              className="inline-flex items-center justify-center rounded-lg bg-white text-emerald-800 px-6 py-3 font-semibold hover:bg-emerald-50 transition shadow-lg"
            >
              Xem sản phẩm
            </Link>
            <Link
              href="/lien-he"
              className="inline-flex items-center justify-center rounded-lg border-2 border-white text-white px-6 py-3 font-semibold hover:bg-white/10 transition"
            >
              Liên hệ
            </Link>
          </div>
        </div>
      </div>
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full -translate-x-1/2 translate-y-1/2" />
        <div className="absolute top-0 right-1/4 w-64 h-64 bg-white rounded-full translate-y-1/2" />
      </div>
    </section>
  );
}
