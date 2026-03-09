"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selected, setSelected] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const list = images.length > 0 ? images : ["/images/placeholder-product.svg"];

  useEffect(() => {
    if (!lightboxOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxOpen(false);
    };
    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [lightboxOpen]);

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={() => setLightboxOpen(true)}
        className="relative block w-full aspect-square max-w-full rounded-xl overflow-hidden bg-slate-100 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 group"
        aria-label="Phóng to ảnh sản phẩm"
      >
        <Image
          src={list[selected]}
          alt={`${productName} - ảnh ${selected + 1}`}
          fill
          className="object-contain transition duration-300 group-hover:scale-[1.02]"
          sizes="(max-width: 768px) 100vw, 40vw"
          priority
          unoptimized
        />
      </button>

      {list.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {list.map((src, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setSelected(i)}
              className={`relative shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition ${
                selected === i ? "border-emerald-500" : "border-slate-200 hover:border-slate-300"
              }`}
            >
              <Image
                src={src}
                alt=""
                fill
                className="object-cover"
                sizes="64px"
                unoptimized
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox: không nền trắng, ảnh trên overlay tối + viền sáng chạy */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
          onClick={() => setLightboxOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Xem ảnh phóng to"
        >
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            className="fixed top-4 right-4 z-[60] w-10 h-10 flex items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/25 transition"
            aria-label="Đóng"
          >
            <span className="text-2xl leading-none">×</span>
          </button>
          <div
            className="w-[min(90vw,80vh)] h-[min(90vw,80vh)] min-w-[280px] min-h-[280px]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="lightbox-image-wrapper h-full w-full">
              <div className="lightbox-image-inner relative w-full h-full">
                <Image
                  src={list[selected]}
                  alt={`${productName} - ảnh ${selected + 1} (phóng to)`}
                  fill
                  className="object-cover"
                  sizes="90vw"
                  unoptimized
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
