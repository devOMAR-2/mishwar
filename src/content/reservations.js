/**
 * Reservations page copy. `{phone}`-style placeholders are filled by the
 * template (build) or by js/modules/reservation-form.js (browser).
 */

export const reservations = {
  meta: {
    title: { ar: 'احجز طاولة', en: 'Book a Table' },
    description: {
      ar: 'احجز طاولتك في مِشوار الياسمين أو قرطبة خلال دقيقة: اختر الفرع واليوم والوقت وعدد الأشخاص، ويؤكّد لك الفرع الحجز برسالة أو على الواتساب.',
      en: 'Book a table at Mishwar in Al Yasmin or Qurtubah in under a minute — choose a branch, day, time and party size, and the branch confirms by SMS or WhatsApp.',
    },
  },

  hero: {
    eyebrow: { ar: 'الحجز', en: 'Reservations' },
    title: { ar: 'خلّ الطاولة <span class="accent">علينا</span>', en: 'Leave the table <span class="accent">to us</span>' },
    lede: {
      ar: 'اختر الفرع واليوم والوقت — ما ياخذ منك دقيقة. يوصلك تأكيد الحجز من الفرع برسالة أو على الواتساب.',
      en: 'Pick a branch, a day and a time — it takes less than a minute. The branch confirms your booking by SMS or WhatsApp.',
    },
    call: { ar: 'تفضّل الاتصال؟', en: 'Rather talk to someone?' },
  },

  form: {
    title: { ar: 'تفاصيل الحجز', en: 'Booking details' },
    requiredNote: {
      ar: 'كل الحقول مطلوبة ما عدا المكتوب عندها «اختياري».',
      en: 'All fields are required unless marked optional.',
    },
    steps: [
      { ar: 'وين ومتى', en: 'Where & when' },
      { ar: 'الطاولة', en: 'The table' },
      { ar: 'بياناتك', en: 'Your details' },
    ],

    branch: {
      legend: { ar: 'الفرع', en: 'Branch' },
      errors: { required: { ar: 'اختر الفرع اللي تبي تحجز فيه.', en: 'Choose the branch you’d like to book.' } },
    },

    date: {
      legend: { ar: 'اليوم', en: 'Date' },
      hint: { ar: 'نستقبل الحجوزات حتى 60 يوم مقدّمًا.', en: 'We take bookings up to 60 days ahead.' },
      toggle: { ar: 'تبي تاريخ أبعد؟', en: 'Need a later date?' },
      inputLabel: { ar: 'اختر التاريخ', en: 'Choose a date' },
      errors: {
        required: { ar: 'اختر يوم الحجز.', en: 'Choose a day for your booking.' },
        past: { ar: 'هذا التاريخ فات، اختر اليوم أو يوم بعده.', en: 'That date has passed — choose today or later.' },
        range: { ar: 'نستقبل الحجز حتى 60 يوم من اليوم فقط.', en: 'We can only take bookings up to 60 days ahead.' },
        full: { ar: 'ما بقى أوقات متاحة هذا اليوم، اختر يوم ثاني.', en: 'There are no times left on this day — please choose another.' },
      },
    },

    time: {
      legend: { ar: 'الوقت', en: 'Time' },
      hint: { ar: 'آخر حجز قبل الإقفال بساعة ونص.', en: 'Last seating is 90 minutes before closing.' },
      selectLabel: { ar: 'اختر الوقت', en: 'Choose a time' },
      pickBranch: { ar: 'اختر الفرع عشان تطلع لك الأوقات المتاحة.', en: 'Choose a branch to see the available times.' },
      errors: { required: { ar: 'اختر وقت الحجز.', en: 'Choose a time for your booking.' } },
      periods: {
        lunch: { ar: 'الغدا', en: 'Lunch' },
        dinner: { ar: 'العشا', en: 'Dinner' },
        late: { ar: 'السهرة', en: 'Late' },
      },
    },

    guests: {
      label: { ar: 'عدد الأشخاص', en: 'Guests' },
      hint: {
        ar: 'الحجز أونلاين حتى 12 شخص. أكثر؟ اتصل على {phone} ونرتّب لكم.',
        en: 'Online bookings are for up to 12. A bigger group? Call {phone} and we’ll sort it out.',
      },
      decrease: { ar: 'تقليل عدد الأشخاص', en: 'Fewer guests' },
      increase: { ar: 'زيادة عدد الأشخاص', en: 'More guests' },
      errors: {
        required: { ar: 'حدّد عدد الأشخاص.', en: 'Enter the number of guests.' },
        range: {
          ar: 'الحجز أونلاين من 1 إلى 12 شخص. للمجموعات الأكبر اتصل علينا.',
          en: 'Online bookings are for 1 to 12 guests. For bigger groups, please call us.',
        },
      },
    },

    seating: {
      legend: { ar: 'الجلسة المفضّلة', en: 'Seating preference' },
      hint: { ar: 'نحاول نجلسك وين تحب قدر الإمكان.', en: 'We’ll do our best to seat you where you’d like.' },
      options: [
        { value: '', label: { ar: 'بدون تفضيل', en: 'No preference' } },
        { value: 'indoor', label: { ar: 'داخلية', en: 'Indoors' } },
        { value: 'terrace', label: { ar: 'خارجية', en: 'Terrace' }, detail: { ar: 'الياسمين فقط', en: 'Al Yasmin only' }, branches: ['yasmin'] },
        { value: 'private', label: { ar: 'غرفة خاصة', en: 'Private room' }, detail: { ar: 'الياسمين فقط · حسب التوفّر', en: 'Al Yasmin only · subject to availability' }, branches: ['yasmin'] },
      ],
    },

    occasion: {
      label: { ar: 'المناسبة', en: 'Occasion' },
      placeholder: { ar: 'بدون مناسبة', en: 'No particular occasion' },
      hint: { ar: 'قل لنا ونجهّز لمسة بسيطة على الطاولة.', en: 'Tell us and we’ll add a small touch to the table.' },
      options: [
        { value: 'birthday', label: { ar: 'عيد ميلاد', en: 'Birthday' } },
        { value: 'anniversary', label: { ar: 'ذكرى زواج', en: 'Anniversary' } },
        { value: 'graduation', label: { ar: 'تخرّج', en: 'Graduation' } },
        { value: 'family', label: { ar: 'جمعة عائلية', en: 'Family gathering' } },
        { value: 'business', label: { ar: 'غدا أو عشا عمل', en: 'Business meal' } },
        { value: 'other', label: { ar: 'مناسبة ثانية', en: 'Something else' } },
      ],
    },

    name: {
      label: { ar: 'الاسم الكامل', en: 'Full name' },
      errors: {
        required: { ar: 'اكتب اسمك عشان نسجّل الحجز باسمك.', en: 'Enter your name so we can put the booking under it.' },
        tooShort: { ar: 'الاسم قصير، اكتبه كامل.', en: 'Enter your full name.' },
      },
    },

    phone: {
      label: { ar: 'رقم الجوال', en: 'Mobile number' },
      hint: { ar: 'يوصلك عليه تأكيد الحجز برسالة أو واتساب.', en: 'We’ll send your confirmation here by SMS or WhatsApp.' },
      errors: { required: { ar: 'اكتب رقم جوالك عشان يوصلك التأكيد.', en: 'Enter your mobile number so we can confirm.' } },
    },

    email: {
      label: { ar: 'البريد الإلكتروني', en: 'Email' },
      hint: { ar: 'لو تبي نسخة من الحجز على إيميلك.', en: 'If you’d like a copy of the booking by email.' },
    },

    notes: {
      label: { ar: 'ملاحظات', en: 'Notes' },
      hint: {
        ar: 'حساسية من أكل، كرسي أطفال، أو مفاجأة تبينا نعرف عنها.',
        en: 'Allergies, a high chair, or a surprise we should be in on.',
      },
      errors: { tooLong: { ar: 'الملاحظات لازم تكون 300 حرف أو أقل.', en: 'Keep notes to 300 characters or fewer.' } },
    },

    submit: { ar: 'أرسل طلب الحجز', en: 'Request this table' },
    confirmNote: {
      ar: 'يؤكّد لك الفرع الحجز برسالة أو واتساب خلال وقت قصير.',
      en: 'The branch confirms by SMS or WhatsApp shortly after.',
    },
    failed: {
      ar: 'ما قدرنا نرسل حجزك. تأكد من اتصالك بالإنترنت وحاول مرة ثانية، أو اتصل علينا على {phone}.',
      en: 'We couldn’t send your booking. Check your connection and try again, or call us on {phone}.',
    },
    noscript: {
      ar: 'الحجز أونلاين يحتاج تفعيل JavaScript في المتصفح. تقدر تحجز بالاتصال على {phone}.',
      en: 'Booking online needs JavaScript switched on. You can also book by calling {phone}.',
    },
  },

  summary: {
    title: { ar: 'حجزك', en: 'Your booking' },
    pending: { ar: 'لم يُحدَّد بعد', en: 'Not chosen yet' },
    labels: {
      branch: { ar: 'الفرع', en: 'Branch' },
      date: { ar: 'اليوم', en: 'Date' },
      time: { ar: 'الوقت', en: 'Time' },
      guests: { ar: 'الأشخاص', en: 'Guests' },
      seating: { ar: 'الجلسة', en: 'Seating' },
      occasion: { ar: 'المناسبة', en: 'Occasion' },
    },
  },

  // Browser-only strings (serialised into the page for the current language).
  client: {
    today: { ar: 'اليوم', en: 'Today' },
    tomorrow: { ar: 'غدًا', en: 'Tomorrow' },
    guests: {
      ar: { one: 'شخص واحد', two: 'شخصين', few: '{n} أشخاص', other: '{n} شخص' },
      en: { one: '1 guest', other: '{n} guests' },
    },
    slotsAvailable: {
      ar: { one: 'وقت واحد متاح يوم {date} في {branch}.', two: 'وقتين متاحين يوم {date} في {branch}.', few: '{n} أوقات متاحة يوم {date} في {branch}.', other: '{n} وقت متاح يوم {date} في {branch}.' },
      en: { one: '1 time available on {date} at {branch}.', other: '{n} times available on {date} at {branch}.' },
    },
    noSlots: { ar: 'ما بقى أوقات متاحة هذا اليوم في {branch}. جرّب يوم ثاني.', en: 'No times left on this day at {branch}. Try another day.' },
    timeCleared: {
      ar: 'الوقت اللي اخترته مو متاح في هذا اليوم أو الفرع، اختر وقت ثاني.',
      en: 'The time you picked isn’t available for this day or branch — please choose another.',
    },
    seatingCleared: {
      ar: 'الجلسات الخارجية والغرفة الخاصة في الياسمين فقط، فرجّعنا الجلسة لـ«بدون تفضيل».',
      en: 'The terrace and the private room are only at Al Yasmin, so we’ve set seating back to no preference.',
    },
    guestsLimit: {
      ar: 'الحد الأعلى أونلاين 12 شخص. للمجموعات الأكبر اتصل على {phone}.',
      en: 'Online bookings go up to 12. For a bigger group, call {phone}.',
    },
    calendarTitle: { ar: 'حجز في {branch}', en: 'Table at {branch}' },
    calendarDescription: {
      ar: 'رقم الحجز: {reference}\n{guests}\nنمسك الطاولة 15 دقيقة من وقت الحجز. للتعديل أو الإلغاء اتصل على {phone}.',
      en: 'Reference: {reference}\n{guests}\nWe hold tables for 15 minutes. To change or cancel, call {phone}.',
    },
  },

  success: {
    eyebrow: { ar: 'تم الإرسال', en: 'Request sent' },
    title: { ar: 'تم استلام حجزك', en: 'Your reservation has been received' },
    text: {
      ar: 'شكرًا {name}. وصل طلبك لفريق {branch}، وبيؤكّدون لك الحجز برسالة أو على الواتساب على الرقم {phone} خلال وقت قصير.',
      en: 'Thank you, {name}. Your request is with the {branch} team — they’ll confirm by SMS or WhatsApp on {phone} shortly.',
    },
    reference: { ar: 'رقم الحجز', en: 'Reference' },
    referenceNote: { ar: 'احتفظ فيه لو احتجت تعدّل أو تلغي.', en: 'Keep it handy in case you need to change or cancel.' },
    calendar: { ar: 'أضف للتقويم', en: 'Add to calendar' },
    directions: { ar: 'الاتجاهات', en: 'Directions' },
    again: { ar: 'حجز جديد', en: 'Make another booking' },
    change: { ar: 'تبي تغيّر شي؟ اتصل على الفرع', en: 'Need to change something? Call the branch on' },
  },

  info: {
    eyebrow: { ar: 'قبل ما تجي', en: 'Good to know' },
    title: { ar: 'كم شغلة <span class="accent">قبل ما توصل</span>', en: 'A few things <span class="accent">before you arrive</span>' },
    caption: { ar: 'السفرة جاهزة، ناقصها أنتم.', en: 'The table’s set — it’s just missing you.' },
    policies: [
      {
        title: { ar: 'نمسك الطاولة 15 دقيقة', en: 'We hold tables for 15 minutes' },
        text: {
          ar: 'بتتأخر أكثر؟ كلّم الفرع ونحاول نمسكها لك. بعد 15 دقيقة ممكن تروح الطاولة لضيوف ينتظرون.',
          en: 'Running later than that? Call the branch and we’ll do what we can — after 15 minutes the table may go to guests who are waiting.',
        },
      },
      {
        title: { ar: 'المجموعات فوق 12 شخص', en: 'Groups over 12' },
        text: {
          ar: 'للجمعات الكبيرة والمناسبات، اتصل على الرقم الموحّد {phone} ونرتّب معك الطاولة والمنيو.',
          en: 'For bigger gatherings and occasions, call {phone} and we’ll plan the table — and the menu — with you.',
        },
      },
      {
        title: { ar: 'التعديل والإلغاء', en: 'Changes & cancellations' },
        text: {
          ar: 'تغيّرت خطتك؟ عادي. بلّغنا قبلها بثلاث ساعات على الأقل، بالاتصال أو بالرد على رسالة التأكيد.',
          en: 'Plans change — that’s fine. Let us know at least three hours ahead by calling or replying to your confirmation message.',
        },
      },
      {
        title: { ar: 'الأطفال على الراس', en: 'Children welcome' },
        text: {
          ar: 'عندنا كراسي أطفال في الفرعين. اذكرها في الملاحظات ونجهّزها قبل ما توصل.',
          en: 'Both branches have high chairs — mention it in the notes and we’ll have one ready.',
        },
      },
    ],
    lines: {
      title: { ar: 'تفضّل تكلّمنا مباشرة؟', en: 'Rather speak to the branch?' },
      central: { ar: 'الرقم الموحّد', en: 'Central line' },
      centralNote: { ar: 'للحجوزات والمجموعات من أي فرع', en: 'Bookings and groups for either branch' },
    },
  },
};
