import type { SiteSettings } from "@/types";

export const siteSettings: SiteSettings = {
  siteName: "Cửa hàng Số",
  hotline: "0901 234 567",
  address: "123 Đường Mẫu, Quận 1, TP. Hồ Chí Minh",
  email: "hotro@cuahangso.vn",
  zalo: "0901234567",
  supportLinks: [
    { label: "Hướng dẫn mua hàng", url: "/chinh-sach/huong-dan-mua-hang" },
    { label: "Hỗ trợ 24/7", url: "/lien-he" },
  ],
  socialLinks: [
    { label: "Facebook", url: "https://facebook.com" },
    { label: "Zalo", url: "https://zalo.me/0901234567" },
  ],
};
