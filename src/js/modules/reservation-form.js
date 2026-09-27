/**
 * Reservation flow: branch → day → time slot → party → details, with a live
 * summary, custom validation, a simulated/real submit and a confirmation
 * "ticket" with an .ics download. All dates and times are Riyadh time.
 */
import { locations } from '../../data/locations.js';
import { timeSlots, formatTime, toMinutes, fromMinutes, riyadhNow } from '../utils/hours.js';
import { formatDate } from '../utils/format.js';
import { mapsUrl } from '../utils/maps.js';
import { lang } from '../core/i18n.js';
import { fill, plural } from '../forms/messages.js';
import { riyadhToday, addDays, weekdayOf, isISODate, dayParts } from '../forms/dates.js';
import { enhancePhoneInput, normaliseSaudiMobile, toE164, displaySaudiMobile } from '../forms/phone.js';
import { enhanceForm } from '../forms/form.js';
import { enhanceStepper } from '../forms/stepper.js';
import { enhanceCounter } from '../forms/counter.js';
import { createReservation } from '../services/reservation-service.js';
import { buildIcs, icsObjectUrl } from '../services/ics.js';

const DAYS_SHOWN = 14;
const MAX_DAYS_AHEAD = 60;
const LEAD_MINUTES = 30; // earliest slot today = now + 30 min
const SITTING_MINUTES = 120; // length of the calendar event
const DAY = 24 * 60;
const PERIODS = [
  { key: 'lunch', from: 0 },
  { key: 'dinner', from: 17 * 60 },
  { key: 'late', from: DAY },
];

const bookable = locations.filter((l) => l.status === 'open');

/**
 * Slots for a branch on a service date. `minutes` counts from that date's
 * midnight, so after-midnight seatings are ≥ 1440.
 */
function slotsFor(location, iso, today) {
  const hours = location.hours[weekdayOf(iso)];
  const opens = toMinutes(hours.open);
  const now = iso === today ? riyadhNow().minutes : -Infinity;
  return timeSlots(hours).map((time) => {
    const minutes = toMinutes(time) < opens ? toMinutes(time) + DAY : toMinutes(time);
    return { time, minutes, past: minutes < now + LEAD_MINUTES };
  });
}

const el = (tag, className, text) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text != null) node.textContent = text;
  return node;
};

export default function reservationForm(root) {
  const strings = JSON.parse(root.querySelector('[data-strings]').textContent);
  const form = root.querySelector('form');
  const main = root.querySelector('[data-booking]');
  const success = root.querySelector('[data-success]');
  const q = (selector) => form.querySelector(selector);

  const daysEl = q('[data-days]');
  const dateInput = q('#res-date');
  const dateOther = q('[data-date-other]');
  const dateToggle = q('[data-date-toggle]');
  const slotsEl = q('[data-slots]');
  const slotsEmpty = q('[data-slots-empty]');
  const slotsEmptyText = slotsEmpty.querySelector('span');
  const pickBranchText = slotsEmptyText.textContent;
  const guestsInput = q('#res-guests');
  const guestsHint = q('#res-guests-hint');
  const phoneInput = q('#res-phone');
  const notes = q('#res-notes');

  const today = riyadhToday();
  const lastDate = addDays(today, MAX_DAYS_AHEAD);
  let date = '';
  let lastBooking = null;
  let icsUrl = null;

  const value = (name) => {
    const control = form.elements.namedItem(name);
    return control ? String(control.value).trim() : '';
  };
  const branch = () => bookable.find((l) => l.id === value('branch'));
  const checkedTime = () => q('input[name="time"]:checked')?.value ?? '';
  const guestsText = (n) => plural(strings.guests, n, lang);
  const availableSlots = (loc, iso) => (loc && isISODate(iso) ? slotsFor(loc, iso, today).filter((s) => !s.past) : []);
  const dayHasSlots = (iso) => (branch() ? [branch()] : bookable).some((loc) => availableSlots(loc, iso).length > 0);

  // --- Progressive enhancement of the static markup -------------------------
  q('[data-time-fallback]').remove();
  dateInput.required = false;
  dateInput.min = today;
  dateInput.max = lastDate;
  dateOther.hidden = true;
  dateToggle.hidden = false;

  const controller = enhanceForm(form, {
    validators: {
      date: () => {
        if (!date) return 'required';
        if (!isISODate(date) || date < today) return 'past';
        if (date > lastDate) return 'range';
        return branch() && !availableSlots(branch(), date).length ? 'full' : '';
      },
      time: () => (availableSlots(branch(), date).some((s) => s.time === checkedTime()) ? '' : 'required'),
    },
    submit: () => {
      lastBooking = payload();
      return createReservation(lastBooking);
    },
    onSuccess: showConfirmation,
  });
  const { announce } = controller;

  // --- Day picker ------------------------------------------------------------
  function renderDays() {
    const items = Array.from({ length: DAYS_SHOWN }, (_, i) => {
      const iso = addDays(today, i);
      const parts = dayParts(iso, lang);
      const relative = i === 0 ? strings.today : i === 1 ? strings.tomorrow : '';
      // Only "Today" replaces the weekday on the tile; "Tomorrow" is too long for it in English.
      const tileLabel = i === 0 ? relative : parts.weekday;
      const label = el('label', 'day');
      const input = el('input', 'day__input');
      Object.assign(input, { type: 'radio', name: 'day', value: iso, id: `res-day-${iso}` });
      label.htmlFor = input.id;
      const visual = el('span', 'day__face');
      visual.setAttribute('aria-hidden', 'true');
      visual.append(el('span', 'day__weekday', tileLabel), el('span', 'day__num num', parts.day), el('span', 'day__month', parts.month));
      const full = formatDate(iso, lang);
      label.append(input, visual, el('span', 'visually-hidden', relative ? `${relative}${lang === 'ar' ? '، ' : ', '}${full}` : full));
      return label;
    });
    daysEl.replaceChildren(...items);
  }

  function syncDays() {
    daysEl.querySelectorAll('.day__input').forEach((input) => {
      input.disabled = !dayHasSlots(input.value);
      input.checked = input.value === date;
    });
  }

  function setDate(iso, { fromInput = false } = {}) {
    date = iso;
    if (!fromInput) dateInput.value = '';
    syncDays();
    renderSlots();
    controller.revalidate('date');
  }

  // --- Time slots --------------------------------------------------------------
  function renderSlots({ quiet = false } = {}) {
    const loc = branch();
    const previous = checkedTime();
    slotsEl.replaceChildren();

    if (!loc || !date) {
      slotsEmptyText.textContent = pickBranchText;
      slotsEmpty.hidden = false;
      return;
    }

    const all = isISODate(date) ? slotsFor(loc, date, today) : [];
    const open = all.filter((s) => !s.past);
    const place = { date: formatDate(date, lang), branch: loc.shortName[lang] };

    if (!open.length) {
      slotsEmptyText.textContent = fill(strings.noSlots, place);
      slotsEmpty.hidden = false;
      if (!quiet) announce(slotsEmptyText.textContent);
      controller.revalidate('time');
      return;
    }
    slotsEmpty.hidden = true;

    PERIODS.forEach(({ key, from }, index) => {
      const until = PERIODS[index + 1]?.from ?? Infinity;
      const slots = all.filter((s) => s.minutes >= from && s.minutes < until);
      if (!slots.some((s) => !s.past)) return;

      const group = el('div', 'slots__group');
      const heading = el('p', 'slots__period', strings.periods[key]);
      heading.id = `res-slots-${key}`;
      const list = el('div', 'slots__list');
      list.setAttribute('role', 'group');
      list.setAttribute('aria-labelledby', heading.id);
      slots.forEach((slot) => {
        const label = el('label', 'slot');
        const input = el('input', 'slot__input');
        Object.assign(input, {
          type: 'radio',
          name: 'time',
          value: slot.time,
          id: `res-time-${slot.time.replace(':', '')}`,
          disabled: slot.past,
          checked: !slot.past && slot.time === previous,
        });
        label.htmlFor = input.id;
        label.append(input, el('span', 'slot__time num', formatTime(slot.time, lang)));
        list.append(label);
      });
      group.append(heading, list);
      slotsEl.append(group);
    });

    if (!quiet) {
      const lost = previous && !checkedTime();
      announce(lost ? strings.timeCleared : fill(plural(strings.slotsAvailable, open.length, lang), place));
    }
    controller.revalidate('time');
  }

  // --- Seating ------------------------------------------------------------------
  function syncSeating() {
    const loc = branch();
    form.querySelectorAll('input[name="seating"][data-branches]').forEach((input) => {
      const allowed = !loc || input.dataset.branches.split(' ').includes(loc.id);
      input.disabled = !allowed;
      if (!allowed && input.checked) {
        q('input[name="seating"][value=""]').checked = true;
        announce(strings.seatingCleared);
      }
    });
  }

  // --- Live summary -----------------------------------------------------------
  function updateSummary() {
    const loc = branch();
    const time = checkedTime();
    const guests = Number(guestsInput.value);
    const seating = q('input[name="seating"]:checked');
    const occasion = form.elements.namedItem('occasion');

    const set = (key, text) => {
      const dd = form.querySelector(`[data-summary="${key}"]`);
      dd.textContent = text || strings.pending;
      dd.toggleAttribute('data-empty', !text);
    };
    const setOptional = (key, text) => {
      form.querySelector(`[data-row="${key}"]`).hidden = !text;
      form.querySelector(`[data-summary="${key}"]`).textContent = text;
    };

    set('branch', loc ? loc.name[lang] : '');
    set('date', isISODate(date) ? formatDate(date, lang) : '');
    set('time', time ? formatTime(time, lang) : '');
    set('guests', Number.isInteger(guests) && guests >= 1 && guests <= Number(guestsInput.max) ? guestsText(guests) : '');
    setOptional('seating', seating?.value ? seating.closest('label').querySelector('.choice__label').textContent : '');
    setOptional('occasion', occasion.value ? occasion.selectedOptions[0].textContent : '');
  }

  // --- Payload & confirmation -----------------------------------------------
  function payload() {
    const loc = branch();
    const slot = availableSlots(loc, date).find((s) => s.time === checkedTime());
    const startDate = addDays(date, Math.floor(slot.minutes / DAY));
    return {
      branch: loc.id,
      date,
      time: slot.time,
      startsAt: `${startDate}T${slot.time}:00+03:00`,
      guests: Number(guestsInput.value),
      seating: value('seating') || null,
      occasion: value('occasion') || null,
      name: value('name'),
      phone: toE164(normaliseSaudiMobile(phoneInput.value)),
      email: value('email') || null,
      notes: value('notes') || null,
      lang,
    };
  }

  function calendarFile(booking, reference, loc) {
    const startDate = booking.startsAt.slice(0, 10);
    const end = toMinutes(booking.time) + SITTING_MINUTES;
    const ics = buildIcs({
      uid: `${reference}@mishwar.example`,
      date: startDate,
      time: booking.time,
      endDate: addDays(startDate, Math.floor(end / DAY)),
      endTime: fromMinutes(end),
      title: fill(strings.calendarTitle, { branch: loc.name[lang] }),
      location: loc.address[lang],
      description: fill(strings.calendarDescription, { reference, guests: guestsText(booking.guests) }),
      url: strings.pageUrl,
      geo: loc.coordinates,
    });
    if (icsUrl) URL.revokeObjectURL(icsUrl);
    icsUrl = icsObjectUrl(ics);
    return icsUrl;
  }

  function showConfirmation(result) {
    const booking = lastBooking;
    const loc = bookable.find((l) => l.id === booking.branch);
    const outputs = {
      name: booking.name,
      branch: loc.name[lang],
      phone: displaySaudiMobile(booking.phone.slice(4)),
      reference: result.reference,
      date: formatDate(booking.date, lang),
      time: formatTime(booking.time, lang),
      guests: guestsText(booking.guests),
      branchPhone: loc.phoneDisplay,
    };
    Object.entries(outputs).forEach(([key, text]) => {
      success.querySelectorAll(`[data-out="${key}"]`).forEach((node) => {
        node.textContent = text;
      });
    });

    const ics = success.querySelector('[data-ics]');
    ics.href = calendarFile(booking, result.reference, loc);
    ics.download = `mishwar-${result.reference}.ics`;
    success.querySelector('[data-directions]').href = mapsUrl(loc);
    success.querySelector('[data-out-tel]').href = `tel:${loc.phone}`;

    main.hidden = true;
    success.hidden = false;
    root.scrollIntoView({ block: 'start' });
    success.querySelector('#booking-done-title').focus({ preventScroll: true });
  }

  function startOver() {
    const keepBranch = lastBooking?.branch;
    controller.reset();
    if (keepBranch) q(`input[name="branch"][value="${keepBranch}"]`).checked = true;
    if (icsUrl) URL.revokeObjectURL(icsUrl);
    icsUrl = null;
    initialise({ quiet: true });
    counter.update();
    stepper.sync();
    success.hidden = true;
    main.hidden = false;
    root.scrollIntoView({ block: 'start' });
    root.querySelector('#booking-title').focus({ preventScroll: true });
  }

  function initialise({ quiet }) {
    syncSeating();
    renderDays();
    const firstOpen = Array.from({ length: DAYS_SHOWN }, (_, i) => addDays(today, i)).find(dayHasSlots) ?? today;
    date = firstOpen;
    dateInput.value = '';
    dateOther.hidden = true;
    dateToggle.setAttribute('aria-expanded', 'false');
    syncDays();
    renderSlots({ quiet });
    updateSummary();
  }

  // --- Wiring -------------------------------------------------------------------
  form.addEventListener('change', (event) => {
    const { target } = event;
    if (target.name === 'branch') {
      syncSeating();
      // Late at night today may have no seatings left at the newly chosen branch.
      setDate(date === today && !dayHasSlots(today) ? addDays(today, 1) : date, { fromInput: Boolean(dateInput.value) });
    } else if (target.name === 'day') {
      setDate(target.value);
    } else if (target === dateInput) {
      setDate(dateInput.value, { fromInput: true });
    }
    updateSummary();
  });
  form.addEventListener('input', (event) => {
    if (event.target === guestsInput) updateSummary();
  });

  dateToggle.addEventListener('click', () => {
    const open = dateToggle.getAttribute('aria-expanded') !== 'true';
    dateToggle.setAttribute('aria-expanded', String(open));
    dateOther.hidden = !open;
    if (open) dateInput.focus();
  });

  const stepper = enhanceStepper(q('[data-stepper]'), {
    onChange: (n, { fromButton }) => {
      updateSummary();
      if (fromButton) announce(guestsText(n));
    },
    onLimit: () => {
      guestsHint.classList.remove('is-emphasised');
      void guestsHint.offsetWidth; // restart the highlight animation
      guestsHint.classList.add('is-emphasised');
      announce(strings.guestsLimit);
    },
  });
  const counter = enhanceCounter(notes, q('#res-notes-count'), announce);
  enhancePhoneInput(phoneInput);
  success.querySelector('[data-again]').addEventListener('click', startOver);

  const requested = new URLSearchParams(window.location.search).get('branch');
  const preselect = requested && q(`input[name="branch"][value="${CSS.escape(requested)}"]`);
  if (preselect) preselect.checked = true;

  initialise({ quiet: true });
}
