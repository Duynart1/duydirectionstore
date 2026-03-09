import { Hero } from "@/components/home/Hero";
import { FeaturedCategories } from "@/components/home/FeaturedCategories";
import { TrustBadges } from "@/components/home/TrustBadges";
import { PromoProducts } from "@/components/home/PromoProducts";
import { ProductSections } from "@/components/home/ProductSections";
import { FeaturedSpotlight } from "@/components/home/FeaturedSpotlight";
import { BlogSection } from "@/components/home/BlogSection";
import { Testimonials } from "@/components/home/Testimonials";

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedCategories />
      <TrustBadges />
      <PromoProducts />
      <FeaturedSpotlight />
      <ProductSections />
      <BlogSection />
      <Testimonials />
    </>
  );
}
