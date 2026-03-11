# Cửa hàng Số - Vietnamese Digital Catalog

Website catalog sản phẩm số (tài khoản giải trí, phần mềm, khóa học) bằng Next.js, TypeScript và Tailwind CSS. Khách hàng xem sản phẩm, thêm giỏ, gửi yêu cầu qua Zalo / sao chép / email — không có thanh toán online hay admin panel trong phiên bản v1.

## Công nghệ

- **Next.js** (App Router) + **TypeScript** + **Tailwind CSS**
- Dữ liệu lưu trong file local (`src/data/*.ts`)
- Ảnh đặt trong `public/images/`

## Chạy local

```bash
# Cài đặt
npm install

# Chạy dev
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000).

```bash
# Build production
npm run build

# Chạy production
npm start
```

## Cấu trúc thư mục chính

- `src/app/` — Trang (App Router)
- `src/components/` — Component dùng chung (layout, product, cart, ui)
- `src/data/` — Dữ liệu (categories, products, posts, policies, siteSettings, faq, testimonials)
- `src/lib/` — Tiện ích (cart localStorage, formatPrice, v.v.)
- `src/types/` — Định nghĩa TypeScript
- `public/images/` — Logo, ảnh sản phẩm, blog (dùng đường dẫn `/images/...`)

## Thêm sản phẩm mới

1. Mở `src/data/products.ts`.
2. Thêm object vào mảng `products` theo cấu trúc:
   - `id`, `name`, `slug`, `categoryId`, `shortDescription`, `description`, `price`, `originalPrice` (tùy chọn), `images`, `soldCount`, `rating` (tùy chọn), `inStock`, `variantGroups` (tùy chọn), `featured` (tùy chọn), `order`.
3. Slug nên viết thường, không dấu, nối bằng `-` (ví dụ: `netflix-premium-1-thang`).
4. Ảnh đặt trong `public/images/products/` (hoặc `public/images/`) và dùng đường dẫn `/images/...`.

## Thêm danh mục

- Sửa `src/data/categories.ts`: thêm item vào mảng `categories`. Có thể dùng `parentId` để tạo danh mục con (mega menu).

## Thay logo và ảnh

- **Logo:** Hiện header dùng chữ cái đầu của `siteName` trong `src/data/siteSettings.ts`. Để dùng ảnh logo:
  - Đặt file logo vào `public/images/logo.png` (hoặc `.svg`).
  - Sửa `src/components/layout/Header.tsx`: thay phần hiển thị logo bằng thẻ `<Image src="/images/logo.png" ... />`.
- **Ảnh sản phẩm / blog:** Đặt file vào `public/images/products/`, `public/images/blog/` và cập nhật đường dẫn trong `src/data/products.ts`, `src/data/posts.ts` tương ứng.

## Deploy lên Vercel

1. Đẩy repo lên GitHub (hoặc Git khác).
2. Vào [vercel.com](https://vercel.com) → New Project → Import repo.
3. Root Directory: để mặc định. Framework: Next.js.
4. Deploy. Build command: `npm run build`, Output: mặc định.
5. Sau khi deploy, có thể gắn tên miền trong Settings → Domains.

## Các trang chính

| Trang        | Đường dẫn          |
|-------------|--------------------|
| Trang chủ   | `/`                |
| Sản phẩm    | `/san-pham`        |
| Danh mục    | `/danh-muc/[slug]` |
| Chi tiết SP | `/san-pham/[slug]` |
| Giỏ hàng    | `/gio-hang`        |
| Gửi yêu cầu | `/gui-yeu-cau`     |
| Blog        | `/blog`, `/blog/[slug]` |
| Giới thiệu  | `/gioi-thieu`      |
| Liên hệ     | `/lien-he`         |
| Chính sách  | `/chinh-sach/[slug]` |
| FAQ         | `/faq`             |

## Giỏ hàng & Gửi yêu cầu

- Giỏ hàng lưu trong **localStorage** (key: `duydirection_cart`).
- Trang **Gửi yêu cầu** (`/gui-yeu-cau`): khách điền form (họ tên, SĐT, Zalo, email, ghi chú), xem tóm tắt giỏ, sau đó:
  - **Gửi qua Zalo admin:** mở Zalo với nội dung đã format sẵn.
  - **Sao chép nội dung:** copy toàn bộ nội dung yêu cầu.
  - **Gửi email admin:** mở client email với subject và body đã điền sẵn.

Số Zalo và email admin lấy từ `src/data/siteSettings.ts` (trường `zalo`, `email`).

## Bản quyền & Nội dung

- Giao diện và luồng dùng tham khảo cấu trúc/UX các site catalog, không sao chép nhãn hiệu hay nội dung gốc.
- Tên cửa hàng và nội dung mẫu có thể thay trong `siteSettings.ts`, `products.ts`, `posts.ts`, v.v.
