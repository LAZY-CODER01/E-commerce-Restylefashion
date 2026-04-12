/**
 * Category ids + labels for drawer nav and seller listing (single source).
 * Ids match `activeCategory` / product `category` (lowercase in DB).
 */
export const DRAWER_CATEGORY_ITEMS = [
  { id: "all", label: "All" },
  { id: "tops", label: "Tops" },
  { id: "bottoms", label: "Bottoms" },
  { id: "dresses", label: "Dresses" },
  { id: "co-ords", label: "Co-ords" },
  { id: "outerwear", label: "Outerwear" },
  { id: "jumpsuits", label: "Dresses | Jumpsuits" },
  { id: "coats", label: "Coats | Jackets" },
  { id: "desi", label: "Desi x GenZ" },
  { id: "hot", label: "Hot Picks" },
  { id: "influencers", label: "Shop by Influencers" },
];

/** Seller product form: same entries as drawer categories, excluding nav-only. */
export const SELLER_PRODUCT_CATEGORY_OPTIONS = DRAWER_CATEGORY_ITEMS.filter(
  (item) => item.id !== "all" && item.id !== "influencers"
);
