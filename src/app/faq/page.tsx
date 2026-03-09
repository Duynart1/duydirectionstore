"use client";

import { useState } from "react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { faqItems } from "@/data/faq";

export default function FAQPage() {
  const [openId, setOpenId] = useState<string | null>(faqItems[0]?.id ?? null);

  return (
    <div className="container mx-auto px-4 py-6 max-w-2xl">
      <Breadcrumbs items={[{ label: "FAQ" }]} />
      <h1 className="text-3xl font-bold text-slate-800 mb-6">Câu hỏi thường gặp</h1>
      <div className="space-y-2">
        {faqItems.map((item) => (
          <div
            key={item.id}
            className="rounded-xl border border-slate-200 bg-white overflow-hidden"
          >
            <button
              type="button"
              onClick={() => setOpenId(openId === item.id ? null : item.id)}
              className="w-full flex items-center justify-between gap-4 px-4 py-4 text-left font-medium text-slate-800 hover:bg-slate-50 transition"
            >
              {item.question}
              <span className="text-slate-400 shrink-0">
                {openId === item.id ? "▲" : "▼"}
              </span>
            </button>
            {openId === item.id && (
              <div className="px-4 pb-4 pt-0 text-slate-600 border-t border-slate-100">
                {item.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
