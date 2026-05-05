import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

// ĐÃ SỬA CHUẨN: Link thẳng ra file Header nằm ngay ngoài thư mục components
import Header from "../components/Header";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: "Duy Direction - Tài khoản Premium chính chủ",
  description: "Cung cấp tài khoản Giải trí, Làm việc, Học tập Premium",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={`${montserrat.className} bg-gray-50 text-gray-900 antialiased`}>
        <Header />
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}