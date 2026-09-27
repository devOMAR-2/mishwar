/**
 * Page registry. Each page module exports:
 *   id               route id (see lib/routes.js)
 *   meta(ctx)        { title, description, noindex?, preloadImage? }
 *   render(ctx)      <main> content
 *   jsonLd?(ctx)     structured data graph(s)
 *   hideReserveBar?  hide the floating mobile booking bar
 */
import home from './home.js';
import menu from './menu.js';
import about from './about.js';
import locations from './locations.js';
import reservations from './reservations.js';
import contact from './contact.js';
import privacy from './privacy.js';
import notFound from './not-found.js';

export const pages = [home, menu, about, locations, reservations, contact, privacy, notFound];
