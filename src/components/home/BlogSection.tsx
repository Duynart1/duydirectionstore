import Link from "next/link";
import Image from "next/image";
import { getRecentPosts } from "@/data/posts";
import { formatDate } from "@/lib/utils";

export function BlogSection() {
  const posts = getRecentPosts(3);

  return (
    <section className="py-12 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-800">Tin tức & Hướng dẫn</h2>
          <Link href="/blog" className="text-emerald-600 font-medium hover:underline">
            Xem tất cả →
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
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
                <h3 className="font-semibold text-slate-800 mt-1 line-clamp-2 group-hover:text-emerald-600 transition">
                  {post.title}
                </h3>
                <p className="text-sm text-slate-600 mt-1 line-clamp-2">{post.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
