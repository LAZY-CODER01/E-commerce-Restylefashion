/**
 * Category ids + labels for drawer nav (single source for menu).
 * Ids align with `activeCategory` / product `category` where applicable.
 *
 * Thumbnails: remote URLs (aligned with `HOME_CATEGORIES` on `app/page.js`) or `/public` assets.
 * Local `/cat-*.png` files were never added, so those paths 404’d and images did not render.
 */
export const DRAWER_CATEGORY_ITEMS = [
  {
    id: "new-arrivals",
    label: "New Arrivals",
    subtitle: "Fresh styles, every day",
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=200&q=80",
    section: "shop",
    labelAccent: "new",
  },
  {
    id: "tops",
    label: "Tops",
    subtitle: "Trendy tops for every vibe",
    image: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=200&q=80",
    section: "shop",
  },
  {
    id: "bottoms",
    label: "Bottoms",
    subtitle: "Jeans, trousers & more",
    image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=200&q=80",
    section: "shop",
  },
  {
    id: "co-ords",
    label: "Co-ord Sets",
    subtitle: "Match. Slay. Repeat.",
    image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=200&q=80",
    section: "shop",
  },
  {
    id: "dresses-jumpsuits",
    label: "Dresses | Jumpsuits",
    subtitle: "Effortless & elegant",
    image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=200&q=80",
    section: "shop",
  },
  {
    id: "coats",
    label: "Coats | Jackets",
    subtitle: "Layer up in style",
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=200&q=80",
    section: "shop",
  },
  { id: "desi", label: "Desi x GenZ", subtitle: "Traditional with a twist", image: "/desi-genz.png", section: "discover" },
  {
    id: "influencers",
    label: "Shop by Influencer",
    subtitle: "Curated by your faves",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=200&q=80",
    section: "discover",
  },
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
