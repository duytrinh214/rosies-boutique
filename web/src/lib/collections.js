// Shop collection config — shared between ShopPage (filtering/listing) and
// HomePage (carousels), so it lives outside any single page component.
export const COLLECTIONS = {
  everyday: {
    title: 'Bouquets',
    eyebrow: 'Curated · Hand-tied',
    blurb: 'Joyful, full-bodied bouquets composed for the simple pleasure of fresh stems at home.',
    filter: (p) => p.category === 'Bouquets',
  },
  wedding: {
    title: 'Luxe Vase Arrangements',
    eyebrow: 'Curated · Statement',
    blurb: 'Sculptural stems arranged in glass — ivory, champagne and blush palettes that hold a room.',
    filter: (p) => p.category === 'Luxe Vase Arrangements',
  },
  gifts: {
    title: 'Event and Corporate Hire',
    eyebrow: 'Curated · At scale',
    blurb: 'Boxed arrangements, keepsakes and installation-ready pieces for events and corporate spaces.',
    filter: (p) => p.category === 'Event and Corporate Hire',
  },
  weddinghire: {
    title: 'Wedding Hire',
    eyebrow: 'Curated · Celebrations',
    blurb: 'Arches, aisle florals and centrepieces available to hire for ceremonies and receptions.',
    filter: (p) => p.category === 'Wedding Hire',
  },
};

export const DRAG_ROWS = [
  { key: 'everyday', eyebrow: 'Nº 01 · Hand-tied', title: 'Bouquets' },
  { key: 'wedding', eyebrow: 'Nº 02 · Statement', title: 'Luxe Vase Arrangements' },
  { key: 'gifts', eyebrow: 'Nº 03 · At scale', title: 'Event and Corporate Hire' },
  { key: 'weddinghire', eyebrow: 'Nº 04 · Celebrations', title: 'Wedding Hire' },
];
