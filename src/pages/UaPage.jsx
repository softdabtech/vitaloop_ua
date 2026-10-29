import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Check,
  ClipboardList,
  CreditCard,
  FileSearch,
  FileText,
  FlaskConical,
  HeartPulse,
  HelpCircle,
  LockKeyhole,
  Mail,
  MessageCircle,
  Scale,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import Seo from "../components/Seo.jsx";
import {
  CTA_CLASS,
  PRICING,
  UaFooter,
  UaHeader,
  getUaPath,
} from "./UaLanding.jsx";

const PAGE_CONTENT = {
  samopochuttia: {
    eyebrow: "Самопочуття",
    title: "Почніть із того, що відчуваєте",
    description:
      "VITALOOP допомагає зафіксувати зміни самопочуття в структурі: що саме турбує, коли це почалося, що посилює стан і які дані вже є. Так розмова з лікарем починається з контексту, а не з уривчастих спогадів.",
    icon: HeartPulse,
    cta: "Оцінити самопочуття",
    blocks: [
      [
        "Енергія та відновлення",
        "Втома, спад сил, переносимість навантаження й відновлення після сну.",
      ],
      [
        "Сон і ритм",
        "Засинання, пробудження, якість сну, графік, стрес і зміни режиму.",
      ],
      [
        "Симптоми тіла",
        "Травлення, цикл, шкіра, волосся, біль, серцебиття та інші сигнали.",
      ],
      [
        "Динаміка",
        "Що змінилося за останні тижні, які чинники впливають і що повторюється.",
      ],
    ],
    steps: [
      ["Короткий опис", "Пишете простими словами, без медичних формулювань."],
      ["Структура", "Сервіс розкладає скарги за напрямками."],
      ["Пріоритет", "Виділяємо, з чого логічно почати перевірку."],
    ],
  },
  symptomy: {
    eyebrow: "Симптоми",
    title: "Розбір симптомів без паніки",
    description:
      "Вбудований модуль симптоматики переводить субʼєктивні відчуття у структурований опис: інтенсивність, тривалість, частота, супутні фактори та зміни в часі. Це допомагає помітити потенційні патерни для обговорення з лікарем — без самодіагностики.",
    icon: MessageCircle,
    cta: "Описати симптоми",
    blocks: [
      [
        "Що турбує",
        "Фіксуємо скарги звичайною мовою, без потреби знати медичні терміни.",
      ],
      [
        "Час і частота",
        "Відокремлюємо нові симптоми від давніх станів і бачимо повторюваність.",
      ],
      [
        "Контекст",
        "Сон, харчування, стрес, навантаження, ліки, цикл і вже наявні результати.",
      ],
      [
        "Питання до лікаря",
        "Перетворюємо дані на короткий структурований список для консультації.",
      ],
    ],
    steps: [
      ["Опис", "Ви описуєте стан як у звичайній розмові."],
      ["Звʼязки", "Vitaloop показує можливі групи симптомів."],
      ["Наступний крок", "Отримуєте короткий список дій без зайвого шуму."],
    ],
  },
  analizy: {
    eyebrow: "Аналізи",
    title: "Аналізи українською, а не мовою бланків",
    description:
      "VITALOOP перетворює PDF, фото або скан лабораторного бланка на робочий контекст: показники, одиниці вимірювання, референси, симптоми й попередні результати поруч. Це основа для регулярного контролю та усвідомленої розмови з лікарем.",
    icon: FileSearch,
    cta: "Додати аналізи",
    blocks: [
      [
        "Структура бланка",
        "Назви, значення, одиниці та референси лабораторії в одному зрозумілому вигляді.",
      ],
      [
        "Контекст замість ізольованих цифр",
        "Показники розглядаються поруч із симптомами, способом життя та попередніми результатами.",
      ],
      [
        "Динаміка",
        "Зберігайте повторні бланки, щоб бачити напрямок змін, а не лише одну дату.",
      ],
      [
        "Наступний крок",
        "Підсумок, питання до лікаря та нутриціологічні lifestyle-рекомендації для професійного обговорення.",
      ],
    ],
    steps: [
      ["Завантаження", "PDF або фото результатів з українських лабораторій."],
      ["Нормалізація", "Назви й одиниці приводяться до зрозумілого вигляду."],
      ["Пояснення", "Отримуєте короткий підсумок без медичного туману."],
    ],
  },
  laboratorii: {
    eyebrow: "Лабораторії",
    title: "Clinical Engine для лабораторій і медичних сервісів",
    description:
      "VITALOOP Clinical Engine перетворює лабораторний результат на зрозумілий цифровий досвід для пацієнта. Підключайте інтелектуальну інтерпретацію, динаміку та наступні кроки через API або у white-label форматі.",
    icon: FlaskConical,
    cta: "Обговорити партнерство",
    blocks: [
      [
        "Clinical Engine",
        "Нормалізація показників, референсів і одиниць виміру з урахуванням структури конкретного бланка.",
      ],
      [
        "Patient experience",
        "Зрозумілі освітні пояснення, динаміка, питання до лікаря та контроль наступних перевірок.",
      ],
      [
        "API-інтеграція",
        "Вбудовуйте інтерпретацію у власний портал, застосунок або шлях пацієнта після видачі результатів.",
      ],
      [
        "White-label",
        "Запускайте брендований досвід лабораторії без необхідності створювати інтерпретаційний продукт з нуля.",
      ],
    ],
    steps: [
      [
        "Підключення даних",
        "PDF, структуровані результати або API-потік лабораторії.",
      ],
      [
        "Нормалізація та контекст",
        "Показники проходять через узгоджену модель даних і правила відображення.",
      ],
      [
        "Результат для пацієнта",
        "Лабораторія отримує цінніший післяаналітичний сервіс і довший контакт із клієнтом.",
      ],
    ],
  },
  tarify: {
    eyebrow: "Тарифи",
    title: "Free для старту, Premium для регулярної роботи",
    description:
      "Почніть безкоштовно, а коли потрібні більше аналізів, динаміка й повніші підсумки, перейдіть на Premium.",
    icon: Sparkles,
    cta: "Почати безкоштовно",
    blocks: [],
    steps: [
      ["Free", "Перший розбір стану, базові симптоми й стартовий підсумок."],
      [
        "Premium",
        "Більше завантажень, динаміка, повніші пояснення і пріоритети.",
      ],
      [
        "249 грн/міс або 2 499 грн/рік",
        "Гнучкий вибір для регулярної роботи зі станом.",
      ],
    ],
  },
  "health-hub": {
    eyebrow: "База знань",
    title: "Знання про здоров’я — без тривожних висновків",
    description:
      "Матеріали VITALOOP допомагають підготуватися до розмови з лікарем: зрозуміти назви показників, зібрати симптоми та не загубити контекст.",
    icon: BookOpen,
    cta: "Почати з бланка",
    blocks: [
      [
        "Втома й енергія",
        "Як описати втому, які зміни помітити та що взяти із собою на консультацію.",
      ],
      [
        "Сон і відновлення",
        "Як фіксувати сон, пробудження й навантаження без самодіагностики.",
      ],
      [
        "Результати аналізів",
        "Як читати бланк лабораторії разом із референсами та власним станом.",
      ],
      [
        "Питання лікарю",
        "Як сформулювати короткі, конкретні питання, що допоможуть на прийомі.",
      ],
    ],
    steps: [
      [
        "Оберіть тему",
        "Почніть із симптомів або результату, який хочете краще зрозуміти.",
      ],
      [
        "Додайте свій контекст",
        "Дата бланка, самопочуття й зміни у звичному ритмі мають значення.",
      ],
      [
        "Обговоріть із лікарем",
        "Матеріали не замінюють консультацію та не є медичним призначенням.",
      ],
    ],
  },
  faq: {
    eyebrow: "Питання та відповіді",
    title: "Відповіді, з яких зручно почати",
    description:
      "Зібрали головне про VITALOOP: які дані можна додати, як працює сервіс і де закінчується освітня підтримка та починається консультація лікаря.",
    icon: HelpCircle,
    cta: "Створити профіль",
    blocks: [
      [
        "Чи ставить VITALOOP діагноз?",
        "Ні. Сервіс структурує дані та допомагає підготувати питання для лікаря.",
      ],
      [
        "Чи можна почати без бланка?",
        "Так. Почніть з короткої оцінки самопочуття та додайте результати пізніше.",
      ],
      [
        "Які файли підходять?",
        "PDF, фото або скан бланка, який можна прочитати. Формат лабораторії не означає партнерство.",
      ],
      [
        "Як захищені дані?",
        "Доступ до профілю маєте ви. Деталі обробки зібрані на сторінці приватності.",
      ],
    ],
    steps: [
      [
        "Оберіть запитання",
        "Почніть із того, що заважає вам зробити перший крок.",
      ],
      [
        "Перевірте деталі",
        "Точні умови підписки, обробки даних і повернення коштів винесені в документи.",
      ],
      ["Зверніться до нас", "Якщо відповіді немає, напишіть команді VITALOOP."],
    ],
  },
  terms: {
    eyebrow: "Документи",
    title: "Умови користування VITALOOP",
    description:
      "Тут зібрані базові правила користування сервісом, обмеження освітнього формату та порядок взаємодії з підтримкою.",
    icon: Scale,
    cta: "Створити профіль",
    blocks: [
      [
        "Освітній формат",
        "VITALOOP не встановлює діагнозів, не призначає лікування та не замінює очну консультацію лікаря.",
      ],
      [
        "Ваш акаунт",
        "Ви відповідаєте за актуальність даних, які додаєте до профілю та бланків.",
      ],
      [
        "Використання сервісу",
        "Не передавайте доступ іншим особам і не використовуйте сервіс для екстрених медичних ситуацій.",
      ],
      [
        "Підтримка",
        "З питань доступу, платежів або роботи продукту звертайтеся до команди через контакти на сайті.",
      ],
    ],
    steps: [
      [
        "Ознайомтеся",
        "Прочитайте правила перед створенням профілю або оплатою підписки.",
      ],
      [
        "Користуйтеся обережно",
        "Зберігайте медичні рішення для обговорення з кваліфікованим лікарем.",
      ],
      [
        "Напишіть нам",
        "Якщо формулювання потребує уточнення, команда підтримки допоможе зорієнтуватися.",
      ],
    ],
  },
  "refund-policy": {
    eyebrow: "Документи",
    title: "Повернення коштів",
    description:
      "Пояснюємо, як звернутися щодо платежу, які дані додати до звернення та як команда підтримки опрацьовує запити.",
    icon: CreditCard,
    cta: "Звернутися до підтримки",
    blocks: [
      [
        "Звернення",
        "Напишіть на info@softdab.tech і вкажіть email профілю, дату та суму платежу.",
      ],
      [
        "Перевірка",
        "Команда звіряє дані транзакції та повертається з відповіддю у робочий час.",
      ],
      [
        "Рішення",
        "Умови повернення застосовуються відповідно до способу оплати й чинного законодавства.",
      ],
      [
        "Підписка",
        "За потреби вимкніть продовження підписки у своєму профілі або зверніться в підтримку.",
      ],
    ],
    steps: [
      ["Зберіть дані", "Підготуйте email профілю та інформацію про платіж."],
      [
        "Надішліть лист",
        "Опишіть запит коротко — це допоможе знайти платіж швидше.",
      ],
      [
        "Отримайте відповідь",
        "Підтримка пояснить наступні кроки після перевірки.",
      ],
    ],
  },
  "privacy-policy": {
    eyebrow: "Документи",
    title: "Приватність і ваші дані",
    description:
      "Медичні дані потребують особливої обережності. На цій сторінці пояснюємо, які дані потрібні для роботи сервісу та як контролювати свій профіль.",
    icon: LockKeyhole,
    cta: "Перейти до профілю",
    blocks: [
      [
        "Що ви додаєте",
        "Симптоми, результати бланків та інші дані, які ви свідомо вносите до свого профілю.",
      ],
      [
        "Для чого це потрібно",
        "Щоб показати дані в одному місці, сформувати підсумок та підготувати контекст для лікаря.",
      ],
      [
        "Кому доступні дані",
        "Ваш профіль захищений обліковим записом; не передавайте пароль іншим людям.",
      ],
      [
        "Ваш контроль",
        "Ви можете звернутися до підтримки щодо доступу до даних або питань їхньої обробки.",
      ],
    ],
    steps: [
      [
        "Додавайте усвідомлено",
        "Завантажуйте лише ті матеріали, які потрібні для вашого запиту.",
      ],
      [
        "Захищайте доступ",
        "Використовуйте надійний пароль і не входьте у профіль на чужих пристроях.",
      ],
      [
        "Ставте питання",
        "Якщо щось у роботі з даними незрозуміло, напишіть у підтримку.",
      ],
    ],
  },
  contact: {
    eyebrow: "Контакти",
    title: "Будьмо на зв’язку",
    description:
      "Напишіть нам щодо доступу, оплати, роботи профілю або пропозицій. Ми допоможемо знайти наступний крок у межах можливостей сервісу.",
    icon: Mail,
    cta: "Написати на email",
    blocks: [
      [
        "Email",
        "info@softdab.tech — для звернень щодо VITALOOP та підтримки користувачів.",
      ],
      [
        "Телефон",
        "+380 66 379 08 19 — для організаційних питань у робочий час.",
      ],
      ["Адреса", "вул. Новоселицька, 7, м. Київ, Україна."],
      [
        "Медичні питання",
        "За медичними рішеннями звертайтеся до свого лікаря або екстрених служб.",
      ],
    ],
    steps: [
      [
        "Опишіть запит",
        "Коротко вкажіть, що сталося та з якого email створено профіль.",
      ],
      [
        "Не надсилайте зайвого",
        "Не надсилайте паролі чи повні платіжні реквізити у звичайному листі.",
      ],
      [
        "Отримайте відповідь",
        "Команда повернеться із наступним кроком після перевірки звернення.",
      ],
    ],
  },
};

const DEFAULT_SLUG = "samopochuttia";

const EXPANDED_CONTENT = {
  samopochuttia: [
    [
      "Від відчуття до структури",
      "Самопочуття часто описують уривками: «немає сил», «погано сплю», «важко зосередитися». VITALOOP допомагає зібрати ці сигнали в послідовний запис: коли вони зʼявилися, як змінювалися і що вже вплинуло на стан. Це не медична оцінка, а якісна підготовка даних для людини та її лікаря.",
    ],
    [
      "Що зберігається у профілі",
      "Ви можете повернутися до власних відповідей, додати бланк лабораторії та порівняти наступні зміни з початковим станом. Контекст не губиться між нотатками, чатами й фото в телефоні.",
    ],
    [
      "Межі сервісу",
      "VITALOOP не встановлює діагнозів і не призначає лікування. Якщо є гострі симптоми, виражене погіршення стану або тривожні результати, звертайтеся до лікаря без зволікань.",
    ],
  ],
  symptomy: [
    [
      "Потенційні патерни, а не «діагноз за симптомами»",
      "Модуль симптоматики допомагає не пропустити звʼязки між скаргами, часом їх появи та контекстом. Він може підсвітити теми для подальшого обговорення з лікарем, але не визначає захворювання і не замінює клінічну оцінку.",
    ],
    [
      "Підготовлена консультація",
      "Коли лікар бачить не лише один симптом, а й динаміку, супутні фактори та попередні бланки, розмова стає предметнішою. VITALOOP формує нейтральні питання, а не самостійні висновки.",
    ],
    [
      "Безпечна логіка",
      "Ми не пропонуємо самостійно починати ліки, добавки або дієти. Нутриціологічні та lifestyle-поради подаються як теми для професійного обговорення з урахуванням індивідуальних ризиків.",
    ],
  ],
  analizy: [
    [
      "Що відбувається після завантаження",
      "Сервіс читає доступні дані бланка, упорядковує назви, значення, одиниці та референсні межі. Далі показники можна розглядати разом із симптомами, датою дослідження та попередніми результатами.",
    ],
    [
      "Регулярний контроль",
      "Один бланк — це точка в часі. Кілька бланків допомагають бачити зміну показника й не втрачати контекст між повторними перевірками. Строки контролю не є призначенням: їх потрібно узгоджувати з лікарем.",
    ],
    [
      "Практична цінність",
      "Замість пошуку суперечливих норм у браузері ви отримуєте структурований матеріал для консультації: що помітити, що уточнити та які дані можуть бути корисними наступного разу.",
    ],
  ],
  laboratorii: [
    [
      "Для чого лабораторії Clinical Engine",
      "Пацієнт часто отримує PDF без пояснення, а лабораторія втрачає контакт одразу після видачі результату. Clinical Engine додає освітній післяаналітичний шар: зрозумілу навігацію по бланку, контекст, динаміку та підготовку до консультації.",
    ],
    [
      "API та white-label",
      "Команда лабораторії може підключити нормалізацію результатів та освітні сценарії через API або запустити white-label кабінет у власному бренді. Інтеграційна модель обговорюється окремо: формат даних, ролі доступу, бренд, SLA та безпека.",
    ],
    [
      "Професійні межі",
      "Clinical Engine не діагностує і не замінює лікаря. Ми проєктуємо досвід так, щоб пацієнт краще розумів результат, а клінічні рішення залишалися за медичним фахівцем.",
    ],
  ],
};

function PageIcon({ icon: Icon }) {
  return (
    <span className="flex h-14 w-14 items-center justify-center rounded-[22px] bg-white text-[#0b9479] shadow-[0_18px_34px_rgba(15,118,110,0.12)] ring-1 ring-[#dce5e5]">
      <Icon className="h-7 w-7" />
    </span>
  );
}

const SECONDARY_BUTTON =
  "inline-flex min-h-11 items-center justify-center rounded-full border border-[#dce5e5] bg-white px-5 py-3 text-center text-sm font-black leading-tight text-[#10233f] shadow-sm transition hover:-translate-y-0.5 hover:border-[#0b9479]/45 hover:text-[#0b9479]";

function PricingPanel({ startSignup }) {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {PRICING.map((plan) => (
        <article
          key={plan.name}
          className={`relative flex h-full flex-col rounded-[28px] border p-5 shadow-sm sm:p-6 ${plan.featured ? "border-[#0b9479] bg-[#10233f] text-white shadow-[0_28px_80px_rgba(15,23,42,0.24)]" : plan.comingSoon ? "border-[#dce5e5] bg-[#fffcf7] text-[#10233f]" : "border-[#dce5e5] bg-white text-[#10233f]"}`}
        >
          {plan.featured && (
            <span className="absolute right-5 top-5 rounded-full bg-[#f4c542] px-3 py-1 text-xs font-black text-[#111111]">
              Найкращий вибір
            </span>
          )}
          <p
            className={`text-sm font-black uppercase tracking-[0.14em] ${plan.featured ? "text-[#8fe0cc]" : "text-[#0b9479]"}`}
          >
            {plan.name}
          </p>
          <h2 className="mt-3 text-4xl font-black">{plan.price}</h2>
          <p
            className={`mt-2 text-sm ${plan.featured ? "text-[#c2ced9]" : "text-[#687789]"}`}
          >
            {plan.note}
          </p>
          <p
            className={`mt-5 text-sm leading-7 ${plan.featured ? "text-[#dce7ed]" : "text-[#526273]"}`}
          >
            {plan.description}
          </p>
          <div className="mt-6 mb-8 grid gap-3">
            {plan.features.map((feature) => (
              <div key={feature} className="flex items-start gap-3">
                <span
                  className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${plan.featured ? "bg-white text-[#10233f]" : "bg-[#e7f6f0] text-[#0b9479]"}`}
                >
                  <Check className="h-3.5 w-3.5" />
                </span>
                <span
                  className={`text-sm leading-6 ${plan.featured ? "text-white" : "text-[#526273]"}`}
                >
                  {feature}
                </span>
              </div>
            ))}
          </div>
          <button
            onClick={plan.comingSoon ? undefined : startSignup}
            disabled={plan.comingSoon}
            className={`${plan.comingSoon ? "inline-flex min-h-11 w-full cursor-not-allowed items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-black text-[#687789] ring-1 ring-[#dce5e5]" : CTA_CLASS} mt-auto w-full`}
          >
            {plan.cta}
          </button>
        </article>
      ))}
    </div>
  );
}

export default function UaPage({ pageSlug }) {
  const params = useParams();
  const navigate = useNavigate();
  const slug = pageSlug || params.pageSlug || DEFAULT_SLUG;
  const page = PAGE_CONTENT[slug] || PAGE_CONTENT[DEFAULT_SLUG];
  const startSignup = () => navigate("/login?signup=true");
  const startAction = () => {
    if (slug === "contact" || slug === "refund-policy") {
      window.location.assign("mailto:info@softdab.tech");
      return;
    }
    if (slug === "laboratorii") {
      navigate("/contact");
      return;
    }
    startSignup();
  };
  const Icon = page.icon;

  const schema = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: `${page.title} | Vitaloop Ukraine`,
      url: `https://ua.vitaloop.today/${slug}`,
      inLanguage: "uk-UA",
      description: page.description,
    }),
    [page.description, page.title, slug],
  );

  return (
    <div className="min-h-screen bg-[#fffcf7] text-[#10233f]">
      <Seo
        title={`${page.title} | Vitaloop Ukraine`}
        description={page.description}
        canonicalUrl={`https://ua.vitaloop.today/${slug}`}
        locale="uk_UA"
        image="https://ua.vitaloop.today/images/ua-health-hero-dashboard-ua-20260603.png"
        schemas={[schema]}
      />
      <UaHeader />

      <main>
        <section className="relative overflow-hidden border-b border-[#dce5e5] bg-[#fffcf7]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(20,184,166,0.12),transparent_34%),radial-gradient(circle_at_86%_18%,rgba(212,180,131,0.20),transparent_30%)]" />
          <div className="relative mx-auto grid w-full max-w-[1200px] gap-8 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:py-20">
            <div>
              <PageIcon icon={Icon} />
              <p className="mt-6 text-xs font-black uppercase tracking-[0.14em] text-[#0b9479] sm:text-sm">
                {page.eyebrow}
              </p>
              <h1 className="mt-3 max-w-3xl text-[34px] font-black leading-[1.08] tracking-tight sm:text-[48px] lg:text-[58px]">
                {page.title}
              </h1>
              <p className="mt-4 max-w-2xl text-[15px] leading-7 text-[#526273] sm:text-lg sm:leading-8">
                {page.description}
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <button onClick={startAction} className={CTA_CLASS}>
                  {page.cta}
                  <ArrowRight className="h-4 w-4" />
                </button>
                <button
                  onClick={() => navigate(getUaPath("/"))}
                  className={SECONDARY_BUTTON}
                >
                  На головну
                </button>
              </div>
            </div>

            <div className="rounded-[30px] bg-white/82 p-5 shadow-[0_24px_70px_rgba(15,23,42,0.08)] ring-1 ring-[#dce5e5] backdrop-blur sm:p-6">
              <div className="grid gap-3">
                {page.steps.map(([title, body], index) => (
                  <div
                    key={title}
                    className="flex gap-4 rounded-[22px] bg-[#fffcf7] p-4"
                  >
                    <span className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-sm font-black text-[#0b9479] ring-1 ring-[#dce5e5]">
                      0{index + 1}
                    </span>
                    <div>
                      <h2 className="text-base font-black text-[#10233f]">
                        {title}
                      </h2>
                      <p className="mt-1 text-sm leading-6 text-[#526273]">
                        {body}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {slug === "tarify" ? (
          <section className="mx-auto w-full max-w-[1200px] px-4 py-12 sm:px-6 sm:py-16 md:py-20">
            <PricingPanel startSignup={startSignup} />
          </section>
        ) : (
          <section className="mx-auto w-full max-w-[1200px] px-4 py-12 sm:px-6 sm:py-16 md:py-20">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {page.blocks.map(([title, body]) => (
                <article
                  key={title}
                  className="flex min-h-[190px] flex-col rounded-[24px] bg-white p-5 shadow-sm ring-1 ring-[#dce5e5] transition duration-200 hover:-translate-y-0.5 hover:ring-[#0b9479]/45 hover:shadow-[0_18px_44px_rgba(15,23,42,0.08)]"
                >
                  <h2 className="text-xl font-black text-[#10233f]">{title}</h2>
                  <p className="mt-3 text-sm leading-7 text-[#526273]">
                    {body}
                  </p>
                </article>
              ))}
            </div>
          </section>
        )}

        {EXPANDED_CONTENT[slug] && (
          <section className="border-t border-[#dce5e5] bg-white py-14 sm:py-20">
            <div className="mx-auto max-w-[980px] px-4 sm:px-6">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-[#0b9479]">
                Детальніше про VITALOOP
              </p>
              <div className="mt-7 divide-y divide-[#dce5e5] rounded-[28px] border border-[#dce5e5] bg-[#fffcf7] px-6 sm:px-9">
                {EXPANDED_CONTENT[slug].map(([title, text]) => (
                  <section key={title} className="py-7 first:pt-8 last:pb-8">
                    <h2 className="text-2xl font-black tracking-tight text-[#10233f]">
                      {title}
                    </h2>
                    <p className="mt-3 text-[15px] leading-7 text-[#526273]">
                      {text}
                    </p>
                  </section>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="border-y border-[#dce5e5] bg-white py-12 sm:py-16">
          <div className="mx-auto grid w-full max-w-[1200px] gap-6 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.14em] text-[#0b9479] sm:text-sm">
                Наступний крок
              </p>
              <h2 className="mt-3 text-[28px] font-black leading-[1.12] tracking-tight text-[#10233f] sm:text-[42px]">
                Зберіть стан у короткий план
              </h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                [ClipboardList, "Стан", "Що відчуваєте зараз"],
                [BarChart3, "Пріоритети", "Що перевірити першим"],
                [ShieldCheck, "Підсумок", "Що взяти до лікаря"],
              ].map(([StepIcon, title, body]) => (
                <div
                  key={title}
                  className="rounded-[22px] bg-[#fffcf7] p-4 text-center ring-1 ring-[#dce5e5]"
                >
                  <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-[#0b9479] ring-1 ring-[#dce5e5]">
                    <StepIcon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 text-base font-black text-[#10233f]">
                    {title}
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-[#526273]">
                    {body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto flex w-full max-w-[1200px] flex-col items-start justify-between gap-5 px-4 py-10 sm:px-6 md:flex-row md:items-center">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-[#10233f]">
              Можна почати з однієї відповіді
            </h2>
            <p className="mt-2 text-sm leading-6 text-[#526273]">
              Опишіть, що турбує зараз, і Vitaloop допоможе скласти перший
              зрозумілий маршрут.
            </p>
          </div>
          <button onClick={startAction} className={CTA_CLASS}>
            Отримати персональну оцінку
            <ArrowRight className="h-4 w-4" />
          </button>
        </section>

        <UaFooter />
      </main>
    </div>
  );
}
