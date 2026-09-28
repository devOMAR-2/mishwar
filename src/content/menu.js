/** Menu page copy. Dishes, categories and dietary labels live in src/data/menu.js. */

export const menuPage = {
  meta: {
    title: { ar: 'المنيو', en: 'Menu' },
    description: {
      ar: 'منيو مِشوار في الرياض: كبسة لحم نعيمي، جريش، قرصان، مطازيز وسليق، مع مقبلات للمشاركة وحلى وقهوة سعودية. الأسعار بالريال وشاملة الضريبة.',
      en: 'The Mishwar menu: Naeemi lamb kabsa, jareesh, qursan, matazeez and saleeg, plus sharing plates, desserts and Saudi coffee. Prices in SAR, VAT included.',
    },
    menuName: { ar: 'منيو مِشوار', en: 'Mishwar menu' },
  },

  hero: {
    eyebrow: { ar: 'من مطبخ مِشوار · الرياض', en: 'From the Mishwar kitchen · Riyadh' },
    title: { ar: 'منيو <span class="accent">مِشوار</span>', en: 'The <span class="accent">menu</span>' },
    lede: {
      ar: 'أطباق من سفرة نجد والحجاز: مقبلات تتقاسمها مع ربعك، أطباق رئيسية تنطبخ على مهل، وحلى وقهوة تختم فيها الجلسة.',
      en: 'Plates from Najdi and Hijazi tables: starters to pass around, mains cooked low and slow, and sweets and coffee to close the night.',
    },
    indexLabel: { ar: 'أقسام المنيو', en: 'Menu sections' },
    allergy: {
      ar: 'عندك حساسية من أكل معيّن؟ قل لفريق الخدمة قبل الطلب.',
      en: 'Allergies or dietary needs? Tell your server before you order.',
    },
    notesLink: { ar: 'ملاحظات المطبخ', en: 'Kitchen notes' },
    caption: { ar: 'خلطات البهارات نطحنها في مطبخنا.', en: 'Our spice blends are ground in-house.' },
  },

  filters: {
    label: { ar: 'تصفّح المنيو', en: 'Browse the menu' },
    categories: { ar: 'أقسام المنيو', en: 'Menu sections' },
    all: { ar: 'الكل', en: 'All' },
    diet: { ar: 'حسب تفضيلك', en: 'Dietary preferences' },
    toggle: { ar: 'فلترة', en: 'Filters' },
    options: [
      { id: 'vegetarian', icon: 'leaf', label: { ar: 'نباتي', en: 'Vegetarian' } },
      { id: 'gluten-free', icon: 'wheat', label: { ar: 'خالٍ من الجلوتين', en: 'Gluten-free' } },
      { id: 'spicy', icon: 'chili', label: { ar: 'حار', en: 'Spicy' } },
      { id: 'signature', icon: 'sparkle', label: { ar: 'أطباق مِشوار', en: 'Signatures' } },
    ],
    clear: { ar: 'امسح الفلاتر', en: 'Clear filters' },
    status: {
      all: { ar: '{count} في المنيو', en: '{count} on the menu' },
      category: { ar: '{count} في قسم {category}', en: '{count} in {category}' },
      filtered: { ar: '{count} حسب اختيارك', en: '{count} matching your filters' },
    },
    empty: {
      title: { ar: 'ما لقينا طبق يجمع كل هذي الاختيارات.', en: 'Nothing on the menu ticks all of those boxes.' },
      text: {
        ar: 'جرّب تشيل فلتر أو اثنين. وإذا عندك طلب خاص، كلّم فريق الخدمة — كثير من أطباقنا نقدر نعدّلها لك.',
        en: 'Try removing a filter or two. If you have a specific need, ask your server — many of our dishes can be adjusted.',
      },
    },
  },

  /** Dish counts, keyed by Intl.PluralRules category (Arabic has six). */
  count: {
    ar: { zero: 'لا توجد أطباق', one: 'طبق واحد', two: 'طبقان', few: '{n} أطباق', many: '{n} طبقًا', other: '{n} طبق' },
    en: { one: '{n} dish', other: '{n} dishes' },
  },

  /**
   * Composition per category, so each section reads differently:
   *   pair   two photographed highlights, wide + narrow
   *   spread one large highlight, photo beside the copy
   *   aside  one highlight in a side column next to the list
   */
  sections: {
    starters: { layout: 'pair', features: 2 },
    mains: { layout: 'spread', features: 1 },
    sides: { layout: 'aside', features: 1 },
    desserts: { layout: 'pair', features: 2, reverse: true },
    drinks: { layout: 'aside', features: 1, compact: true, surface: 'dark' },
  },

  notes: {
    eyebrow: { ar: 'قبل ما تطلب', en: 'Before you order' },
    title: { ar: 'ملاحظات <span class="accent">المطبخ</span>', en: 'Kitchen <span class="accent">notes</span>' },
    legend: {
      title: { ar: 'دليل الرموز', en: 'Key' },
      rows: {
        signature: { ar: 'طبق يعرّفك على مِشوار — ابدأ منه.', en: 'The dishes we’re known for. Start here.' },
        sharing: { ar: 'معمول للنص، يتقاسمه أكثر من شخص.', en: 'Made for the middle of the table.' },
        mild: { ar: 'حرارة خفيفة تناسب أغلب الناس.', en: 'A gentle warmth most people enjoy.' },
        hot: { ar: 'حار فعلًا — اسأل عنه قبل.', en: 'Properly hot. Ask us first.' },
        vegetarian: { ar: 'بدون لحم أو دجاج أو سمك.', en: 'No meat, poultry or fish.' },
        vegan: { ar: 'بدون أي منتجات حيوانية.', en: 'No animal products at all.' },
        'gluten-free': { ar: 'بدون قمح أو شعير.', en: 'Made without wheat or barley.' },
        nuts: { ar: 'فيه مكسرات أو فستق.', en: 'Contains nuts or pistachio.' },
      },
    },
    allergy: {
      title: { ar: 'الحساسية', en: 'Allergies' },
      text: {
        ar: 'مطبخنا يتعامل مع القمح والألبان والمكسرات والسمسم والبيض. نفصل بينها قدر الإمكان، لكن ما نقدر نضمن خلو أي طبق من آثارها تمامًا. بلّغ فريق الخدمة عن أي حساسية قبل الطلب.',
        en: 'Our kitchen handles wheat, dairy, nuts, sesame and eggs. We keep them apart wherever we can, but we can’t guarantee any dish is completely free of traces. Please tell your server about allergies before ordering.',
      },
    },
    season: {
      title: { ar: 'على حسب الموسم', en: 'By the season' },
      text: {
        ar: 'بعض الأطباق تطلع في وقتها فقط، وبكميات محدودة:',
        en: 'A few dishes only appear in their season, and in small batches:',
      },
    },
    reserve: {
      title: { ar: 'جاهز تجرّبها؟', en: 'Hungry yet?' },
      text: {
        ar: 'احجز طاولتك في الياسمين أو قرطبة، والأطباق الكبيرة تنتظرك.',
        en: 'Book a table in Al Yasmin or Qurtubah and let the big plates do the talking.',
      },
    },
  },
};
