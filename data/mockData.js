export const CATEGORIES = [
  { id: 'all', name: 'All', image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=150&q=80' },
  { id: 'streetwear', name: 'Streetwear', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=150&q=80' },
  { id: 'vintage', name: 'Vintage', image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=150&q=80' },
  { id: 'formals', name: 'Formals', image: 'https://images.unsplash.com/photo-1488161628813-04466f872be2?auto=format&fit=crop&w=150&q=80' },
  { id: 'ethnic', name: 'Ethnic', image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=150&q=80' },
  { id: 'accessories', name: 'Accessories', image: 'https://images.unsplash.com/photo-1512314889357-e157c22f938d?auto=format&fit=crop&w=150&q=80' },
  { id: 'footwear', name: 'Footwear', image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=150&q=80' },
];

export const ALL_PRODUCTS = [
  { 
    id: "1", 
    title: "Vintage Denim Jacket", 
    price: 1299, 
    originalPrice: 3999,
    discount: 67,
    brand: "Levi's", 
    category: "vintage", 
    rating: 4.8,
    totalSales: 450,
    tags: ["denim", "jacket", "blue", "outerwear"],
    imageUrl: "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=800&q=80"
    ],
    condition: "Excellent",
    description: "Classic vintage Levi's denim jacket. Perfect fade and fit.",
    details: { fabric: "100% Cotton", fit: "Regular", care: "Machine Wash" }
  },
  { 
    id: "2", 
    title: "Oversized Formal Blazer", 
    price: 850, 
    originalPrice: 1500,
    discount: 43,
    brand: "Zara", 
    category: "formals", 
    rating: 4.5,
    totalSales: 230,
    tags: ["formal", "blazer", "black", "workwear"],
    imageUrl: "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=80"
    ],
    condition: "New without tags",
    description: "Elegant oversized blazer for a professional yet trendy look.",
    details: { fabric: "Polyester Blend", fit: "Oversized", care: "Dry Clean Only" }
  },
  { 
    id: "3", 
    title: "Silk Slip Dress", 
    price: 600, 
    brand: "Réalisation Par", 
    category: "streetwear", 
    rating: 4.9,
    totalSales: 120,
    tags: ["silk", "dress", "summer", "pattern"],
    imageUrl: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=800&q=80",
    images: ["https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=800&q=80"],
    condition: "Gently Used",
    description: "Beautiful silk slip dress in a vibrant pattern.",
    details: { fabric: "100% Silk", fit: "Slim", care: "Hand Wash" }
  },
  { 
    id: "4", 
    title: "Chunky Loafers", 
    price: 1200, 
    brand: "Prada", 
    category: "footwear", 
    rating: 4.7,
    totalSales: 85,
    tags: ["shoes", "loafers", "leather", "black"],
    imageUrl: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80",
    images: ["https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80"],
    condition: "Gently Used",
    description: "High-quality chunky loafers that add an edge to any outfit.",
    details: { fabric: "Leather", fit: "True to size", care: "Wipe clean" }
  },
  { 
    id: "5", 
    title: "Ribbed Knit Top", 
    price: 250, 
    brand: "H&M", 
    category: "streetwear", 
    rating: 4.2,
    totalSales: 310,
    tags: ["top", "knit", "white", "basic"],
    imageUrl: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=800&q=80",
    images: ["https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=800&q=80"],
    condition: "Good",
    description: "Comfortable ribbed knit top for everyday wear.",
    details: { fabric: "Cotton Blend", fit: "Tight", care: "Machine Wash" }
  },
  { 
    id: "6", 
    title: "Graphic Tee", 
    price: 150, 
    brand: "Vintage", 
    category: "vintage", 
    rating: 4.6,
    totalSales: 540,
    tags: ["tshirt", "graphic", "cotton", "black"],
    imageUrl: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80",
    images: ["https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80"],
    condition: "Vintage",
    description: "Cool graphic tee with a retro vibe.",
    details: { fabric: "100% Cotton", fit: "Loose", care: "Machine Wash" }
  }
];

export const INFLUENCERS = [
  { id: "1", name: "Sarah Style", handle: "@sarahstyle" },
  { id: "2", name: "Jane Doe", handle: "@janedoe" }
];
