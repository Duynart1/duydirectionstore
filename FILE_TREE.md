# Proposed file tree – Vietnamese catalog website

```
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx                    # Home
│   ├── globals.css
│   ├── san-pham/
│   │   ├── page.tsx                # Product listing
│   │   └── [slug]/page.tsx         # Product detail
│   ├── danh-muc/
│   │   └── [slug]/page.tsx         # Category page
│   ├── gio-hang/page.tsx           # Cart
│   ├── gui-yeu-cau/page.tsx        # Request form
│   ├── blog/
│   │   ├── page.tsx
│   │   └── [slug]/page.tsx
│   ├── gioi-thieu/page.tsx         # About
│   ├── lien-he/page.tsx            # Contact
│   ├── chinh-sach/
│   │   └── [slug]/page.tsx         # Policy pages
│   └── faq/page.tsx
├── components/
│   ├── layout/
│   │   ├── TopBar.tsx
│   │   ├── Header.tsx
│   │   ├── MegaMenu.tsx
│   │   └── Footer.tsx
│   ├── home/
│   │   ├── Hero.tsx
│   │   ├── FeaturedCategories.tsx
│   │   ├── PromoProducts.tsx
│   │   ├── ProductSections.tsx
│   │   ├── FeaturedSpotlight.tsx
│   │   ├── BlogSection.tsx
│   │   ├── TrustBadges.tsx
│   │   └── Testimonials.tsx
│   ├── product/
│   │   ├── ProductCard.tsx
│   │   ├── ProductGallery.tsx
│   │   ├── VariantSelectors.tsx
│   │   └── RelatedProducts.tsx
│   ├── cart/
│   │   ├── CartSummary.tsx
│   │   └── CartItem.tsx
│   ├── ui/
│   │   ├── Breadcrumbs.tsx
│   │   ├── Button.tsx
│   │   └── EmptyState.tsx
│   └── RequestForm.tsx
├── data/
│   ├── categories.ts
│   ├── products.ts
│   ├── posts.ts
│   ├── policies.ts
│   └── siteSettings.ts
├── lib/
│   ├── cart.ts
│   └── utils.ts
└── types/
    └── index.ts

public/
├── images/
│   ├── logo.svg (or .png)
│   ├── hero/
│   ├── products/
│   └── blog/
```

Next: create types and sample data, then layout and components.
