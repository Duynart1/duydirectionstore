import Link from "next/link";
import { siteSettings } from "@/data/siteSettings";

export function TopBar() {
  return (
    <div className="bg-slate-800 text-slate-200 text-sm hidden md:block">
      <div className="container mx-auto px-4 py-2 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-4">
          <a href={`tel:${siteSettings.hotline.replace(/\s/g, "")}`} className="hover:text-white transition">
            📞 Hotline: {siteSettings.hotline}
          </a>
          <span className="text-slate-500">|</span>
          <span className="text-slate-400 truncate max-w-[200px]">{siteSettings.address}</span>
        </div>
        <div className="flex items-center gap-4">
          {siteSettings.supportLinks?.map((link) => (
            <Link key={link.url} href={link.url} className="hover:text-white transition">
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
