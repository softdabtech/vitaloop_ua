import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Clock3,
  Stethoscope,
} from "lucide-react";
import Seo from "../components/Seo.jsx";
import { HEALTH_ARTICLES, HEALTH_TOPICS } from "../data/healthHubContent.js";
import { CTA_CLASS, UaFooter, UaHeader } from "./UaLanding.jsx";

const articleBySlug = Object.fromEntries(
  HEALTH_ARTICLES.map((article) => [article.slug, article]),
);

function HubShell({ children }) {
  return (
    <div className="min-h-screen bg-[#fffcf7] text-[#10233f]">
      <UaHeader />
      {children}
      <UaFooter />
    </div>
  );
}

function Breadcrumb({ items }) {
  return (
    <nav
      aria-label="Навігація"
      className="flex flex-wrap items-center gap-2 text-sm text-[#687789]"
    >
      <Link to="/health-hub" className="font-semibold text-[#0b9479]">
        База знань
      </Link>
      {items.map((item) => (
        <span key={item}>
          <span className="mx-2 text-[#b5c2c7]">/</span>
          {item}
        </span>
      ))}
    </nav>
  );
}

function ArticleCard({ article }) {
  return (
    <article className="flex h-full flex-col rounded-[24px] border border-[#dce5e5] bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-[#9bd8c9] hover:shadow-[0_18px_44px_rgba(16,35,63,.08)]">
      <p className="text-xs font-bold uppercase tracking-[.12em] text-[#0b9479]">
        {article.clusterLabel}
      </p>
      <h2 className="mt-3 text-xl font-bold leading-snug">{article.title}</h2>
      <p className="mt-3 text-sm leading-6 text-[#526273]">
        {article.description}
      </p>
      <div className="mt-5 flex items-center gap-2 text-xs text-[#687789]">
        <Clock3 className="h-4 w-4" />
        {article.readMin} хв читання
      </div>
      <Link
        to={`/health-hub/${article.slug}`}
        className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#0b9479]"
      >
        Читати статтю <ArrowRight className="h-4 w-4" />
      </Link>
    </article>
  );
}

function HubOverview() {
  return (
    <HubShell>
      <main>
        <section className="border-b border-[#dce5e5] bg-[#f8fbfa]">
          <div className="mx-auto max-w-[1220px] px-5 py-16 sm:px-8 lg:py-20">
            <p className="text-xs font-bold uppercase tracking-[.15em] text-[#0b9479]">
              База знань · Україна
            </p>
            <h1 className="mt-4 max-w-4xl text-[42px] font-bold leading-[1.03] tracking-[-.045em] sm:text-[62px]">
              Аналізи та симптоми: зрозуміло і без жаргону
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-8 text-[#526273]">
              Матеріали VITALOOP допомагають підготуватися до розмови з лікарем:
              розібратися в показниках, описати симптоми та не загубити важливий
              контекст. Це освітні матеріали, а не діагноз чи призначення.
            </p>
          </div>
        </section>
        <section className="mx-auto max-w-[1220px] px-5 py-16 sm:px-8 lg:py-20">
          <div className="flex items-end justify-between gap-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-[.15em] text-[#0b9479]">
                Теми
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-[-.03em] sm:text-4xl">
                Оберіть близький запит
              </h2>
            </div>
            <BookOpen className="h-9 w-9 text-[#0b9479]" />
          </div>
          <div className="mt-9 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {HEALTH_TOPICS.map((topic) => (
              <Link
                key={topic.slug}
                to={`/health-hub/topics/${topic.slug}`}
                className="rounded-[24px] border border-[#dce5e5] bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-[#9bd8c9]"
              >
                <span className="text-3xl" aria-hidden>
                  {topic.icon}
                </span>
                <h3 className="mt-5 text-xl font-bold">{topic.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#526273]">
                  {topic.description}
                </p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#0b9479]">
                  Переглянути матеріали <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            ))}
          </div>
        </section>
        <section className="border-y border-[#dce5e5] bg-white py-16 lg:py-20">
          <div className="mx-auto max-w-[1220px] px-5 sm:px-8">
            <p className="text-xs font-bold uppercase tracking-[.15em] text-[#0b9479]">
              Усі матеріали
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-[-.03em] sm:text-4xl">
              Читайте у своєму темпі
            </h2>
            <div className="mt-9 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {HEALTH_ARTICLES.map((article) => (
                <ArticleCard key={article.slug} article={article} />
              ))}
            </div>
          </div>
        </section>
        <section className="mx-auto max-w-[1220px] px-5 py-16 sm:px-8">
          <div className="rounded-[28px] bg-[#10233f] p-7 text-white sm:flex sm:items-center sm:justify-between sm:gap-8 sm:p-10">
            <div>
              <p className="text-sm font-bold text-[#8fe0cc]">
                Є бланк або симптоми?
              </p>
              <h2 className="mt-3 text-2xl font-bold sm:text-3xl">
                Перенесіть знання у власний контекст
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-[#c2ced9]">
                VITALOOP допомагає зібрати результати та питання до наступної
                розмови з лікарем.
              </p>
            </div>
            <Link
              to="/login?signup=true"
              className={`${CTA_CLASS} mt-6 shrink-0 sm:mt-0`}
            >
              Почати з бланка <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>
    </HubShell>
  );
}

function TopicPage({ topic }) {
  const articles = topic.articleSlugs
    .map((slug) => articleBySlug[slug])
    .filter(Boolean);
  return (
    <HubShell>
      <main>
        <section className="border-b border-[#dce5e5] bg-[#f8fbfa]">
          <div className="mx-auto max-w-[1220px] px-5 py-14 sm:px-8 lg:py-20">
            <Breadcrumb items={[topic.title]} />
            <div className="mt-9 flex gap-5">
              <span className="text-5xl">{topic.icon}</span>
              <div>
                <p className="text-xs font-bold uppercase tracking-[.15em] text-[#0b9479]">
                  Тема
                </p>
                <h1 className="mt-3 text-[38px] font-bold leading-[1.05] tracking-[-.04em] sm:text-[56px]">
                  {topic.title}
                </h1>
                <p className="mt-5 max-w-3xl text-base leading-8 text-[#526273]">
                  {topic.description}
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="mx-auto max-w-[1220px] px-5 py-16 sm:px-8 lg:py-20">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        </section>
      </main>
    </HubShell>
  );
}

function ArticlePage({ article }) {
  const related = article.relatedSlugs
    .map((slug) => articleBySlug[slug])
    .filter(Boolean);
  return (
    <HubShell>
      <main>
        <article>
          <section className="border-b border-[#dce5e5] bg-[#f8fbfa]">
            <div className="mx-auto max-w-[980px] px-5 py-14 sm:px-8 lg:py-20">
              <Breadcrumb items={[article.clusterLabel, article.title]} />
              <p className="mt-9 text-xs font-bold uppercase tracking-[.15em] text-[#0b9479]">
                {article.clusterLabel}
              </p>
              <h1 className="mt-4 text-[38px] font-bold leading-[1.05] tracking-[-.04em] sm:text-[56px]">
                {article.title}
              </h1>
              <p className="mt-6 max-w-3xl text-base leading-8 text-[#526273]">
                {article.description}
              </p>
              <p className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#687789]">
                <Clock3 className="h-4 w-4" />
                {article.readMin} хв читання · Оновлено 25 вересня 2026 року
              </p>
            </div>
          </section>
          <section className="mx-auto grid max-w-[980px] gap-10 px-5 py-14 sm:px-8 lg:grid-cols-[minmax(0,1fr)_230px] lg:py-20">
            <div className="grid gap-8">
              {article.content.map((section) => (
                <section key={section.heading}>
                  <h2 className="text-2xl font-bold leading-snug tracking-[-.02em]">
                    {section.heading}
                  </h2>
                  {section.callout && (
                    <aside className="mt-5 border-l-2 border-[#f4c542] bg-[#fff8df] px-5 py-4 text-sm font-medium leading-7 text-[#526273]">
                      {section.callout}
                    </aside>
                  )}
                  <div className="mt-5 grid gap-4 text-[16px] leading-8 text-[#526273]">
                    {section.paragraphs.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                </section>
              ))}
              <aside className="rounded-[24px] border border-[#f4c542]/50 bg-[#fff8df] p-6">
                <Stethoscope className="h-6 w-6 text-[#a87900]" />
                <h2 className="mt-3 text-lg font-bold">Важливо</h2>
                <p className="mt-2 text-sm leading-6 text-[#526273]">
                  Матеріал має освітній характер. Не використовуйте його для
                  самодіагностики або самостійного призначення лікування —
                  обговоріть результати й симптоми з лікарем.
                </p>
              </aside>
            </div>
            <aside className="h-fit rounded-[22px] border border-[#dce5e5] bg-white p-5 lg:sticky lg:top-24">
              <p className="text-xs font-bold uppercase tracking-[.13em] text-[#0b9479]">
                У статті
              </p>
              <ul className="mt-4 grid gap-3 text-sm leading-5 text-[#526273]">
                {article.keyPoints.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
              <div className="mt-6 border-t border-[#dce5e5] pt-5">
                <p className="text-xs font-bold uppercase tracking-[.13em] text-[#0b9479]">
                  Показники
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {article.biomarkers.map((biomarker) => (
                    <span
                      key={biomarker}
                      className="rounded-full bg-[#e7f6f0] px-3 py-1.5 text-xs font-semibold text-[#087b66]"
                    >
                      {biomarker}
                    </span>
                  ))}
                </div>
              </div>
            </aside>
          </section>
        </article>
        {related.length > 0 && (
          <section className="border-t border-[#dce5e5] bg-white py-16">
            <div className="mx-auto max-w-[1220px] px-5 sm:px-8">
              <p className="text-xs font-bold uppercase tracking-[.15em] text-[#0b9479]">
                Читайте також
              </p>
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                {related.map((item) => (
                  <ArticleCard key={item.slug} article={item} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </HubShell>
  );
}

export default function UaHealthHub() {
  const { topicSlug, articleSlug } = useParams();
  if (topicSlug) {
    const topic = HEALTH_TOPICS.find((item) => item.slug === topicSlug);
    return topic ? <TopicPage topic={topic} /> : <HubOverview />;
  }
  if (articleSlug) {
    const article = articleBySlug[articleSlug];
    return article ? <ArticlePage article={article} /> : <HubOverview />;
  }
  return (
    <>
      <Seo
        title="База знань про здоровʼя | VITALOOP Україна"
        description="Матеріали про симптоми, аналізи та підготовку до розмови з лікарем."
        canonicalUrl="https://ua.vitaloop.today/health-hub"
        locale="uk_UA"
      />
      <HubOverview />
    </>
  );
}
