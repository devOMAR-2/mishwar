/**
 * Privacy policy copy.
 *
 * Section bodies are lists of blocks:
 *   { p }                     paragraph (may contain trusted inline markup)
 *   { list: [...] }           bulleted list
 *   { facts: [{ term, detail }] }  labelled rows (what / how long …)
 */

export const privacy = {
  meta: {
    title: { ar: 'سياسة الخصوصية', en: 'Privacy Policy' },
    description: {
      ar: 'كيف يتعامل مِشوار مع بياناتك: ما نجمعه عند الحجز أو التواصل، ولماذا، وكم نحتفظ به، وحقوقك على بياناتك الشخصية.',
      en: 'How Mishwar handles your information: what we collect when you book or get in touch, why, how long we keep it, and your rights over your personal data.',
    },
  },

  hero: {
    eyebrow: { ar: 'الخصوصية', en: 'The fine print' },
    title: {
      ar: 'بياناتك <span class="accent">أمانة عندنا</span>',
      en: 'Your details, <span class="accent">handled with care</span>',
    },
    lede: {
      ar: 'نطلب منك أقل قدر من المعلومات يكفي عشان نجهّز طاولتك أو نرد على رسالتك — وهنا نشرح بوضوح وش نسوي فيها.',
      en: 'We ask for as little as we need to set your table or answer your message. Here’s exactly what happens to it, in plain language.',
    },
  },

  updated: { label: { ar: 'آخر تحديث', en: 'Last updated' }, date: '2026-09-01' },
  tocLabel: { ar: 'في هذه الصفحة', en: 'On this page' },

  notice: {
    title: { ar: 'قبل أن تبدأ: مِشوار مشروع افتراضي', en: 'Before you read on: Mishwar is fictional' },
    text: {
      ar: 'مِشوار مطعم غير حقيقي، وهذا الموقع مشروع تصميم وتطوير لأغراض العرض. لا تُرسَل أي بيانات تُدخلها هنا إلى خادم، ولا يعالجها أي شخص. كُتبت هذه السياسة لتوضّح كيف سيتعامل مطعم حقيقي مع بياناتك.',
      en: 'Mishwar isn’t a real restaurant, and this site is a design and development concept. Nothing you enter here is sent to a server or seen by anyone. This policy shows how a real restaurant would handle your data.',
    },
  },

  summary: {
    title: { ar: 'باختصار', en: 'In short' },
    points: [
      { ar: 'نجمع فقط ما نحتاجه للحجز أو للرد عليك.', en: 'We only collect what we need to book your table or reply to you.' },
      { ar: 'ما نبيع بياناتك ولا نستخدمها للإعلانات.', en: 'We never sell your data or use it for advertising.' },
      { ar: 'ما فيه ملفات تتبّع ولا أدوات تحليل في هذا الموقع.', en: 'There are no tracking cookies or analytics on this site.' },
      { ar: 'تقدر تطلب نسخة من بياناتك أو حذفها في أي وقت.', en: 'You can ask for a copy of your data, or for it to be deleted, at any time.' },
    ],
  },

  sections: [
    {
      id: 'collect',
      title: { ar: 'المعلومات التي نجمعها', en: 'What we collect' },
      body: [
        {
          p: {
            ar: 'نجمع المعلومات التي تعطينا إياها بنفسك عبر نموذجَين فقط في الموقع، ولا شيء غيرهما:',
            en: 'We only collect what you give us yourself, through the two forms on this site — nothing else:',
          },
        },
        {
          facts: [
            {
              term: { ar: 'نموذج الحجز', en: 'Reservation form' },
              detail: {
                ar: 'الاسم، رقم الجوال، البريد الإلكتروني (اختياري)، الفرع، التاريخ والوقت، عدد الأشخاص، وأي ملاحظات تكتبها مثل حساسية الطعام أو مناسبة خاصة.',
                en: 'Your name, mobile number, email (optional), branch, date and time, party size, and any notes you add — allergies or a special occasion, for example.',
              },
            },
            {
              term: { ar: 'نموذج التواصل', en: 'Contact form' },
              detail: {
                ar: 'الاسم، البريد الإلكتروني، رقم الجوال (اختياري)، نوع الاستفسار، ونص رسالتك.',
                en: 'Your name, email, mobile number (optional), the topic, and your message.',
              },
            },
          ],
        },
        {
          p: {
            ar: 'ما نطلب منك رقم الهوية ولا بيانات بطاقتك البنكية، ولا نجمع موقعك الجغرافي. وإذا ذكرت في ملاحظاتك معلومة صحية مثل الحساسية، نستخدمها فقط لتجهيز أكلك بأمان.',
            en: 'We never ask for your ID number or card details, and we don’t collect your location. If you mention health information such as an allergy, we use it only to prepare your food safely.',
          },
        },
      ],
    },
    {
      id: 'use',
      title: { ar: 'لماذا نستخدمها', en: 'Why we use it' },
      body: [
        { p: { ar: 'نستخدم معلوماتك لأغراض محددة وواضحة:', en: 'We use your information for a few specific reasons:' } },
        {
          list: [
            { ar: 'تأكيد حجزك وتجهيز طاولتك في الفرع الذي اخترته.', en: 'To confirm your booking and have your table ready at the branch you chose.' },
            { ar: 'التواصل معك إذا تغيّر شيء، مثل تأخير أو تعديل على الحجز.', en: 'To reach you if something changes — a delay, or a change to your booking.' },
            { ar: 'الرد على رسالتك أو طلبك للمناسبات الخاصة.', en: 'To reply to your message or private-event enquiry.' },
            { ar: 'مراعاة أي حساسية أو طلب خاص ذكرته.', en: 'To take care of any allergy or special request you mention.' },
          ],
        },
        {
          p: {
            ar: 'لن نرسل لك رسائل تسويقية إلا إذا وافقت على ذلك صراحةً، وتقدر تلغي اشتراكك متى ما حبيت.',
            en: 'We won’t send you marketing unless you’ve clearly said yes, and you can opt out whenever you like.',
          },
        },
      ],
    },
    {
      id: 'retention',
      title: { ar: 'كم نحتفظ بها', en: 'How long we keep it' },
      body: [
        {
          p: {
            ar: 'نحتفظ بالبيانات فقط طوال المدة التي نحتاجها فيها، ثم نحذفها أو نجعلها مجهولة الهوية:',
            en: 'We keep data only for as long as we need it, then delete it or strip out anything that identifies you:',
          },
        },
        {
          facts: [
            {
              term: { ar: 'بيانات الحجز', en: 'Reservations' },
              detail: { ar: '12 شهرًا من تاريخ زيارتك.', en: '12 months from the date of your visit.' },
            },
            {
              term: { ar: 'رسائل التواصل', en: 'Contact messages' },
              detail: { ar: '12 شهرًا من آخر رد بيننا.', en: '12 months from our last reply.' },
            },
            {
              term: { ar: 'ملاحظات الحساسية', en: 'Allergy notes' },
              detail: { ar: 'تُحذف بعد انتهاء الزيارة نفسها.', en: 'Deleted once the visit itself is over.' },
            },
          ],
        },
        {
          p: {
            ar: 'تُحفظ البيانات على أنظمة مؤمّنة، ولا يطّلع عليها إلا فريق الحجوزات ومدير الفرع المعني.',
            en: 'Data is stored on secured systems, and only our reservations team and the relevant branch manager can see it.',
          },
        },
      ],
    },
    {
      id: 'sharing',
      title: { ar: 'مع من نشاركها', en: 'Who we share it with' },
      body: [
        {
          p: {
            ar: '<strong>لا نبيع بياناتك ولا نؤجّرها لأي جهة.</strong> نشاركها فقط مع مزوّدي خدمات يساعدوننا في تشغيل الحجوزات، ولا يُسمح لهم باستخدامها لأي غرض آخر:',
            en: '<strong>We never sell or rent your data to anyone.</strong> We share it only with service providers who help us run bookings, and they may not use it for anything else:',
          },
        },
        {
          list: [
            { ar: 'مزوّد الرسائل النصية الذي يرسل لك تأكيد الحجز والتذكير.', en: 'The SMS provider that sends your booking confirmation and reminder.' },
            { ar: 'مزوّد البريد الإلكتروني الذي نرد من خلاله على رسائلك.', en: 'The email service we use to reply to you.' },
            { ar: 'مزوّد الاستضافة الذي تُحفظ عليه بيانات الحجوزات.', en: 'The hosting provider where booking records are stored.' },
          ],
        },
        {
          p: {
            ar: 'وقد نفصح عن البيانات إذا طلبتها جهة حكومية مختصة وفق الأنظمة المعمول بها في المملكة.',
            en: 'We may also disclose data if a competent Saudi authority requires it by law.',
          },
        },
      ],
    },
    {
      id: 'storage',
      title: { ar: 'ملفات تعريف الارتباط والتخزين المحلي', en: 'Cookies and local storage' },
      body: [
        {
          p: {
            ar: 'هذا الموقع <strong>لا يستخدم</strong> ملفات تعريف الارتباط (الكوكيز) للتتبّع، ولا أدوات تحليل، ولا إعلانات من أطراف أخرى.',
            en: 'This site uses <strong>no</strong> tracking cookies, no analytics tools and no third-party advertising.',
          },
        },
        {
          p: {
            ar: 'لأن الموقع نسخة تجريبية، يُحفظ الحجز الذي تسويه <strong>داخل متصفحك فقط</strong> (عبر خاصية التخزين المحلي) حتى تقدر ترجع لتفاصيله. هذه البيانات ما تطلع من جهازك، ولا توصلنا ولا توصل أي أحد.',
            en: 'Because this is a demo, any booking you make is saved <strong>only in your own browser</strong> (using local storage) so you can see its details again. It never leaves your device and never reaches us or anyone else.',
          },
        },
        {
          p: {
            ar: 'تقدر تمسحها في أي وقت من إعدادات المتصفح عبر حذف بيانات هذا الموقع.',
            en: 'You can remove it at any time by clearing this site’s data in your browser settings.',
          },
        },
      ],
    },
    {
      id: 'rights',
      title: { ar: 'حقوقك', en: 'Your rights' },
      body: [
        {
          p: {
            ar: 'لك حقوق واضحة على بياناتك الشخصية وفق الأنظمة المعمول بها في المملكة، ونحترمها كاملة. من حقك أن:',
            en: 'Under the data-protection rules that apply in Saudi Arabia, you have clear rights over your personal data, and we respect all of them. You can:',
          },
        },
        {
          list: [
            { ar: 'تعرف ما نجمعه عنك ولماذا — وهذا ما تشرحه هذه الصفحة.', en: 'Know what we collect about you and why — which is what this page is for.' },
            { ar: 'تطلب نسخة من بياناتك بصيغة واضحة ومقروءة.', en: 'Ask for a copy of your data in a clear, readable format.' },
            { ar: 'تطلب تصحيح أي معلومة غير دقيقة أو تحديثها.', en: 'Ask us to correct or update anything that’s wrong.' },
            { ar: 'تطلب حذف بياناتك متى ما انتهت الحاجة إليها.', en: 'Ask us to delete your data once it’s no longer needed.' },
            { ar: 'تسحب موافقتك على أي رسائل تسويقية في أي وقت.', en: 'Withdraw your consent to marketing messages at any time.' },
          ],
        },
        {
          p: {
            ar: 'نرد على طلبك خلال 30 يومًا. وإذا ما كنت راضيًا عن طريقة تعاملنا، يحق لك تقديم شكوى إلى الجهة المختصة بحماية البيانات في المملكة.',
            en: 'We’ll respond within 30 days. If you’re not happy with how we’ve handled your request, you can raise a complaint with the competent data-protection authority in Saudi Arabia.',
          },
        },
      ],
    },
    {
      id: 'contact',
      title: { ar: 'كيف تتواصل معنا', en: 'Contact us' },
      body: [
        {
          p: {
            ar: 'لأي سؤال عن خصوصيتك أو لتقديم طلب يتعلق ببياناتك، راسلنا على <a href="mailto:privacy@mishwar.example">privacy@mishwar.example</a> واذكر الاسم ورقم الجوال المستخدمَين في الحجز حتى نوصل لبياناتك بسرعة.',
            en: 'For any privacy question, or to make a request about your data, email <a href="mailto:privacy@mishwar.example">privacy@mishwar.example</a>. Include the name and mobile number you booked with so we can find your details quickly.',
          },
        },
        {
          p: {
            ar: 'إذا غيّرنا هذه السياسة، نحدّث التاريخ أعلى الصفحة، ونوضّح التغييرات المهمة هنا.',
            en: 'If we change this policy, we’ll update the date at the top of the page and point out anything important here.',
          },
        },
      ],
    },
  ],
};
