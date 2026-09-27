/**
 * Where the site's forms send their data.
 *
 * apiBaseUrl: null   → demo mode. Submissions are simulated with a short
 *                      delay and kept in this browser's localStorage.
 * apiBaseUrl: 'https://api.mishwar.example/v1'
 *                    → forms POST JSON to `${apiBaseUrl}/reservations` and
 *                      `${apiBaseUrl}/messages` (see the payload typedefs in
 *                      reservation-service.js and contact-service.js).
 *
 * Also read at build time: with an API configured, the forms' `action`
 * attributes point at the same endpoints, so a backend that also accepts
 * classic form posts receives submissions from visitors without JavaScript.
 */
export const config = {
  apiBaseUrl: null,
  timeoutMs: 15000,
  demoLatencyMs: 1100,
};
