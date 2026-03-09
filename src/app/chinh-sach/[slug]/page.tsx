import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { getPolicyBySlug } from "@/data/policies";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const policy = getPolicyBySlug(slug);
  if (!policy) return { title: "Chính sách" };
  return {
    title: policy.title,
    description: policy.content.replace(/<[^>]+>/g, "").slice(0, 160),
  };
}

export default async function PolicyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const policy = getPolicyBySlug(slug);
  if (!policy) notFound();

  return (
    <div className="container mx-auto px-4 py-6 max-w-3xl">
      <Breadcrumbs items={[{ label: "Chính sách" }, { label: policy.title }]} />
      <h1 className="text-3xl font-bold text-slate-800 mb-6">{policy.title}</h1>
      <div
        className="prose prose-slate max-w-none"
        dangerouslySetInnerHTML={{ __html: policy.content }}
      />
    </div>
  );
}
