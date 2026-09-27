/**
 * Contact form: reply-by-email-or-phone switch, topic-specific hints,
 * `?topic=` preselection, shared validation and a success state.
 */
import { lang } from '../core/i18n.js';
import { enhanceForm } from '../forms/form.js';
import { enhanceCounter } from '../forms/counter.js';
import { enhancePhoneInput, normaliseSaudiMobile, toE164, displaySaudiMobile } from '../forms/phone.js';
import { sendMessage } from '../services/contact-service.js';

export default function contactForm(root) {
  const main = root.querySelector('[data-contact-main]');
  const form = main.querySelector('form');
  const success = root.querySelector('[data-success]');
  const q = (selector) => form.querySelector(selector);

  const emailField = q('[data-field="email"]');
  const phoneField = q('[data-field="phone"]');
  const phoneInput = q('#con-phone');
  const topic = q('#con-topic');
  const topicHint = q('#con-topic-hint');
  const defaultHint = topicHint.textContent;
  let sent = null;

  const value = (name) => String(form.elements.namedItem(name)?.value ?? '').trim();

  const syncReplyVia = () => {
    const byPhone = value('replyVia') === 'phone';
    emailField.hidden = byPhone;
    phoneField.hidden = !byPhone;
    q('#con-email').disabled = byPhone;
    phoneInput.disabled = !byPhone;
  };

  const syncTopicHint = () => {
    topicHint.textContent = topic.selectedOptions[0]?.dataset.hint || defaultHint;
  };

  const payload = () => {
    const replyVia = value('replyVia');
    return {
      name: value('name'),
      replyVia,
      email: replyVia === 'email' ? value('email') : null,
      phone: replyVia === 'phone' ? toE164(normaliseSaudiMobile(phoneInput.value)) : null,
      topic: value('topic'),
      branch: value('branch') || null,
      message: value('message'),
      lang,
    };
  };

  const controller = enhanceForm(form, {
    submit: () => {
      sent = payload();
      return sendMessage(sent);
    },
    onSuccess: (result) => {
      const outputs = {
        name: sent.name,
        contact: sent.replyVia === 'phone' ? displaySaudiMobile(sent.phone.slice(4)) : sent.email,
        reference: result.reference,
      };
      Object.entries(outputs).forEach(([key, text]) => {
        success.querySelector(`[data-out="${key}"]`).textContent = text;
      });
      main.hidden = true;
      success.hidden = false;
      success.scrollIntoView({ block: 'center' });
      success.querySelector('#contact-done-title').focus({ preventScroll: true });
    },
  });

  const counter = enhanceCounter(q('#con-message'), q('#con-message-count'), controller.announce);
  enhancePhoneInput(phoneInput);

  form.addEventListener('change', (event) => {
    if (event.target.name === 'replyVia') syncReplyVia();
    if (event.target === topic) syncTopicHint();
  });

  success.querySelector('[data-again]').addEventListener('click', () => {
    controller.reset();
    syncReplyVia();
    syncTopicHint();
    counter.update();
    success.hidden = true;
    main.hidden = false;
    q('#con-name').focus();
  });

  const requested = new URLSearchParams(window.location.search).get('topic');
  if (requested && [...topic.options].some((o) => o.value === requested)) topic.value = requested;

  syncReplyVia();
  syncTopicHint();
}
