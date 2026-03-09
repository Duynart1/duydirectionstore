import type { ProductPurchaseNotes } from "@/types";

function highlightText(text: string, keywords: string[] = []) {
  if (!keywords.length) return text;

  let parts: (string | JSX.Element)[] = [text];

  for (const keyword of keywords) {
    const nextParts: (string | JSX.Element)[] = [];
    parts.forEach((part, partIndex) => {
      if (typeof part !== "string") {
        nextParts.push(part);
        return;
      }
      const segments = part.split(keyword);
      segments.forEach((segment, i) => {
        if (segment) nextParts.push(segment);
        if (i < segments.length - 1) {
          nextParts.push(
            <strong
              key={`${keyword}-${partIndex}-${i}`}
              className="font-black text-[#b91c1c]"
            >
              {keyword}
            </strong>
          );
        }
      });
    });
    parts = nextParts;
  }

  return parts;
}

interface PurchaseNotesProps {
  notes: ProductPurchaseNotes;
}

export function PurchaseNotes({ notes }: PurchaseNotesProps) {
  const keywords = notes.highlightKeywords ?? [];

  return (
    <div className="relative mt-3 mb-4">
      <div className="absolute -top-3 left-5 z-10">
        <div className="inline-flex items-center gap-1 rounded-full border border-orange-200 bg-white px-3 py-1 text-xs font-semibold text-amber-800 shadow-sm">
          <span aria-hidden>⚡</span>
          <span>Cam kết &amp; Hỗ trợ nhanh</span>
        </div>
      </div>
      <div
        className="rounded-[18px] border-2 border-[rgba(255,170,64,0.55)] bg-[linear-gradient(90deg,_#f8e5c0_0%,_#ffffff_50%,_#f8e5c0_100%)] shadow-[0_14px_40px_rgba(0,0,0,0.1)] pt-[22px] pb-[16px] px-[18px] text-sm text-slate-800"
      >
        <p className="mb-2">
          {highlightText(notes.title, keywords)}
        </p>
        <ul className="space-y-1.5">
          {notes.lines.map((line, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="mt-0.5 text-purple-500" aria-hidden>
                ✔
              </span>
              <span>{highlightText(line, keywords)}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

