/**
 * optimize-images.mjs
 * -------------------------------------------------------------
 * Turns the hand-picked originals in src/assets/images/_source/
 * into responsive, colour-graded WebP variants plus a manifest.
 *
 *   Input : src/assets/images/_source/<key>.(jpg|jpeg|png|webp)
 *   Output: src/assets/images/<key>-<width>.webp
 *           src/data/images.generated.js   (width/height/widths/color per key)
 *
 * Usage: npm run images
 *
 * The originals come from different photographers, so every image gets
 * the same very gentle grade (a touch less saturation, a hint of warmth)
 * to make the set read as one cohesive shoot.
 */

import { readdir, mkdir, writeFile, unlink, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SOURCE_DIR = path.join(ROOT, 'src/assets/images/_source');
const OUTPUT_DIR = path.join(ROOT, 'src/assets/images');
const MANIFEST = path.join(ROOT, 'src/data/images.generated.js');

/** Responsive breakpoints. Widths larger than the original are skipped. */
const WIDTHS = [480, 800, 1200, 1800, 2400];

/**
 * Pixel budget per variant (≈ a 2400×1600 frame). A full-bleed 3:2 landscape
 * gets every width, while tall portraits and squares stop one step earlier —
 * they are never displayed at full viewport width, so 1800×2700 files would
 * only bloat the build. Keys in MAX_PIXELS_OVERRIDES may go bigger.
 */
const MAX_PIXELS = 3_900_000;
const MAX_PIXELS_OVERRIDES = { 'hero-detail': 5_000_000, 'interior-main': 5_000_000 };

/** WebP settings. Large variants are only served to high-DPR screens, where a lower quality is invisible. */
const WEBP_OPTIONS = { quality: 74, effort: 5, smartSubsample: true };

/** Busy, high-detail photographs compress poorly; a lower quality keeps them lean at 800w. */
const QUALITY_OVERRIDES = { 'dish-stew': 44, 'dish-grill': 52, spices: 56, 'dish-kabsa': 58, 'dish-jareesh': 58 };
const WEBP_QUALITY_LARGE = 68;
const LARGE_FROM = 1800;

/**
 * Unified grade. Deliberately subtle — it should unify, not stylise.
 *  - saturation 0.94 calms the loudest food shots
 *  - recomb nudges red up / blue down for a slight, natural warmth
 */
const GRADE = {
  saturation: 0.94,
  brightness: 1.0,
  warmth: [
    [1.025, 0, 0],
    [0, 1.0, 0],
    [0, 0, 0.965],
  ],
};

/** Placeholder colour is the average colour, darkened so light text/UI still reads on it. */
const PLACEHOLDER_DARKEN = 0.82;

const SOURCE_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp']);

/** Apply the shared orientation fix, colour-space normalisation and grade. */
function graded(input) {
  return sharp(input, { failOn: 'none' })
    .rotate() // respect EXIF orientation before metadata is stripped
    .toColourspace('srgb')
    .modulate({ saturation: GRADE.saturation, brightness: GRADE.brightness })
    .recomb(GRADE.warmth);
}

const toHex = (n) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, '0');

async function placeholderColor(file) {
  // Stats on a tiny graded copy: fast, and matches what is actually shipped.
  const small = await graded(file).resize(64, 64, { fit: 'inside' }).toBuffer();
  const { channels } = await sharp(small).stats();
  const [r, g, b] = channels.map((c) => c.mean * PLACEHOLDER_DARKEN);
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

async function processImage(file) {
  const key = path.basename(file, path.extname(file));
  const meta = await sharp(file).rotate().metadata();
  // .rotate() without args doesn't swap metadata dims; handle EXIF 5–8 manually.
  const swap = (meta.orientation ?? 1) >= 5;
  const srcWidth = swap ? meta.height : meta.width;
  const srcHeight = swap ? meta.width : meta.height;
  const aspect = srcHeight / srcWidth;
  const maxPixels = MAX_PIXELS_OVERRIDES[key] ?? MAX_PIXELS;

  let widths = WIDTHS.filter((w) => w <= srcWidth && w * w * aspect <= maxPixels);
  if (widths.length === 0) widths = [Math.min(srcWidth, WIDTHS[0])]; // always ship at least one

  let largest = null;
  for (const width of widths) {
    const out = path.join(OUTPUT_DIR, `${key}-${width}.webp`);
    const info = await graded(file)
      .resize({ width, withoutEnlargement: true })
      // Metadata is stripped by default (we never call withMetadata()).
      .webp({
        ...WEBP_OPTIONS,
        ...(width >= LARGE_FROM && { quality: WEBP_QUALITY_LARGE }),
        ...(QUALITY_OVERRIDES[key] && { quality: Math.min(QUALITY_OVERRIDES[key], width >= LARGE_FROM ? WEBP_QUALITY_LARGE : 100) }),
      })
      .toFile(out);
    largest = info;
  }

  const color = await placeholderColor(file);
  return { key, width: largest.width, height: largest.height, widths, color };
}

async function cleanOldVariants() {
  const files = await readdir(OUTPUT_DIR);
  await Promise.all(
    files.filter((f) => /-\d+\.webp$/.test(f)).map((f) => unlink(path.join(OUTPUT_DIR, f))),
  );
}

function renderManifest(entries) {
  const lines = entries.map(
    ({ key, width, height, widths, color }) =>
      `  '${key}': { width: ${width}, height: ${height}, widths: [${widths.join(', ')}], color: '${color}' },`,
  );
  return [
    '// Generated by scripts/optimize-images.mjs — do not edit by hand.',
    '',
    'export const imageMeta = {',
    ...lines,
    '};',
    '',
  ].join('\n');
}

async function main() {
  const sources = (await readdir(SOURCE_DIR))
    .filter((f) => SOURCE_EXT.has(path.extname(f).toLowerCase()))
    .sort();

  if (sources.length === 0) {
    console.error(`No source images found in ${path.relative(ROOT, SOURCE_DIR)}`);
    process.exitCode = 1;
    return;
  }

  await mkdir(OUTPUT_DIR, { recursive: true });
  await mkdir(path.dirname(MANIFEST), { recursive: true });
  await cleanOldVariants();

  const started = Date.now();
  const entries = [];
  // Sequential on purpose: sharp is already multi-threaded per image.
  for (const f of sources) {
    const entry = await processImage(path.join(SOURCE_DIR, f));
    entries.push(entry);
    console.log(`  ✓ ${entry.key.padEnd(18)} ${entry.width}×${entry.height}  [${entry.widths.join(', ')}]  ${entry.color}`);
  }

  await writeFile(MANIFEST, renderManifest(entries), 'utf8');

  let bytes = 0;
  for (const f of await readdir(OUTPUT_DIR)) {
    if (f.endsWith('.webp')) bytes += (await stat(path.join(OUTPUT_DIR, f))).size;
  }
  const secs = ((Date.now() - started) / 1000).toFixed(1);
  console.log(`\n${entries.length} images → ${(bytes / 1024 / 1024).toFixed(2)} MB of WebP in ${secs}s`);
  console.log(`Manifest: ${path.relative(ROOT, MANIFEST)}`);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
