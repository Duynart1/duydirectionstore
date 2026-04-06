import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header.tsx";

export const metadata: Metadata = {
  title: "SK Shop Tài Khoản - Sản phẩm số uy tín",
  description: "Cửa hàng sản phẩm số: tài khoản giải trí, phần mềm, khóa học.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body suppressHydrationWarning>
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}