/**
 * Category ids + labels for drawer nav (single source for menu).
 * Ids align with `activeCategory` / product `category` where applicable.
 */
export const DRAWER_CATEGORY_ITEMS = [
  { id: "new-arrivals", label: "New Arrivals" },
  { id: "tops", label: "Tops" },
  { id: "bottoms", label: "Bottoms" },
  { id: "co-ords", label: "Co-ord Sets" },
  { id: "dresses-jumpsuits", label: "Dresses | Jumpsuits" },
  { id: "coats", label: "Coats | Jackets" },
  { id: "desi", label: "Desi x GenZ" },
  { id: "influencers", label: "Shop by Influencer" },
  { id: "hot", label: "Hot Picks", labelAccent: "hot" },
];

/** Seller product form: DB enum values (not drawer-only composite ids). */
export const SELLER_PRODUCT_CATEGORY_OPTIONS = [
  { id: "tops", label: "Tops" },
  { id: "bottoms", label: "Bottoms" },
  { id: "co-ords", label: "Co-ord Sets" },
  { id: "dresses", label: "Dresses" },
  { id: "jumpsuits", label: "Jumpsuits" },
  // { id: "outerwear", label: "Outerwear" },
  { id: "coats", label: "Coats | Jackets" },
  { id: "desi", label: "Desi x GenZ" },
  { id: "hot", label: "Hot Picks" },
  // { id: "streetwear", label: "Streetwear" },
  // { id: "vintage", label: "Vintage" },
  // { id: "ethnic", label: "Ethnic" },
  // { id: "formals", label: "Formals" },
  // { id: "activewear", label: "Activewear" },
  // { id: "accessories", label: "Accessories" },
  // { id: "footwear", label: "Footwear" },
  // { id: "bags", label: "Bags" },
  // { id: "jewellery", label: "Jewellery" },
  // { id: "other", label: "Other" },
];
