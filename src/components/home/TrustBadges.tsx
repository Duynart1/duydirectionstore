export function TrustBadges() {
  const items = [
    { icon: "🚚", title: "Giao nhanh", desc: "Giao tài khoản trong 5–30 phút" },
    { icon: "🛡️", title: "Bảo hành", desc: "Đổi trả trong 24h nếu lỗi" },
    { icon: "💬", title: "Hỗ trợ 24/7", desc: "Zalo, hotline luôn sẵn sàng" },
    { icon: "✅", title: "Chính hãng", desc: "Nguồn uy tín, minh bạch" },
  ];

  return (
    <section className="py-10 bg-white border-y border-slate-200">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {items.map((item) => (
            <div key={item.title} className="flex items-center gap-4">
              <div className="text-3xl">{item.icon}</div>
              <div>
                <h3 className="font-semibold text-slate-800">{item.title}</h3>
                <p className="text-sm text-slate-500">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
