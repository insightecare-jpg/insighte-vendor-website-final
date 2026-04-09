// ─── Geo-Location Utilities ──────────────────────────────────────────────────
// Maps browser lat/lng to Insighte service zones.
// Strategy:
//   1. Check if coordinates fall within any known SERVICE CITY metro radius (60 km).
//   2. Within that city, find the nearest neighbourhood zone.
//   3. If outside all service cities, return a generic zone for that city using
//      reverse geocoding (nominatim — free, no API key).
//   4. Fall back to "Online / Remote" if nothing resolves.

export interface Zone {
  id: string;
  label: string;
  city: string;
  lat: number;
  lng: number;
}

// ─── NEIGHBOURHOOD ZONES (within service cities) ──────────────────────────────
export const ZONES: Zone[] = [
  // Bangalore
  { id: "whitefield",       label: "Near Whitefield",       city: "Bangalore", lat: 12.9698, lng: 77.7499 },
  { id: "jayanagar",        label: "Near Jayanagar",        city: "Bangalore", lat: 12.9302, lng: 77.5830 },
  { id: "hebbal",           label: "Near Hebbal",           city: "Bangalore", lat: 13.0352, lng: 77.5970 },
  { id: "electronic-city",  label: "Near Electronic City",  city: "Bangalore", lat: 12.8399, lng: 77.6770 },
  { id: "central-bangalore",label: "Central Bangalore",     city: "Bangalore", lat: 12.9716, lng: 77.5946 },
  { id: "koramangala",      label: "Near Koramangala",      city: "Bangalore", lat: 12.9352, lng: 77.6245 },
  { id: "indiranagar",      label: "Near Indiranagar",      city: "Bangalore", lat: 12.9784, lng: 77.6408 },
  { id: "sarjapur",         label: "Near Sarjapur",         city: "Bangalore", lat: 12.9010, lng: 77.6960 },
  { id: "yelahanka",        label: "Near Yelahanka",        city: "Bangalore", lat: 13.1007, lng: 77.5963 },
  // Delhi NCR
  { id: "delhi-central",    label: "Central Delhi",         city: "Delhi",     lat: 28.6139, lng: 77.2090 },
  { id: "delhi-south",      label: "South Delhi",           city: "Delhi",     lat: 28.5355, lng: 77.2503 },
  { id: "gurgaon",          label: "Near Gurgaon",          city: "Delhi NCR", lat: 28.4595, lng: 77.0266 },
  { id: "noida",            label: "Near Noida",            city: "Delhi NCR", lat: 28.5355, lng: 77.3910 },
  // Mumbai
  { id: "mumbai-central",   label: "Central Mumbai",        city: "Mumbai",    lat: 18.9388, lng: 72.8354 },
  { id: "mumbai-west",      label: "West Mumbai / Bandra",  city: "Mumbai",    lat: 19.0596, lng: 72.8295 },
  { id: "thane",            label: "Near Thane",            city: "Mumbai",    lat: 19.2183, lng: 72.9781 },
  // Kochi
  { id: "central-kochi",    label: "Central Kochi",         city: "Kochi",     lat: 9.9312,  lng: 76.2673 },
  { id: "ernakulam",        label: "Near Ernakulam",        city: "Kochi",     lat: 9.9816,  lng: 76.2999 },
  // Trivandrum / Thiruvananthapuram
  { id: "trivandrum-central", label: "Central Trivandrum",  city: "Trivandrum", lat: 8.5241, lng: 76.9366 },
  { id: "technopark",       label: "Near Technopark",       city: "Trivandrum", lat: 8.5572, lng: 76.8816 },
  { id: "kazhakkoottam",    label: "Near Kazhakkoottam",    city: "Trivandrum", lat: 8.5689, lng: 76.8695 },
  // Chennai
  { id: "chennai-central",  label: "Central Chennai",       city: "Chennai",   lat: 13.0827, lng: 80.2707 },
  { id: "chennai-south",    label: "South Chennai / Adyar", city: "Chennai",   lat: 13.0063, lng: 80.2574 },
  { id: "velachery",        label: "Near Velachery",        city: "Chennai",   lat: 12.9815, lng: 80.2180 },
  // Hyderabad
  { id: "hyderabad-central",label: "Central Hyderabad",     city: "Hyderabad", lat: 17.3850, lng: 78.4867 },
  { id: "hitech-city",      label: "Near Hitech City",      city: "Hyderabad", lat: 17.4435, lng: 78.3772 },
  { id: "secunderabad",     label: "Near Secunderabad",     city: "Hyderabad", lat: 17.4399, lng: 78.4983 },
  // Pune
  { id: "pune-central",     label: "Central Pune",          city: "Pune",      lat: 18.5204, lng: 73.8567 },
  { id: "hinjewadi",        label: "Near Hinjewadi",        city: "Pune",      lat: 18.5900, lng: 73.7381 },
  // Generic online
  { id: "online",           label: "Online / Remote",       city: "India",     lat: 20.5937, lng: 78.9629 },
];

// ─── SERVICE CITY CENTRES + METRO RADIUS ─────────────────────────────────────
// We only show neighbourhood zones for cities where Insighte has specialists.
// If the user is within `radiusKm`, we pick a neighbourhood. Otherwise, city name only.
const SERVICE_CITIES = [
  { name: "Bangalore",  lat: 12.9716, lng: 77.5946, radiusKm: 65 },
  { name: "Delhi",      lat: 28.6139, lng: 77.2090, radiusKm: 80 },
  { name: "Mumbai",     lat: 18.9388, lng: 72.8354, radiusKm: 70 },
  { name: "Kochi",      lat: 9.9312,  lng: 76.2673, radiusKm: 40 },
  { name: "Trivandrum", lat: 8.5241,  lng: 76.9366, radiusKm: 40 },
  { name: "Chennai",    lat: 13.0827, lng: 80.2707, radiusKm: 55 },
  { name: "Hyderabad",  lat: 17.3850, lng: 78.4867, radiusKm: 60 },
  { name: "Pune",       lat: 18.5204, lng: 73.8567, radiusKm: 50 },
];

// ─── PINCODE → ZONE ───────────────────────────────────────────────────────────
// Covers all service cities. Expand as needed.
const PINCODE_ZONE_MAP: Record<string, string> = {
  // Bangalore
  "560066": "whitefield", "560067": "whitefield", "560087": "whitefield",
  "560011": "jayanagar",  "560041": "hebbal",       "560100": "electronic-city",
  "560001": "central-bangalore", "560034": "indiranagar", "560047": "koramangala",
  "560103": "sarjapur",   "560064": "yelahanka",
  // Delhi NCR
  "110001": "delhi-central", "110049": "delhi-south",
  "122001": "gurgaon",    "122022": "gurgaon",
  "201301": "noida",      "201304": "noida",
  // Mumbai
  "400001": "mumbai-central", "400050": "mumbai-west", "400051": "mumbai-west",
  "400601": "thane",      "400602": "thane",
  // Kochi
  "682001": "central-kochi", "682016": "ernakulam", "682031": "ernakulam",
  // Trivandrum
  "695001": "trivandrum-central", "695002": "trivandrum-central",
  "695581": "technopark",  "695582": "technopark",
  "695524": "kazhakkoottam",
  // Chennai
  "600001": "chennai-central", "600020": "chennai-south",
  "600042": "velachery",  "600090": "velachery",
  // Hyderabad
  "500001": "hyderabad-central", "500081": "hitech-city",
  "500003": "secunderabad",
  // Pune
  "411001": "pune-central", "411057": "hinjewadi", "411027": "hinjewadi",
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ─── CORE: LAT/LNG → ZONE ────────────────────────────────────────────────────
// Returns the best zone for given coordinates using 3-tier strategy.
export function getNearestZone(lat: number, lng: number): Zone {
  // Defensive: basic check for invalid or placeholder coordinates
  if (!lat || !lng || (lat === 0 && lng === 0)) {
    return ZONES.find((z) => z.id === "online")!;
  }

  // Tier 1: Is this inside a service city metro?
  let matchedCity: typeof SERVICE_CITIES[0] | null = null;
  let closestCityDist = Infinity;

  for (const city of SERVICE_CITIES) {
    const d = haversineKm(lat, lng, city.lat, city.lng);
    // User must be within the specified metro radius of the city center
    if (d <= city.radiusKm && d < closestCityDist) {
      closestCityDist = d;
      matchedCity = city;
    }
  }

  if (matchedCity) {
    // Tier 2: Find nearest neighbourhood within that city
    const cityZones = ZONES.filter((z) => z.city === matchedCity!.name);
    if (cityZones.length === 0) return ZONES.find((z) => z.id === "online")!;
    
    let nearest = cityZones[0];
    let minDist = Infinity;
    for (const z of cityZones) {
      const d = haversineKm(lat, lng, z.lat, z.lng);
      if (d < minDist) { minDist = d; nearest = z; }
    }
    return nearest;
  }

  // Tier 3: Outside all service cities — return the online fallback.
  // The caller (getUserZone) will attempt to refine this with reverse geocoding if needed.
  return ZONES.find((z) => z.id === "online")!;
}

// ─── REVERSE GEOCODE (Nominatim — free, no key) ───────────────────────────────
// Returns city name or null if fetch fails / times out.
async function reverseGeocode(lat: number, lng: number): Promise<string | null> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&addressdetails=1`,
      { headers: { "Accept-Language": "en" }, signal: AbortSignal.timeout(4000) }
    );
    if (!res.ok) return null;
    const json = await res.json();
    // Prefer city > town > state_district
    return (
      json.address?.city ||
      json.address?.town ||
      json.address?.state_district ||
      json.address?.county ||
      null
    );
  } catch {
    return null;
  }
}

// ─── MAIN: GET USER ZONE ──────────────────────────────────────────────────────
export async function getUserZone(): Promise<Zone | null> {
  if (typeof window === "undefined") return null;

  return new Promise((resolve) => {
    if (!navigator.geolocation) { resolve(null); return; }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        const zone = getNearestZone(lat, lng);

        // If coordinate resolved to the generic online zone, try reverse geocoding
        // to build a useful city label instead of "Online / Remote"
        if (zone.id === "online") {
          const cityName = await reverseGeocode(lat, lng);
          if (cityName) {
            // Return a synthetic zone with the real city name
            resolve({
              id:    `generic-${cityName.toLowerCase().replace(/\s+/g, "-")}`,
              label: cityName,
              city:  cityName,
              lat,
              lng,
            });
            return;
          }
        }

        resolve(zone);
      },
      () => resolve(null),
      { timeout: 7000, enableHighAccuracy: false }
    );
  });
}

// ─── PINCODE LOOKUP ───────────────────────────────────────────────────────────
export function getPincodeZone(pincode: string): Zone | null {
  const zoneId = PINCODE_ZONE_MAP[pincode.trim()];
  return ZONES.find((z) => z.id === zoneId) ?? null;
}

// ─── CACHE ────────────────────────────────────────────────────────────────────
export function getCachedZone(): Zone | null {
  try {
    const raw = localStorage.getItem("insighte_geo_zone");
    if (!raw) return null;
    return JSON.parse(raw) as Zone;
  } catch { return null; }
}

export function setCachedZone(zone: Zone): void {
  try { localStorage.setItem("insighte_geo_zone", JSON.stringify(zone)); } catch {}
}
