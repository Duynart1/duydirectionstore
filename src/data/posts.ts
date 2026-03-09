import type { BlogPost } from "@/types";

export const posts: BlogPost[] = [
  {
    id: "post-1",
    title: "Hướng dẫn chọn gói Netflix phù hợp với gia đình",
    slug: "huong-dan-chon-goi-netflix-phu-hop",
    excerpt: "So sánh các gói Netflix Basic, Standard, Premium và cách chọn gói tiết kiệm nhất.",
    content: `
      <p>Netflix hiện có 3 gói chính: Basic, Standard và Premium. Mỗi gói khác nhau về chất lượng hình ảnh và số thiết bị đăng nhập.</p>
      <h3>Gói Basic</h3>
      <p>Phù hợp cá nhân, 1 màn hình, chất lượng HD.</p>
      <h3>Gói Standard</h3>
      <p>2 màn hình, Full HD, phù hợp gia đình nhỏ.</p>
      <h3>Gói Premium</h3>
      <p>4 màn hình, 4K Ultra HD, tải xem offline nhiều thiết bị. Đây là lựa chọn tốt nhất cho gia đình đông người.</p>
    `,
    image: "/images/placeholder-blog.svg",
    publishedAt: "2025-02-15",
    author: "Admin",
  },
  {
    id: "post-2",
    title: "Spotify Premium vs Free: Có nên nâng cấp?",
    slug: "spotify-premium-vs-free-co-nen-nang-cap",
    excerpt: "So sánh tính năng và lợi ích khi nâng cấp lên Spotify Premium.",
    content: `
      <p>Spotify Free có quảng cáo và giới hạn nhảy bài. Spotify Premium cho phép nghe không quảng cáo, tải nhạc offline và chất lượng cao hơn.</p>
      <p>Nếu bạn nghe nhạc hơn 2 giờ mỗi ngày, Premium sẽ mang lại trải nghiệm tốt hơn rất nhiều.</p>
    `,
    image: "/images/placeholder-blog.svg",
    publishedAt: "2025-02-10",
    author: "Admin",
  },
  {
    id: "post-3",
    title: "Microsoft 365 bản quyền: Mua một lần hay thuê tháng?",
    slug: "microsoft-365-ban-quyen-mua-mot-lan-hay-thue-thang",
    excerpt: "Phân tích ưu nhược điểm của từng hình thức mua Microsoft 365.",
    content: `
      <p>Microsoft 365 thuê theo năm giúp bạn luôn được cập nhật phiên bản mới và 1TB OneDrive. Mua key trọn đời thường rẻ hơn nhưng không có OneDrive và cập nhật có thể bị giới hạn.</p>
      <p>Với đa số người dùng văn phòng, thuê năm là lựa chọn cân bằng nhất.</p>
    `,
    image: "/images/placeholder-blog.svg",
    publishedAt: "2025-02-05",
    author: "Admin",
  },
  {
    id: "post-4",
    title: "5 nền tảng khóa học trực tuyến đáng học nhất 2025",
    slug: "5-nen-tang-khoa-hoc-truc-tuyen-dang-hoc-nhat-2025",
    excerpt: "Udemy, Coursera, Skillshare và các nền tảng học online chất lượng.",
    content: `
      <p>Udemy có nhiều khóa học thực hành, giá thường xuyên giảm. Coursera hợp với bằng cấp và chứng chỉ từ đại học. Skillshare mạnh về sáng tạo và thiết kế.</p>
      <p>Nên chọn nền tảng theo mục tiêu: kỹ năng nghề nghiệp thì Coursera/Udemy, sáng tạo thì Skillshare.</p>
    `,
    image: "/images/placeholder-blog.svg",
    publishedAt: "2025-01-28",
    author: "Admin",
  },
  {
    id: "post-5",
    title: "Cách bảo mật tài khoản streaming của bạn",
    slug: "cach-bao-mat-tai-khoan-streaming",
    excerpt: "Mẹo đổi mật khẩu, bật xác thực 2 bước và tránh bị khóa tài khoản.",
    content: `
      <p>Luôn đổi mật khẩu sau khi nhận tài khoản. Không chia sẻ thông tin đăng nhập với người lạ. Nếu dịch vụ hỗ trợ 2FA, hãy bật lên.</p>
      <p>Với tài khoản chia sẻ (family), chỉ thêm thiết bị tin cậy và không vượt quá số lượng cho phép.</p>
    `,
    image: "/images/placeholder-blog.svg",
    publishedAt: "2025-01-20",
    author: "Admin",
  },
  {
    id: "post-6",
    title: "YouTube Premium có gì ngoài bỏ quảng cáo?",
    slug: "youtube-premium-co-gi-ngoai-bo-quang-cao",
    excerpt: "YouTube Music, phát nền, tải video offline và nhiều tính năng khác.",
    content: `
      <p>Ngoài việc xem YouTube không quảng cáo, gói Premium còn bao gồm YouTube Music — ứng dụng nghe nhạc riêng. Bạn có thể tải video để xem offline và phát nhạc khi tắt màn hình.</p>
      <p>Gói gia đình cho phép tối đa 5 thành viên, rất tiết kiệm nếu chia đều.</p>
    `,
    image: "/images/placeholder-blog.svg",
    publishedAt: "2025-01-15",
    author: "Admin",
  },
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return posts.find((p) => p.slug === slug);
}

export function getAllPosts(): BlogPost[] {
  return [...posts].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export function getRecentPosts(limit = 3): BlogPost[] {
  return getAllPosts().slice(0, limit);
}
