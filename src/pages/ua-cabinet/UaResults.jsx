import { useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, CheckCircle2, ClipboardList, FlaskConical, ShieldAlert, Sparkles } from 'lucide-react'
import { useLabResults } from '../../hooks/useQueries.js'

const MARKER_LABELS = {
  ferritin: 'Феритин',
  hemoglobin: 'Гемоглобін',
  haemoglobin: 'Гемоглобін',
  platelets: 'Тромбоцити',
  'red blood cells': 'Еритроцити',
  'white blood cells': 'Лейкоцити',
  triglycerides: 'Тригліцериди',
  'vitamin b12': 'Вітамін B12',
  'vitamin d': 'Вітамін D',
  glucose: 'Глюкоза',
  cholesterol: 'Холестерин',
}

function markerName(name) {
  const raw = String(name || '').trim()
  if (!raw) return 'Показник'
  return MARKER_LABELS[raw.toLowerCase()] || raw
}

function statusLabel(status) {
  const value = String(status || '').toUpperCase()
  if (value === 'OPTIMAL') return 'У межах'
  if (value === 'BORDERLINE') return 'На межі'
  if (value === 'DEFICIENT') return 'Нижче бажаного'
  if (value === 'ELEVATED') return 'Вище бажаного'
  if (value === 'LOW') return 'Низький'
  if (value === 'HIGH') return 'Високий'
  return 'Потребує перегляду'
}

function statusClass(status) {
  const value = String(status || '').toUpperCase()
  if (value === 'OPTIMAL') return 'bg-[#eefaf6] text-[#0f766e] ring-[#cbe9e1]'
  if (value === 'BORDERLINE') return 'bg-[#fff8e7] text-[#8a5d16] ring-[#ead2a2]'
  return 'bg-[#fff1f2] text-[#be123c] ring-[#fecdd3]'
}

function translateTitle(text) {
  const value = String(text || '').toLowerCase()
  if (value.includes('ferritin') || value.includes('iron')) return 'Перевірити статус заліза'
  if (value.includes('lipid') || value.includes('triglycer')) return 'Переглянути ліпідний профіль'
  if (value.includes('vitamin d')) return 'Оцінити вітамін D у контексті'
  if (value.includes('b12')) return 'Перевірити B12 та повʼязані показники'
  if (value.includes('clinician') || value.includes('doctor')) return 'Обговорити з лікарем'
  return text || 'Наступний крок'
}

function translateBody(item, fallback) {
  const combined = `${item?.title || ''} ${item?.body || ''} ${item?.description || ''}`.toLowerCase()
  if (combined.includes('ferritin') || combined.includes('iron')) {
    return 'Феритин і показники крові варто оцінювати разом із симптомами, харчуванням, CRP, можливими втратами крові та ліками. Це хороший пункт для розмови з лікарем.'
  }
  if (combined.includes('lipid') || combined.includes('triglycer')) {
    return 'Ліпідні показники залежать від харчування, голодування перед аналізом, глюкози, щитоподібної залози та сімейної історії. Їх краще переглядати в загальному серцево-судинному контексті.'
  }
  if (combined.includes('vitamin')) {
    return 'Вітамінні показники важливо дивитися разом із самопочуттям, сезонністю, харчуванням і попередніми результатами, а не як окрему цифру.'
  }
  return fallback || 'Перегляньте цей пункт разом із симптомами, історією здоровʼя та рекомендаціями лікаря.'
}

function safeList(value) {
  return Array.isArray(value) ? value.filter(Boolean) : []
}

export default function UaResults() {
  const { uploadId } = useParams()
  const navigate = useNavigate()
  const { data, isLoading, error } = useLabResults(uploadId)

  const biomarkers = useMemo(() => {
    if (Array.isArray(data?.biomarkers)) return data.biomarkers
    if (Array.isArray(data)) return data
    return []
  }, [data])

  const report = data?.knowledge_report || {}
  const attention = biomarkers.filter((item) => String(item.status || '').toUpperCase() !== 'OPTIMAL')
  const priorityItems = safeList(report.what_was_found).slice(0, 3)
  const patternItems = safeList(report.why_it_matters).slice(0, 3)
  const actionItems = safeList(report.action_plan).slice(0, 3)
  const doctorItems = safeList(report.doctor_discussion).slice(0, 4)

  const headline = biomarkers.length
    ? `Знайдено ${biomarkers.length} показників. ${attention.length} потребують перегляду.`
    : 'Результат аналізу'

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[30px] bg-white/88 p-6 shadow-[0_18px_55px_rgba(15,23,42,0.07)] ring-1 ring-[#e8dfd2] sm:p-7">
        <button onClick={() => navigate('/lab-results')} className="inline-flex min-h-10 items-center gap-2 rounded-full bg-[#f8f5f0] px-4 py-2 text-sm font-black text-[#0f172a] ring-1 ring-[#e8dfd2] transition hover:-translate-y-0.5 hover:bg-white">
          <ArrowLeft className="h-4 w-4" />
          До аналізів
        </button>
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px] lg:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[#0f766e]">Підсумок аналізу</p>
            <h2 className="mt-3 max-w-3xl text-[30px] font-black leading-tight tracking-tight sm:text-[44px]">{headline}</h2>
            <p className="mt-3 max-w-2xl text-base leading-8 text-[#64748b]">Vitaloop структурує показники, виділяє пріоритети та готує зрозумілий план для наступного кроку. Це освітній підсумок, а не діагноз.</p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button onClick={() => navigate(`/protocol/${uploadId}`)} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[linear-gradient(135deg,#0f766e_0%,#14b8a6_58%,#d4b483_135%)] px-6 text-sm font-black text-white shadow-[0_16px_35px_rgba(15,118,110,0.22)] transition hover:-translate-y-0.5">
                Відкрити план дій
                <ArrowRight className="h-4 w-4" />
              </button>
              <button onClick={() => navigate('/upload')} className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-6 text-sm font-black text-[#0f172a] ring-1 ring-[#e8dfd2] transition hover:-translate-y-0.5 hover:bg-[#f8f5f0]">
                Завантажити ще аналіз
              </button>
            </div>
          </div>
          <div className="rounded-[28px] bg-[#f8f5f0] p-5 ring-1 ring-[#e8dfd2]">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-[#0f766e]">Пріоритет</p>
            <div className="mt-3 flex items-end gap-2">
              <span className="text-6xl font-black tracking-tight text-[#0f172a]">{attention.length}</span>
              <span className="pb-2 text-sm font-black text-[#64748b]">з {biomarkers.length || 0}</span>
            </div>
            <div className="mt-4 h-3 overflow-hidden rounded-full bg-white ring-1 ring-[#e8dfd2]">
              <div className="h-full rounded-full bg-[linear-gradient(90deg,#0f766e,#60a5fa,#d4b483)]" style={{ width: `${biomarkers.length ? Math.max(12, Math.round((attention.length / biomarkers.length) * 100)) : 0}%` }} />
            </div>
            <p className="mt-3 text-sm font-semibold leading-6 text-[#64748b]">Показує, на що варто звернути увагу першим під час обговорення з фахівцем.</p>
          </div>
        </div>
      </section>

      {isLoading && <div className="rounded-2xl bg-white p-4 text-sm font-bold text-[#64748b] ring-1 ring-[#e8dfd2]">Завантажуємо результат...</div>}
      {error && <div className="rounded-2xl bg-[#fff7ed] p-4 text-sm font-bold text-[#9a3412] ring-1 ring-[#fed7aa]">Не вдалося завантажити результат.</div>}

      {!isLoading && biomarkers.length > 0 && (
        <>
          <section className="grid gap-4 lg:grid-cols-3">
            <InfoPanel
              eyebrow="Що знайшли"
              title="Пріоритетні показники"
              icon={FlaskConical}
              items={priorityItems.length ? priorityItems.map((item) => ({
                title: markerName(item.marker || item.name || item.title),
                body: translateBody(item, `${statusLabel(item.status)}. Перевірте цей показник у контексті симптомів.`),
              })) : attention.slice(0, 3).map((item) => ({
                title: markerName(item.name || item.display_name),
                body: `${statusLabel(item.status)}. Значення: ${item.value ?? '-'} ${item.unit || ''}`.trim(),
              }))}
            />
            <InfoPanel
              eyebrow="Контекст"
              title="Що це може означати"
              icon={Sparkles}
              items={patternItems.length ? patternItems.map((item) => ({
                title: translateTitle(item.title || item.pattern),
                body: translateBody(item),
              })) : [{
                title: 'Показники не оцінюються окремо',
                body: 'Важливо поєднати аналізи з симптомами, сном, енергією, харчуванням і попередніми результатами.',
              }]}
            />
            <InfoPanel
              eyebrow="План"
              title="Наступні дії"
              icon={ClipboardList}
              items={actionItems.length ? actionItems.map((item) => ({
                title: translateTitle(item.title || item.action),
                body: translateBody(item),
              })) : [{
                title: 'Підготувати питання',
                body: 'Збережіть цей підсумок і покажіть лікарю разом з оригінальним PDF аналізу.',
              }]}
            />
          </section>

          <section className="rounded-[30px] bg-white/88 p-6 ring-1 ring-[#e8dfd2] sm:p-7">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-[#0f766e]">Усі показники</p>
                <h3 className="mt-2 text-2xl font-black tracking-tight">Список маркерів з аналізу</h3>
              </div>
              {doctorItems.length > 0 && <p className="max-w-md text-sm font-semibold leading-6 text-[#64748b]">Питання для лікаря вже зібрані в плані дій.</p>}
            </div>
            <div className="mt-5 grid gap-3">
              {biomarkers.map((item) => (
                <div key={`${item.name}-${item.id || item.value}`} className="rounded-[22px] bg-[#f8f5f0] p-4 ring-1 ring-[#e8dfd2]">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <h4 className="truncate text-base font-black">{markerName(item.name || item.display_name)}</h4>
                      <p className="mt-1 text-sm font-semibold text-[#64748b]">
                        {item.value ?? '-'} {item.unit || ''}
                        {(item.ref_low || item.ref_high) ? ` · референс ${item.ref_low ?? ''}-${item.ref_high ?? ''}` : ''}
                      </p>
                    </div>
                    <span className={`w-fit rounded-full px-3 py-1.5 text-xs font-black ring-1 ${statusClass(item.status)}`}>{statusLabel(item.status)}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      {!isLoading && biomarkers.length === 0 && (
        <section className="rounded-[30px] bg-white/88 p-8 text-center ring-1 ring-[#e8dfd2]">
          <ShieldAlert className="mx-auto h-10 w-10 text-[#0f766e]" />
          <h3 className="mt-4 text-2xl font-black">Показники ще не знайдено</h3>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-7 text-[#64748b]">Спробуйте завантажити чіткий PDF, де видно назви показників, значення, одиниці та референси.</p>
        </section>
      )}

      <section className="rounded-[28px] bg-[#eefaf6] p-5 ring-1 ring-[#cbe9e1]">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-[#0f766e]" />
          <p className="text-sm font-semibold leading-7 text-[#0f172a]">Vitaloop допомагає побачити пріоритети, але не замінює лікаря. Якщо симптоми різкі або стан погіршується, зверніться до медичного спеціаліста.</p>
        </div>
      </section>
    </div>
  )
}

function InfoPanel({ eyebrow, title, icon: Icon, items }) {
  return (
    <section className="rounded-[30px] bg-white/88 p-5 shadow-[0_14px_40px_rgba(15,23,42,0.05)] ring-1 ring-[#e8dfd2]">
      <div className="flex h-full flex-col">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#eefaf6] text-[#0f766e] ring-1 ring-[#cbe9e1]">
            <Icon className="h-5 w-5" />
          </span>
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.14em] text-[#0f766e]">{eyebrow}</p>
            <h3 className="text-lg font-black tracking-tight">{title}</h3>
          </div>
        </div>
        <div className="mt-5 space-y-3">
          {items.map((item, index) => (
            <div key={`${item.title}-${index}`} className="rounded-[20px] bg-[#f8f5f0] p-4 ring-1 ring-[#e8dfd2]">
              <h4 className="text-sm font-black text-[#0f172a]">{item.title}</h4>
              <p className="mt-2 text-sm font-semibold leading-6 text-[#64748b]">{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
