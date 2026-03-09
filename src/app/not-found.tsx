import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-4xl font-bold text-slate-800 mb-2">404</h1>
      <p className="text-slate-600 mb-6">Trang bạn tìm không tồn tại.</p>
      <Link
        href="/"
        className="inline-flex items-center justify-center rounded-lg bg-emerald-600 text-white px-6 py-3 font-semibold hover:bg-emerald-700 transition"
      >
        Về trang chủ
      </Link>
    </div>
  );
}
