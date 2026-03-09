import type { Product } from "@/types";

export const products: Product[] = [
  {
    id: "p1",
    name: "Netflix Premium 4K - Gói 1 tháng",
    slug: "netflix-premium-4k-1-thang",
    categoryId: "cat-1-1",
    shortDescription: "Tài khoản Netflix Premium 4K chính hãng, dùng chung ổn định.",
    description: `
      <p>Tài khoản Netflix Premium 4K chính hãng, gói 1 tháng.</p>
      <ul>
        <li>Chất lượng 4K Ultra HD</li>
        <li>Đăng nhập tối đa 4 thiết bị</li>
        <li>Hỗ trợ xem ngoại tuyến</li>
        <li>Bảo hành lỗi 1 đổi 1</li>
      </ul>
    `,
    price: 65000,
    originalPrice: 95000,
    images: ["/images/products/Netflix.jpg"],
    soldCount: 112,
    rating: 4.8,
    inStock: true,
    featured: true,
    order: 1,
    purchaseNotes: {
      title: "Lưu ý với Netflix dùng chung:",
      lines: [
        "KHÔNG ĐỔI avt, ngôn ngữ, tên profile nếu không sẽ không được bảo hành.",
        "Sử dụng đúng profile được chỉ định.",
        "Khi mua xong, cần xem tiếng việt thì chỉ cần vào phụ đề bật tiếng Việt là được bạn nhé.",
      ],
      highlightKeywords: ["Netflix dùng chung", "KHÔNG ĐỔI", "profile được chỉ định"],
    },
    variantGroups: [
      {
        id: "vg1",
        label: "Thời hạn",
        options: [
          { id: "v1-1", name: "1 tháng", priceModifier: 0, stock: 100 },
          { id: "v1-2", name: "3 tháng", priceModifier: 5000, stock: 80 },
          { id: "v1-3", name: "6 tháng", priceModifier: 15000, stock: 50 },
        ],
      },
    ],
  },
  {
    id: "p2",
    name: "Spotify Premium Family",
    slug: "spotify-premium-family",
    categoryId: "cat-1-2",
    shortDescription: "Gia đình tối đa 6 người, nghe nhạc không quảng cáo.",
    description: "<p>Spotify Premium Family cho tối đa 6 tài khoản. Nghe nhạc chất lượng cao, tải offline.</p>",
    price: 55000,
    images: ["/images/placeholder-product.svg"],
    soldCount: 890,
    rating: 4.7,
    inStock: true,
    featured: true,
    order: 2,
    variantGroups: [
      {
        id: "vg2",
        label: "Gói",
        options: [
          { id: "v2-1", name: "1 tháng", priceModifier: 0, stock: 200 },
          { id: "v2-2", name: "3 tháng", priceModifier: 10000, stock: 150 },
        ],
      },
    ],
  },
  {
    id: "p3",
    name: "YouTube Premium Gia đình",
    slug: "youtube-premium-gia-dinh",
    categoryId: "cat-1-3",
    shortDescription: "YouTube Premium cho gia đình, tối đa 5 thành viên. Không quảng cáo, YouTube Music, tải video offline.",
    price: 65000,
    originalPrice: 75000,
    description: "<p>YouTube Premium Family. Xem không quảng cáo, nghe YouTube Music, tải video offline.</p>",
    images: ["/images/placeholder-product.svg"],
    soldCount: 560,
    rating: 4.9,
    inStock: true,
    order: 3,
    variantGroups: [
      {
        id: "vg3",
        label: "Thời hạn",
        options: [
          { id: "v3-1", name: "1 tháng", priceModifier: 0, stock: 90 },
          { id: "v3-2", name: "6 tháng", priceModifier: 20000, stock: 60 },
        ],
      },
    ],
  },
  {
    id: "p4",
    name: "Microsoft 365 Personal 1 năm",
    slug: "microsoft-365-personal-1-nam",
    categoryId: "cat-2-1",
    shortDescription: "Word, Excel, PowerPoint, 1TB OneDrive, bảo mật.",
    description: "<p>Microsoft 365 Personal bản quyền 1 năm. Bao gồm Office apps và 1TB OneDrive.</p>",
    price: 299000,
    originalPrice: 359000,
    images: ["/images/placeholder-product.svg"],
    soldCount: 340,
    rating: 4.8,
    inStock: true,
    featured: true,
    order: 4,
    variantGroups: [
      {
        id: "vg4",
        label: "Gói",
        options: [
          { id: "v4-1", name: "1 năm", priceModifier: 0, stock: 100 },
          { id: "v4-2", name: "2 năm", priceModifier: 50000, stock: 50 },
        ],
      },
    ],
  },
  {
    id: "p5",
    name: "Adobe Creative Cloud All Apps",
    slug: "adobe-creative-cloud-all-apps",
    categoryId: "cat-2-2",
    shortDescription: "Full bộ ứng dụng Adobe: Photoshop, Premiere, Illustrator...",
    description: "<p>Adobe Creative Cloud All Apps - đầy đủ công cụ sáng tạo: Photoshop, Premiere Pro, Illustrator, After Effects và hơn 20 ứng dụng khác.</p>",
    price: 199000,
    images: ["/images/placeholder-product.svg"],
    soldCount: 210,
    rating: 4.6,
    inStock: true,
    order: 5,
    variantGroups: [
      {
        id: "vg5",
        label: "Thời hạn",
        options: [
          { id: "v5-1", name: "1 tháng", priceModifier: 0, stock: 80 },
          { id: "v5-2", name: "3 tháng", priceModifier: 30000, stock: 40 },
        ],
      },
    ],
  },
  {
    id: "p6",
    name: "Udemy Unlimited - 1 tháng",
    slug: "udemy-unlimited-1-thang",
    categoryId: "cat-3-1",
    shortDescription: "Truy cập hàng ngàn khóa học Udemy không giới hạn.",
    description: "<p>Udemy Unlimited cho phép bạn truy cập hàng ngàn khóa học với một gói đăng ký. Học mọi lúc, mọi nơi.</p>",
    price: 99000,
    originalPrice: 129000,
    images: ["/images/placeholder-product.svg"],
    soldCount: 445,
    rating: 4.7,
    inStock: true,
    featured: true,
    order: 6,
    variantGroups: [
      {
        id: "vg6",
        label: "Thời hạn",
        options: [
          { id: "v6-1", name: "1 tháng", priceModifier: 0, stock: 120 },
          { id: "v6-2", name: "3 tháng", priceModifier: 50000, stock: 70 },
        ],
      },
    ],
  },
  {
    id: "p7",
    name: "Disney+ Premium",
    slug: "disney-plus-premium",
    categoryId: "cat-1-1",
    shortDescription: "Disney, Marvel, Star Wars, National Geographic.",
    description: "<p>Disney+ Premium - xem Disney, Marvel, Star Wars, National Geographic không giới hạn.</p>",
    price: 39000,
    images: ["/images/placeholder-product.svg"],
    soldCount: 678,
    rating: 4.8,
    inStock: true,
    order: 7,
    variantGroups: [
      {
        id: "vg7",
        label: "Thời hạn",
        options: [
          { id: "v7-1", name: "1 tháng", priceModifier: 0, stock: 90 },
          { id: "v7-2", name: "1 năm", priceModifier: 50000, stock: 30 },
        ],
      },
    ],
  },
  {
    id: "p8",
    name: "Apple TV+ 3 tháng",
    slug: "apple-tv-plus-3-thang",
    categoryId: "cat-1-1",
    shortDescription: "Nội dung độc quyền Apple Originals.",
    description: "<p>Apple TV+ 3 tháng - phim và chương trình độc quyền Apple Originals.</p>",
    price: 59000,
    images: ["/images/placeholder-product.svg"],
    soldCount: 234,
    inStock: true,
    order: 8,
  },
  {
    id: "p9",
    name: "Coursera Plus - 1 tháng",
    slug: "coursera-plus-1-thang",
    categoryId: "cat-3-1",
    shortDescription: "Hàng ngàn khóa học từ đại học top thế giới.",
    description: "<p>Coursera Plus - truy cập hàng ngàn khóa học và chứng chỉ từ các trường đại học hàng đầu thế giới.</p>",
    price: 149000,
    originalPrice: 199000,
    images: ["/images/placeholder-product.svg"],
    soldCount: 156,
    rating: 4.9,
    inStock: true,
    order: 9,
  },
  {
    id: "p10",
    name: "Tài khoản Netflix Standard (Hết hàng mẫu)",
    slug: "netflix-standard-het-hang",
    categoryId: "cat-1-1",
    shortDescription: "Sản phẩm mẫu hết hàng.",
    description: "<p>Sản phẩm mẫu để hiển thị trạng thái hết hàng.</p>",
    price: 35000,
    images: ["/images/placeholder-product.svg"],
    soldCount: 2000,
    inStock: false,
    order: 10,
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCategoryId(categoryId: string): Product[] {
  return products.filter((p) => p.categoryId === categoryId).sort((a, b) => a.order - b.order);
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.featured).sort((a, b) => a.order - b.order);
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  return products
    .filter((p) => p.id !== product.id && (p.categoryId === product.categoryId || p.featured))
    .slice(0, limit);
}

export function getAllProducts(): Product[] {
  return [...products].sort((a, b) => a.order - b.order);
}
