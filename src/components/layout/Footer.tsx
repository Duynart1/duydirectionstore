import Link from "next/link";
import { siteSettings } from "@/data/siteSettings";
import { getAllPolicies } from "@/data/policies";

export function Footer() {
  const policies = getAllPolicies();

  return (
    <footer className="bg-slate-800 text-slate-300">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="font-semibold text-white text-lg mb-3">{siteSettings.siteName}</h3>
            <p className="text-sm mb-2">Hotline: {siteSettings.hotline}</p>
            <p className="text-sm mb-2">{siteSettings.address}</p>
            <p className="text-sm">Email: {siteSettings.email}</p>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-3">Liên kết</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/gioi-thieu" className="hover:text-white transition">Giới thiệu</Link>
              </li>
              <li>
                <Link href="/san-pham" className="hover:text-white transition">Sản phẩm</Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-white transition">Blog</Link>
              </li>
              <li>
                <Link href="/lien-he" className="hover:text-white transition">Liên hệ</Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white transition">FAQ</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-3">Chính sách</h3>
            <ul className="space-y-2 text-sm">
              {policies.map((p) => (
                <li key={p.id}>
                  <Link href={`/chinh-sach/${p.slug}`} className="hover:text-white transition">
                    {p.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-3">Hỗ trợ</h3>
            <p className="text-sm mb-2">Zalo: {siteSettings.zalo}</p>
            <div className="flex gap-2 mt-2">
              {siteSettings.socialLinks?.map((s) => (
                <a
                  key={s.url}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-white transition"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-slate-700 mt-8 pt-6 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} {siteSettings.siteName}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
