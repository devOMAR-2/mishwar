import { html } from '../lib/html.js';
import { locationsPage } from '../../content/locations.js';

/**
 * Stylised map of Riyadh: a handful of arteries drawn as thin lines on
 * plaster, branch pins placed from their real coordinates, and the dotted
 * "mishwar" route that links them.
 *
 * Lines live in a single inline SVG (non-scaling strokes, so they stay
 * hairline at any size). Everything that has to stay legible — pins, road
 * names — is HTML laid over it at percentage positions, so type is sized in
 * rem rather than shrinking with the viewBox on phones.
 *
 * Geography is physical: overlay positions use left/top on purpose and the
 * map is never mirrored for RTL.
 */

const BOUNDS = { west: 46.53, east: 46.86, north: 24.9, south: 24.66 };
const VIEW = { w: 800, h: 640 }; // ≈ 33 km × 27 km

const project = ([lng, lat]) => [
  +(((lng - BOUNDS.west) / (BOUNDS.east - BOUNDS.west)) * VIEW.w).toFixed(1),
  +(((BOUNDS.north - lat) / (BOUNDS.north - BOUNDS.south)) * VIEW.h).toFixed(1),
];

const percent = (point) => {
  const [x, y] = project(point);
  return `left:${((x / VIEW.w) * 100).toFixed(2)}%;top:${((y / VIEW.h) * 100).toFixed(2)}%`;
};

/** Smooth path through points (Catmull-Rom → cubic Bézier). */
function smooth(points) {
  const p = points.map(project);
  let d = `M${p[0][0]} ${p[0][1]}`;
  for (let i = 0; i < p.length - 1; i++) {
    const [p0, p1, p2, p3] = [p[i - 1] ?? p[i], p[i], p[i + 1], p[i + 2] ?? p[i + 1]];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0]} ${p2[1]}`;
  }
  return d;
}

// [lng, lat] — simplified, not survey-accurate.
const ROADS = {
  major: [
    // King Fahd Rd
    [[46.598, 24.9], [46.618, 24.86], [46.632, 24.82], [46.648, 24.78], [46.668, 24.74], [46.686, 24.705], [46.702, 24.66]],
    // King Salman Rd
    [[46.54, 24.836], [46.62, 24.834], [46.7, 24.832], [46.78, 24.829], [46.86, 24.826]],
  ],
  ring: [
    // Northern + Eastern ring
    [[46.585, 24.745], [46.62, 24.763], [46.665, 24.773], [46.705, 24.776], [46.738, 24.77], [46.757, 24.752], [46.766, 24.72], [46.774, 24.69], [46.78, 24.66]],
    // Western stretch
    [[46.585, 24.745], [46.578, 24.712], [46.584, 24.684], [46.594, 24.66]],
  ],
  minor: [
    // Airport Rd
    [[46.716, 24.776], [46.712, 24.82], [46.708, 24.86], [46.703, 24.9]],
    // Makkah Rd
    [[46.575, 24.672], [46.64, 24.683], [46.7, 24.69], [46.78, 24.7], [46.86, 24.712]],
    // King Abdullah Rd
    [[46.6, 24.722], [46.66, 24.726], [46.72, 24.73], [46.766, 24.731]],
    // Dammam Rd
    [[46.757, 24.752], [46.79, 24.772], [46.825, 24.79], [46.86, 24.806]],
    // Imam Abdullah Ibn Saud Rd
    [[46.716, 24.8], [46.76, 24.806], [46.81, 24.812], [46.86, 24.818]],
    // Othman Bin Affan Rd
    [[46.664, 24.774], [46.66, 24.83], [46.656, 24.9]],
  ],
  wadi: [[46.548, 24.9], [46.556, 24.86], [46.548, 24.822], [46.566, 24.79], [46.56, 24.752], [46.575, 24.72], [46.57, 24.69], [46.585, 24.66]],
};

const ROAD_LABELS = [
  { key: 'kingFahd', at: [46.6125, 24.872], angle: 70 },
  { key: 'kingSalman', at: [46.585, 24.835], angle: 0 },
  { key: 'northernRing', at: [46.69, 24.7755], angle: 1, minor: true },
  { key: 'easternRing', at: [46.7615, 24.735], angle: 76, minor: true },
  { key: 'airport', at: [46.71, 24.873], angle: -85, minor: true },
  { key: 'wadi', at: [46.5545, 24.805], angle: 80, wadi: true },
];

const OLAYA = [46.674, 24.711];
const AIRPORT = [46.703, 24.9];
/** The third branch has no confirmed district; its marker only says "further along the road". */
const NEXT_STOP = [46.79, 24.7];

/** Which side of the pin its label sits on. */
const LABEL_SIDE = { yasmin: 'left', qurtubah: 'right' };

export function riyadhMap(ctx, branches) {
  const c = locationsPage.map;
  const open = branches.filter((b) => b.status === 'open');
  const soon = branches.find((b) => b.status !== 'open');
  const stops = open.map((b) => project([b.coordinates.lng, b.coordinates.lat]));

  // Dotted route through the open branches, bowing north like an evening drive.
  const route = stops.slice(1).reduce((d, [x, y], i) => {
    const [px, py] = stops[i];
    return `${d} Q${((px + x) / 2).toFixed(1)} ${(Math.min(py, y) - 90).toFixed(1)} ${x} ${y}`;
  }, `M${stops[0][0]} ${stops[0][1]}`);
  const last = stops.at(-1);
  const [nx, ny] = project(NEXT_STOP);
  const onward = `M${last[0]} ${last[1]} Q${nx + 30} ${((last[1] + ny) / 2).toFixed(1)} ${nx} ${ny}`;

  const scaleKm = 5;
  const scaleW = (scaleKm / ((BOUNDS.east - BOUNDS.west) * 101.2)) * VIEW.w;

  return html`
  <figure class="rmap">
    <div class="rmap__canvas">
      <svg class="rmap__lines" viewBox="0 0 ${VIEW.w} ${VIEW.h}" preserveAspectRatio="none" aria-hidden="true" focusable="false">
        <path class="rmap__wadi" d="${smooth(ROADS.wadi)}"/>
        ${ROADS.minor.map((r) => html`<path class="rmap__road rmap__road--minor" d="${smooth(r)}"/>`)}
        ${ROADS.ring.map((r) => html`<path class="rmap__road rmap__road--casing" d="${smooth(r)}"/><path class="rmap__road rmap__road--ring" d="${smooth(r)}"/>`)}
        ${ROADS.major.map((r) => html`<path class="rmap__road rmap__road--casing rmap__road--wide" d="${smooth(r)}"/><path class="rmap__road rmap__road--major" d="${smooth(r)}"/>`)}
        <path class="rmap__onward" d="${onward}"/>
        <path class="rmap__route" d="${route}"/>
        <path class="rmap__scale" d="M24 ${VIEW.h - 30} v6 h${scaleW.toFixed(1)} v-6"/>
      </svg>

      <p class="rmap__city" aria-hidden="true">${ctx.t(c.city)}</p>

      <div class="rmap__labels" aria-hidden="true">
        ${ROAD_LABELS.map(
          (l) => html`<span class="rmap__road-label${l.minor ? ' rmap__road-label--minor' : ''}${l.wadi ? ' rmap__road-label--wadi' : ''}" style="${percent(l.at)};--angle:${l.angle}deg">${ctx.t(c.roads[l.key])}</span>`
        )}
        <span class="rmap__place" style="${percent(OLAYA)}">${ctx.t(c.places.olaya)}</span>
        <span class="rmap__airport" style="${percent(AIRPORT)}">↑ ${ctx.t(c.places.airport)}</span>
        <span class="rmap__north"><span class="rmap__north-arrow"></span>${ctx.t(c.north)}</span>
        <span class="rmap__scale-label" style="left:3%;top:calc(100% - 2.6rem)">${ctx.t(c.scale)}</span>
      </div>

      ${open.map(
        (b) => html`<a class="rmap__pin rmap__pin--${LABEL_SIDE[b.id] ?? 'right'}" href="#branch-${b.id}" style="${percent([b.coordinates.lng, b.coordinates.lat])}">
          <span class="rmap__dot" aria-hidden="true"></span>
          <span class="rmap__tag">
            <span class="rmap__name">${ctx.t(b.shortName)}</span>
            <span class="rmap__alt ${ctx.otherLang === 'en' ? 'name-en' : 'name-ar'}" lang="${ctx.otherLang}" aria-hidden="true">${b.shortName[ctx.otherLang]}</span>
          </span>
          <span class="visually-hidden"> — ${ctx.t(c.jump)}</span>
        </a>`
      )}
      ${soon
        ? html`<a class="rmap__pin rmap__pin--soon rmap__pin--left" href="#branch-${soon.id}" style="${percent(NEXT_STOP)}">
            <span class="rmap__dot" aria-hidden="true">?</span>
            <span class="rmap__tag"><span class="rmap__name">${ctx.t(c.soon)}</span></span>
            <span class="visually-hidden"> — ${ctx.t(soon.name)}, ${ctx.t(c.legend.soon)}</span>
          </a>`
        : ''}
    </div>

    <figcaption class="rmap__foot">
      <span class="visually-hidden">${ctx.t(c.label)}. </span>
      <ul class="rmap__legend" role="list">
        <li><span class="rmap__key rmap__key--open" aria-hidden="true"></span>${ctx.t(c.legend.open)}</li>
        <li><span class="rmap__key rmap__key--soon" aria-hidden="true"></span>${ctx.t(c.legend.soon)}</li>
        <li><span class="rmap__key rmap__key--route" aria-hidden="true"></span>${ctx.t(c.legend.route)}</li>
      </ul>
      <p class="rmap__note">${ctx.t(c.note)}</p>
    </figcaption>
  </figure>`;
}
