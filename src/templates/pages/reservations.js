import { html, raw, attrs } from '../lib/html.js';
import { restaurantSchema } from '../lib/seo.js';
import { reservations as c } from '../../content/reservations.js';
import { ui } from '../../i18n/ui.js';
import { site } from '../../data/site.js';
import { openLocations } from '../../data/locations.js';
import { timeSlots, formatTime, toMinutes } from '../../js/utils/hours.js';
import { mapsUrl } from '../../js/utils/maps.js';
import { plural } from '../../js/forms/messages.js';
import { config } from '../../js/services/config.js';
import { pageHero } from '../components/page-hero.js';
import { sectionHead } from '../components/section-head.js';
import { picture } from '../components/picture.js';
import { icon } from '../components/icon.js';
import { hoursList } from '../components/hours.js';
import { textField, textareaField, selectField, phoneField, errorAttrs, describedBy, fieldHint, fieldError } from '../components/form-field.js';
import { choiceGroup } from '../components/form-choice.js';
import { stepperField } from '../components/form-stepper.js';
import { errorSummary, formAlert, submitButton, announcer, clientStrings, fillHtml } from '../components/form-status.js';

const f = c.form;
const MAX_GUESTS = 12;
const DEFAULT_GUESTS = 2;

const SUMMARY_ROWS = [
  { key: 'branch', icon: 'pin' },
  { key: 'date', icon: 'calendar' },
  { key: 'time', icon: 'clock' },
  { key: 'guests', icon: 'users' },
  { key: 'seating', icon: 'door', optional: true },
  { key: 'occasion', icon: 'sparkle', optional: true },
];

/** Every bookable slot across both branches and all days, in service order (after-midnight last). */
const serviceOrder = (time) => (toMinutes(time) < 6 * 60 ? toMinutes(time) + 24 * 60 : toMinutes(time));
const ALL_SLOTS = [...new Set(openLocations.flatMap((loc) => loc.hours.flatMap((day) => timeSlots(day))))].sort(
  (a, b) => serviceOrder(a) - serviceOrder(b)
);

const centralPhone = () => html`<a href="tel:${site.contact.phone}"><span dir="ltr">${site.contact.phoneDisplay}</span></a>`;
const guestsLabel = (ctx, n) => plural(c.client.guests[ctx.lang], n, ctx.lang);

function hero(ctx) {
  return pageHero(ctx, {
    eyebrow: ctx.t(c.hero.eyebrow),
    title: raw(ctx.t(c.hero.title)),
    lede: ctx.t(c.hero.lede),
    className: 'page-hero--booking',
    children: html`
      <p class="booking-hero__call" data-reveal>
        <span>${ctx.t(c.hero.call)}</span>
        <a class="link-arrow" href="tel:${site.contact.phone}">${icon('phone')}<span dir="ltr">${site.contact.phoneDisplay}</span></a>
      </p>`,
  });
}

function step(ctx, index, fields) {
  const id = `booking-step-${index + 1}`;
  return html`
  <section class="form-step" aria-labelledby="${id}">
    <h3 class="form-step__title" id="${id}">
      <span class="form-step__num num" aria-hidden="true">${String(index + 1).padStart(2, '0')}</span>
      ${ctx.t(f.steps[index])}
    </h3>
    <div class="form-step__fields">${fields}</div>
  </section>`;
}

function branchField(ctx) {
  return choiceGroup(ctx, {
    id: 'res-branch',
    name: 'branch',
    legend: ctx.t(f.branch.legend),
    required: true,
    errors: f.branch.errors,
    variant: 'cards',
    className: 'field--branch',
    options: openLocations.map((loc) => ({
      value: loc.id,
      label: ctx.t(loc.name),
      detail: ctx.t(loc.district),
      note: loc.features.slice(0, 2).map((feature) => ctx.t(feature)).join(' · '),
      media: picture(ctx, loc.image, { sizes: '(min-width: 768px) 8rem, 5.5rem', decorative: true }),
    })),
  });
}

/**
 * Date: the browser module adds a two-week day picker and tucks the native
 * date input behind "Need a later date?". Without JavaScript the native input is the field.
 */
function dateField(ctx) {
  const id = 'res-date';
  return html`
  <fieldset${attrs({
    class: 'field field--group field--date',
    id: `${id}-group`,
    'data-field': 'date',
    'aria-describedby': describedBy(id, { hint: true }),
    ...errorAttrs(ctx, f.date.errors),
  })}>
    <legend class="field__label" id="${id}-label">${ctx.t(f.date.legend)}</legend>
    <div class="days" data-days></div>
    <button class="field__toggle" type="button" data-date-toggle aria-expanded="false" aria-controls="${id}-other" hidden>
      ${icon('calendar')}<span>${ctx.t(f.date.toggle)}</span>${icon('chevron-down', { className: 'field__toggle-chevron' })}
    </button>
    <div class="date-other" id="${id}-other" data-date-other>
      <label class="field__sublabel" for="${id}">${ctx.t(f.date.inputLabel)}</label>
      <input class="field__input date-other__input" type="date" id="${id}" name="date" required aria-describedby="${describedBy(id, { hint: true })}">
    </div>
    ${fieldHint(id, ctx.t(f.date.hint))}
    ${fieldError(id)}
  </fieldset>`;
}

/** Time: chips per branch/day in the browser; a plain list of every slot without JavaScript. */
function timeField(ctx) {
  const id = 'res-time';
  return html`
  <fieldset${attrs({
    class: 'field field--group field--time',
    id: `${id}-group`,
    'data-field': 'time',
    'aria-describedby': describedBy(id, { hint: true }),
    ...errorAttrs(ctx, f.time.errors),
  })}>
    <legend class="field__label" id="${id}-label">${ctx.t(f.time.legend)}</legend>
    ${fieldHint(id, ctx.t(f.time.hint))}
    <div class="slots" data-slots></div>
    <p class="slots__empty" data-slots-empty hidden>${icon('clock')}<span>${ctx.t(f.time.pickBranch)}</span></p>
    <div class="time-fallback" data-time-fallback>
      <label class="field__sublabel" for="${id}">${ctx.t(f.time.selectLabel)}</label>
      <div class="field__select">
        <select class="field__input" id="${id}" name="time" required aria-describedby="${describedBy(id, { hint: true })}">
          <option value="">—</option>
          ${ALL_SLOTS.map((slot) => html`<option value="${slot}">${formatTime(slot, ctx.lang)}</option>`)}
        </select>
        ${icon('chevron-down', { className: 'field__select-icon' })}
      </div>
    </div>
    ${fieldError(id)}
  </fieldset>`;
}

function tableFields(ctx) {
  return html`
    ${stepperField(ctx, {
      id: 'res-guests',
      name: 'guests',
      label: ctx.t(f.guests.label),
      hint: fillHtml(ctx.t(f.guests.hint), { phone: centralPhone() }),
      min: 1,
      max: MAX_GUESTS,
      value: DEFAULT_GUESTS,
      decreaseLabel: ctx.t(f.guests.decrease),
      increaseLabel: ctx.t(f.guests.increase),
      errors: f.guests.errors,
    })}
    ${choiceGroup(ctx, {
      id: 'res-seating',
      name: 'seating',
      legend: ctx.t(f.seating.legend),
      hint: ctx.t(f.seating.hint),
      optional: true,
      className: 'field--seating',
      options: f.seating.options.map((o) => ({
        value: o.value,
        label: ctx.t(o.label),
        detail: o.detail && ctx.t(o.detail),
        checked: o.value === '',
        data: o.branches ? { 'data-branches': o.branches.join(' ') } : undefined,
      })),
    })}
    ${selectField(ctx, {
      id: 'res-occasion',
      name: 'occasion',
      label: ctx.t(f.occasion.label),
      hint: ctx.t(f.occasion.hint),
      required: false,
      placeholder: ctx.t(f.occasion.placeholder),
      options: f.occasion.options.map((o) => ({ value: o.value, label: ctx.t(o.label) })),
    })}`;
}

function detailFields(ctx) {
  return html`
    ${textField(ctx, {
      id: 'res-name',
      name: 'name',
      label: ctx.t(f.name.label),
      autocomplete: 'name',
      minlength: 2,
      maxlength: 80,
      errors: f.name.errors,
    })}
    ${phoneField(ctx, { id: 'res-phone', label: ctx.t(f.phone.label), hint: ctx.t(f.phone.hint), errors: f.phone.errors })}
    ${textField(ctx, {
      id: 'res-email',
      name: 'email',
      type: 'email',
      label: ctx.t(f.email.label),
      hint: ctx.t(f.email.hint),
      required: false,
      autocomplete: 'email',
      inputmode: 'email',
      dir: 'ltr',
      maxlength: 120,
    })}
    ${textareaField(ctx, {
      id: 'res-notes',
      name: 'notes',
      label: ctx.t(f.notes.label),
      hint: ctx.t(f.notes.hint),
      required: false,
      maxlength: 300,
      rows: 3,
      errors: f.notes.errors,
    })}`;
}

function summary(ctx) {
  const value = (row) =>
    row.key === 'guests'
      ? html`<dd data-summary="guests">${guestsLabel(ctx, DEFAULT_GUESTS)}</dd>`
      : row.optional
        ? html`<dd data-summary="${row.key}"></dd>`
        : html`<dd data-summary="${row.key}" data-empty>${ctx.t(c.summary.pending)}</dd>`;

  return html`
  <aside class="booking__aside" aria-labelledby="booking-summary-title">
    <div class="booking-summary surface-dark">
      <h3 class="booking-summary__title" id="booking-summary-title">${ctx.t(c.summary.title)}</h3>
      <span class="tri-rule booking-summary__rule" aria-hidden="true"></span>
      <dl class="booking-summary__rows">
        ${SUMMARY_ROWS.map(
          (row) => html`<div class="booking-summary__row" data-row="${row.key}"${row.optional ? raw(' hidden') : ''}>
            <dt>${icon(row.icon)}${ctx.t(c.summary.labels[row.key])}</dt>
            ${value(row)}
          </div>`
        )}
      </dl>
      ${errorSummary(ctx)}
      ${formAlert(fillHtml(ctx.t(f.failed), { phone: centralPhone() }))}
      ${submitButton(ctx, { label: ctx.t(f.submit) })}
      <p class="booking-summary__note">${ctx.t(f.confirmNote)}</p>
      ${config.apiBaseUrl ? '' : html`<noscript><p class="booking-summary__noscript">${fillHtml(ctx.t(f.noscript), { phone: centralPhone() })}</p></noscript>`}
    </div>
  </aside>`;
}

function confirmation(ctx) {
  const s = c.success;
  const out = (key, tag = 'strong') => raw(`<${tag} data-out="${key}"></${tag}>`);
  const row = (key) => html`<div><dt>${ctx.t(c.summary.labels[key])}</dt><dd data-out="${key}"></dd></div>`;

  return html`
  <section class="form-success booking-done" data-success aria-labelledby="booking-done-title" hidden>
    <div class="booking-done__head">
      <span class="form-success__mark" aria-hidden="true">${icon('check')}</span>
      <p class="eyebrow">${ctx.t(s.eyebrow)}</p>
      <h2 class="form-success__title" id="booking-done-title" tabindex="-1">${ctx.t(s.title)}</h2>
      <p class="form-success__text">${fillHtml(ctx.t(s.text), { name: out('name'), branch: out('branch'), phone: html`<span dir="ltr" data-out="phone"></span>` })}</p>
    </div>

    <div class="ticket surface-dark">
      <div class="ticket__stub">
        <p class="ticket__label">${ctx.t(s.reference)}</p>
        <p class="ticket__code num" dir="ltr" data-out="reference"></p>
        <p class="ticket__note">${ctx.t(s.referenceNote)}</p>
      </div>
      <dl class="ticket__rows">
        ${['branch', 'date', 'time', 'guests'].map(row)}
      </dl>
    </div>

    <div class="form-success__actions">
      <a class="btn btn--primary" href="#" download="mishwar-reservation.ics" data-ics>${icon('calendar', { className: 'btn__icon' })}<span class="btn__label">${ctx.t(s.calendar)}</span></a>
      <a class="btn btn--secondary" href="#" target="_blank" rel="noopener" data-directions>${icon('map', { className: 'btn__icon' })}<span class="btn__label">${ctx.t(s.directions)}</span><span class="visually-hidden">${ctx.t(ui.labels.newWindow)}</span></a>
      <button class="btn btn--ghost" type="button" data-again><span class="btn__label">${ctx.t(s.again)}</span>${icon('arrow', { className: 'btn__icon' })}</button>
    </div>
    <p class="booking-done__change">${ctx.t(s.change)} <a href="#" data-out-tel><span dir="ltr" data-out="branchPhone"></span></a></p>
  </section>`;
}

function booking(ctx) {
  const phone = site.contact.phoneDisplay;
  const strings = {
    pending: ctx.t(c.summary.pending),
    today: ctx.t(c.client.today),
    tomorrow: ctx.t(c.client.tomorrow),
    periods: Object.fromEntries(Object.entries(f.time.periods).map(([k, v]) => [k, ctx.t(v)])),
    guests: c.client.guests[ctx.lang],
    slotsAvailable: c.client.slotsAvailable[ctx.lang],
    noSlots: ctx.t(c.client.noSlots),
    timeCleared: ctx.t(c.client.timeCleared),
    seatingCleared: ctx.t(c.client.seatingCleared),
    guestsLimit: ctx.t(c.client.guestsLimit).replace('{phone}', phone),
    calendarTitle: ctx.t(c.client.calendarTitle),
    calendarDescription: ctx.t(c.client.calendarDescription).replace('{phone}', phone),
    pageUrl: ctx.absoluteUrl('reservations'),
  };

  return html`
  <section class="booking" data-module="reservation-form" aria-labelledby="booking-title">
    <div class="container">
      <div class="booking__main" data-booking>
        <h2 class="visually-hidden" id="booking-title" tabindex="-1">${ctx.t(f.title)}</h2>
        <form${attrs({
          class: 'booking__form',
          id: 'booking-form',
          method: 'post',
          action: config.apiBaseUrl ? `${config.apiBaseUrl}/reservations` : null,
          'aria-labelledby': 'booking-title',
        })}>
          <div class="booking__fields">
            <p class="form-note">${ctx.t(f.requiredNote)}</p>
            ${step(ctx, 0, [branchField(ctx), dateField(ctx), timeField(ctx)])}
            ${step(ctx, 1, tableFields(ctx))}
            ${step(ctx, 2, detailFields(ctx))}
          </div>
          ${summary(ctx)}
          ${announcer()}
        </form>
      </div>
      ${confirmation(ctx)}
      ${clientStrings(strings)}
    </div>
  </section>`;
}

function info(ctx) {
  const i = c.info;
  return html`
  <section class="booking-info section surface-alt" aria-labelledby="booking-info-title">
    <div class="container">
      <div class="booking-info__grid">
        <figure class="booking-info__media">
          <div class="photo booking-info__photo" data-reveal="image">
            ${picture(ctx, 'gathering-2', { sizes: '(min-width: 1024px) 36vw, 100vw' })}
          </div>
          <figcaption class="booking-info__caption">${ctx.t(i.caption)}</figcaption>
        </figure>
        <div class="booking-info__content">
          ${sectionHead({ eyebrow: ctx.t(i.eyebrow), title: raw(ctx.t(i.title)), id: 'booking-info-title' })}
          <ol class="policies" role="list" data-reveal-stagger>
            ${i.policies.map(
              (p, index) => html`<li class="policy" data-reveal>
                <span class="policy__num num" aria-hidden="true">${String(index + 1).padStart(2, '0')}</span>
                <h3 class="policy__title">${ctx.t(p.title)}</h3>
                <p class="policy__text">${fillHtml(ctx.t(p.text), { phone: centralPhone() })}</p>
              </li>`
            )}
          </ol>
        </div>
      </div>

      <div class="booking-lines">
        <h3 class="booking-lines__title" data-reveal>${ctx.t(i.lines.title)}</h3>
        <ul class="booking-lines__grid" role="list" data-reveal-stagger>
          <li class="line-card line-card--central" data-reveal>
            <p class="line-card__label">${ctx.t(i.lines.central)}</p>
            <a class="line-card__number" href="tel:${site.contact.phone}"><span dir="ltr">${site.contact.phoneDisplay}</span></a>
            <p class="line-card__note">${ctx.t(i.lines.centralNote)}</p>
          </li>
          ${openLocations.map(
            (loc) => html`<li class="line-card" data-reveal>
              <p class="line-card__label">${ctx.t(loc.name)}</p>
              <a class="line-card__number" href="tel:${loc.phone}"><span dir="ltr">${loc.phoneDisplay}</span></a>
              ${hoursList(ctx, loc.hours, { className: 'hours--compact line-card__hours' })}
              <a class="link-arrow line-card__map" href="${mapsUrl(loc)}" target="_blank" rel="noopener">${ctx.t(ui.cta.directions)}${icon('arrow-up-right')}<span class="visually-hidden">${ctx.t(ui.labels.newWindow)}</span></a>
            </li>`
          )}
        </ul>
      </div>
    </div>
  </section>`;
}

export default {
  id: 'reservations',
  hideReserveBar: true,
  meta: (ctx) => ({ title: ctx.t(c.meta.title), description: ctx.t(c.meta.description) }),
  jsonLd: (ctx) => restaurantSchema(ctx),
  render: (ctx) => html`
    ${hero(ctx)}
    ${booking(ctx)}
    ${info(ctx)}`,
};
