/**
 * Branch data — consumed by the static build *and* the browser
 * (open/closed status, reservation time slots), so keep it plain ESM.
 *
 * Hours are listed per weekday (0 = Sunday … 6 = Saturday) in Riyadh time.
 * A closing time earlier than the opening time means "after midnight".
 *
 * NOTE: fictional placeholder addresses and zeroed-out phone numbers.
 */

const weekdayHours = { open: '12:30', close: '00:30' };
const lateHours = { open: '12:30', close: '01:30' }; // Thursday night
const fridayHours = { open: '13:30', close: '01:30' }; // opens after Friday prayer

export const locations = [
  {
    id: 'yasmin',
    status: 'open',
    name: { ar: 'مِشوار الياسمين', en: 'Mishwar Al Yasmin' },
    shortName: { ar: 'الياسمين', en: 'Al Yasmin' },
    district: { ar: 'حي الياسمين، شمال الرياض', en: 'Al Yasmin District, North Riyadh' },
    address: {
      ar: 'مبنى 0000، شارع 00، حي الياسمين، الرياض 00000',
      en: 'Building 0000, Street 00, Al Yasmin, Riyadh 00000',
    },
    shortAddress: 'XXXX0000',
    landmark: {
      ar: 'مقابل حديقة الحي، والمدخل من الجهة الشرقية',
      en: 'Opposite the neighbourhood park, entrance on the east side',
    },
    coordinates: { lat: 24.82, lng: 46.64 },
    phone: '0000000000',
    phoneDisplay: '000 000 0000',
    opened: 2022,
    image: 'branch-yasmin',
    summary: {
      ar: 'فرعنا الأول. مساحة مفتوحة بإضاءة نهارية، وجلسات خارجية تصير أحلى مع نسمة الشتاء.',
      en: 'Where it started. An open, daylight-filled room with a terrace that comes alive in the cooler months.',
    },
    features: [
      { ar: 'جلسات خارجية', en: 'Terrace seating' },
      { ar: 'غرفة خاصة تكفي 14 شخص', en: 'Private room for 14' },
      { ar: 'خدمة صف السيارات', en: 'Valet parking' },
    ],
    hours: [weekdayHours, weekdayHours, weekdayHours, weekdayHours, lateHours, fridayHours, weekdayHours],
  },
  {
    id: 'qurtubah',
    status: 'open',
    name: { ar: 'مِشوار قرطبة', en: 'Mishwar Qurtubah' },
    shortName: { ar: 'قرطبة', en: 'Qurtubah' },
    district: { ar: 'حي قرطبة، شرق الرياض', en: 'Qurtubah District, East Riyadh' },
    address: {
      ar: 'مبنى 0000، شارع 00، حي قرطبة، الرياض 00000',
      en: 'Building 0000, Street 00, Qurtubah, Riyadh 00000',
    },
    shortAddress: 'XXXX0000',
    landmark: {
      ar: 'على الطريق الخدمي، والمدخل من الجهة الجنوبية',
      en: 'On the service road, entrance on the south side',
    },
    coordinates: { lat: 24.81, lng: 46.74 },
    phone: '0000000000',
    phoneDisplay: '000 000 0000',
    opened: 2024,
    image: 'branch-qurtubah',
    summary: {
      ar: 'أكبر فروعنا. إضاءة دافية، طاولات طويلة للجمعات، ومطبخ مفتوح تشوف فيه الشغل من أوله.',
      en: 'Our largest room. Warm light, long tables built for gatherings, and an open kitchen you can watch from your seat.',
    },
    features: [
      { ar: 'مطبخ مفتوح', en: 'Open kitchen' },
      { ar: 'طاولات للمجموعات حتى 20 شخص', en: 'Group tables for up to 20' },
      { ar: 'مواقف خاصة', en: 'Private parking' },
    ],
    hours: [
      { open: '13:00', close: '01:00' },
      { open: '13:00', close: '01:00' },
      { open: '13:00', close: '01:00' },
      { open: '13:00', close: '01:00' },
      { open: '13:00', close: '02:00' },
      { open: '14:00', close: '02:00' },
      { open: '13:00', close: '01:00' },
    ],
  },
  {
    id: 'third',
    status: 'coming-soon',
    name: { ar: 'مِشوار الثالث', en: 'The Third Mishwar' },
    shortName: { ar: 'قريبًا', en: 'Coming soon' },
    district: { ar: 'الرياض', en: 'Riyadh' },
    image: 'coming-soon',
    summary: {
      ar: 'نجهّز لمشوار جديد في الرياض. الحي؟ نخليها مفاجأة لين نقترب من الافتتاح.',
      en: 'A new Mishwar is taking shape in Riyadh. Which neighbourhood? We’ll keep that to ourselves a little longer.',
    },
  },
];

export const openLocations = locations.filter((l) => l.status === 'open');
