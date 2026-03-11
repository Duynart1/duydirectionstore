// Category with optional children for mega menu
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentId: string | null;
  order: number;
  children?: Category[];
}

// Product variant option (e.g. "Gói đăng ký", "Thời hạn")
export interface ProductVariantOption {
  id: string;
  name: string; // e.g. "1 tháng", "3 tháng"
  priceModifier: number; // added to base price, can be 0
  stock: number;
  inStock: boolean; // explicit availability flag for this variant option
}

export interface ProductVariantGroup {
  id: string;
  label: string; // e.g. "Thời hạn", "Gói"
  options: ProductVariantOption[];
}

export interface ProductPurchaseNotes {
  title: string;
  lines: string[];
  /**
   * Các từ khóa cần in đậm đỏ trong nội dung.
   * Ví dụ: ["KHÔNG ĐỔI", "profile được chỉ định", "Netflix dùng chung"]
   */
  highlightKeywords?: string[];
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  shortDescription: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  soldCount: number;
  rating?: number;
  inStock: boolean;
  variantGroups?: ProductVariantGroup[];
  featured?: boolean;
  order: number;
  purchaseNotes?: ProductPurchaseNotes;
}

// Cart item with selected variants
export interface CartItemVariant {
  groupId: string;
  groupLabel: string;
  optionId: string;
  optionName: string;
  priceModifier: number;
}

export interface CartItem {
  productId: string;
  productSlug: string;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
  variants: CartItemVariant[];
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image?: string;
  publishedAt: string;
  author?: string;
}

export interface Policy {
  id: string;
  title: string;
  slug: string;
  content: string;
}

export interface SiteSettings {
  siteName: string;
  hotline: string;
  address: string;
  email: string;
  zalo: string;
  supportLinks?: { label: string; url: string }[];
  socialLinks?: { label: string; url: string; icon?: string }[];
}

export interface Testimonial {
  id: string;
  name: string;
  content: string;
  rating: number;
  avatar?: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}
