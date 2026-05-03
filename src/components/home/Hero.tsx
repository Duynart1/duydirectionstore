"use client";
import Link from "next/link";

export default function Hero() {
  // Đã chuyển icon thành dạng hàm () => <svg...> để React render chuẩn xác 100%
  const categoriesWithIcons = [
    { name: "Giải trí", slug: "giai-tri", icon: () => <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M21.58 7.19c-.23-1.42-1.46-2.5-2.92-2.5H5.34c-1.46 0-2.69 1.08-2.92 2.5L1.05 15.61c-.13.8.14 1.62.72 2.21.58.59 1.39.88 2.21.78l3.14-.35 2.1 2.1c.39.39 1.02.39 1.41 0l1.41-1.41h3.92l1.41 1.41c.39.39 1.02.39 1.41 0l2.1-2.1 3.14.35c.81.09 1.63-.19 2.21-.78.58-.59.85-1.41.72-2.21l-1.37-8.42zM9 11H7v2H5v-2H3V9h2V7h2v2h2v2zm6-2c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm2 3c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z" /></svg> },
    { name: "Làm việc", slug: "lam-viec", icon: () => <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M20 6h-4V4c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zM10 4h4v2h-4V4zm10 15H4V8h16v11z" /></svg> },
    { name: "Học tập", slug: "hoc-tap", icon: () => <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72l5 2.73 5-2.73v3.72z" /></svg> },
    { name: "Công cụ AI", slug: "cong-cu-ai", icon: () => <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M21 11c0-1.1-.9-2-2-2h-1V6c0-1.1-.9-2-2-2h-2V3h-4v1H8c-1.1 0-2 .9-2 2v3H5c-1.1 0-2 .9-2 2v2c0 1.1.9 2 2 2h1v3c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2v-3h1c1.1 0 2-.9 2-2v-2zm-5 4H8V8h8v7zm-5-5h2v2h-2zm-3 0h2v2H8z" /></svg> },
    { name: "Đồ họa", slug: "do-hoa", icon: () => <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.49 2 2 6.49 2 12s4.49 10 10 10c1.38 0 2.5-1.12 2.5-2.5 0-.61-.23-1.21-.64-1.67-.08-.09-.13-.21-.13-.33 0-.28.22-.5.5-.5H16c3.31 0 6-2.69 6-6 0-4.96-4.49-9-10-9zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 8 6.5 8 8 8.67 8 9.5 7.33 11 6.5 11zm3-4C8.67 7 8 6.33 8 5.5S8.67 4 9.5 4 11 4.67 11 5.5 10.33 7 9.5 7zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 4 14.5 4 16 4.67 16 5.5 15.33 7 14.5 7zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 8 17.5 8 19 8.67 19 9.5 18.33 11 17.5 11z" /></svg> },
    { name: "Key Win, Office", slug: "key-win-office", icon: () => <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M12.65 10A5.99 5.99 0 007 6c-3.31 0-6 2.69-6 6s2.69 6 6 6a5.99 5.99 0 005.65-4H17v4h4v-4h2v-4H12.65zM7 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" /></svg> },
    { name: "Dung lượng", slug: "dung-luong", icon: () => <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M19.35 10.04A7.49 7.49 0 0012 4C9.11 4 6.6 5.64 5.35 8.04A5.994 5.994 0 000 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" /></svg> },
    { name: "Phần mềm VPN", slug: "phan-mem-vpn", icon: () => <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" /></svg> },
    { name: "Diệt Virus", slug: "diet-virus", icon: () => <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M20 8h-2.81c-.45-.78-1.07-1.45-1.82-1.96L17 4.41 15.59 3l-2.17 2.17C12.96 5.06 12.49 5 12 5c-.49 0-.96.06-1.41.17L8.41 3 7 4.41l1.62 1.63C7.88 6.55 7.26 7.22 6.81 8H4v2h2.09c-.05.33-.09.66-.09 1v1H4v2h2v1c0 .34.04.67.09 1H4v2h2.81c1.04 1.79 2.97 3 5.19 3s4.15-1.21 5.19-3H20v-2h-2.09c.05-.33.09-.66.09-1v-1h2v-2h-2v-1c0-.34-.04-.67-.09-1H20V8zm-6 8h-4v-2h4v2zm0-4h-4v-2h4v2z" /></svg> },
    { name: "Phần mềm khác", slug: "phan-mem-khac", icon: () => <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M21 16.5c0 .38-.21.71-.53.88l-7.9 4.44c-.16.12-.36.18-.57.18-.21 0-.41-.06-.57-.18l-7.9-4.44A.991.991 0 013 16.5v-9c0-.38.21-.71.53-.88l7.9-4.44c.16-.12.36-.18.57-.18.21 0 .41.06.57.18l7.9 4.44c.32.17.53.5.53.88v9zM12 4.15L6.04 7.5 12 10.85l5.96-3.35L12 4.15zM5 15.91l6 3.38v-6.71L5 9.21v6.7zM19 15.91v-6.7l-6 3.38v6.71l6-3.38z" /></svg> }
  ];

  return (
    <section className="bg-[#f3f4f6] pt-6 pb-10">
      <div className="container mx-auto max-w-[1200px] px-4">
        <div className="flex flex-col md:flex-row gap-4">

          {/* CỘT TRÁI: MENU DANH MỤC */}
          <div className="w-full md:w-[250px] shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden h-fit">
              <ul className="py-1.5">
                {categoriesWithIcons.map((cat, index) => (
                  <li
                    key={cat.slug}
                    className={index !== categoriesWithIcons.length - 1 ? "border-b border-gray-50" : ""}
                  >
                    <Link
                      href={`/danh-muc/${cat.slug}`}
                      className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50 text-gray-700 hover:text-teal-600 transition group"
                    >
                      {/* ĐÃ THÊM: shrink-0 và w-5 h-5 để đảm bảo icon có không gian cứng, không bị móp */}
                      <div className="text-gray-500 group-hover:text-teal-600 transition flex items-center justify-center shrink-0 w-5 h-5">
                        {cat.icon()}
                      </div>
                      <span className="font-medium text-[14px]">{cat.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* CỘT GIỮA: BANNER CHÍNH */}
          <div className="flex-1 flex flex-col gap-4">
            <div className="w-full h-full min-h-[300px] md:min-h-[420px] bg-gray-200 rounded-xl border border-gray-300 flex items-center justify-center overflow-hidden relative shadow-sm">
              <span className="text-gray-500 font-medium">Ảnh Banner Chính (Chèn sau)</span>
            </div>
          </div>

          {/* CỘT PHẢI: BANNER NHỎ */}
          <div className="w-full md:w-[260px] shrink-0 flex flex-col gap-4">
            <div className="w-full h-[200px] bg-gray-200 rounded-xl border border-gray-300 flex items-center justify-center overflow-hidden shadow-sm">
              <span className="text-gray-500 font-medium text-sm">Ảnh Banner Nhỏ 1</span>
            </div>
            <div className="w-full h-[200px] bg-gray-200 rounded-xl border border-gray-300 flex items-center justify-center overflow-hidden shadow-sm">
              <span className="text-gray-500 font-medium text-sm">Ảnh Banner Nhỏ 2</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}