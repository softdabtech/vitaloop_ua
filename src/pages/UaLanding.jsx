import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Check,
  ChevronDown,
  FileImage,
  FileUp,
  LockKeyhole,
  Menu,
  MessageSquareText,
  ScanLine,
  ShieldCheck,
  X,
} from "lucide-react";
import Seo from "../components/Seo.jsx";

export const CTA_CLASS =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#0b9479] px-5 py-3 text-sm font-bold text-white shadow-[0_12px_28px_rgba(11,148,121,.2)] transition hover:-translate-y-0.5 hover:bg-[#087b66]";
export const NAV_LINKS = [
  { label: "Як це працює", id: "how" },
  { label: "Самопочуття", path: "/samopochuttia" },
  { label: "Симптоми", path: "/symptomy" },
  { label: "Аналізи", path: "/analizy" },
  { label: "База знань", path: "/health-hub" },
  { label: "Тарифи", path: "/tarify" },
  { label: "FAQ", path: "/faq" },
];
export const PRICING = [
  {
    name: "Free",
    price: "0 грн",
    note: "для першого кроку",
    description: "Зберіть симптоми й почніть розуміти, на що звернути увагу.",
    features: [
      "Оцінка симптомів",
      "Базовий підсумок",
      "1 завантаження бланка",
      "Збережений результат у вашому профілі",
      "Підказки для підготовки до консультації",
    ],
    cta: "Почати безкоштовно",
  },
  {
    name: "Premium",
    price: "249 грн/міс",
    note: "або 2 499 грн/рік",
    description:
      "Для регулярної роботи зі здоровʼям: зберігайте кілька бланків, бачте зміни в динаміці та повертайтеся до зрозумілого плану між консультаціями.",
    features: [
      "Кілька завантажень і одна історія результатів",
      "Розширений звіт: показники, референси та контекст",
      "Динаміка маркерів і нагадування про наступну перевірку",
      "Питання до лікаря та структурований підсумок консультації",
      "Нутриціологічні й lifestyle-рекомендації для обговорення з фахівцем",
    ],
    cta: "Спробувати Premium",
    featured: true,
  },
];

const TABS = [
  {
    id: "fatigue",
    label: "Втома",
    image: "/images/cabinet/results.png",
    title: "Втома — не один показник",
    text: "Розглядайте симптоми, феритин, гемоглобін та інші результати разом, а не як ізольовані цифри.",
    note: "Позначаємо, на що звернути увагу, і допомагаємо сформулювати запитання для лікаря.",
  },
  {
    id: "after",
    label: "Після бланка",
    image: "/images/cabinet/report.png",
    title: "Бланк перетворюється на розмову",
    text: "Замість списку цифр — структурований підсумок: що виділяється та які питання зберегти до консультації.",
    note: "Без діагнозів та самостійних призначень — тільки підготовлена інформація для консультації.",
  },
  {
    id: "progress",
    label: "Динаміка",
    image: "/images/cabinet/dashboard.png",
    title: "Бачте зміни, а не окремий день",
    text: "Порівнюйте наступні результати зі збереженим контекстом самопочуття й попередніми файлами.",
    note: "Дата наступної перевірки зберігається поруч із результатом.",
  },
];
const TRUST = [
  [FileImage, "PDF · фото · скан", "Завантажте бланк так, як зручно вам."],
  [ScanLine, "Симптоми + аналізи", "Поєднані в один зрозумілий контекст."],
  [
    MessageSquareText,
    "Питання до лікаря",
    "Без самодіагностики та зайвих висновків.",
  ],
  [
    ShieldCheck,
    "Ваші дані — ваші",
    "Конфіденційно й з повагою до приватності.",
  ],
];
const LANDING_SYMPTOMS = [
  "Втома",
  "Поганий сон",
  "Низька енергія",
  "Випадіння волосся",
  "Тривожність",
  "Концентрація",
  "Травлення",
  "Часті застуди",
];
const STEPS = [
  [
    "01",
    "Почніть із себе",
    "Позначте, що турбує: сон, енергія, волосся, концентрація або відновлення.",
    "Це формує контекст, а не «оцінку здоров’я».",
  ],
  [
    "02",
    "Додайте бланк",
    "Завантажте PDF, фото або скан із Сінево, ДІЛА, Ескулаб чи іншої лабораторії.",
    "Не потрібно вручну переносити показники.",
  ],
  [
    "03",
    "Розберіть результат",
    "Побачте, що виділяється, що доречно обговорити та чого може бракувати для контексту.",
    "Зрозумілою мовою й без призначень.",
  ],
  [
    "04",
    "Поверніться до динаміки",
    "Додайте наступний бланк і порівняйте зміни разом із самопочуттям.",
    "Зберігайте історію важливого в одному місці.",
  ],
];
const SCENARIOS = [
  [
    "01",
    "Втома, волосся, цикл",
    "Коли енергії менше, а причин може бути багато.",
    "Зберіть симптоми та результати в один структурований запит до лікаря.",
    "/health-hub/volossia-ta-analizy",
  ],
  [
    "02",
    "Після Сінево або ДІЛА",
    "Коли PDF вже в телефоні, але відповідей у ньому немає.",
    "Завантажте файл і перетворіть його на зрозумілий підсумок та питання.",
    "/analizy",
  ],
  [
    "03",
    "Два бланки — одна динаміка",
    "Коли важлива не одна дата, а напрям змін.",
    "Порівнюйте результати обережно — без небезпечних ярликів і самодіагностики.",
    "/health-hub",
  ],
];
const FAQ_ITEMS = [
  [
    "Чи замінює Vitaloop лікаря?",
    "Ні, Vitaloop не замінює лікаря, не встановлює діагноз і не призначає лікування. Сервіс допомагає зібрати симптоми, результати аналізів і попередні вимірювання в одному місці. Так легше побачити, які дані варто взяти на консультацію. У звіті можна знайти нейтральні пояснення показників та питання для обговорення. Клінічну оцінку, рішення щодо обстежень і лікування приймає кваліфікований лікар. Якщо стан погіршується або є гострі симптоми, звертайтеся по медичну допомогу без зволікань.",
  ],
  [
    "Чи можна почати без аналізів?",
    "Так, почати можна без готового бланка аналізів. Опишіть те, що турбує: зміни енергії, сну, концентрації, настрою або відновлення. Це дозволяє зібрати вихідні дані без медичних термінів. Коли результати лабораторії будуть під рукою, їх можна додати до того самого профілю. Так симптоми й показники залишаться поруч, а не в різних чатах і папках. Vitaloop не підбирає лікування, але допомагає підготувати зрозумілі питання до консультації.",
  ],
  [
    "Які файли можна завантажити?",
    "Ви можете додати PDF, фото або скан лабораторного бланка. Для коректного прочитання на зображенні мають бути видимі назви показників, значення, одиниці вимірювання та референсні межі лабораторії. Підійдуть результати з популярних українських лабораторій, зокрема Сінево, ДІЛА, Ескулаб, SmartLab, CSD та інших. Чітке фото без обрізаних полів допомагає уникнути помилок у назвах і числах. Якщо певної інформації бракує, сервіс може показати, що саме варто уточнити. Дані з бланка залишаються у вашому профілі для подальшого порівняння.",
  ],
  [
    "Чи є перелічені лабораторії партнерами Vitaloop?",
    "Перелік лабораторій на сторінці означає приклади поширених форматів бланків, а не підтверджене партнерство. Ми не заявляємо про співпрацю, якщо її немає. Офіційні партнерства, якщо вони з’являться, будуть позначені окремо. Ви можете додати бланк іншої лабораторії, якщо на ньому видно назви показників, значення, одиниці та референси. Доступність розпізнавання окремих форматів може залежати від якості файлу. Перед завантаженням перевірте, що фото не розмите й не обрізане.",
  ],
  [
    "Як Vitaloop працює з моїми даними?",
    "Результати аналізів і відповіді про самопочуття зберігаються у вашому профілі, щоб їх можна було переглянути та порівняти пізніше. Доступ до профілю захищений обліковим записом. У налаштуваннях доступні дії для керування профілем і даними. Детальні умови обробки даних описані в Політиці приватності. Не завантажуйте чужі медичні документи без законної підстави та дозволу людини. Якщо потрібне видалення даних або виникли запитання, зверніться через контакти внизу сторінки.",
  ],
];
const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_ITEMS.map(([question, answer]) => ({
    "@type": "Question",
    name: question,
    acceptedAnswer: { "@type": "Answer", text: answer },
  })),
};

function scrollTo(id) {
  document
    .getElementById(id)
    ?.scrollIntoView({ behavior: "smooth", block: "start" });
}
export function getUaPath(path = "/") {
  if (typeof window === "undefined") return path;
  return window.location.hostname === "ua.vitaloop.today"
    ? path
    : `/ua${path === "/" ? "" : path}`;
}
export function UaBrandMark() {
  return (
    <span className="inline-flex items-center gap-3">
      <img
        src="/images/favicon_1.png"
        alt=""
        className="h-10 w-10 object-contain"
      />
      <b className="text-[21px] font-black uppercase leading-none tracking-[.02em]">
        <span className="text-[#10343a]">VITA</span>
        <span className="text-[#087f78]">LOOP</span>
      </b>
    </span>
  );
}
export function UaFlag() {
  return null;
}
function Eyebrow({ children }) {
  return (
    <p className="text-xs font-bold uppercase tracking-[.15em] text-[#0b9479]">
      {children}
    </p>
  );
}
function Heading({ children, className = "" }) {
  return (
    <h2
      className={`mt-3 text-[34px] font-bold leading-[1.07] tracking-[-.04em] text-[#10233f] sm:text-[48px] ${className}`}
    >
      {children}
    </h2>
  );
}
function BrowserFrame({ children, className = "" }) {
  return (
    <div
      className={`overflow-hidden rounded-[22px] border border-[#d6e0e1] bg-white shadow-[0_26px_70px_rgba(16,35,63,.14)] ${className}`}
    >
      <div className="flex h-9 items-center gap-1.5 border-b border-[#e7eeee] bg-[#f8fbfb] px-4">
        <i className="h-2 w-2 rounded-full bg-[#f4c542]" />
        <i className="h-2 w-2 rounded-full bg-[#9bd8c9]" />
        <i className="h-2 w-2 rounded-full bg-[#c9d4dc]" />
      </div>
      {children}
    </div>
  );
}

export function UaHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const updateHeader = () => setScrolled(window.scrollY > 12);
    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
    return () => window.removeEventListener("scroll", updateHeader);
  }, []);
  const go = (link) => {
    setOpen(false);
    if (link.id) {
      navigate(getUaPath("/"));
      setTimeout(() => scrollTo(link.id), 50);
    } else if (link.href) window.location.assign(link.href);
    else navigate(getUaPath(link.path));
  };
  return (
    <header
      className={`sticky top-0 z-50 border-b border-[#dce5e5]/80 transition-[background-color,box-shadow] duration-300 ${scrolled ? "bg-[#fffcf7]/70 shadow-[0_8px_24px_rgba(16,35,63,.06)] backdrop-blur-xl" : "bg-[#fffcf7]"}`}
    >
      <div className="mx-auto flex h-[70px] max-w-[1220px] items-center justify-between px-5 sm:px-8">
        <button
          onClick={() => navigate(getUaPath("/"))}
          aria-label="На головну"
        >
          <UaBrandMark />
        </button>
        <nav className="hidden items-center gap-4 xl:gap-5 lg:flex">
          {NAV_LINKS.map((link) => (
            <button
              key={link.label}
              onClick={() => go(link)}
              className="text-sm font-medium tracking-[-.01em] text-[#526273] transition hover:text-[#0b9479]"
            >
              {link.label}
            </button>
          ))}
        </nav>
        <div className="hidden items-center gap-2 lg:flex">
          <button
            onClick={() => navigate("/login")}
            className="inline-flex h-10 items-center rounded-full border border-[#dce5e5] bg-white px-4 text-sm font-semibold text-[#526273] transition hover:border-[#0b9479]/40 hover:text-[#0b9479]"
          >
            Вхід
          </button>
          <button
            className="inline-flex h-10 items-center rounded-full bg-[#0b9479] px-4 text-sm font-semibold text-white shadow-[0_8px_18px_rgba(11,148,121,.18)] transition hover:-translate-y-0.5 hover:bg-[#087b66]"
            onClick={() => navigate("/login?signup=true")}
          >
            Реєстрація
          </button>
        </div>
        <button
          className="grid h-10 w-10 place-items-center lg:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Відкрити меню"
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <div className="border-t border-[#dce5e5] bg-[#fffcf7] px-5 py-4 lg:hidden">
          {NAV_LINKS.map((link) => (
            <button
              key={link.label}
              onClick={() => go(link)}
              className="block w-full py-3 text-left text-sm font-medium text-[#526273]"
            >
              {link.label}
            </button>
          ))}
          <button
            className="mt-2 inline-flex min-h-12 w-full items-center justify-center rounded-full border border-[#dce5e5] bg-white px-5 text-sm font-semibold text-[#526273] transition hover:border-[#0b9479]/40 hover:text-[#0b9479]"
            onClick={() => navigate("/login")}
          >
            Вхід
          </button>
          <button
            className={`${CTA_CLASS} mt-2 w-full`}
            onClick={() => navigate("/login?signup=true")}
          >
            Реєстрація
          </button>
        </div>
      )}
    </header>
  );
}
export function UaFooter() {
  const navigate = useNavigate();
  const column = (title, items) => (
    <div>
      <p className="text-xs font-bold uppercase tracking-[.14em] text-[#8fe0cc]">
        {title}
      </p>
      <div className="mt-4 grid gap-2 text-sm text-[#c2ced9]">
        {items.map(([label, action]) => (
          <button
            key={label}
            onClick={action}
            className="w-fit text-left transition hover:text-[#8fe0cc]"
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
  return (
    <footer className="bg-[#10233f] pb-[76px] text-white lg:pb-0">
      <div className="mx-auto grid max-w-[1220px] gap-x-8 gap-y-10 px-5 py-14 sm:px-8 sm:grid-cols-2 lg:grid-cols-[1.35fr_repeat(3,.85fr)]">
        <div>
          <button
            onClick={() => navigate(getUaPath("/"))}
            className="inline-flex items-center gap-3"
          >
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-white/10 ring-1 ring-white/20">
              <img
                src="/images/favicon_1.png"
                alt=""
                className="h-8 w-8 object-contain"
              />
            </span>
            <b className="text-[21px] font-black tracking-[.02em] text-white">
              VITALOOP
            </b>
          </button>
          <p className="mt-5 max-w-sm text-sm leading-6 text-[#c2ced9]">
            VITALOOP поєднує симптоми, лабораторні результати та динаміку в
            підготовлений наступний крок.
          </p>
          <div className="mt-5 grid gap-1 text-sm leading-6 text-[#c2ced9]">
            <a
              href="mailto:info@softdab.tech"
              className="font-semibold text-[#8fe0cc]"
            >
              info@softdab.tech
            </a>
            <a href="tel:+380663790819">+380 66 379 08 19</a>
            <p>
              вул. Новоселицька, 7,
              <br />
              м. Київ, Україна
            </p>
          </div>
        </div>
        {column("Сторінки", [
          ["Як це працює", () => scrollTo("how")],
          ["Симптоми", () => navigate(getUaPath("/symptomy"))],
          ["Аналізи", () => navigate(getUaPath("/analizy"))],
          ["База знань", () => navigate(getUaPath("/health-hub"))],
          ["Тарифи", () => navigate(getUaPath("/tarify"))],
          ["FAQ", () => navigate(getUaPath("/faq"))],
        ])}
        {column("Матеріали", [
          ["Самопочуття", () => navigate(getUaPath("/samopochuttia"))],
          ["Симптоми", () => navigate(getUaPath("/symptomy"))],
          ["Аналізи", () => navigate(getUaPath("/analizy"))],
          ["Лабораторії", () => navigate(getUaPath("/laboratorii"))],
        ])}
        {column("Документи", [
          ["Умови користування", () => navigate(getUaPath("/terms"))],
          ["Повернення коштів", () => navigate(getUaPath("/refund-policy"))],
          ["Приватність", () => navigate(getUaPath("/privacy-policy"))],
          ["Контакти", () => navigate(getUaPath("/contact"))],
        ])}
      </div>
      <div className="mx-auto flex max-w-[1220px] flex-col gap-3 border-t border-white/10 px-5 py-6 text-xs text-[#91a0ae] sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p>© 2026 VITALOOP Ukraine. Усі права захищені.</p>
        <p>
          Зроблено з <span className="text-red-400">♥</span> SoftDAB ·
          softdab.tech
        </p>
      </div>
    </footer>
  );
}

export default function UaLanding() {
  const navigate = useNavigate();
  const [activeId, setActiveId] = useState("fatigue");
  const [billing, setBilling] = useState("month");
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const active = TABS.find((tab) => tab.id === activeId);
  const signup = () => navigate("/login?signup=true");
  const startSymptoms = () => {
    window.sessionStorage.setItem(
      "vitaloop-intake-symptoms",
      JSON.stringify(selectedSymptoms),
    );
    navigate("/login?signup=true&returnUrl=/questionnaire");
  };
  const symptomsCta = selectedSymptoms.length
    ? `Продовжити з ${selectedSymptoms.length} ${selectedSymptoms.length === 1 ? "симптомом" : "симптомами"}`
    : "Пройти оцінку";
  const toggleSymptom = (symptom) =>
    setSelectedSymptoms((current) =>
      current.includes(symptom)
        ? current.filter((item) => item !== symptom)
        : [...current, symptom],
    );
  return (
    <div className="min-h-screen bg-[#fffcf7] text-[#10233f]">
      <Seo
        title="VITALOOP — пояснення аналізів і симптомів українською"
        description="Завантажте PDF, фото або скан аналізів. VITALOOP допомагає зібрати симптоми, результати лабораторії та питання для розмови з лікарем."
        canonicalUrl="https://ua.vitaloop.today/"
        locale="uk_UA"
        image="https://ua.vitaloop.today/images/ua-og-preview-20260604.png"
        imageAlt="Vitaloop Ukraine"
        structuredData={FAQ_SCHEMA}
      />
      <UaHeader />
      <main>
        <section className="relative overflow-hidden bg-[#f8fbfa]">
          <img
            src="/images/ua-health-hero-ukraine-2026.png"
            alt=""
            className="absolute inset-0 h-full w-full object-cover object-center opacity-[.32] mix-blend-multiply"
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_88%_18%,#d8f0ea_0,transparent_28%),radial-gradient(ellipse_at_8%_100%,#f7e3a8_0,transparent_32%)]" />
          <div className="absolute bottom-0 left-0 right-0 h-2 bg-[#f4c542]/65" />
          <div className="relative mx-auto grid min-h-[690px] max-w-[1220px] gap-8 px-5 pb-12 pt-16 sm:px-8 lg:grid-cols-[.92fr_1.08fr] lg:items-center lg:py-20">
            <div className="max-w-[600px]">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#cde9df] bg-white/80 px-3 py-1.5 text-xs font-semibold text-[#087b66]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#f4c542]" />
                Для українських бланків аналізів
              </div>
              <h1 className="mt-6 text-[46px] font-bold leading-[.98] tracking-[-.055em] sm:text-[68px]">
                Зрозумійте аналізи.
                <br />
                <span className="text-[#0b9479]">Не залишайтеся</span>
                <br />з бланком наодинці.
              </h1>
              <p className="mt-6 max-w-lg text-[17px] leading-8 text-[#526273]">
                VITALOOP поєднує симптоми, результати лабораторії та динаміку —
                щоб ви прийшли до лікаря з підготовленими питаннями.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button onClick={signup} className={CTA_CLASS}>
                  Почати з бланка <ArrowRight className="h-4 w-4" />
                </button>
                <button
                  onClick={startSymptoms}
                  className="inline-flex min-h-12 items-center gap-2 px-3 text-sm font-bold text-[#0b9479]"
                >
                  Пройти оцінку самопочуття <ArrowRight className="h-4 w-4" />
                </button>
              </div>
              <p className="mt-5 max-w-md text-xs leading-5 text-[#687789]">
                Освітній інструмент, не діагноз. Медичні рішення — разом із
                лікарем.
              </p>
            </div>
            <div className="relative mx-auto w-full max-w-[610px] lg:justify-self-end">
              <div className="absolute -right-8 top-14 hidden h-32 w-32 rounded-full border border-[#9bd8c9] lg:block" />
              <div className="absolute -left-8 bottom-10 h-24 w-24 rounded-full bg-[#f4c542]/30" />
              <img
                src="/images/cabinet/dashboard.png"
                alt="Приклад кабінету Vitaloop: результати та динаміка"
                className="relative z-10 mx-auto w-full drop-shadow-[0_28px_30px_rgba(16,35,63,.18)]"
              />
              <div className="absolute bottom-8 left-0 z-20 rounded-2xl border border-white bg-white/95 p-4 shadow-xl sm:-left-5">
                <p className="text-xs font-bold text-[#526273]">
                  Наступний крок
                </p>
                <p className="mt-1 text-sm font-bold">
                  Феритин: повторити
                  <br />
                  через 6–12 тижнів
                </p>
                <p className="mt-2 max-w-[190px] text-[10px] leading-4 text-[#687789]">
                  Демонстраційний приклад. Терміни повторної перевірки
                  узгоджують із лікарем.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="border-y border-[#dce5e5] bg-white">
          <div className="mx-auto grid max-w-[1220px] gap-6 px-5 py-7 sm:px-8 sm:grid-cols-2 lg:grid-cols-4">
            {TRUST.map(([Icon, title, text]) => (
              <div key={title} className="flex items-center gap-4">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#e7f6f0] text-[#0b9479]">
                  <Icon className="h-6 w-6" />
                </span>
                <div>
                  <p className="text-sm text-[#10233f]">{title}</p>
                  <p className="mt-1 text-sm leading-5 text-[#687789]">
                    {text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
        <section
          id="wellbeing"
          className="scroll-mt-20 mx-auto max-w-[1220px] px-5 pb-28 pt-16 sm:px-8 sm:pb-20 lg:py-20"
        >
          <div className="grid gap-6 rounded-[28px] border border-[#cde9df] bg-[#e7f6f0] p-6 sm:p-8 lg:grid-cols-[.72fr_1.28fr] lg:gap-8 lg:items-start">
            <div>
              <Eyebrow>Коротка оцінка самопочуття</Eyebrow>
              <Heading className="max-w-md">
                Почніть із того, що турбує зараз
              </Heading>
              <p className="mt-4 max-w-md text-sm leading-7 text-[#526273]">
                Оберіть кілька симптомів. Після реєстрації вони збережуться в
                оцінці — не доведеться обирати їх повторно.
              </p>
              <p className="mt-3 text-xs leading-5 text-[#687789]">
                Оберіть симптоми в картці — продовжите кнопкою внизу екрана.
              </p>
            </div>
            <div className="rounded-[22px] bg-white p-4 shadow-sm sm:p-5">
              <div className="flex items-center justify-between gap-3 border-b border-[#e7eeee] pb-4">
                <p className="text-sm font-bold text-[#10233f]">
                  Що відчуваєте?
                </p>
                <p className="text-xs text-[#687789]">
                  Обрано: {selectedSymptoms.length}
                </p>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {LANDING_SYMPTOMS.map((symptom) => {
                  const active = selectedSymptoms.includes(symptom);
                  return (
                    <button
                      key={symptom}
                      onClick={() => toggleSymptom(symptom)}
                      className={`inline-flex min-h-11 items-center gap-2 rounded-full border px-4 text-sm font-medium transition ${active ? "border-[#0b9479] bg-[#e7f6f0] text-[#087b66]" : "border-[#dce5e5] bg-white text-[#526273] hover:border-[#0b9479]/40"}`}
                    >
                      {active && <Check className="h-3.5 w-3.5" />}
                      {symptom}
                    </button>
                  );
                })}
              </div>
              <div className="mt-5 rounded-xl bg-[#f8fbfa] p-4 text-sm leading-6 text-[#526273]">
                {selectedSymptoms.length
                  ? "Ваш вибір буде додано до стартової анкети після реєстрації."
                  : "Можна обрати кілька пунктів або перейти до анкети без вибору."}
              </div>
              <button
                onClick={startSymptoms}
                className={`${CTA_CLASS} mt-5 w-full`}
              >
                {symptomsCta} <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </section>
        <section className="mx-auto max-w-[1220px] px-5 py-20 sm:px-8 lg:py-28">
          <div className="grid gap-12 lg:grid-cols-[.78fr_1.22fr] lg:items-center">
            <div>
              <Eyebrow>Звичний український формат</Eyebrow>
              <Heading>Ваш PDF — вже точка старту</Heading>
              <p className="mt-5 text-base leading-7 text-[#526273]">
                Не потрібно вручну переносити десятки цифр. Додайте файл з
                лабораторії — VITALOOP допоможе розкласти результати на
                зрозумілі частини.
              </p>
              <div className="mt-7 flex flex-wrap gap-2">
                {["Сінево", "ДІЛА", "Ескулаб", "SmartLab", "CSD", "Інші"].map(
                  (lab) => (
                    <span
                      key={lab}
                      className="rounded-full border border-[#dce5e5] bg-white px-4 py-2 text-sm font-bold"
                    >
                      {lab}
                    </span>
                  ),
                )}
              </div>
              <p className="mt-4 text-xs leading-5 text-[#687789]">
                Це приклади поширених форматів бланків, а не перелік партнерів.
                Офіційні партнерства позначаємо окремо.
              </p>
              <button
                onClick={signup}
                className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-[#0b9479]"
              >
                Як підготувати бланк <ArrowRight className="h-4 w-4" />
              </button>
            </div>
            <BrowserFrame className="mx-auto w-full max-w-[690px]">
              <div className="grid min-h-[340px] grid-cols-[.8fr_1.2fr] bg-[#f5fbf9]">
                <div className="flex flex-col justify-between border-r border-[#dce5e5] p-5">
                  <div>
                    <p className="text-xs font-bold text-[#0b9479]">КРОК 01</p>
                    <h3 className="mt-3 text-xl font-bold">Додайте файл</h3>
                    <p className="mt-2 text-sm leading-6 text-[#687789]">
                      PDF, фото або скан бланка.
                    </p>
                  </div>
                  <div className="rounded-xl border-2 border-dashed border-[#9bd8c9] bg-white p-4">
                    <FileUp className="h-5 w-5 text-[#0b9479]" />
                    <p className="mt-3 text-xs font-bold">
                      analizy_10-2026.pdf
                    </p>
                    <p className="mt-1 text-[11px] text-[#687789]">
                      PDF · 1.4 MB
                    </p>
                  </div>
                </div>
                <div className="relative overflow-hidden bg-white">
                  <img
                    src="/images/cabinet/upload.png"
                    alt="Екран завантаження аналізу"
                    className="absolute left-[10%] top-[5%] w-[82%] rounded-lg shadow-lg"
                  />
                </div>
              </div>
            </BrowserFrame>
          </div>
        </section>
        <section
          id="report"
          className="overflow-hidden bg-[#10233f] py-20 text-white sm:py-28"
        >
          <div className="mx-auto max-w-[1220px] px-5 sm:px-8">
            <div className="grid gap-8 lg:grid-cols-[.82fr_1.18fr] lg:items-start">
              <div>
                <Eyebrow>Приклад у кабінеті</Eyebrow>
                <h2 className="mt-3 text-[38px] font-bold leading-[1.04] tracking-[-.04em] sm:text-[54px]">
                  Результати, які стають зрозумілими
                </h2>
                <p className="mt-5 max-w-xl text-base leading-7 text-[#c2ced9]">
                  Реальний інтерфейс продукту об’єднує результати, симптоми та
                  наступний check-in. Він не замінює лікаря — зате допомагає не
                  розгубитися перед консультацією й вийти з неї з чіткішим
                  планом.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 lg:justify-center lg:pt-20">
                {TABS.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveId(tab.id)}
                    className={`rounded-full px-4 py-2 text-sm font-bold transition ${activeId === tab.id ? "bg-[#f4c542] text-[#10233f]" : "border border-white/20 text-white hover:bg-white/10"}`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-0 grid gap-6 lg:grid-cols-[.82fr_1.18fr] lg:items-center lg:gap-10">
              <div className="lg:-mt-24">
                <p className="text-sm font-bold text-[#8fe0cc]">
                  {active.label}
                </p>
                <h3 className="mt-3 text-3xl font-bold leading-tight">
                  {active.title}
                </h3>
                <p className="mt-5 text-base leading-7 text-[#c2ced9]">
                  {active.text}
                </p>
                <div className="mt-7 border-l-2 border-[#f4c542] pl-4 text-sm leading-6 text-[#e8eef2]">
                  {active.note}
                </div>
                <button
                  onClick={signup}
                  className="mt-9 inline-flex items-center gap-2 text-sm font-bold text-[#8fe0cc]"
                >
                  Відкрити повний приклад <ArrowRight className="h-4 w-4" />
                </button>
              </div>
              <div className="relative order-first -mt-3 lg:order-none lg:-mt-40">
                <div className="absolute inset-8 rounded-[28px] bg-[#0b9479]/30 blur-3xl" />
                <img
                  src={active.image}
                  alt={`Приклад інтерфейсу Vitaloop: ${active.label}`}
                  className="relative mx-auto max-h-[580px] w-auto max-w-full drop-shadow-2xl"
                />
              </div>
            </div>
          </div>
        </section>
        <section
          id="how"
          className="mx-auto max-w-[1220px] px-5 py-20 sm:px-8 lg:py-28"
        >
          <div className="max-w-3xl">
            <Eyebrow>Як це працює</Eyebrow>
            <Heading>
              Від «я не знаю, з чого почати» до підготовленої розмови з лікарем
            </Heading>
            <p className="mt-5 max-w-2xl text-base leading-7 text-[#526273]">
              Без медичного жаргону та непотрібних форм. Кожен крок дає вам
              трохи більше порядку, контексту й впевненості.
            </p>
          </div>
          <div className="relative mt-10 grid gap-3 sm:mt-12 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4 xl:gap-0">
            <div className="absolute left-[12%] right-[12%] top-7 hidden h-px bg-[#b8ddd3] xl:block" />
            {STEPS.map(([num, title, text, note]) => (
              <article
                key={num}
                className="relative z-10 flex flex-col rounded-[22px] border border-[#dce5e5] bg-white p-5 shadow-sm sm:min-h-[270px] xl:min-h-[300px] xl:rounded-none xl:border-0 xl:bg-[#fffcf7] xl:px-6 xl:shadow-none"
              >
                <span className="grid h-14 w-14 place-items-center rounded-full border border-[#9bd8c9] bg-white text-sm font-bold text-[#0b9479] shadow-sm">
                  {num}
                </span>
                <h3 className="mt-5 text-xl font-bold">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#526273]">{text}</p>
                <p className="mt-5 border-t border-[#e7eeee] pt-4 text-xs leading-5 text-[#687789] sm:mt-auto">
                  {note}
                </p>
              </article>
            ))}
          </div>
        </section>
        <section className="bg-[#e7f6f0] py-20 sm:py-28">
          <div className="mx-auto max-w-[1220px] px-5 sm:px-8">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div className="max-w-[1080px]">
                <Eyebrow>Ваші життєві сценарії</Eyebrow>
                <Heading className="max-w-[980px]">
                  Не «середній пацієнт». Ваша ситуація.
                </Heading>
                <p className="mt-5 text-base leading-7 text-[#526273]">
                  Оберіть близьку ситуацію — так легше зрозуміти, які дані
                  зібрати перед консультацією й з чого почати розмову.
                </p>
              </div>
            </div>
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {SCENARIOS.map(([num, title, lead, text, path]) => (
                <article
                  key={num}
                  className="flex min-h-[330px] flex-col rounded-[24px] bg-[#fffcf7] p-6"
                >
                  <span className="text-sm font-bold text-[#0b9479]">
                    {num}
                  </span>
                  <h3 className="mt-7 text-2xl font-bold leading-tight">
                    {title}
                  </h3>
                  <p className="mt-4 text-sm font-medium leading-6 text-[#10233f]">
                    {lead}
                  </p>
                  <p className="mt-4 text-sm leading-6 text-[#526273]">
                    {text}
                  </p>
                  <button
                    onClick={() => navigate(getUaPath(path))}
                    className="mt-auto pt-7 text-left text-sm font-bold text-[#0b9479]"
                  >
                    Дізнатися більше <ArrowRight className="inline h-4 w-4" />
                  </button>
                </article>
              ))}
            </div>
          </div>
        </section>
        <section className="mx-auto max-w-[1280px] px-5 py-20 sm:px-8 lg:py-28">
          <div className="grid gap-12 lg:grid-cols-[.95fr_1.05fr] lg:items-center">
            <div className="relative">
              <img
                src="/images/cabinet/results.png"
                alt="Результати аналізів у кабінеті Vitaloop"
                className="mx-auto max-h-[550px] max-w-full"
              />
              <div className="absolute bottom-8 left-[5%] rounded-2xl bg-white p-4 shadow-xl">
                <LockKeyhole className="h-4 w-4 text-[#0b9479]" />
                <p className="mt-2 text-xs font-bold">Ваші дані — приватні</p>
              </div>
            </div>
            <div className="max-w-[610px]">
              <Eyebrow>Маленький крок сьогодні</Eyebrow>
              <Heading>Завантажте бланк аналізів або опишіть симптоми</Heading>
              <p className="mt-5 text-base leading-7 text-[#526273]">
                Оберіть зручний старт: додайте PDF, фото чи скан із лабораторії
                — або коротко опишіть, що вас турбує. VITALOOP допоможе зібрати
                це в контекст для наступного кроку.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button onClick={signup} className={CTA_CLASS}>
                  Створити профіль <ArrowRight className="h-4 w-4" />
                </button>
                <button
                  onClick={() => scrollTo("pricing")}
                  className="min-h-12 px-3 text-sm font-bold text-[#0b9479]"
                >
                  Переглянути тарифи
                </button>
              </div>
            </div>
          </div>
        </section>
        <section
          id="pricing"
          className="border-y border-[#dce5e5] bg-white py-20"
        >
          <div className="mx-auto max-w-[960px] px-5 sm:px-8">
            <div className="text-center">
              <Eyebrow>Тарифи</Eyebrow>
              <Heading>Почніть у своєму темпі</Heading>
              <div className="mx-auto mt-6 inline-flex rounded-full border border-[#dce5e5] bg-[#f8fbfa] p-1">
                <button
                  onClick={() => setBilling("month")}
                  className={`rounded-full px-4 py-2 text-sm font-bold transition ${billing === "month" ? "bg-white text-[#10233f] shadow-sm" : "text-[#687789]"}`}
                >
                  Щомісяця
                </button>
                <button
                  onClick={() => setBilling("year")}
                  className={`rounded-full px-4 py-2 text-sm font-bold transition ${billing === "year" ? "bg-white text-[#10233f] shadow-sm" : "text-[#687789]"}`}
                >
                  Щороку
                </button>
              </div>
            </div>
            <div className="mt-10 grid gap-4 md:grid-cols-2">
              {PRICING.map((plan) => (
                <article
                  key={plan.name}
                  className={`flex h-full flex-col rounded-[24px] border p-7 ${plan.featured ? "border-[#0b9479] bg-[#10233f] text-white" : "border-[#dce5e5] bg-[#fffcf7]"}`}
                >
                  <p
                    className={`text-sm font-bold ${plan.featured ? "text-[#8fe0cc]" : "text-[#0b9479]"}`}
                  >
                    {plan.name}
                  </p>
                  <p className="mt-4 text-4xl font-bold">
                    {plan.featured
                      ? billing === "year"
                        ? "2 499 грн/рік"
                        : "249 грн/міс"
                      : plan.price}
                  </p>
                  <p
                    className={`mt-1 text-sm ${plan.featured ? "text-[#c2ced9]" : "text-[#687789]"}`}
                  >
                    {plan.featured
                      ? billing === "year"
                        ? "вигідніше для регулярної динаміки"
                        : "або 2 499 грн/рік"
                      : plan.note}
                  </p>
                  <p
                    className={`mt-6 text-sm leading-6 ${plan.featured ? "text-[#dce7ed]" : "text-[#526273]"}`}
                  >
                    {plan.description}
                  </p>
                  <div className="mt-7 mb-8 grid gap-3">
                    {plan.features.map((feature) => (
                      <p key={feature} className="text-sm">
                        <Check
                          className={`mr-2 inline h-4 w-4 ${plan.featured ? "text-[#8fe0cc]" : "text-[#0b9479]"}`}
                        />
                        {feature}
                      </p>
                    ))}
                  </div>
                  <button
                    onClick={signup}
                    className={`${CTA_CLASS} mt-auto w-full`}
                  >
                    {plan.cta} <ArrowRight className="h-4 w-4" />
                  </button>
                </article>
              ))}
            </div>
            <p className="mt-5 text-center text-xs text-[#687789]">
              Vitaloop не є заміною медичної консультації.
            </p>
          </div>
        </section>
        <section className="mx-auto max-w-[860px] px-5 py-20 sm:px-8">
          <div className="text-center">
            <Eyebrow>Питання</Eyebrow>
            <Heading>Коротко про важливе</Heading>
          </div>
          <div className="mt-8 divide-y divide-[#dce5e5] rounded-2xl border border-[#dce5e5] bg-white">
            {FAQ_ITEMS.map(([question, answer]) => (
              <details key={question} className="group p-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-5 font-bold">
                  <span>{question}</span>
                  <ChevronDown className="h-5 w-5 shrink-0 text-[#687789] transition group-open:rotate-180" />
                </summary>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-[#526273]">
                  {answer}
                </p>
              </details>
            ))}
          </div>
        </section>
      </main>
      <UaFooter />
    </div>
  );
}
