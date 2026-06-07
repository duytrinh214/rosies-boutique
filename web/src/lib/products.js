// Catalog seed data — ported from the design prototype's hardcoded PRODUCTS array.
// The live catalog lives in Supabase (see lib/supabase.js); this seed is used to
// pre-populate localStorage on first load so the shop has content before Supabase
// is configured, and as a fallback when Supabase is unreachable.
export const PRODUCTS = [
  { id: 'sunset-atelier', name: 'Sunset Atelier', category: 'Bouquets', price: 92, img: 'products/sunset-atelier.jpg', tag: 'New', rating: 4.9, reviews: 184, palette: ['Coral', 'Ivory', 'Champagne'], description: "A warm coral, peach and ivory hand-tied composition centered on a hand-shaped chrysanthemum. Wrapped in raw silk ribbon, set in our signature gift vessel.", details: ['Mixed silk roses, cosmos & chrysanthemum', 'Hand-tied with silk & satin ribbon', 'Approx. 28 × 26 cm', 'Made to last 5+ years'], sizes: ['Petite', 'Standard', 'Grand'] },
  { id: 'magenta-garden', name: 'Magenta Garden', category: 'Bouquets', price: 108, img: 'products/magenta-garden.jpg', tag: 'Bestseller', rating: 4.9, reviews: 312, palette: ['Magenta', 'Blush', 'Coral'] },
  { id: 'graduation-lily', name: 'Graduation Lily', category: 'Gifts', price: 86, img: 'products/graduation-lily.jpg', tag: 'Gift', rating: 4.8, reviews: 142, palette: ['Coral', 'Ivory'] },
  { id: 'burgundy-crescent', name: 'Burgundy Crescent', category: 'Bouquets', price: 96, img: 'products/burgundy-crescent.jpg', rating: 4.9, reviews: 220, palette: ['Burgundy', 'Ivory'] },
  { id: 'studio-pink', name: 'Studio Pink Bundle', category: 'Bouquets', price: 74, img: 'products/studio-pink.jpg', tag: 'New', rating: 4.8, reviews: 76, palette: ['Blush', 'Ivory'] },
  { id: 'sunshine-bear', name: 'Sunshine Bear', category: 'Gifts', price: 68, img: 'products/sunshine-bear.jpg', tag: 'Gift', rating: 4.8, reviews: 98, palette: ['Mint', 'Champagne'] },
  { id: 'ivory-tulip', name: 'Ivory Tulip Pot', category: 'Bouquets', price: 112, img: 'products/ivory-tulip.jpg', rating: 4.9, reviews: 167, palette: ['Ivory', 'Champagne'] },
  { id: 'coral-peony', name: 'Coral Peony Bloom', category: 'Bouquets', price: 124, img: 'products/coral-peony.jpg', tag: 'Bestseller', rating: 4.9, reviews: 248, palette: ['Coral', 'Blush'] },
  { id: 'teacup-romance', name: 'Teacup Romance', category: 'Gifts', price: 58, img: 'products/teacup-romance.jpg', tag: 'Gift', rating: 4.7, reviews: 62, palette: ['Blush', 'Ivory'] },
  { id: 'calla-cascade', name: 'Calla Cascade', category: 'Bouquets', price: 98, img: 'products/calla-cascade.jpg', tag: 'New', rating: 4.8, reviews: 89, palette: ['Coral', 'Ivory'] },
  { id: 'crimson-orchid', name: 'Crimson & Orchid', category: 'Bouquets', price: 116, img: 'products/crimson-orchid.jpg', rating: 4.9, reviews: 134, palette: ['Burgundy', 'Ivory'] },
  { id: 'spring-lush', name: 'Spring Lush', category: 'Bouquets', price: 128, img: 'products/spring-lush.jpg', rating: 5.0, reviews: 41, palette: ['Magenta', 'Coral', 'Ivory'] },
  { id: 'amber-protea', name: 'Amber Protea', category: 'Bouquets', price: 94, img: 'products/sunset-atelier.jpg', tag: 'New', rating: 4.8, reviews: 73, palette: ['Amber', 'Coral', 'Ivory'] },
  { id: 'jade-orchid', name: 'Jade Orchid Jar', category: 'Bouquets', price: 120, img: 'products/ivory-tulip.jpg', tag: 'New', rating: 4.9, reviews: 58, palette: ['Lime', 'Ivory'] },
  { id: 'rose-tote', name: 'Rosé Posy Tote', category: 'Gifts', price: 88, img: 'products/magenta-garden.jpg', tag: 'Gift', rating: 4.9, reviews: 121, palette: ['Blush', 'Magenta'] },
  { id: 'peony-cascade', name: 'Peony Cascade', category: 'Bouquets', price: 118, img: 'products/coral-peony.jpg', rating: 4.9, reviews: 96, palette: ['Coral', 'Blush', 'Ivory'] },
  { id: 'golden-graduate', name: 'Golden Graduate', category: 'Gifts', price: 90, img: 'products/graduation-lily.jpg', tag: 'Gift', rating: 4.8, reviews: 64, palette: ['Coral', 'Ivory'] },
  { id: 'sunbeam-bundle', name: 'Sunbeam Bundle', category: 'Bouquets', price: 80, img: 'products/studio-pink.jpg', rating: 4.7, reviews: 52, palette: ['Blush', 'Ivory'] },
  { id: 'pearl-calla', name: 'Pearl Calla Pot', category: 'Bouquets', price: 102, img: 'products/calla-cascade.jpg', rating: 4.8, reviews: 47, palette: ['Peach', 'Ivory'] },
  { id: 'teddy-blossom', name: 'Teddy Blossom', category: 'Gifts', price: 70, img: 'products/sunshine-bear.jpg', tag: 'Gift', rating: 4.8, reviews: 85, palette: ['Mint', 'Champagne'] },
];

export const CATEGORIES = ['All', 'Bouquets', 'Gifts'];

// Fallback gradient shown when a product image fails to load.
export const FALLBACK_BG = 'linear-gradient(135deg, #f6d6cd 0%, #e7c9a7 50%, #dceddd 100%)';

export const normaliseProduct = (p) => ({
  ...p,
  img: p.img || p.image_url || '',
  image_url: p.image_url || p.img || '',
  event: p.event || '',
  created_at: p.created_at || new Date().toISOString(),
});
