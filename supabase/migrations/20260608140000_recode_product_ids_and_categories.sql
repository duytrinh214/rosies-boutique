-- Re-code product IDs and categories to match the storefront's four
-- collections, using short category-prefixed codes (BQ/LV/EC/WH-NNN).

-- Bouquets
update public.products set id = 'BQ-001', category = 'Bouquets' where id = 'sunset-atelier';
update public.products set id = 'BQ-002', category = 'Bouquets' where id = 'magenta-garden';
update public.products set id = 'BQ-003', category = 'Bouquets' where id = 'burgundy-crescent';
update public.products set id = 'BQ-004', category = 'Bouquets' where id = 'studio-pink';
update public.products set id = 'BQ-005', category = 'Bouquets' where id = 'coral-peony';

-- Luxe Vase Arrangements
update public.products set id = 'LV-001', category = 'Luxe Vase Arrangements' where id = 'ivory-tulip';
update public.products set id = 'LV-002', category = 'Luxe Vase Arrangements' where id = 'jade-orchid';
update public.products set id = 'LV-003', category = 'Luxe Vase Arrangements' where id = 'pearl-calla';
update public.products set id = 'LV-004', category = 'Luxe Vase Arrangements' where id = 'calla-cascade';
update public.products set id = 'LV-005', category = 'Luxe Vase Arrangements' where id = 'crimson-orchid';

-- Event and Corporate Hire
update public.products set id = 'EC-001', category = 'Event and Corporate Hire' where id = 'graduation-lily';
update public.products set id = 'EC-002', category = 'Event and Corporate Hire' where id = 'sunshine-bear';
update public.products set id = 'EC-003', category = 'Event and Corporate Hire' where id = 'teacup-romance';
update public.products set id = 'EC-004', category = 'Event and Corporate Hire' where id = 'rose-tote';
update public.products set id = 'EC-005', category = 'Event and Corporate Hire' where id = 'golden-graduate';

-- Wedding Hire
update public.products set id = 'WH-001', category = 'Wedding Hire' where id = 'spring-lush';
update public.products set id = 'WH-002', category = 'Wedding Hire' where id = 'amber-protea';
update public.products set id = 'WH-003', category = 'Wedding Hire' where id = 'peony-cascade';
update public.products set id = 'WH-004', category = 'Wedding Hire' where id = 'sunbeam-bundle';
update public.products set id = 'WH-005', category = 'Wedding Hire' where id = 'teddy-blossom';
