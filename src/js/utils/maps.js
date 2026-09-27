/**
 * Map link for a branch (shared by build and browser).
 * Placeholder domain for this fictional project — point it at a real maps
 * provider's search URL when the branches exist.
 */

export const mapsUrl = ({ coordinates: { lat, lng } }) => `https://maps.example/?q=${lat}%2C${lng}`;
