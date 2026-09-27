/**
 * Tiny tagged-template renderer for the static build.
 * Interpolated values are HTML-escaped unless they are already `SafeHtml`
 * (i.e. produced by `html` itself or explicitly marked with `raw`).
 */

class SafeHtml {
  constructor(value) {
    this.value = value;
  }
  toString() {
    return this.value;
  }
}

const ENTITIES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

export const escape = (value) => String(value).replace(/[&<>"']/g, (c) => ENTITIES[c]);

export const raw = (value) => new SafeHtml(String(value ?? ''));

const renderValue = (value) => {
  if (value == null || value === false || value === true) return '';
  if (Array.isArray(value)) return value.map(renderValue).join('');
  if (value instanceof SafeHtml) return value.value;
  return escape(value);
};

export const html = (strings, ...values) =>
  raw(strings.reduce((out, str, i) => out + str + (i < values.length ? renderValue(values[i]) : ''), ''));

/** Render an attribute map; `true` → boolean attribute, null/false → omitted. */
export const attrs = (map) =>
  raw(
    Object.entries(map)
      .filter(([, v]) => v != null && v !== false)
      .map(([k, v]) => (v === true ? ` ${k}` : ` ${k}="${escape(v)}"`))
      .join('')
  );

export const cx = (...names) => names.flat().filter(Boolean).join(' ');
