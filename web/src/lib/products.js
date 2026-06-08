// Catalog seed data — ported from the design prototype's hardcoded PRODUCTS array.
// The live catalog lives in Supabase (see lib/supabase.js); this seed is used to
// pre-populate localStorage on first load so the shop has content before Supabase
// is configured, and as a fallback when Supabase is unreachable.
export const PRODUCTS = [
  { id: 'BQ-001', name: 'Sunset Atelier', category: 'Bouquets', price: 92, img: 'products/sunset-atelier.jpg', tag: 'New', rating: 4.9, reviews: 184, palette: ['Coral', 'Ivory', 'Champagne'], description: "A warm coral, peach and ivory hand-tied composition centered on a hand-shaped chrysanthemum. Wrapped in raw silk ribbon, set in our signature gift vessel.", details: ['Mixed silk roses, cosmos & chrysanthemum', 'Hand-tied with silk & satin ribbon', 'Approx. 28 × 26 cm', 'Made to last 5+ years'], sizes: ['Petite', 'Standard', 'Grand'] },
  { id: 'BQ-002', name: 'Magenta Garden', category: 'Bouquets', price: 108, img: 'products/magenta-garden.jpg', tag: 'Bestseller', rating: 4.9, reviews: 312, palette: ['Magenta', 'Blush', 'Coral'] },
  { id: 'EC-001', name: 'Graduation Lily', category: 'Event and Corporate Hire', price: 86, img: 'products/graduation-lily.jpg', tag: 'Gift', rating: 4.8, reviews: 142, palette: ['Coral', 'Ivory'] },
  { id: 'BQ-003', name: 'Burgundy Crescent', category: 'Bouquets', price: 96, img: 'products/burgundy-crescent.jpg', rating: 4.9, reviews: 220, palette: ['Burgundy', 'Ivory'] },
  { id: 'BQ-004', name: 'Studio Pink Bundle', category: 'Bouquets', price: 74, img: 'products/studio-pink.jpg', tag: 'New', rating: 4.8, reviews: 76, palette: ['Blush', 'Ivory'] },
  { id: 'EC-002', name: 'Sunshine Bear', category: 'Event and Corporate Hire', price: 68, img: 'products/sunshine-bear.jpg', tag: 'Gift', rating: 4.8, reviews: 98, palette: ['Mint', 'Champagne'] },
  { id: 'LV-001', name: 'Ivory Tulip Pot', category: 'Luxe Vase Arrangements', price: 112, img: 'products/ivory-tulip.jpg', rating: 4.9, reviews: 167, palette: ['Ivory', 'Champagne'] },
  { id: 'BQ-005', name: 'Coral Peony Bloom', category: 'Bouquets', price: 124, img: 'products/coral-peony.jpg', tag: 'Bestseller', rating: 4.9, reviews: 248, palette: ['Coral', 'Blush'] },
  { id: 'EC-003', name: 'Teacup Romance', category: 'Event and Corporate Hire', price: 58, img: 'products/teacup-romance.jpg', tag: 'Gift', rating: 4.7, reviews: 62, palette: ['Blush', 'Ivory'] },
  { id: 'LV-004', name: 'Calla Cascade', category: 'Luxe Vase Arrangements', price: 98, img: 'products/calla-cascade.jpg', tag: 'New', rating: 4.8, reviews: 89, palette: ['Coral', 'Ivory'] },
  { id: 'LV-005', name: 'Crimson & Orchid', category: 'Luxe Vase Arrangements', price: 116, img: 'products/crimson-orchid.jpg', rating: 4.9, reviews: 134, palette: ['Burgundy', 'Ivory'] },
  { id: 'WH-001', name: 'Spring Lush', category: 'Wedding Hire', price: 128, img: 'products/spring-lush.jpg', rating: 5.0, reviews: 41, palette: ['Magenta', 'Coral', 'Ivory'] },
  { id: 'WH-002', name: 'Amber Protea', category: 'Wedding Hire', price: 94, img: 'products/sunset-atelier.jpg', tag: 'New', rating: 4.8, reviews: 73, palette: ['Amber', 'Coral', 'Ivory'] },
  { id: 'LV-002', name: 'Jade Orchid Jar', category: 'Luxe Vase Arrangements', price: 120, img: 'products/ivory-tulip.jpg', tag: 'New', rating: 4.9, reviews: 58, palette: ['Lime', 'Ivory'] },
  { id: 'EC-004', name: 'Rosé Posy Tote', category: 'Event and Corporate Hire', price: 88, img: 'products/magenta-garden.jpg', tag: 'Gift', rating: 4.9, reviews: 121, palette: ['Blush', 'Magenta'] },
  { id: 'WH-003', name: 'Peony Cascade', category: 'Wedding Hire', price: 118, img: 'products/coral-peony.jpg', rating: 4.9, reviews: 96, palette: ['Coral', 'Blush', 'Ivory'] },
  { id: 'EC-005', name: 'Golden Graduate', category: 'Event and Corporate Hire', price: 90, img: 'products/graduation-lily.jpg', tag: 'Gift', rating: 4.8, reviews: 64, palette: ['Coral', 'Ivory'] },
  { id: 'WH-004', name: 'Sunbeam Bundle', category: 'Wedding Hire', price: 80, img: 'products/studio-pink.jpg', rating: 4.7, reviews: 52, palette: ['Blush', 'Ivory'] },
  { id: 'LV-003', name: 'Pearl Calla Pot', category: 'Luxe Vase Arrangements', price: 102, img: 'products/calla-cascade.jpg', rating: 4.8, reviews: 47, palette: ['Peach', 'Ivory'] },
  { id: 'WH-005', name: 'Teddy Blossom', category: 'Wedding Hire', price: 70, img: 'products/sunshine-bear.jpg', tag: 'Gift', rating: 4.8, reviews: 85, palette: ['Mint', 'Champagne'] },
];

export const CATEGORIES = ['All', 'Bouquets', 'Luxe Vase Arrangements', 'Event and Corporate Hire', 'Wedding Hire'];

// Fallback gradient shown when a product image fails to load.
export const FALLBACK_BG = 'linear-gradient(135deg, #f6d6cd 0%, #e7c9a7 50%, #dceddd 100%)';

export const normaliseProduct = (p) => ({
  ...p,
  img: p.img || p.image_url || (p.images && p.images[0]) || '',
  image_url: p.image_url || p.img || '',
  images: p.images && p.images.length ? p.images : (p.img || p.image_url ? [p.img || p.image_url] : []),
  event: p.event || '',
  stock: p.stock ?? 0,
  palette: p.palette || [],
  details: p.details || [],
  sizes: p.sizes || [],
  created_at: p.created_at || new Date().toISOString(),
});
