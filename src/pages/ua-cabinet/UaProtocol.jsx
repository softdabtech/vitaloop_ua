import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, ClipboardCheck, MessageSquareText, Moon, RefreshCw, Salad, ShieldCheck } from 'lucide-react'
import { useLabResults } from '../../hooks/useQueries.js'

function safeList(value) {
  return Array.isArray(value) ? value.filter(Boolean) : []
}

function statusNeedsAttention(status) {
  return String(status || '').toUpperCase() !== 'OPTIMAL'
}

function translateTitle(text) {
  const value = String(text || '').toLowerCase()
  if (value.includes('ferritin') || value.includes('iron')) return 'Перевірити статус заліза'
  if (value.includes('lipid') || value.includes('triglycer')) return 'Переглянути ліпідний профіль'
  if (value.includes('vitamin d')) return 'Оцінити вітамін D'
  if (value.includes('b12')) return 'Перевірити B12'
  if (value.includes('doctor') || value.includes('clinician')) return 'Обговорити з лікарем'
  return text || 'Наступний крок'
}

function translateBody(item) {
  const combined = `${item?.title || ''} ${item?.body || ''} ${item?.description || ''}`.toLowerCase()
  if (combined.includes('ferritin') || combined.includes('iron')) {
    return 'Попросіть лікаря оцінити феритин разом із загальним аналізом крові, CRP, симптомами, харчуванням і можливими втратами крові.'
  }
  if (combined.includes('lipid') || combined.includes('triglycer')) {
    return 'Перегляньте ліпідні показники в контексті харчування, голодування перед аналізом, глюкози, щитоподібної залози та сімейної історії.'
  }
  if (combined.includes('vitamin')) {
    return 'Оцініть цей показник разом із самопочуттям, сезонністю, харчуванням і попередніми аналізами.'
  }
  return item?.body || item?.description || 'Використайте цей пункт як орієнтир для обговорення з фахівцем.'
}

export default function UaProtocol() {
  const { uploadId } = useParams()
  const navigate = useNavigate()
  const { data, isLoading, error } = useLabResults(uploadId)

  const biomarkers = useMemo(() => {
    if (Array.isArray(data?.biomarkers)) return data.biomarkers
    if (Array.isArray(data)) return data
    return []
  }, [data])

  const report = data?.knowledge_report || {}
  const actionPlan = safeList(data?.protocol).length ? safeList(data.protocol) : safeList(report.action_plan)
  const doctorDiscussion = safeList(report.doctor_discussion)
  const retestPlan = safeList(report.retest_plan)
  const attentionCount = biomarkers.filter((item) => statusNeedsAttention(item.status)).length

  return (
    <div className="space-y-6">
      <section className="rounded-[30px] bg-white/88 p-6 shadow-[0_18px_55px_rgba(15,23,42,0.07)] ring-1 ring-[#e8dfd2] sm:p-7">
        <button onClick={() => navigate(`/results/${uploadId}`)} className="inline-flex min-h-10 items-center gap-2 rounded-full bg-[#f8f5f0] px-4 py-2 text-sm font-black text-[#0f172a] ring-1 ring-[#e8dfd2] transition hover:-translate-y-0.5 hover:bg-white">
          <ArrowLeft className="h-4 w-4" />
          До результату
        </button>
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px] lg:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[#0f766e]">План дій</p>
            <h2 className="mt-3 max-w-3xl text-[30px] font-black leading-tight tracking-tight sm:text-[44px]">Що робити після аналізу</h2>
            <p className="mt-3 max-w-2xl text-base leading-8 text-[#64748b]">Короткий план допомагає підготуватися до розмови з лікарем: які теми підняти, що перевірити повторно і як відстежувати самопочуття.</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Metric value={actionPlan.length || 3} label="кроки" />
            <Metric value={attentionCount} label="пріоритети" />
          </div>
        </div>
      </section>

      {isLoading && <div className="rounded-2xl bg-white p-4 text-sm font-bold text-[#64748b] ring-1 ring-[#e8dfd2]">Готуємо план...</div>}
      {error && <div className="rounded-2xl bg-[#fff7ed] p-4 text-sm font-bold text-[#9a3412] ring-1 ring-[#fed7aa]">Не вдалося завантажити план.</div>}

      {!isLoading && (
        <>
          <section className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="rounded-[30px] bg-white/88 p-6 ring-1 ring-[#e8dfd2] sm:p-7">
              <div className="flex items-center gap-3">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#eefaf6] text-[#0f766e] ring-1 ring-[#cbe9e1]">
                  <ClipboardCheck className="h-6 w-6" />
                </span>
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-[#0f766e]">Персональний фокус</p>
                  <h3 className="text-2xl font-black tracking-tight">Основні кроки</h3>
                </div>
              </div>
              <div className="mt-6 space-y-3">
                {(actionPlan.length ? actionPlan : [
                  { title: 'Порівняти з симптомами', body: 'Поверніться до скарг, які турбують зараз, і позначте, що збігається з пріоритетними показниками.' },
                  { title: 'Підготувати питання до лікаря', body: 'Збережіть цей план і покажіть його разом з оригінальним PDF аналізу.' },
                  { title: 'Запланувати повторну перевірку', body: 'Домовтеся з фахівцем, коли варто повторити показники для оцінки динаміки.' },
                ]).map((item, index) => (
                  <div key={`${item.title}-${index}`} className="rounded-[24px] bg-[#f8f5f0] p-5 ring-1 ring-[#e8dfd2]">
                    <div className="flex gap-4">
                      <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white text-sm font-black text-[#0f766e] ring-1 ring-[#d9efe9]">{index + 1}</span>
                      <div>
                        <h4 className="font-black text-[#0f172a]">{translateTitle(item.title || item.action)}</h4>
                        <p className="mt-2 text-sm font-semibold leading-7 text-[#64748b]">{translateBody(item)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <GuidanceCard icon={MessageSquareText} title="Питання до лікаря" items={doctorDiscussion.length ? doctorDiscussion.slice(0, 4) : [
                'Які показники варто перевірити першими?',
                'Чи потрібні додаткові аналізи для підтвердження?',
                'Коли краще повторити перевірку?',
              ]} />
              <GuidanceCard icon={RefreshCw} title="Повторна перевірка" items={retestPlan.length ? retestPlan.slice(0, 3) : [
                'Оцініть динаміку після консультації з фахівцем.',
                'Повторюйте аналізи в строки, погоджені з лікарем.',
              ]} />
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-3">
            <LifestyleCard icon={Salad} title="Харчування" body="Перегляньте раціон у контексті знайдених пріоритетів. Не додавайте добавки без погодження з фахівцем." />
            <LifestyleCard icon={Moon} title="Сон і відновлення" body="Фіксуйте сон, енергію та навантаження, щоб бачити звʼязок між самопочуттям і показниками." />
            <LifestyleCard icon={ShieldCheck} title="Безпечний підхід" body="План не замінює діагностику. Він допомагає краще підготуватися до медичної консультації." />
          </section>
        </>
      )}

      <section className="rounded-[28px] bg-[#eefaf6] p-5 ring-1 ring-[#cbe9e1]">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-[#0f766e]" />
          <p className="text-sm font-semibold leading-7 text-[#0f172a]">Якщо є гострий біль, різке погіршення стану або тривожні симптоми, не чекайте рекомендацій сервісу і зверніться по медичну допомогу.</p>
        </div>
      </section>
    </div>
  )
}

function Metric({ value, label }) {
  return (
    <div className="rounded-[24px] bg-[#f8f5f0] p-5 ring-1 ring-[#e8dfd2]">
      <div className="text-4xl font-black tracking-tight text-[#0f172a]">{value}</div>
      <p className="mt-1 text-xs font-black uppercase tracking-[0.12em] text-[#64748b]">{label}</p>
    </div>
  )
}

function GuidanceCard({ icon: Icon, title, items }) {
  return (
    <section className="rounded-[30px] bg-white/88 p-5 ring-1 ring-[#e8dfd2]">
      <div className="flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#eefaf6] text-[#0f766e] ring-1 ring-[#cbe9e1]">
          <Icon className="h-5 w-5" />
        </span>
        <h3 className="text-lg font-black tracking-tight">{title}</h3>
      </div>
      <ul className="mt-5 space-y-3">
        {items.map((item, index) => (
          <li key={`${item}-${index}`} className="rounded-[20px] bg-[#f8f5f0] p-4 text-sm font-semibold leading-6 text-[#64748b] ring-1 ring-[#e8dfd2]">
            {typeof item === 'string' ? item : item.question || item.body || item.title || 'Питання для обговорення'}
          </li>
        ))}
      </ul>
    </section>
  )
}

function LifestyleCard({ icon: Icon, title, body }) {
  return (
    <section className="rounded-[30px] bg-white/88 p-5 ring-1 ring-[#e8dfd2]">
      <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#f8f5f0] text-[#0f766e] ring-1 ring-[#e8dfd2]">
        <Icon className="h-5 w-5" />
      </span>
      <h3 className="mt-5 text-lg font-black tracking-tight">{title}</h3>
      <p className="mt-2 text-sm font-semibold leading-7 text-[#64748b]">{body}</p>
    </section>
  )
}
