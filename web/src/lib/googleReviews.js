// ===== GOOGLE BUSINESS REVIEWS =====
// Pulls reviews for the Rosie's Boutique listing from the Google Maps
// Places library, entirely client-side. Set these in your .env:
//   VITE_GOOGLE_PLACES_API_KEY  — Google Cloud key with the Places API
//                                 + Maps JavaScript API enabled, restricted
//                                 to your website's domain (HTTP referrer).
//   VITE_GOOGLE_PLACE_ID        — the Place ID of your Google Business
//                                 listing (find it with Google's Place ID
//                                 Finder: https://developers.google.com/maps/documentation/places/web-service/place-id).
//
// Google returns at most 5 reviews per place and picks which ones. Results
// are cached in localStorage for 24h so visitors don't trigger a billable
// lookup on every page load. If anything is missing or fails, the homepage
// falls back to its built-in sample reviews.

const API_KEY = import.meta.env.VITE_GOOGLE_PLACES_API_KEY || '';
const PLACE_ID = import.meta.env.VITE_GOOGLE_PLACE_ID || '';
const CACHE_KEY = 'rb_google_reviews_v1';
const CACHE_TTL = 24 * 60 * 60 * 1000; // refresh at most once per day

export const isGoogleReviewsConfigured = Boolean(API_KEY && PLACE_ID);

let mapsPromise = null;
const loadMaps = () => {
  if (window.google?.maps) return Promise.resolve(window.google);
  if (mapsPromise) return mapsPromise;
  mapsPromise = new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(API_KEY)}&v=weekly&libraries=places&loading=async`;
    s.async = true;
    s.onload = () => resolve(window.google);
    s.onerror = () => reject(new Error('Could not load Google Maps JS'));
    document.head.appendChild(s);
  });
  return mapsPromise;
};

// Normalises both the modern Place API and the legacy PlacesService shapes.
const normalize = (r) => {
  const author = r.authorAttribution || {};
  return {
    name: author.displayName || r.author_name || 'Google reviewer',
    photo: author.photoURI || r.profile_photo_url || '',
    url: author.uri || r.author_url || '',
    rating: r.rating || 5,
    text: (r.text && r.text.text) || r.text || '',
    time: r.relativePublishTimeDescription || r.relative_time_description || '' };

};

const fetchFromGoogle = async () => {
  const google = await loadMaps();

  // Prefer the modern Place class.
  if (google.maps.importLibrary) {
    try {
      const { Place } = await google.maps.importLibrary('places');
      const place = new Place({ id: PLACE_ID });
      await place.fetchFields({ fields: ['reviews', 'rating', 'userRatingCount'] });
      if (place.reviews?.length) return place.reviews.map(normalize);
    } catch (e) {
      console.warn('New Places API failed, trying legacy:', e.message);
    }
  }

  // Legacy fallback (older projects).
  return new Promise((resolve, reject) => {
    const svc = new google.maps.places.PlacesService(document.createElement('div'));
    svc.getDetails(
      { placeId: PLACE_ID, fields: ['reviews', 'rating', 'user_ratings_total'] },
      (place, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && place?.reviews) {
          resolve(place.reviews.map(normalize));
        } else {
          reject(new Error('Places status: ' + status));
        }
      });

  });
};

export const fetchGoogleReviews = async () => {
  if (!isGoogleReviewsConfigured) return null;

  // Serve from cache when still fresh.
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (raw) {
      const { at, data } = JSON.parse(raw);
      if (Date.now() - at < CACHE_TTL && Array.isArray(data) && data.length) return data;
    }
  } catch { /* ignore cache errors */ }

  try {
    const reviews = (await fetchFromGoogle()).filter((r) => r.text);
    if (reviews.length) {
      try { localStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), data: reviews })); } catch { /* ignore */ }
    }
    return reviews;
  } catch (e) {
    console.warn('Google reviews unavailable:', e.message);
    return null;
  }
};
