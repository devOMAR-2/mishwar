/** Messages from the contact form. */
import { config } from './config.js';
import { postJson, simulate, referenceCode } from './request.js';

/**
 * What the contact form sends — also the request body for
 * `POST {apiBaseUrl}/messages`.
 *
 * @typedef {object} ContactPayload
 * @property {string} name
 * @property {'email'|'phone'} replyVia  how the visitor wants to hear back
 * @property {string|null} email         set when replyVia is "email"
 * @property {string|null} phone         E.164 Saudi mobile, set when replyVia is "phone"
 * @property {'general'|'feedback'|'events'|'careers'|'press'} topic
 * @property {'yasmin'|'qurtubah'|null} branch
 * @property {string} message            10–1000 characters
 * @property {'ar'|'en'} lang            language to reply in
 */

/**
 * @typedef {object} ContactResult
 * @property {string} reference  e.g. "MSG-4H8TD"
 * @property {'received'} status
 * @property {string} createdAt  ISO timestamp
 */

/**
 * @param {ContactPayload} payload
 * @returns {Promise<ContactResult>}
 */
export async function sendMessage(payload) {
  if (config.apiBaseUrl) return postJson('/messages', payload);

  const record = { ...payload, reference: referenceCode('MSG'), status: 'received', createdAt: new Date().toISOString() };
  const { reference, status, createdAt } = await simulate('mishwar:messages', record);
  return { reference, status, createdAt };
}
