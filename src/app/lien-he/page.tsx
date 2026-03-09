import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { siteSettings } from "@/data/siteSettings";

export const metadata = {
  title: "Liên hệ",
  description: `Liên hệ ${siteSettings.siteName} - Hotline, Zalo, Email.`,
};

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-6 max-w-2xl">
      <Breadcrumbs items={[{ label: "Liên hệ" }]} />
      <h1 className="text-3xl font-bold text-slate-800 mb-6">Liên hệ</h1>
      <div className="space-y-6 rounded-xl border border-slate-200 bg-slate-50 p-6">
        <div>
          <h3 className="font-semibold text-slate-800 mb-1">Hotline</h3>
          <a
            href={`tel:${siteSettings.hotline.replace(/\s/g, "")}`}
            className="text-emerald-600 font-medium hover:underline"
          >
            {siteSettings.hotline}
          </a>
        </div>
        <div>
          <h3 className="font-semibold text-slate-800 mb-1">Zalo</h3>
          <a
            href={`https://zalo.me/${siteSettings.zalo.replace(/\D/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-600 font-medium hover:underline"
          >
            {siteSettings.zalo}
          </a>
        </div>
        <div>
          <h3 className="font-semibold text-slate-800 mb-1">Email</h3>
          <a
            href={`mailto:${siteSettings.email}`}
            className="text-emerald-600 font-medium hover:underline"
          >
            {siteSettings.email}
          </a>
        </div>
        <div>
          <h3 className="font-semibold text-slate-800 mb-1">Địa chỉ</h3>
          <p className="text-slate-600">{siteSettings.address}</p>
        </div>
      </div>
    </div>
  );
}
