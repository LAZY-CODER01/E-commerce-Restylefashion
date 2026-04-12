/**
 * Mock cart lines for development or tests.
 * IDs are prefixed to avoid collisions with real product _id strings.
 */
export const DEMO_CART_ITEMS = [
  {
    id: "restyle-demo-cart-1",
    title: "Vintage Denim Jacket",
    brand: "Levi's",
    price: 1299,
    originalPrice: 3999,
    imageUrl:
      "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=600&q=80",
    selectedSize: "M",
    qty: 1,
    businessName: "Restyle Studio Mumbai",
  },
  {
    id: "restyle-demo-cart-2",
    title: "Silk Slip Dress",
    brand: "Réalisation Par",
    price: 600,
    originalPrice: 1299,
    imageUrl:
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=600&q=80",
    selectedSize: "S",
    qty: 2,
    businessName: "Curated Thrift Co.",
  },
  {
    id: "restyle-demo-cart-3",
    title: "Chunky Leather Loafers",
    brand: "Prada",
    price: 1200,
    originalPrice: 2499,
    imageUrl:
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=600&q=80",
    selectedSize: "8",
    qty: 1,
    businessName: "Luxe Resale Delhi",
  },
];
