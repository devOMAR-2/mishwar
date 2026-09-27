/** Table reservations. */
import { config } from './config.js';
import { postJson, simulate, referenceCode } from './request.js';

/**
 * What the reservation form sends — also the request body for
 * `POST {apiBaseUrl}/reservations`.
 *
 * @typedef {object} ReservationPayload
 * @property {'yasmin'|'qurtubah'} branch  location id from src/data/locations.js
 * @property {string} date      service date, ISO "YYYY-MM-DD", Riyadh calendar
 * @property {string} time      "HH:MM" 24-hour Riyadh time. Slots after midnight
 *                              ("00:30") belong to the service that began on `date`.
 * @property {string} startsAt  full local start, ISO "YYYY-MM-DDTHH:MM:00+03:00"
 * @property {number} guests    1–12 (larger groups book by phone)
 * @property {'indoor'|'terrace'|'private'|null} seating  preference, not a guarantee
 * @property {'birthday'|'anniversary'|'business'|'family'|'graduation'|'other'|null} occasion
 * @property {string} name
 * @property {string} phone     E.164 Saudi mobile, "+9665XXXXXXXX"
 * @property {string|null} email
 * @property {string|null} notes  up to 300 characters
 * @property {'ar'|'en'} lang   language for the confirmation message
 */

/**
 * What the API answers with.
 *
 * @typedef {object} ReservationResult
 * @property {string} reference  e.g. "MSH-7K3Q9"
 * @property {'received'} status the branch confirms separately by SMS/WhatsApp
 * @property {string} createdAt  ISO timestamp
 */

/**
 * @param {ReservationPayload} payload
 * @returns {Promise<ReservationResult>}
 */
export async function createReservation(payload) {
  if (config.apiBaseUrl) return postJson('/reservations', payload);

  const record = { ...payload, reference: referenceCode('MSH'), status: 'received', createdAt: new Date().toISOString() };
  const { reference, status, createdAt } = await simulate('mishwar:reservations', record);
  return { reference, status, createdAt };
}
