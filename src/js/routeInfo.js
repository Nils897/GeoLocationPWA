/**
 * Loads all location-related information for a given coordinate pair.
 * This combines nearby Wikipedia attractions with reverse-geocoded
 * address data from OpenStreetMap.
 *
 * @param {number} lat - Latitude of the selected point
 * @param {number} lon - Longitude of the selected point
 * @returns {Promise<{streetName: string, description: string, nearbyAttractions: Array}>}
 */
export default async function getRouteInfo(lat, lon) {

    // Load Wikipedia attractions and reverse-geocoded address in parallel
    const [nearbyAttractions, addressInformation] = await Promise.all([
        getNearbyAttractions(lat, lon),
        reverseGeoCode(lat, lon)
    ]);
    // Street name shown in the UI
    const streetName = addressInformation.street;
    // Short human-readable description (postcode, city, country)
    const description = addressInformation.postcode + ' ' + addressInformation.city + ', ' + addressInformation.country;
    return {streetName, description, nearbyAttractions};
}

/**
 * Queries the Wikipedia GeoSearch API for articles located near the given coordinates.
 * Each result includes title, short description and geographic position.
 *
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @returns {Promise<Array>} List of nearby Wikipedia attractions
 */
async function getNearbyAttractions(lat, lon) {
    const endpoint = "https://de.wikipedia.org/w/api.php";

    // Wikipedia API parameters (GeoSearch + content extraction)
    const params = new URLSearchParams({
        action: "query",
        format: "json",
        origin: "*",
        generator: "geosearch",
        ggscoord: `${lat}|${lon}`,
        ggsradius: "1000",
        ggslimit: "20",
        prop: "coordinates|extracts",
        exintro: "1",
        explaintext: "1"
    });

    const response = await fetch(`${endpoint}?${params.toString()}`);
    if (!response.ok) throw new Error("Wikipedia request failed");

    const data = await response.json();

    // Wikipedia returns pages as an object keyed by pageid
    const pagesObj = data?.query?.pages;
    if (!pagesObj || Object.keys(pagesObj).length === 0) {
        return [];
    }

    // In saubere Liste umwandeln
    return Object.values(pagesObj).map(p => ({
        pageid: p.pageid,
        title: p.title,
        extract: p.extract ?? "",
        lat: p.coordinates?.[0]?.lat,
        lon: p.coordinates?.[0]?.lon
    }));
}

/**
 * Performs reverse geocoding using OpenStreetMap (Nominatim).
 * Converts latitude/longitude into a human-readable address.
 *
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @returns {Promise<Object>} Structured address information
 */
async function reverseGeoCode(lat, lon) {

    // Build Nominatim reverse-geocoding request
    const url = new URL("https://nominatim.openstreetmap.org/reverse");
    url.search = new URLSearchParams({
        format: "jsonv2",
        lat: String(lat),
        lon: String(lon),
        adressdetails: "1"
    }).toString();

    // Nominatim requires a User-Agent for identification
    const response = await fetch(url, {
        headers: {
            "User-Agent": "UniProject (University Assignment)"
        }
    });

    if (!response.ok) throw new Error(`Nominatim error: ${response.status}`);

    const data = await response.json();

    const address = data.address ?? {};
    // City fallback logic because different places use different fields
    const city = address.city ?? address.town ?? address.village ?? address.municipallity ?? "(Keine Stadt gefunden)";

    return {
        displayName: data.display_name ?? null,
        street: address.road ?? address.pedestrian ?? address.footway ?? "Keine Straße gefunden",
        postcode: address.postcode ?? "(Keine Postleitzahl gefunden)",
        suburb: address.suburb ?? address.city_district ?? null,
        city: city,
        state: address.state ?? null,
        country: address.country ?? "(Kein Land gefunden)"
    }
}