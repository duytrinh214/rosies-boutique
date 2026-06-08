// Shop collection config — shared between ShopPage (filtering/listing) and
// HomePage (carousels), so it lives outside any single page component.
export const COLLECTIONS = {
  bouquets: {
    title: 'Bouquets',
    filter: (p) => p.category === 'Bouquets',
  },
  'luxe-vase-arrangements': {
    title: 'Luxe Vase Arrangements',
    filter: (p) => p.category === 'Luxe Vase Arrangements',
  },
  'event-corporate-hire': {
    title: 'Event and Corporate Hire',
    filter: (p) => p.category === 'Event and Corporate Hire',
  },
  'wedding-hire': {
    title: 'Wedding Hire',
    filter: (p) => p.category === 'Wedding Hire',
  },
};

export const DRAG_ROWS = [
  { key: 'bouquets', eyebrow: 'Nº 01 · Hand-tied', title: 'Bouquets' },
  { key: 'luxe-vase-arrangements', eyebrow: 'Nº 02 · Statement', title: 'Luxe Vase Arrangements' },
  { key: 'event-corporate-hire', eyebrow: 'Nº 03 · At scale', title: 'Event and Corporate Hire' },
  { key: 'wedding-hire', eyebrow: 'Nº 04 · Celebrations', title: 'Wedding Hire' },
];
