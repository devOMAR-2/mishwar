import { html } from '../lib/html.js';

/**
 * Abstract "where our ingredients come from" map: a faint graticule, the
 * Red Sea and Gulf named in the margins, and a dotted route from each
 * producing region to Riyadh. No coastline is drawn on purpose — it's a
 * diagram, not a survey map.
 */

const BOUNDS = { west: 38.6, east: 52, north: 28.6, south: 16.4 };
const SCALE_X = 30; // px per degree of longitude
const SCALE_Y = 33.3; // px per degree of latitude (≈ SCALE_X / cos 25°)
const WIDTH = Math.round((BOUNDS.east - BOUNDS.west) * SCALE_X);
const HEIGHT = Math.round((BOUNDS.north - BOUNDS.south) * SCALE_Y);
const RIYADH = { lat: 24.71, lng: 46.68 };
const SEAS = [
  { name: { ar: 'البحر الأحمر', en: 'Red Sea' }, at: { lat: 18.8, lng: 40 }, angle: 58 },
  { name: { ar: 'الخليج العربي', en: 'Arabian Gulf' }, at: { lat: 27, lng: 51 }, angle: 36 },
];

const project = ({ lat, lng }) => ({
  x: +((lng - BOUNDS.west) * SCALE_X).toFixed(1),
  y: +((BOUNDS.north - lat) * SCALE_Y).toFixed(1),
});

/** Gently bowed route from a place to Riyadh. */
function route(from, to) {
  const mx = (from.x + to.x) / 2;
  const my = (from.y + to.y) / 2;
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const bow = 0.14;
  return `M${from.x} ${from.y} Q${(mx - dy * bow).toFixed(1)} ${(my + dx * bow).toFixed(1)} ${to.x} ${to.y}`;
}

const pad = (n) => String(n).padStart(2, '0');

export function originsMap(ctx, { places, items, riyadhLabel, label }) {
  const riyadh = project(RIYADH);
  const lats = [18, 20, 22, 24, 26, 28];
  const lngs = [40, 42, 44, 46, 48, 50];

  const markers = Object.entries(places).map(([id, place]) => {
    const p = project(place.coords);
    const numbers = items
      .map((item, i) => (item.place === id ? pad(i + 1) : null))
      .filter(Boolean)
      .join(' · ');
    return { p, numbers, name: ctx.t(place.name) };
  });

  return html`
  <svg class="origins-map" viewBox="0 0 ${WIDTH} ${HEIGHT}" role="img" aria-label="${label}">
    <g class="origins-map__grid">
      ${lats.map((lat) => html`<line x1="0" x2="${WIDTH}" y1="${project({ lat, lng: 0 }).y}" y2="${project({ lat, lng: 0 }).y}"/>`)}
      ${lngs.map((lng) => html`<line y1="0" y2="${HEIGHT}" x1="${project({ lat: 0, lng }).x}" x2="${project({ lat: 0, lng }).x}"/>`)}
    </g>
    <g class="origins-map__degrees" aria-hidden="true">
      ${lats.map((lat) => html`<text x="4" y="${project({ lat, lng: 0 }).y - 4}">${lat}°N</text>`)}
      ${lngs.map((lng) => html`<text x="${project({ lat: 0, lng }).x + 4}" y="${HEIGHT - 6}">${lng}°E</text>`)}
    </g>
    <g class="origins-map__seas" aria-hidden="true">
      ${SEAS.map((sea) => {
        const p = project(sea.at);
        return html`<text transform="translate(${p.x} ${p.y}) rotate(${sea.angle})" text-anchor="middle">${ctx.t(sea.name)}</text>`;
      })}
    </g>
    <g class="origins-map__routes">
      ${markers.map((m) => html`<path d="${route(m.p, riyadh)}"/>`)}
    </g>
    <g class="origins-map__places">
      ${markers.map(
        (m) => html`<g class="origins-map__place">
          <circle cx="${m.p.x}" cy="${m.p.y}" r="3.5"/>
          <text x="${m.p.x + 9}" y="${m.p.y + 4}">
            <tspan class="origins-map__name">${m.name}</tspan>
            <tspan class="origins-map__nums" x="${m.p.x + 9}" dy="14">${m.numbers}</tspan>
          </text>
        </g>`
      )}
    </g>
    <g class="origins-map__riyadh">
      <circle class="origins-map__halo" cx="${riyadh.x}" cy="${riyadh.y}" r="13"/>
      <circle cx="${riyadh.x}" cy="${riyadh.y}" r="6"/>
      <text x="${riyadh.x}" y="${riyadh.y - 20}" text-anchor="middle">${riyadhLabel}</text>
    </g>
  </svg>`;
}
