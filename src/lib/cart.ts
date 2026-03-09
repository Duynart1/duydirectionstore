import type { CartItem } from "@/types";

const CART_STORAGE_KEY = "duydirection_cart";

export function getCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CartItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function setCart(items: CartItem[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event("cart-update"));
  } catch {
    // ignore
  }
}

export function addToCart(item: CartItem): void {
  const cart = getCart();
  const existing = cart.find(
    (i) =>
      i.productId === item.productId &&
      JSON.stringify(i.variants) === JSON.stringify(item.variants)
  );
  if (existing) {
    existing.quantity += item.quantity;
  } else {
    cart.push({ ...item });
  }
  setCart(cart);
}

export function removeFromCart(productId: string, variants: CartItem["variants"]): void {
  const cart = getCart().filter(
    (i) =>
      !(i.productId === productId && JSON.stringify(i.variants) === JSON.stringify(variants))
  );
  setCart(cart);
}

export function updateQuantity(
  productId: string,
  variants: CartItem["variants"],
  quantity: number
): void {
  if (quantity < 1) {
    removeFromCart(productId, variants);
    return;
  }
  const cart = getCart();
  const item = cart.find(
    (i) =>
      i.productId === productId && JSON.stringify(i.variants) === JSON.stringify(variants)
  );
  if (item) {
    item.quantity = quantity;
    setCart(cart);
  }
}

export function getCartCount(): number {
  return getCart().reduce((sum, i) => sum + i.quantity, 0);
}

export function getCartSubtotal(): number {
  return getCart().reduce((sum, i) => sum + i.price * i.quantity, 0);
}
