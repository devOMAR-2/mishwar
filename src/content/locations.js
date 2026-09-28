/** Locations page copy. Branch facts (address, hours, phone…) live in src/data/locations.js. */

export const locationsPage = {
  meta: {
    title: { ar: 'الفروع: الياسمين وقرطبة، الرياض', en: 'Locations: Al Yasmin & Qurtubah, Riyadh' },
    description: {
      ar: 'عناوين فروع مِشوار في الرياض وساعات العمل وأرقام التواصل والمواقف: الياسمين في الشمال، وقرطبة في الشرق — والفرع الثالث قريبًا.',
      en: 'Addresses, opening hours, phone numbers and parking for Mishwar in Riyadh: Al Yasmin in the north, Qurtubah in the east — and a third room on the way.',
    },
  },

  hero: {
    eyebrow: { ar: 'الفروع', en: 'Locations' },
    title: { ar: 'وين <span class="accent">مشوارك</span> الليلة؟', en: 'Where’s tonight’s <span class="accent">mishwar?</span>' },
    lede: {
      ar: 'فرعين في الرياض — الياسمين في الشمال، وقرطبة في الشرق — والثالث على الطريق. اختر الأقرب لك، أو الجلسة اللي تناسب سهرتك.',
      en: 'Two rooms in Riyadh — Al Yasmin in the north, Qurtubah in the east — and a third on the way. Pick the closest, or the one that suits your evening.',
    },
  },

  map: {
    label: { ar: 'خريطة مبسّطة لفروع مِشوار في الرياض', en: 'Stylised map of Mishwar’s branches in Riyadh' },
    jump: { ar: 'انتقل لتفاصيل الفرع', en: 'jump to branch details' },
    city: { ar: 'الرياض', en: 'Riyadh' },
    north: { ar: 'ش', en: 'N' },
    scale: { ar: '5 كم', en: '5 km' },
    soon: { ar: 'الثالث؟', en: 'Next stop?' },
    note: {
      ar: 'الخريطة للتوضيح فقط — للاتجاهات استخدم «افتح في الخرائط» في تفاصيل كل فرع.',
      en: 'For illustration only — use “Open in Maps” in each branch’s details for directions.',
    },
    legend: {
      open: { ar: 'فرع مفتوح', en: 'Open branch' },
      soon: { ar: 'قريبًا', en: 'Coming soon' },
      route: { ar: 'مشوارنا', en: 'Our route' },
    },
    places: {
      olaya: { ar: 'العليا', en: 'Olaya' },
      airport: { ar: 'المطار', en: 'Airport' },
    },
    roads: {
      kingFahd: { ar: 'طريق الملك فهد', en: 'King Fahd Rd' },
      northernRing: { ar: 'الدائري الشمالي', en: 'Northern Ring Rd' },
      easternRing: { ar: 'الدائري الشرقي', en: 'Eastern Ring Rd' },
      kingSalman: { ar: 'طريق الملك سلمان', en: 'King Salman Rd' },
      airport: { ar: 'طريق المطار', en: 'Airport Rd' },
      wadi: { ar: 'وادي حنيفة', en: 'Wadi Hanifa' },
    },
  },

  labels: {
    since: { ar: 'منذ {year}', en: 'Since {year}' },
    landmark: { ar: 'أقرب معلم', en: 'Landmark' },
    features: { ar: 'في الفرع', en: 'At this branch' },
    gettingThere: { ar: 'الوصول والمواقف', en: 'Getting there' },
    reserveAt: { ar: 'احجز في {branch}', en: 'Reserve at {branch}' },
    copy: { ar: 'نسخ', en: 'Copy' },
    copied: { ar: 'تم النسخ', en: 'Copied' },
  },

  branches: {
    yasmin: {
      tagline: { ar: 'هنا بدأ كل شي', en: 'Where it all began' },
      detailImage: 'exterior',
      detailAlt: { ar: 'مدخل فرع الياسمين بإضاءته الدافية وقت المغرب', en: 'The Al Yasmin entrance, lit warm at dusk' },
      directions: {
        ar: 'المدخل من الجهة الشرقية للمبنى. صف السيارات يبدأ من 7 مساءً، وقبلها فيه مواقف مجانية خلف المبنى.',
        en: 'The entrance is on the east side of the building. Valet starts at 7 pm; before that there’s free parking behind the building.',
      },
    },
    qurtubah: {
      tagline: { ar: 'أكبر سفرة عندنا', en: 'Our biggest table' },
      detailImage: 'interior-main',
      detailAlt: { ar: 'صالة فرع قرطبة بطاولاتها الطويلة', en: 'The Qurtubah dining room and its long tables' },
      directions: {
        ar: 'على الطريق الخدمي، بعد التقاطع الرئيسي بقليل، والمدخل من الجهة الجنوبية.',
        en: 'On the service road, a short drive past the main junction. Private parking is beneath the building; the entrance is on the south side.',
      },
    },
  },

  soon: {
    eyebrow: { ar: 'الفرع الثالث', en: 'Branch three' },
    title: { ar: 'مشوار جديد <span class="accent">على الطريق</span>', en: 'A new mishwar <span class="accent">on the way</span>' },
    text: {
      ar: 'نجهّز لفرعنا الثالث في الرياض. الحي؟ نخليها مفاجأة لين نقرّب من الافتتاح — وبتعرفون هنا أول.',
      en: 'Our third room in Riyadh is taking shape. Which neighbourhood? We’re keeping that quiet until we’re close to opening — you’ll hear it here first.',
    },
    suggest: { ar: 'وين تتمنى نفتح؟ قل لنا', en: 'Where would you like us next? Tell us' },
  },

  faq: {
    eyebrow: { ar: 'قبل لا تجي', en: 'Good to know' },
    title: { ar: 'أسئلة <span class="accent">تتكرر</span>', en: 'Questions we <span class="accent">get a lot</span>' },
    items: [
      {
        q: { ar: 'فيه جلسات عائلية؟', en: 'Do you have family seating?' },
        a: {
          ar: 'نعم، في الفرعين. الجلسات العائلية فيها بارتشن تقدر تسكّره إذا تبي خصوصية أكثر — بس اذكرها وقت الحجز.',
          en: 'Yes, at both branches. Family sections have screens you can close for more privacy — just mention it when you book.',
        },
      },
      {
        q: { ar: 'وين أوقف سيارتي؟', en: 'Where do I park?' },
        a: {
          ar: 'في الياسمين: صف سيارات من 7 مساءً، ومواقف مجانية خلف المبنى. في قرطبة: مواقف خاصة تحت المبنى طول ساعات العمل.',
          en: 'Al Yasmin: valet from 7 pm, and free parking behind the building. Qurtubah: private parking beneath the building during all opening hours.',
        },
      },
      {
        q: { ar: 'عندكم غرف خاصة؟', en: 'Can I book a private room?' },
        a: {
          ar: 'في الياسمين غرفة خاصة تكفي 14 شخص. احجزها قبلها بـ 48 ساعة على الأقل، بالاتصال أو الواتساب.',
          en: 'Al Yasmin has a private room for up to 14 guests. Book it at least 48 hours ahead by phone or WhatsApp.',
        },
      },
      {
        q: { ar: 'حنا مجموعة كبيرة، تقدرون تستقبلونا؟', en: 'We’re a big group — can you fit us?' },
        a: {
          ar: 'قرطبة فيها طاولات تكفي لين 20 شخص. للمجموعات فوق 12 شخص كلّمنا مباشرة، ونجهّز لكم الطاولة ونقترح عليكم الطلب.',
          en: 'Qurtubah has tables for up to 20. For groups over 12, call us directly and we’ll set the table and suggest what to order.',
        },
      },
      {
        q: { ar: 'تستقبلون الأطفال؟', en: 'Is it child-friendly?' },
        a: {
          ar: 'أكيد. فيه كراسي أطفال في الفرعين، والمطبخ يقدر يجهّز نص كمية من أغلب الأطباق.',
          en: 'Absolutely. There are high chairs at both branches, and the kitchen can do half portions of most dishes.',
        },
      },
      {
        q: { ar: 'وش أوقاتكم في رمضان؟', en: 'What are your hours during Ramadan?' },
        a: {
          ar: 'في رمضان نفتح من المغرب لين السحور، وننشر الأوقات بالضبط على حساباتنا قبل بداية الشهر. حجوزات الفطور تفتح قبل رمضان بأسبوعين.',
          en: 'During Ramadan we open from maghrib until suhoor, and post exact times on our socials before the month begins. Iftar bookings open two weeks ahead.',
        },
      },
    ],
    more: { ar: 'عندك سؤال ثاني؟', en: 'Something else?' },
    call: { ar: 'اتصل على الرقم الموحّد', en: 'Call our central line' },
    whatsapp: { ar: 'أو راسلنا واتساب', en: 'or message us on WhatsApp' },
  },
};
