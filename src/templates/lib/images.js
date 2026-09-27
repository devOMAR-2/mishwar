/**
 * Loads the photography manifest. Missing images degrade to a tinted
 * placeholder (and a build warning) instead of failing the whole build.
 */
let images = {};
try {
  ({ images } = await import('../../data/images.js'));
} catch (error) {
  console.warn(`⚠ images manifest unavailable (${error.message}) — rendering placeholders`);
}

export const getImage = (key) => images[key];
export const allImages = () => images;
