import Link from "next/link";
import Image from "next/image";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { getAllPosts } from "@/data/posts";
import { formatDate } from "@/lib/utils";

export const metadata = {
  title: "Blog",
  description: "Tin tức và hướng dẫn về sản phẩm số.",
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="container mx-auto px-4 py-6">
      <Breadcrumbs items={[{ label: "Blog" }]} />
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Tin tức & Hướng dẫn</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/blog/${post.slug}`}
            className="group bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition"
          >
            <div className="relative aspect-video bg-slate-200">
              <Image
                src={post.image || "/images/placeholder-blog.svg"}
                alt=""
                fill
                className="object-cover group-hover:scale-105 transition duration-300"
                sizes="(max-width: 768px) 100vw, 33vw"
                unoptimized
              />
            </div>
            <div className="p-4">
              <time className="text-sm text-slate-500">{formatDate(post.publishedAt)}</time>
              <h2 className="font-semibold text-slate-800 mt-1 line-clamp-2 group-hover:text-emerald-600 transition">
                {post.title}
              </h2>
              <p className="text-sm text-slate-600 mt-1 line-clamp-2">{post.excerpt}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
