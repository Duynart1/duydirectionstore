import { testimonials } from "@/data/testimonials";

export function Testimonials() {
  return (
    <section className="py-12 bg-slate-50">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Khách hàng nói gì về chúng tôi</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <blockquote
              key={t.id}
              className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col"
            >
              <div className="flex gap-1 text-amber-500 mb-3">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <span key={i} aria-hidden>★</span>
                ))}
              </div>
              <p className="text-slate-600 flex-1">&ldquo;{t.content}&rdquo;</p>
              <cite className="not-italic font-medium text-slate-800 mt-3">— {t.name}</cite>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
