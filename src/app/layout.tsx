import type { Metadata } from "next";
import { TopBar } from "@/components/layout/TopBar";
import { Header } from "@/components/layout/Header";
import { MegaMenu } from "@/components/layout/MegaMenu";
import { Footer } from "@/components/layout/Footer";
import { siteSettings } from "@/data/siteSettings";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: `${siteSettings.siteName} - Sản phẩm số uy tín`,
    template: `%s | ${siteSettings.siteName}`,
  },
  description: "Cửa hàng sản phẩm số: tài khoản giải trí, phần mềm, khóa học. Giao nhanh, bảo hành tận tâm.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body
        className="antialiased min-h-screen flex flex-col"
        suppressHydrationWarning
      >
        <TopBar />
        <Header />
        <MegaMenu />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
