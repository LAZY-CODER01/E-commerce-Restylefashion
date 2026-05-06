export const DASHBOARD_METRICS = {
  earnings: {
    label: "Earnings",
    value: 112880,
    deltaLabel: "12.5% vs last 30 days",
    deltaPositive: true,
  },
  activeListings: {
    label: "Active Listings",
    value: 103,
    subLabel: "Live on your store",
  },
  ordersSold: {
    label: "Orders Sold",
    value: 109,
    subLabel: "orders sold till date",
  },
  stockInsights: {
    label: "Stock Insights",
    value: 12,
    subLabel: "Low stock products",
    healthLabel: "Healthy",
    healthPct: 72,
  },
};

export const EARNINGS_SERIES = [
  { day: "1", value: 10000 },
  { day: "2", value: 25000 },
  { day: "3", value: 45000 },
  { day: "4", value: 30000 },
  { day: "5", value: 60000 },
];

export const EARNINGS_MONTH_OPTIONS = [
  { key: "2025-01", label: "January 2025" },
  { key: "2025-02", label: "February 2025" },
  { key: "2025-03", label: "March 2025" },
  { key: "2025-04", label: "April 2025" },
  { key: "2025-05", label: "May 2025" },
];

export const EARNINGS_SERIES_BY_MONTH = {
  "2025-01": [
    { day: "1", value: 10000 },
    { day: "2", value: 25000 },
    { day: "3", value: 45000 },
    { day: "4", value: 30000 },
    { day: "5", value: 60000 },
  ],
  "2025-02": [
    { day: "1", value: 12000 },
    { day: "2", value: 18000 },
    { day: "3", value: 35000 },
    { day: "4", value: 42000 },
    { day: "5", value: 52000 },
  ],
  "2025-03": [
    { day: "1", value: 14000 },
    { day: "2", value: 22000 },
    { day: "3", value: 38000 },
    { day: "4", value: 26000 },
    { day: "5", value: 47000 },
  ],
  "2025-04": [
    { day: "1", value: 9000 },
    { day: "2", value: 16000 },
    { day: "3", value: 24000 },
    { day: "4", value: 31000 },
    { day: "5", value: 41000 },
  ],
  "2025-05": [
    { day: "1", value: 18000 },
    { day: "2", value: 28000 },
    { day: "3", value: 36000 },
    { day: "4", value: 52000 },
    { day: "5", value: 78000 },
  ],
};

export const DASHBOARD_PRODUCTS = [
  {
    id: "FPD001",
    name: "Floral Pink Dress",
    price: 1799,
    sku: "FPD001",
    status: "Active",
    views: 245,
    image:
      "https://images.unsplash.com/photo-1520975958225-2f8b7f3a3a52?auto=format&fit=crop&w=240&q=80",
  },
  {
    id: "PCS002",
    name: "Pink Co-ord Set",
    price: 1499,
    sku: "PCS002",
    status: "Active",
    views: 189,
    image:
      "https://images.unsplash.com/photo-1520975681370-8b5b2f2d5ef9?auto=format&fit=crop&w=240&q=80",
  },
  {
    id: "QSB003",
    name: "Quilted Shoulder Bag",
    price: 1299,
    sku: "QSB003",
    status: "Active",
    views: 156,
    image:
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=240&q=80",
  },
  {
    id: "WCS004",
    name: "White Casual Sneakers",
    price: 1199,
    sku: "WCS004",
    status: "Active",
    views: 142,
    image:
      "https://images.unsplash.com/photo-1528701800489-20be3c3ea5f0?auto=format&fit=crop&w=240&q=80",
  },
  {
    id: "SST005",
    name: "Striped Summer Top",
    price: 799,
    sku: "SST005",
    status: "Active",
    views: 98,
    image:
      "https://images.unsplash.com/photo-1520975904899-2f75f1a4b8b9?auto=format&fit=crop&w=240&q=80",
  },
  {
    id: "UCP006",
    name: "Utility Cargo Pants",
    price: 1499,
    sku: "UCP006",
    status: "Active",
    views: 87,
    image:
      "https://images.unsplash.com/photo-1520975958513-68c3a6d7f0d3?auto=format&fit=crop&w=240&q=80",
  },
  {
    id: "LISH007",
    name: "Lost In Space Hoodie",
    price: 1499,
    sku: "LISH007",
    status: "Active",
    views: 87,
    image:
      "https://images.unsplash.com/photo-1520975912668-3b4a72f3c0df?auto=format&fit=crop&w=240&q=80",
  },
  {
    id: "GDJ008",
    name: "Graffiti Denim Jacket",
    price: 1699,
    sku: "GDJ008",
    status: "Active",
    views: 64,
    image:
      "https://images.unsplash.com/photo-1520975947514-b17b4d033f02?auto=format&fit=crop&w=240&q=80",
  },
];

export const DASHBOARD_ORDERS = [
  {
    id: "ORD10293",
    productName: "Oversized Graphic Tee",
    dateTime: "31 May • 10:24 AM",
    amount: 2999,
    image:
      "https://images.unsplash.com/photo-1520975906280-3a8baf09b46d?auto=format&fit=crop&w=240&q=80",
  },
  {
    id: "ORD10292",
    productName: "Swinger Bag 20 In",
    dateTime: "31 May • 09:15 AM",
    amount: 4999,
    image:
      "https://images.unsplash.com/photo-1520975906083-6e81b9c67d8d?auto=format&fit=crop&w=240&q=80",
  },
  {
    id: "ORD10291",
    productName: "Utility Cargo Pants",
    dateTime: "30 May • 08:47 PM",
    amount: 5999,
    image:
      "https://images.unsplash.com/photo-1520975910333-2b1c5a3c0b9b?auto=format&fit=crop&w=240&q=80",
  },
  {
    id: "ORD10290",
    productName: "Lost In Space Hoodie",
    dateTime: "30 May • 07:30 PM",
    amount: 4999,
    image:
      "https://images.unsplash.com/photo-1520975915599-e8f2bdc1c1dd?auto=format&fit=crop&w=240&q=80",
  },
  {
    id: "ORD10289",
    productName: "Graffiti Denim Jacket",
    dateTime: "29 May • 06:12 PM",
    amount: 6999,
    image:
      "https://images.unsplash.com/photo-1520975944448-5c96d3e9d8fe?auto=format&fit=crop&w=240&q=80",
  },
  {
    id: "ORD10288",
    productName: "Textured Knit Polo",
    dateTime: "29 May • 05:22 PM",
    amount: 3999,
    image:
      "https://images.unsplash.com/photo-1520975926986-41d2f8b6f39b?auto=format&fit=crop&w=240&q=80",
  },
  {
    id: "ORD10287",
    productName: "Streetwear Sneakers",
    dateTime: "28 May • 04:55 PM",
    amount: 3999,
    image:
      "https://images.unsplash.com/photo-1520975908326-2a5a2b3c4d7a?auto=format&fit=crop&w=240&q=80",
  },
];

export function formatINR(value) {
  const n = Number(value) || 0;
  return n.toLocaleString("en-IN");
}

