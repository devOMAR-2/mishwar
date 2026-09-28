/**
 * Contact page copy.
 *
 * Phone numbers, emails, addresses and social handles come from
 * src/data/site.js and src/data/locations.js — all of them are fictional
 * placeholders (see `site.fictional`), as noted in the page's fine print.
 */

export const contact = {
  meta: {
    title: { ar: 'تواصل معنا', en: 'Contact' },
    description: {
      ar: 'تواصل مع مِشوار في الرياض: الرقم الموحّد، واتساب، البريد الإلكتروني للمناسبات والوظائف، وعناوين وساعات عمل فرعي الياسمين وقرطبة.',
      en: 'Contact Mishwar in Riyadh: central line, WhatsApp, email for events and careers, plus addresses and hours for our Al Yasmin and Qurtubah branches.',
    },
  },

  hero: {
    eyebrow: { ar: 'تواصل معنا', en: 'Contact' },
    title: { ar: 'كلّمنا، <span class="accent">نسمعك</span>', en: 'Talk to us — <span class="accent">we’re listening</span>' },
    lede: {
      ar: 'سؤال عن حجز، فكرة لمناسبة، أو رأيك في زيارتك الأخيرة — نرد على كل رسالة خلال يوم عمل.',
      en: 'A question about a booking, an idea for an event, or thoughts on your last visit — we answer every message within one working day.',
    },
  },

  directory: {
    label: { ar: 'أرقام وعناوين مباشرة', en: 'Direct lines' },
    central: {
      label: { ar: 'الرقم الموحّد', en: 'Central line' },
      note: { ar: 'للحجوزات والاستفسارات، يوميًا من 12 الظهر', en: 'Bookings and questions, daily from noon' },
    },
    whatsapp: {
      label: { ar: 'واتساب', en: 'WhatsApp' },
      note: { ar: 'أسرع طريق للأسئلة السريعة', en: 'Quickest for quick questions' },
    },
    emails: [
      { key: 'email', label: { ar: 'استفسارات عامة', en: 'General enquiries' } },
      { key: 'eventsEmail', label: { ar: 'المناسبات والجلسات الخاصة', en: 'Events & private dining' } },
      { key: 'careersEmail', label: { ar: 'الوظائف', en: 'Careers' } },
    ],
    fictional: {
      ar: 'مِشوار مطعم افتراضي؛ كل الأرقام والعناوين في هذا الموقع للعرض فقط.',
      en: 'Mishwar is a fictional restaurant; every number and address on this site is a placeholder.',
    },
  },

  form: {
    eyebrow: { ar: 'راسلنا', en: 'Write to us' },
    title: { ar: 'اكتب لنا <span class="accent">رسالة</span>', en: 'Send us <span class="accent">a note</span>' },
    intro: {
      ar: 'قل لنا وش تحتاج، ونوصّل رسالتك للشخص المسؤول مباشرة — مو لصندوق منسي.',
      en: 'Tell us what you need and we’ll pass it to the right person — not a forgotten inbox.',
    },
    caption: { ar: 'نرد بنفس الاهتمام اللي نصب فيه القهوة.', en: 'We answer with the same care we pour the coffee.' },
    requiredNote: {
      ar: 'كل الحقول مطلوبة ما عدا المكتوب عندها «اختياري».',
      en: 'All fields are required unless marked optional.',
    },
    name: {
      label: { ar: 'الاسم', en: 'Your name' },
      errors: {
        required: { ar: 'اكتب اسمك عشان نعرف نخاطبك.', en: 'Enter your name so we know who we’re replying to.' },
        tooShort: { ar: 'الاسم قصير، اكتبه كامل.', en: 'Enter your full name.' },
      },
    },
    replyVia: {
      legend: { ar: 'كيف نرد عليك؟', en: 'How should we reply?' },
      options: [
        { value: 'email', label: { ar: 'بالإيميل', en: 'By email' } },
        { value: 'phone', label: { ar: 'بالجوال أو واتساب', en: 'By phone or WhatsApp' } },
      ],
    },
    email: {
      label: { ar: 'البريد الإلكتروني', en: 'Email' },
      errors: { required: { ar: 'اكتب بريدك الإلكتروني عشان نرد عليك.', en: 'Enter your email so we can reply.' } },
    },
    phone: {
      label: { ar: 'رقم الجوال', en: 'Mobile number' },
      errors: { required: { ar: 'اكتب رقم جوالك عشان نرد عليك.', en: 'Enter your mobile number so we can reply.' } },
    },
    topic: {
      label: { ar: 'الموضوع', en: 'Topic' },
      placeholder: { ar: 'اختر الموضوع', en: 'Choose a topic' },
      hint: { ar: 'نوصل رسالتك للشخص المسؤول عن الموضوع.', en: 'We’ll route it to whoever looks after that topic.' },
      errors: { required: { ar: 'اختر موضوع الرسالة عشان نوصلها للشخص الصح.', en: 'Choose a topic so it reaches the right person.' } },
      options: [
        {
          value: 'general',
          label: { ar: 'استفسار عام', en: 'General question' },
          hint: { ar: 'للحجوزات القريبة، الاتصال أسرع.', en: 'For same-day bookings, calling is quicker.' },
        },
        {
          value: 'feedback',
          label: { ar: 'رأيك في زيارتك', en: 'Feedback on a visit' },
          hint: { ar: 'اذكر الفرع وتاريخ الزيارة التقريبي عشان نتابع مع الفريق.', en: 'Mention the branch and roughly when you visited so we can follow up with the team.' },
        },
        {
          value: 'events',
          label: { ar: 'مناسبات وجلسات خاصة', en: 'Events & private dining' },
          hint: { ar: 'التاريخ التقريبي وعدد الضيوف يساعدونا نرد عليك بعرض واضح.', en: 'A rough date and head count help us come back with a clear proposal.' },
        },
        {
          value: 'careers',
          label: { ar: 'الوظائف', en: 'Careers' },
          hint: { ar: 'أرسل سيرتك الذاتية على careers@mishwar.example واذكر الوظيفة والفرع.', en: 'Send your CV to careers@mishwar.example with the role and branch you’re interested in.' },
        },
        {
          value: 'press',
          label: { ar: 'الإعلام والصحافة', en: 'Press & media' },
          hint: { ar: 'اذكر الوسيلة الإعلامية وموعد النشر المتوقع.', en: 'Let us know the publication and your deadline.' },
        },
      ],
    },
    branch: {
      label: { ar: 'الفرع', en: 'Branch' },
      placeholder: { ar: 'مو عن فرع معيّن', en: 'Not about a specific branch' },
    },
    message: {
      label: { ar: 'رسالتك', en: 'Your message' },
      errors: {
        required: { ar: 'اكتب رسالتك.', en: 'Write your message.' },
        tooShort: { ar: 'الرسالة قصيرة شوي، زدنا تفاصيل (10 أحرف على الأقل).', en: 'Tell us a little more — at least 10 characters.' },
        tooLong: { ar: 'الرسالة لازم تكون 1000 حرف أو أقل.', en: 'Keep your message to 1000 characters or fewer.' },
      },
    },
    submit: { ar: 'أرسل الرسالة', en: 'Send message' },
    failed: {
      ar: 'ما قدرنا نرسل رسالتك. تأكد من اتصالك بالإنترنت وحاول مرة ثانية، أو راسلنا على {email}.',
      en: 'We couldn’t send your message. Check your connection and try again, or email us at {email}.',
    },
    noscript: {
      ar: 'نموذج التواصل يحتاج تفعيل JavaScript. تقدر تراسلنا مباشرة على {email}.',
      en: 'This form needs JavaScript switched on. You can also email us at {email}.',
    },
  },

  success: {
    eyebrow: { ar: 'تم الإرسال', en: 'Message sent' },
    title: { ar: 'وصلتنا رسالتك', en: 'We have your message' },
    text: {
      ar: 'شكرًا {name}. بنرد عليك خلال يوم عمل على {contact}.',
      en: 'Thanks, {name}. We’ll reply within one working day at {contact}.',
    },
    reference: { ar: 'رقم الرسالة', en: 'Reference' },
    again: { ar: 'أرسل رسالة ثانية', en: 'Send another message' },
  },

  branches: {
    eyebrow: { ar: 'الفروع', en: 'Find us' },
    title: { ar: 'تعال <span class="accent">زورنا</span>', en: 'Come <span class="accent">by</span>' },
  },

  social: {
    title: { ar: 'تابع مِشوار', en: 'Follow Mishwar' },
    text: {
      ar: 'أطباق الموسم، ليالي خاصة، ولمحات من المطبخ قبل ما تنزل المنيو.',
      en: 'Seasonal plates, special nights and glimpses from the kitchen before they reach the menu.',
    },
  },
};
