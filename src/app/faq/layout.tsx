import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Câu hỏi thường gặp",
  description: "FAQ - Câu hỏi thường gặp về đặt hàng, thanh toán, bảo hành.",
};

export default function FAQLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
