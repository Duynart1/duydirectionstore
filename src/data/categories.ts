import type { Category } from "@/types";

export const categories: Category[] = [
  {
    id: "cat-1",
    name: "Tài khoản giải trí",
    slug: "tai-khoan-giai-tri",
    parentId: null,
    order: 1,
    description: "Netflix, Spotify, YouTube Premium...",
  },
  {
    id: "cat-2",
    name: "Tài khoản phần mềm",
    slug: "tai-khoan-phan-mem",
    parentId: null,
    order: 2,
    description: "Microsoft, Adobe, Antivirus...",
  },
  {
    id: "cat-3",
    name: "Khóa học trực tuyến",
    slug: "khoa-hoc-truc-tuyen",
    parentId: null,
    order: 3,
    description: "Udemy, Coursera, Skillshare...",
  },
  {
    id: "cat-1-1",
    name: "Netflix",
    slug: "netflix",
    parentId: "cat-1",
    order: 1,
  },
  {
    id: "cat-1-2",
    name: "Spotify",
    slug: "spotify",
    parentId: "cat-1",
    order: 2,
  },
  {
    id: "cat-1-3",
    name: "YouTube Premium",
    slug: "youtube-premium",
    parentId: "cat-1",
    order: 3,
  },
  {
    id: "cat-2-1",
    name: "Microsoft 365",
    slug: "microsoft-365",
    parentId: "cat-2",
    order: 1,
  },
  {
    id: "cat-2-2",
    name: "Adobe",
    slug: "adobe",
    parentId: "cat-2",
    order: 2,
  },
  {
    id: "cat-3-1",
    name: "Udemy",
    slug: "udemy",
    parentId: "cat-3",
    order: 1,
  },
];

// Build tree for mega menu
export function getCategoryTree(): Category[] {
  const byId = new Map(categories.map((c) => [c.id, { ...c, children: [] as Category[] }]));
  const roots: Category[] = [];
  for (const c of categories) {
    const node = byId.get(c.id)!;
    if (!c.parentId) {
      roots.push(node);
    } else {
      const parent = byId.get(c.parentId);
      if (parent) parent.children!.push(node);
      else roots.push(node);
    }
  }
  roots.sort((a, b) => a.order - b.order);
  roots.forEach((r) => r.children?.sort((a, b) => a.order - b.order));
  return roots;
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function getCategoryById(id: string): Category | undefined {
  return categories.find((c) => c.id === id);
}

export function getCategoriesByParentId(parentId: string | null): Category[] {
  return categories.filter((c) => c.parentId === parentId).sort((a, b) => a.order - b.order);
}
