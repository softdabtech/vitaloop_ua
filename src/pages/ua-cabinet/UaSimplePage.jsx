import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, ArrowRight, Bell, Calendar, CheckCircle2, CreditCard, Lock, Mail, ShieldAlert, UserRound } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../../lib/api.js'
import { supabase } from '../../lib/supabase.js'
import { useAuth } from '../../hooks/useAuth.js'
import { useSubscription } from '../../hooks/useSubscription.js'

const fieldClass = 'min-h-12 rounded-2xl border border-[#e8dfd2] bg-[#f8f5f0] px-4 font-semibold text-[#0f172a] outline-none transition placeholder:text-[#94a3b8] focus:border-[#0f766e] focus:bg-white focus:ring-4 focus:ring-[#14b8a6]/10'
const primaryButton = 'inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[linear-gradient(135deg,#0f766e_0%,#14b8a6_58%,#d4b483_135%)] px-6 text-sm font-black text-white shadow-[0_16px_35px_rgba(15,118,110,0.22)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60'
const secondaryButton = 'inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-white px-5 text-sm font-black text-[#0f172a] ring-1 ring-[#e8dfd2] transition hover:-translate-y-0.5 hover:text-[#0f766e] disabled:cursor-not-allowed disabled:opacity-60'

function Card({ children, className = '' }) {
  return <section className={`rounded-[30px] bg-white/82 p-5 shadow-[0_18px_55px_rgba(15,23,42,0.07)] ring-1 ring-[#e8dfd2] sm:p-7 ${className}`}>{children}</section>
}

function SectionTitle({ icon: Icon, label, title, body }) {
  return (
    <div className="flex items-start gap-3">
      {Icon && <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#f1fbf8] text-[#0f766e] ring-1 ring-[#b7d8d2]"><Icon className="h-5 w-5" /></span>}
      <div>
        {label && <p className="text-xs font-black uppercase tracking-[0.16em] text-[#0f766e]">{label}</p>}
        <h2 className="text-2xl font-black tracking-tight sm:text-3xl">{title}</h2>
        {body && <p className="mt-2 max-w-2xl text-sm leading-7 text-[#64748b]">{body}</p>}
      </div>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <label className="grid gap-2">
      <span className="text-xs font-black uppercase tracking-[0.12em] text-[#64748b]">{label}</span>
      {children}
    </label>
  )
}

function fmtDate(value) {
  if (!value) return '—'
  const date = typeof value === 'number' ? new Date(value * 1000) : new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleDateString('uk-UA', { day: '2-digit', month: 'short', year: 'numeric' })
}

function planLabel(plan) {
  const normalized = String(plan || '').toLowerCase()
  if (normalized.includes('personal') || normalized.includes('premium') || normalized.includes('core')) return 'Преміум'
  if (normalized.includes('practitioner')) return 'Практик'
  return plan || 'Безкоштовно'
}

function statusLabel(status) {
  const normalized = String(status || 'free').toLowerCase()
  if (normalized === 'active') return 'Активна'
  if (normalized === 'past_due') return 'Потрібна оплата'
  if (normalized === 'cancelled' || normalized === 'canceled') return 'Скасована'
  if (normalized === 'paused') return 'Пауза'
  return 'Безкоштовно'
}

function normalizePrefs(source = {}) {
  return {
    weekly_checkin: source.weekly_checkin !== false,
    retest_reminder: source.retest_reminder !== false,
    weekly_digest: source.weekly_digest !== false,
    biomarker_alert: source.biomarker_alert !== false,
  }
}

function Toggle({ label, description, checked, onChange }) {
  return (
    <button type="button" onClick={() => onChange(!checked)} className="flex items-center justify-between gap-4 rounded-2xl bg-[#f8f5f0] p-4 text-left ring-1 ring-[#e8dfd2] transition hover:bg-white">
      <span>
        <span className="block text-sm font-black text-[#0f172a]">{label}</span>
        <span className="mt-1 block text-xs font-semibold leading-5 text-[#64748b]">{description}</span>
      </span>
      <span className={`relative h-7 w-12 shrink-0 rounded-full transition ${checked ? 'bg-[#0f766e]' : 'bg-[#cbd5e1]'}`}>
        <span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${checked ? 'left-6' : 'left-1'}`} />
      </span>
    </button>
  )
}

function useBillingHistory() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function load() {
    setLoading(true)
    setError('')
    try {
      const { data } = await api.get('/stripe/billing-history')
      setRows(Array.isArray(data?.history) ? data.history : [])
    } catch (err) {
      setError(err?.response?.data?.detail || 'Не вдалося завантажити історію оплат.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  return { rows, loading, error, reload: load }
}

export function UaSettings() {
  const navigate = useNavigate()
  const { user, signOut } = useAuth()
  const { isPremium, refresh } = useSubscription()
  const [profile, setProfile] = useState({})
  const [preferences, setPreferences] = useState(() => normalizePrefs(user?.user_metadata))
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [savingProfile, setSavingProfile] = useState(false)
  const [savingPassword, setSavingPassword] = useState(false)
  const [savingPrefs, setSavingPrefs] = useState(false)
  const [cancelConfirm, setCancelConfirm] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(false)
  const [busyDanger, setBusyDanger] = useState(false)

  useEffect(() => {
    let active = true
    api.get('/profile')
      .then(({ data }) => {
        if (!active) return
        setProfile(data?.profile || {})
      })
      .catch(() => {})
    return () => {
      active = false
    }
  }, [])

  async function saveProfile() {
    setSavingProfile(true)
    try {
      const payload = {
        full_name: profile.full_name || '',
        age: profile.age ? Number(profile.age) : undefined,
        sex: profile.sex || undefined,
        height_cm: profile.height_cm ? Number(profile.height_cm) : undefined,
        weight_kg: profile.weight_kg ? Number(profile.weight_kg) : undefined,
      }
      const { data } = await api.patch('/profile', payload)
      setProfile(data?.profile || profile)
      toast.success('Профіль оновлено.')
    } catch (error) {
      toast.error(error?.response?.data?.detail || 'Не вдалося зберегти профіль.')
    } finally {
      setSavingProfile(false)
    }
  }

  async function updatePassword() {
    if (password.length < 8) {
      toast.error('Пароль має містити щонайменше 8 символів.')
      return
    }
    if (password !== confirmPassword) {
      toast.error('Паролі не збігаються.')
      return
    }
    setSavingPassword(true)
    try {
      const { error } = await supabase.auth.updateUser({ password })
      if (error) throw error
      setPassword('')
      setConfirmPassword('')
      toast.success('Пароль оновлено.')
    } catch (error) {
      toast.error(error?.message || 'Не вдалося оновити пароль.')
    } finally {
      setSavingPassword(false)
    }
  }

  async function savePreferences() {
    setSavingPrefs(true)
    try {
      const { data } = await api.patch('/settings/notifications', preferences)
      setPreferences((current) => ({ ...current, ...(data?.preferences || {}) }))
      toast.success('Налаштування сповіщень оновлено.')
    } catch (error) {
      toast.error(error?.response?.data?.detail || 'Не вдалося оновити сповіщення.')
    } finally {
      setSavingPrefs(false)
    }
  }

  async function cancelSubscription() {
    setBusyDanger(true)
    try {
      await api.post('/stripe/cancel')
      toast.success('Підписку скасовано.')
      setCancelConfirm(false)
      await refresh()
    } catch (error) {
      toast.error(error?.response?.data?.detail || 'Не вдалося скасувати підписку.')
    } finally {
      setBusyDanger(false)
    }
  }

  async function deleteAccount() {
    setBusyDanger(true)
    try {
      await api.delete('/auth')
      toast.success('Акаунт видалено.')
      await signOut().catch(() => {})
      window.location.assign('/login')
    } catch (error) {
      toast.error(error?.response?.data?.detail || 'Не вдалося видалити акаунт.')
      setBusyDanger(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <SectionTitle icon={UserRound} label="Акаунт" title="Налаштування" body="Профіль, пароль, сповіщення, підписка й контроль даних в одному місці." />
      </Card>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <Card>
          <SectionTitle icon={Mail} title="Профіль" body="Базові дані допомагають точніше інтерпретувати показники та рекомендації." />
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Field label="Email">
              <input value={user?.email || ''} readOnly className={`${fieldClass} text-[#64748b]`} />
            </Field>
            <Field label="Імʼя">
              <input value={profile.full_name || ''} onChange={(e) => setProfile((value) => ({ ...value, full_name: e.target.value }))} placeholder="Ваше імʼя" className={fieldClass} />
            </Field>
            <Field label="Вік">
              <input type="number" min="1" max="120" value={profile.age || ''} onChange={(e) => setProfile((value) => ({ ...value, age: e.target.value }))} placeholder="35" className={fieldClass} />
            </Field>
            <Field label="Стать">
              <select value={profile.sex || ''} onChange={(e) => setProfile((value) => ({ ...value, sex: e.target.value }))} className={fieldClass}>
                <option value="">Не вказано</option>
                <option value="female">Жінка</option>
                <option value="male">Чоловік</option>
                <option value="other">Інше</option>
              </select>
            </Field>
            <Field label="Зріст, см">
              <input type="number" value={profile.height_cm || ''} onChange={(e) => setProfile((value) => ({ ...value, height_cm: e.target.value }))} placeholder="175" className={fieldClass} />
            </Field>
            <Field label="Вага, кг">
              <input type="number" value={profile.weight_kg || ''} onChange={(e) => setProfile((value) => ({ ...value, weight_kg: e.target.value }))} placeholder="70" className={fieldClass} />
            </Field>
          </div>
          <button onClick={saveProfile} disabled={savingProfile} className={`${primaryButton} mt-6 w-full sm:w-fit`}>
            {savingProfile ? 'Зберігаємо...' : 'Зберегти профіль'}
          </button>
        </Card>

        <Card>
          <SectionTitle icon={Lock} title="Безпека" body="Оновіть пароль або завершіть поточну сесію, якщо користуєтесь спільним пристроєм." />
          <div className="mt-6 grid gap-4">
            <Field label="Новий пароль">
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Не менше 8 символів" className={fieldClass} />
            </Field>
            <Field label="Повторіть пароль">
              <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Повторіть новий пароль" className={fieldClass} />
            </Field>
            <button onClick={updatePassword} disabled={savingPassword || !password} className={`${primaryButton} w-full`}>
              {savingPassword ? 'Оновлюємо...' : 'Оновити пароль'}
            </button>
            <button onClick={async () => { await signOut(); window.location.assign('/login') }} className={`${secondaryButton} w-full`}>
              Вийти з акаунта
            </button>
          </div>
        </Card>
      </div>

      <Card>
        <SectionTitle icon={Bell} title="Сповіщення" body="Залиште тільки ті нагадування, які справді допомагають тримати здоровʼя в полі уваги." />
        <div className="mt-6 grid gap-3 md:grid-cols-2">
          <Toggle label="Щотижневий check-in" description="Нагадування коротко оновити самопочуття." checked={preferences.weekly_checkin} onChange={(value) => setPreferences((current) => ({ ...current, weekly_checkin: value }))} />
          <Toggle label="Повторна перевірка аналізів" description="Коли варто повернутися до контрольних показників." checked={preferences.retest_reminder} onChange={(value) => setPreferences((current) => ({ ...current, retest_reminder: value }))} />
          <Toggle label="Тижневий підсумок" description="Стислий огляд динаміки, фокусу й наступних кроків." checked={preferences.weekly_digest} onChange={(value) => setPreferences((current) => ({ ...current, weekly_digest: value }))} />
          <Toggle label="Важливі маркери" description="Повідомлення, якщо новий результат потребує уваги." checked={preferences.biomarker_alert} onChange={(value) => setPreferences((current) => ({ ...current, biomarker_alert: value }))} />
        </div>
        <button onClick={savePreferences} disabled={savingPrefs} className={`${primaryButton} mt-6 w-full sm:w-fit`}>
          {savingPrefs ? 'Зберігаємо...' : 'Зберегти сповіщення'}
        </button>
      </Card>

      <Card className="bg-[#fff7ed]/80 ring-[#fed7aa]">
        <SectionTitle icon={ShieldAlert} title="Контроль акаунта" body="Дії нижче впливають на доступ, підписку або збережені дані. Використовуйте їх уважно." />
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl bg-white/78 p-4 ring-1 ring-[#fed7aa]">
            <h3 className="font-black text-[#9a3412]">Підписка</h3>
            <p className="mt-2 text-sm leading-6 text-[#9a3412]">{isPremium ? 'Можна скасувати Преміум. Доступ зберігається до кінця оплаченого періоду.' : 'Зараз активний безкоштовний план.'}</p>
            {isPremium && (
              cancelConfirm ? (
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  <button onClick={cancelSubscription} disabled={busyDanger} className="rounded-full bg-[#dc2626] px-4 py-3 text-sm font-black text-white disabled:opacity-60">Так, скасувати</button>
                  <button onClick={() => setCancelConfirm(false)} disabled={busyDanger} className="rounded-full bg-white px-4 py-3 text-sm font-black text-[#0f172a] ring-1 ring-[#fed7aa]">Залишити</button>
                </div>
              ) : (
                <button onClick={() => setCancelConfirm(true)} className="mt-4 rounded-full bg-white px-5 py-3 text-sm font-black text-[#dc2626] ring-1 ring-[#fecaca]">Скасувати підписку</button>
              )
            )}
          </div>

          <div className="rounded-2xl bg-white/78 p-4 ring-1 ring-[#fecaca]">
            <h3 className="font-black text-[#991b1b]">Видалення акаунта</h3>
            <p className="mt-2 text-sm leading-6 text-[#991b1b]">Видаляє акаунт і повʼязані дані. Цю дію неможливо скасувати.</p>
            {deleteConfirm ? (
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                <button onClick={deleteAccount} disabled={busyDanger} className="rounded-full bg-[#991b1b] px-4 py-3 text-sm font-black text-white disabled:opacity-60">Видалити назавжди</button>
                <button onClick={() => setDeleteConfirm(false)} disabled={busyDanger} className="rounded-full bg-white px-4 py-3 text-sm font-black text-[#0f172a] ring-1 ring-[#fecaca]">Скасувати</button>
              </div>
            ) : (
              <button onClick={() => setDeleteConfirm(true)} className="mt-4 rounded-full bg-white px-5 py-3 text-sm font-black text-[#991b1b] ring-1 ring-[#fecaca]">Видалити акаунт</button>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}

export function UaSubscription() {
  const navigate = useNavigate()
  const { rows, loading: historyLoading, error: historyError } = useBillingHistory()
  const [subscription, setSubscription] = useState(null)
  const [loading, setLoading] = useState(true)
  const [upgrading, setUpgrading] = useState(false)
  const [openingPortal, setOpeningPortal] = useState(false)

  const currentStatus = String(subscription?.sub_status || 'free').toLowerCase()
  const isPremium = Boolean(subscription?.is_premium)
  const hasStripeCustomer = Boolean(subscription?.has_stripe_customer)
  const uploadsLeft = subscription?.upload_limit == null ? 'Без ліміту' : Math.max(0, Number(subscription.upload_limit || 0) - Number(subscription.upload_count || 0))

  useEffect(() => {
    let active = true
    setLoading(true)
    api.get('/stripe/subscription')
      .then(({ data }) => {
        if (active) setSubscription(data)
      })
      .catch(() => toast.error('Не вдалося завантажити підписку.'))
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  async function startCheckout() {
    setUpgrading(true)
    try {
      const { data } = await api.post('/stripe/checkout', { plan_id: 'personal', billing_cycle: 'monthly' })
      if (data?.checkout_url) {
        window.location.href = data.checkout_url
        return
      }
      toast.error('Stripe не повернув посилання для оплати.')
    } catch (error) {
      toast.error(error?.response?.data?.detail || 'Не вдалося відкрити оплату Stripe.')
    } finally {
      setUpgrading(false)
    }
  }

  async function openPortal() {
    if (!hasStripeCustomer) return
    setOpeningPortal(true)
    try {
      const { data } = await api.post('/stripe/portal')
      if (data?.portal_url) {
        window.open(data.portal_url, '_blank')
        return
      }
      toast.error('Портал Stripe тимчасово недоступний.')
    } catch (error) {
      toast.error(error?.response?.data?.detail || 'Не вдалося відкрити Stripe portal.')
    } finally {
      setOpeningPortal(false)
    }
  }

  const planCards = useMemo(() => ([
    {
      name: 'Безкоштовно',
      price: '0 грн',
      active: !isPremium,
      body: 'Перший аналіз, базовий підсумок і знайомство з кабінетом.',
      features: ['1 завантаження за період', 'Базовий огляд маркерів', 'Оцінка симптомів'],
    },
    {
      name: 'Premium',
      price: '399 грн/міс',
      active: isPremium,
      body: 'Для регулярної роботи зі станом, аналізами, динамікою та сімейними сценаріями.',
      features: ['Більше завантажень', 'Динаміка показників', 'Персональні пріоритети', 'Підготовка питань до лікаря'],
    },
  ]), [isPremium])

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <SectionTitle icon={CreditCard} label="Оплата" title="Тарифи й підписка" body="Free для першого кроку. Premium відкриває регулярну роботу з аналізами, пріоритетами та динамікою." />
          <button onClick={hasStripeCustomer ? openPortal : startCheckout} disabled={upgrading || openingPortal || loading} className={`${primaryButton} w-full lg:w-fit`}>
            {hasStripeCustomer ? (openingPortal ? 'Відкриваємо...' : 'Керувати оплатою') : (upgrading ? 'Переходимо до Stripe...' : 'Оформити Premium')}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-4">
        <div className="rounded-[26px] bg-white/82 p-5 ring-1 ring-[#e8dfd2]">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-[#64748b]">Поточний план</p>
          <p className="mt-2 text-2xl font-black">{isPremium ? 'Premium' : 'Free'}</p>
        </div>
        <div className="rounded-[26px] bg-[#f1fbf8] p-5 ring-1 ring-[#b7d8d2]">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-[#0f766e]">Статус</p>
          <p className="mt-2 text-2xl font-black">{loading ? '...' : statusLabel(currentStatus)}</p>
        </div>
        <div className="rounded-[26px] bg-[#fff8e7] p-5 ring-1 ring-[#ead7ab]">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-[#9a6a1d]">Завантаження</p>
          <p className="mt-2 text-2xl font-black">{loading ? '...' : uploadsLeft}</p>
        </div>
        <div className="rounded-[26px] bg-white/82 p-5 ring-1 ring-[#e8dfd2]">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-[#64748b]">Наступна дата</p>
          <p className="mt-2 text-xl font-black">{fmtDate(subscription?.current_period_end)}</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {planCards.map((plan) => (
          <div key={plan.name} className={`rounded-[30px] p-6 ring-1 ${plan.active ? 'bg-[linear-gradient(145deg,#ffffff_0%,#f1fbf8_100%)] ring-[#b7d8d2] shadow-[0_24px_60px_rgba(15,118,110,0.13)]' : 'bg-white/82 ring-[#e8dfd2]'}`}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.14em] text-[#64748b]">{plan.name}</p>
                <h3 className="mt-3 text-3xl font-black">{plan.price}</h3>
              </div>
              {plan.active && <span className="rounded-full bg-[#0f766e] px-3 py-1 text-xs font-black text-white">Активний</span>}
            </div>
            <p className="mt-4 text-sm leading-7 text-[#64748b]">{plan.body}</p>
            <ul className="mt-5 grid gap-2">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-sm font-semibold text-[#475569]">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#0f766e]" />
                  {feature}
                </li>
              ))}
            </ul>
            {plan.name === 'Premium' && !isPremium && (
              <button onClick={startCheckout} disabled={upgrading} className={`${primaryButton} mt-6 w-full`}>
                {upgrading ? 'Переходимо до Stripe...' : 'Оформити Premium'}
              </button>
            )}
          </div>
        ))}
      </div>

      <Card>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <SectionTitle icon={Calendar} title="Історія оплат" body="Підписки й зміни тарифу зʼявляються тут після платежів через Stripe." />
          {hasStripeCustomer && (
            <button onClick={openPortal} disabled={openingPortal} className={secondaryButton}>
              {openingPortal ? 'Відкриваємо...' : 'Stripe portal'}
            </button>
          )}
        </div>

        <div className="mt-6 overflow-hidden rounded-[24px] ring-1 ring-[#e8dfd2]">
          {historyLoading && <div className="bg-white/70 p-5 text-sm font-bold text-[#64748b]">Завантажуємо історію...</div>}
          {!historyLoading && historyError && <div className="bg-[#fff7ed] p-5 text-sm font-bold text-[#9a3412]">{historyError}</div>}
          {!historyLoading && !historyError && rows.length === 0 && (
            <div className="bg-white/70 p-8 text-center">
              <CreditCard className="mx-auto h-10 w-10 text-[#94a3b8]" />
              <p className="mt-3 font-black">Історії оплат ще немає</p>
              <p className="mt-1 text-sm leading-6 text-[#64748b]">Після оформлення Premium тут буде видно статус, період і дату оновлення.</p>
            </div>
          )}
          {!historyLoading && !historyError && rows.length > 0 && (
            <div className="divide-y divide-[#e8dfd2] bg-white/76">
              {rows.map((row, index) => (
                <div key={`${row.plan_name}-${row.updated_at}-${index}`} className="grid gap-3 p-4 text-sm md:grid-cols-[1fr_1fr_1fr_1fr] md:items-center">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.12em] text-[#64748b]">План</p>
                    <p className="mt-1 font-black">{planLabel(row.plan_name)}</p>
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.12em] text-[#64748b]">Статус</p>
                    <p className="mt-1 font-bold">{statusLabel(row.status)}</p>
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.12em] text-[#64748b]">Період</p>
                    <p className="mt-1 font-bold">{fmtDate(row.current_period_start || row.started_at)} - {fmtDate(row.current_period_end)}</p>
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.12em] text-[#64748b]">Оновлено</p>
                    <p className="mt-1 font-bold">{fmtDate(row.updated_at)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      <button onClick={() => navigate('/dashboard')} className={secondaryButton}>
        <ArrowLeft className="h-4 w-4" />
        До кабінету
      </button>
    </div>
  )
}
