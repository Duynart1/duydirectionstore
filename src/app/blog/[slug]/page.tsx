import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { getPostBySlug } from "@/data/posts";
import { formatDate } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Bài viết" };
  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  return (
    <div className="container mx-auto px-4 py-6 max-w-3xl">
      <Breadcrumbs items={[{ label: "Blog", href: "/blog" }, { label: post.title }]} />
      <article>
        <h1 className="text-3xl font-bold text-slate-800 mb-4">{post.title}</h1>
        <div className="flex items-center gap-4 text-slate-500 text-sm mb-6">
          <time>{formatDate(post.publishedAt)}</time>
          {post.author && <span>{post.author}</span>}
        </div>
        {post.image && (
          <div className="relative aspect-video rounded-xl overflow-hidden mb-8">
            <Image
              src={post.image}
              alt=""
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 672px"
              priority
              unoptimized
            />
          </div>
        )}
        <div
          className="prose prose-slate max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>
      <p className="mt-8">
        <Link href="/blog" className="text-emerald-600 font-medium hover:underline">
          ← Quay lại Blog
        </Link>
      </p>
    </div>
  );
}
