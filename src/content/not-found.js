/** 404 page copy. */

export const notFound = {
  meta: {
    title: { ar: 'الصفحة غير موجودة', en: 'Page not found' },
    description: {
      ar: 'الصفحة التي تبحث عنها غير موجودة. ارجع إلى الرئيسية أو تصفّح المنيو أو احجز طاولتك في مِشوار.',
      en: 'The page you’re looking for doesn’t exist. Head back home, browse the menu or book a table at Mishwar.',
    },
  },

  eyebrow: { ar: 'خطأ 404 · الصفحة غير موجودة', en: 'Error 404 · Page not found' },
  title: {
    ar: 'شكل المشوار <span class="accent">أخذك لمكان غلط.</span>',
    en: 'Looks like this mishwar <span class="accent">took a wrong turn.</span>',
  },
  lede: {
    ar: 'الصفحة اللي تدوّر عليها انتقلت، أو ما كانت موجودة من الأساس. لا تشيل هم — الطريق للسفرة قريب.',
    en: 'The page you’re after has moved, or never existed in the first place. No harm done — the way back to the table is right here.',
  },

  stopsTitle: { ar: 'وين نوديك؟', en: 'Where to next?' },
  stops: [
    { page: 'menu', note: { ar: 'كبسة، جريش، قرصان… والباقي', en: 'Kabsa, jareesh, qursan and the rest' } },
    { page: 'reservations', note: { ar: 'طاولتك الليلة، خلال دقيقة', en: 'Your table tonight, in under a minute' } },
    { page: 'locations', note: { ar: 'الياسمين وقرطبة', en: 'Al Yasmin and Qurtubah' } },
  ],
};
