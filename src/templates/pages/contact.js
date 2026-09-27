import { html, raw, attrs } from '../lib/html.js';
import { restaurantSchema } from '../lib/seo.js';
import { contact as c } from '../../content/contact.js';
import { ui } from '../../i18n/ui.js';
import { site } from '../../data/site.js';
import { openLocations } from '../../data/locations.js';
import { mapsUrl } from '../../js/utils/maps.js';
import { config } from '../../js/services/config.js';
import { pageHero } from '../components/page-hero.js';
import { sectionHead } from '../components/section-head.js';
import { picture } from '../components/picture.js';
import { icon } from '../components/icon.js';
import { hoursList, openStatus } from '../components/hours.js';
import { socialLinks, whatsappUrl } from '../components/footer.js';
import { textField, textareaField, selectField, phoneField } from '../components/form-field.js';
import { choiceGroup } from '../components/form-choice.js';
import { errorSummary, formAlert, submitButton, announcer, fillHtml } from '../components/form-status.js';

const f = c.form;
const mailLink = (address) => html`<a href="mailto:${address}">${address}</a>`;

function directory(ctx) {
  const d = c.directory;
  const item = ({ label, href, value, note, iconName, external, lead }) => html`
    <li class="${lead ? 'directory__item directory__item--lead' : 'directory__item'}">
      <p class="directory__label">${icon(iconName)}${label}</p>
      <a${attrs({ class: 'directory__value', href, target: external ? '_blank' : null, rel: external ? 'noopener' : null })}>
        <span dir="ltr">${value}</span>${external ? html`<span class="visually-hidden"> ${ctx.t(ui.labels.newWindow)}</span>` : ''}
      </a>
      ${note ? html`<p class="directory__note">${note}</p>` : ''}
    </li>`;

  return html`
    <div class="directory" data-reveal>
      <h2 class="visually-hidden">${ctx.t(d.label)}</h2>
      <ul class="directory__list" role="list">
        ${item({ label: ctx.t(d.central.label), href: `tel:${site.contact.phone}`, value: site.contact.phoneDisplay, note: ctx.t(d.central.note), iconName: 'phone', lead: true })}
        ${item({ label: ctx.t(d.whatsapp.label), href: whatsappUrl(), value: site.contact.whatsappDisplay, note: ctx.t(d.whatsapp.note), iconName: 'whatsapp' })}
        ${d.emails.map((e) => item({ label: ctx.t(e.label), href: `mailto:${site.contact[e.key]}`, value: site.contact[e.key], iconName: 'mail' }))}
      </ul>
      ${site.fictional ? html`<p class="directory__fine">${ctx.t(d.fictional)}</p>` : ''}
    </div>`;
}

function hero(ctx) {
  return pageHero(ctx, {
    eyebrow: ctx.t(c.hero.eyebrow),
    title: raw(ctx.t(c.hero.title)),
    lede: ctx.t(c.hero.lede),
    className: 'page-hero--contact',
    children: directory(ctx),
  });
}

function fields(ctx) {
  return html`
    ${textField(ctx, { id: 'con-name', name: 'name', label: ctx.t(f.name.label), autocomplete: 'name', minlength: 2, maxlength: 80, errors: f.name.errors })}
    ${choiceGroup(ctx, {
      id: 'con-reply',
      name: 'replyVia',
      legend: ctx.t(f.replyVia.legend),
      className: 'field--reply',
      options: f.replyVia.options.map((o, i) => ({ value: o.value, label: ctx.t(o.label), checked: i === 0 })),
    })}
    ${textField(ctx, {
      id: 'con-email',
      name: 'email',
      type: 'email',
      label: ctx.t(f.email.label),
      autocomplete: 'email',
      inputmode: 'email',
      dir: 'ltr',
      maxlength: 120,
      errors: f.email.errors,
      className: 'field--reply-email',
    })}
    ${phoneField(ctx, { id: 'con-phone', label: ctx.t(f.phone.label), errors: f.phone.errors, className: 'field--reply-phone', hidden: true })}
    ${selectField(ctx, {
      id: 'con-topic',
      name: 'topic',
      label: ctx.t(f.topic.label),
      hint: ctx.t(f.topic.hint),
      placeholder: ctx.t(f.topic.placeholder),
      errors: f.topic.errors,
      options: f.topic.options.map((o) => ({ value: o.value, label: ctx.t(o.label), data: { 'data-hint': ctx.t(o.hint) } })),
    })}
    ${selectField(ctx, {
      id: 'con-branch',
      name: 'branch',
      label: ctx.t(f.branch.label),
      required: false,
      placeholder: ctx.t(f.branch.placeholder),
      options: openLocations.map((loc) => ({ value: loc.id, label: ctx.t(loc.name) })),
    })}
    ${textareaField(ctx, { id: 'con-message', name: 'message', label: ctx.t(f.message.label), minlength: 10, maxlength: 1000, rows: 5, errors: f.message.errors, className: 'field--message' })}`;
}

function confirmation(ctx) {
  const s = c.success;
  return html`
  <section class="form-success contact-done" data-success aria-labelledby="contact-done-title" hidden>
    <span class="form-success__mark" aria-hidden="true">${icon('check')}</span>
    <p class="eyebrow">${ctx.t(s.eyebrow)}</p>
    <h3 class="form-success__title contact-done__title" id="contact-done-title" tabindex="-1">${ctx.t(s.title)}</h3>
    <p class="form-success__text">${fillHtml(ctx.t(s.text), { name: raw('<strong data-out="name"></strong>'), contact: raw('<strong dir="ltr" data-out="contact"></strong>') })}</p>
    <p class="contact-done__ref">${ctx.t(s.reference)} <span class="num" dir="ltr" data-out="reference"></span></p>
    <div class="form-success__actions">
      <button class="btn btn--secondary" type="button" data-again><span class="btn__label">${ctx.t(s.again)}</span>${icon('arrow', { className: 'btn__icon' })}</button>
    </div>
  </section>`;
}

function write(ctx) {
  return html`
  <section class="contact-write section surface-alt" aria-labelledby="contact-write-title">
    <div class="container contact-write__grid">
      <div class="contact-write__intro">
        ${sectionHead({ eyebrow: ctx.t(f.eyebrow), title: raw(ctx.t(f.title)), intro: ctx.t(f.intro), id: 'contact-write-title' })}
        <figure class="contact-write__media">
          <div class="photo contact-write__photo" data-reveal="image">
            ${picture(ctx, 'drink-tea', { sizes: '(min-width: 1024px) 30vw, 100vw' })}
          </div>
          <figcaption class="contact-write__caption">${ctx.t(f.caption)}</figcaption>
        </figure>
      </div>

      <div class="contact-write__panel" data-module="contact-form">
        <div data-contact-main>
          <form${attrs({
            class: 'contact-form',
            method: 'post',
            action: config.apiBaseUrl ? `${config.apiBaseUrl}/messages` : null,
            'aria-labelledby': 'contact-write-title',
          })}>
            <p class="form-note">${ctx.t(f.requiredNote)}</p>
            <div class="contact-form__fields">${fields(ctx)}</div>
            <div class="contact-form__foot">
              ${errorSummary(ctx)}
              ${formAlert(fillHtml(ctx.t(f.failed), { email: mailLink(site.contact.email) }))}
              ${submitButton(ctx, { label: ctx.t(f.submit), className: 'contact-form__submit' })}
              ${config.apiBaseUrl ? '' : html`<noscript><p class="contact-form__noscript">${fillHtml(ctx.t(f.noscript), { email: mailLink(site.contact.email) })}</p></noscript>`}
            </div>
            ${announcer()}
          </form>
        </div>
        ${confirmation(ctx)}
      </div>
    </div>
  </section>`;
}

function branchInfo(ctx, loc) {
  const b = c.branches;
  return html`
  <article class="branch-info" data-reveal>
    <header class="branch-info__head">
      <p class="branch-info__district">${icon('pin')}${ctx.t(loc.district)}</p>
      <h3 class="branch-info__name">${ctx.t(loc.name)}</h3>
      ${openStatus(ctx, loc.id)}
    </header>
    <dl class="branch-info__facts">
      <div>
        <dt>${ctx.t(ui.labels.address)}</dt>
        <dd>${ctx.t(loc.address)}<span class="branch-info__landmark">${ctx.t(loc.landmark)}</span></dd>
      </div>
      <div>
        <dt>${ctx.t(ui.labels.shortAddress)}</dt>
        <dd class="num" dir="ltr">${loc.shortAddress}</dd>
      </div>
      <div>
        <dt>${ctx.t(ui.labels.phone)}</dt>
        <dd><a href="tel:${loc.phone}"><span dir="ltr">${loc.phoneDisplay}</span></a></dd>
      </div>
    </dl>
    <div class="branch-info__hours">
      <h4 class="branch-info__subhead">${ctx.t(ui.labels.hours)}</h4>
      ${hoursList(ctx, loc.hours)}
    </div>
    <div class="branch-info__actions">
      <a class="btn btn--secondary btn--sm" href="${mapsUrl(loc)}" target="_blank" rel="noopener">
        ${icon('map', { className: 'btn__icon' })}<span class="btn__label">${ctx.t(ui.cta.directions)}</span><span class="visually-hidden">${ctx.t(ui.labels.newWindow)}</span>
      </a>
      <a class="btn btn--primary btn--sm" href="${ctx.url('reservations')}?branch=${loc.id}"><span class="btn__label">${ctx.t(ui.cta.reserveShort)}</span></a>
    </div>
  </article>`;
}

function branches(ctx) {
  const b = c.branches;
  return html`
  <section class="contact-branches section" aria-labelledby="contact-branches-title">
    <div class="container">
      ${sectionHead({ eyebrow: ctx.t(b.eyebrow), title: raw(ctx.t(b.title)), id: 'contact-branches-title' })}
      <div class="contact-branches__grid" data-reveal-stagger>
        ${openLocations.map((loc) => branchInfo(ctx, loc))}
      </div>

      <div class="contact-social" data-reveal>
        <span class="tri-rule contact-social__rule" aria-hidden="true"></span>
        <div class="contact-social__copy">
          <h3 class="contact-social__title">${ctx.t(c.social.title)}</h3>
          <p class="contact-social__text">${ctx.t(c.social.text)}</p>
        </div>
        <div class="contact-social__links">
          ${socialLinks(ctx, { className: 'social contact-social__icons' })}
          <p class="contact-social__handle" dir="ltr">${site.social[0].handle}</p>
        </div>
      </div>
    </div>
  </section>`;
}

export default {
  id: 'contact',
  meta: (ctx) => ({ title: ctx.t(c.meta.title), description: ctx.t(c.meta.description) }),
  jsonLd: (ctx) => [
    ...restaurantSchema(ctx),
    {
      '@type': 'ContactPage',
      '@id': `${ctx.absoluteUrl('contact')}#page`,
      url: ctx.absoluteUrl('contact'),
      name: ctx.t(c.meta.title),
      inLanguage: ctx.lang,
      about: { '@id': `${site.url}/#organization` },
    },
  ],
  render: (ctx) => html`
    ${hero(ctx)}
    ${write(ctx)}
    ${branches(ctx)}`,
};
