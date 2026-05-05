/**
 * Category ids + labels for drawer nav (single source for menu).
 * Ids align with `activeCategory` / product `category` where applicable.
 */
export const DRAWER_CATEGORY_ITEMS = [
  { id: "new-arrivals", label: "New Arrivals", subtitle: "Fresh styles, every day", image: "/cat-new-arrivals.png", section: "shop", labelAccent: "new" },
  { id: "tops", label: "Tops", subtitle: "Trendy tops for every vibe", image: "/cat-tops.png", section: "shop" },
  { id: "bottoms", label: "Bottoms", subtitle: "Jeans, trousers & more", image: "/cat-bottoms.png", section: "shop" },
  { id: "co-ords", label: "Co-ord Sets", subtitle: "Match. Slay. Repeat.", image: "/cat-coords.png", section: "shop" },
  { id: "dresses-jumpsuits", label: "Dresses | Jumpsuits", subtitle: "Effortless & elegant", image: "/cat-dresses.png", section: "shop" },
  { id: "coats", label: "Coats | Jackets", subtitle: "Layer up in style", image: "/cat-coats.png", section: "shop" },
  { id: "desi", label: "Desi x GenZ", subtitle: "Traditional with a twist", image: "/desi-genz.png", section: "discover" },
  { id: "influencers", label: "Shop by Influencer", subtitle: "Curated by your faves", image: "/cat-influencers.png", section: "discover" },
  { id: "hot", label: "Hot Picks", subtitle: "Everyone's loving right now", image: "flame-icon", section: "discover", labelAccent: "hot" },
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
