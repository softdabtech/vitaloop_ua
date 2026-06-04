import { useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Check, Eye, EyeOff, ShieldCheck } from 'lucide-react'
import toast from 'react-hot-toast'
import Seo from '../components/Seo.jsx'
import { useAuth } from '../hooks/useAuth.js'
import { supabase } from '../lib/supabase.js'
import { notifyRegistrationAlert, sendWelcomeEmail } from '../auth/registrationAlert.js'
import { gaLogin, gaSignUp } from '../lib/analytics.js'
import { trackFunnelEvent } from '../lib/funnel.js'
import { navigateToResolvedPath, resolvePostLoginDestination } from '../auth/postLogin.js'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function resolveEmailConfirmationRedirect(returnUrl = null) {
  const url = new URL('/auth/confirmation', window.location.origin)
  if (returnUrl) url.searchParams.set('returnUrl', returnUrl)
  return url.toString()
}

function isValidEmail(value) {
  return EMAIL_RE.test(String(value || '').trim())
}

function hasValidPassword(value) {
  return String(value || '').length >= 8
}

export default function Login({ pendingConfirmation = false }) {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const initialSignup = searchParams.get('signup') === 'true'
  const [isSignUp, setIsSignUp] = useState(initialSignup)
  const [isForgot, setIsForgot] = useState(false)
  const [email, setEmail] = useState(searchParams.get('email') || '')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const { signInWithEmail, signUpWithEmail, signInWithGoogle, resetPassword, signOut } = useAuth()

  const copy = useMemo(() => {
    if (pendingConfirmation) {
      return {
        label: 'Підтвердження',
        title: 'Перевірте пошту',
        description: 'Ми надіслали лист для підтвердження акаунта. Після підтвердження поверніться до входу.',
      }
    }
    if (isForgot) {
      return {
        label: 'Доступ',
        title: 'Відновлення пароля',
        description: 'Вкажіть email, і ми надішлемо посилання для відновлення доступу.',
      }
    }
    if (isSignUp) {
      return {
        label: 'Реєстрація',
        title: 'Створіть акаунт',
        description: 'Почніть із симптомів або аналізів. Без картки та зайвих кроків.',
      }
    }
    return {
      label: 'Авторизація',
      title: 'Вхід до акаунта',
      description: 'Продовжуйте працювати зі своїм станом, аналізами й персональними пріоритетами.',
    }
  }, [isForgot, isSignUp, pendingConfirmation])

  async function handleSubmit(event) {
    event.preventDefault()
    setMessage('')
    const normalizedEmail = email.trim()

    if (!isValidEmail(normalizedEmail)) {
      toast.error('Введіть коректний email.')
      return
    }
    if (!isForgot && !hasValidPassword(password)) {
      toast.error('Пароль має містити щонайменше 8 символів.')
      return
    }

    setLoading(true)
    try {
      if (isForgot) {
        const { error } = await resetPassword(normalizedEmail)
        if (error) throw error
        toast.success('Посилання для відновлення надіслано.')
        setIsForgot(false)
        return
      }

      const returnUrl = searchParams.get('returnUrl')
      const { data, error } = isSignUp
        ? await signUpWithEmail(normalizedEmail, password, { emailRedirectTo: resolveEmailConfirmationRedirect(returnUrl) })
        : await signInWithEmail(normalizedEmail, password)
      if (error) throw error

      if (isSignUp) {
        gaSignUp('email')
        trackFunnelEvent('funnel_signup_completed', 'UA user completed signup', { auth_provider: 'email', locale: 'uk' }, { oncePerSession: true })
        if (data?.session?.access_token) {
          await notifyRegistrationAlert('ua_email_signup')
          await sendWelcomeEmail()
          toast.success('Акаунт створено.')
          navigate('/dashboard', { replace: true })
          return
        }
        toast.success('Акаунт створено. Підтвердіть email, щоб продовжити.')
        navigate(`/auth/confirmation?pending=1&email=${encodeURIComponent(normalizedEmail)}`, { replace: true })
        return
      }

      gaLogin('email')
      const destination = await resolvePostLoginDestination(returnUrl)
      navigateToResolvedPath(navigate, destination)
    } catch (error) {
      console.error('UA auth error:', error)
      await signOut().catch(() => {})
      const text = error?.message || 'Не вдалося виконати дію. Спробуйте ще раз.'
      setMessage(text)
      toast.error(text)
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogle() {
    gaLogin('google')
    const { error } = await signInWithGoogle()
    if (error) toast.error(error.message)
  }

  return (
    <>
      <Seo
        title="Вхід або реєстрація | VITALOOP Ukraine"
        description="Увійдіть або створіть акаунт VITALOOP Ukraine, щоб почати з симптомів, аналізів і персонального плану дій."
        path="/login"
        noindex
      />
      <main className="relative min-h-[100svh] overflow-hidden bg-[#f8f5f0] text-[#0f172a]">
        <img src="/images/ua-health-hero-2026.png" alt="" className="absolute inset-0 h-full w-full object-cover object-center" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(248,245,240,0.92)_0%,rgba(248,245,240,0.60)_50%,rgba(248,245,240,0.16)_100%)]" />
        <button onClick={() => navigate('/')} className="absolute left-4 top-4 z-20 inline-flex min-h-10 items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-black text-[#0f172a] shadow-sm ring-1 ring-[#e5dfd6] backdrop-blur transition hover:-translate-y-0.5 hover:text-[#0f766e]">
          <ArrowLeft className="h-4 w-4" />
          На сайт
        </button>

        <div className={`relative z-10 mx-auto grid min-h-[100svh] w-full max-w-[1240px] gap-8 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:items-center ${isSignUp ? '' : 'lg:[&_.ua-auth-form]:order-2 lg:[&_.ua-auth-copy]:order-1'}`}>
          <section className="ua-auth-form w-full max-w-[480px] justify-self-center lg:justify-self-start">
            <div className="rounded-[34px] bg-white/88 p-5 shadow-[0_30px_90px_rgba(15,23,42,0.14)] ring-1 ring-white/80 backdrop-blur-xl sm:p-7">
              <div className="mb-8 flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-[14px] bg-white ring-1 ring-[#e5dfd6]">
                  <img src="/images/ua-vitaloop-mark-20260603.png" alt="" className="h-9 w-9 object-contain" />
                </span>
                <div>
                  <p className="text-lg font-black uppercase leading-none tracking-[0.02em]">
                    <span className="text-[#1f6ed4]">VITA</span><span className="text-[#f4c542]">LOOP</span>
                  </p>
                  <p className="mt-1 text-xs font-bold text-[#6b7280]">Ukraine</p>
                </div>
              </div>

              <p className="text-xs font-black uppercase tracking-[0.14em] text-[#0f766e]">{copy.label}</p>
              <h1 className="mt-3 text-[30px] font-black leading-tight tracking-tight text-[#0f172a] sm:text-[38px]">{copy.title}</h1>
              <p className="mt-3 text-sm leading-7 text-[#4b5563]">{copy.description}</p>

              {pendingConfirmation ? (
                <div className="mt-7 grid gap-3">
                  <button onClick={() => navigate('/login')} className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#0f766e] px-5 text-sm font-black text-white">Перейти до входу</button>
                </div>
              ) : (
                <>
                  {message && <div className="mt-5 rounded-[18px] bg-[#fff7ed] p-4 text-sm leading-6 text-[#9a3412] ring-1 ring-[#fed7aa]">{message}</div>}
                  <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
                    <label className="grid gap-2">
                      <span className="text-xs font-black uppercase tracking-[0.12em] text-[#6b7280]">Email</span>
                      <input type="email" required placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="min-h-12 rounded-[18px] border border-[#e5dfd6] bg-[#f8f5f0] px-4 text-base font-semibold outline-none transition placeholder:text-[#9ca3af] focus:border-[#14b8a6] focus:bg-white focus:ring-4 focus:ring-[#14b8a6]/10" />
                    </label>

                    {!isForgot && (
                      <label className="grid gap-2">
                        <span className="text-xs font-black uppercase tracking-[0.12em] text-[#6b7280]">Пароль</span>
                        <span className="relative">
                          <input type={showPass ? 'text' : 'password'} required minLength={8} placeholder="Не менше 8 символів" value={password} onChange={(e) => setPassword(e.target.value)} className="min-h-12 w-full rounded-[18px] border border-[#e5dfd6] bg-[#f8f5f0] px-4 pr-12 text-base font-semibold outline-none transition placeholder:text-[#9ca3af] focus:border-[#14b8a6] focus:bg-white focus:ring-4 focus:ring-[#14b8a6]/10" />
                          <button type="button" onClick={() => setShowPass((value) => !value)} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-2 text-[#6b7280] transition hover:bg-white hover:text-[#0f766e]" aria-label={showPass ? 'Сховати пароль' : 'Показати пароль'}>
                            {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </span>
                        {!isSignUp && <button type="button" onClick={() => setIsForgot(true)} className="justify-self-end text-sm font-bold text-[#0f766e] transition hover:text-[#14b8a6]">Забули пароль?</button>}
                      </label>
                    )}

                    <button type="submit" disabled={loading} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[linear-gradient(135deg,#0f766e_0%,#14b8a6_58%,#d4b483_135%)] px-5 py-3 text-sm font-black text-white shadow-[0_14px_34px_rgba(15,118,110,0.24)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70">
                      {loading ? 'Зачекайте...' : isForgot ? 'Надіслати посилання' : isSignUp ? 'Створити акаунт' : 'Увійти'}
                      {!loading && <ArrowRight className="h-4 w-4" />}
                    </button>
                  </form>

                  {!isForgot && (
                    <>
                      <div className="my-5 flex items-center gap-3"><span className="h-px flex-1 bg-[#e5dfd6]" /><span className="text-xs font-bold text-[#9ca3af]">або</span><span className="h-px flex-1 bg-[#e5dfd6]" /></div>
                      <button onClick={handleGoogle} className="flex min-h-12 w-full items-center justify-center gap-3 rounded-full bg-white px-5 py-3 text-sm font-black text-[#0f172a] shadow-sm ring-1 ring-[#e5dfd6] transition hover:-translate-y-0.5 hover:text-[#0f766e]">Продовжити з Google</button>
                    </>
                  )}

                  <p className="mt-6 text-center text-sm font-semibold text-[#6b7280]">
                    {isForgot ? (
                      <button onClick={() => setIsForgot(false)} className="font-black text-[#0f766e]">Повернутися до входу</button>
                    ) : (
                      <>
                        {isSignUp ? 'Вже маєте акаунт? ' : 'Ще немає акаунта? '}
                        <button onClick={() => setIsSignUp((value) => !value)} className="font-black text-[#0f766e]">{isSignUp ? 'Увійти' : 'Створити безкоштовно'}</button>
                      </>
                    )}
                  </p>
                </>
              )}

              <div className="mt-7 rounded-[22px] bg-[#f8f5f0] p-4 ring-1 ring-[#e5dfd6]">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.12em] text-[#0f766e]"><ShieldCheck className="h-4 w-4" />Безпека даних</div>
                <p className="mt-2 text-xs leading-6 text-[#6b7280]">Vitaloop не продає медичні дані. Доступ до акаунта захищений на рівні користувача.</p>
              </div>
            </div>
          </section>

          <section className="ua-auth-copy hidden max-w-[520px] justify-self-center lg:block">
            <div className="rounded-[34px] bg-white/58 p-8 shadow-[0_30px_90px_rgba(15,23,42,0.10)] ring-1 ring-white/70 backdrop-blur-xl">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-[#0f766e]">VITALOOP Ukraine</p>
              <h2 className="mt-4 text-[42px] font-black leading-[1.05] tracking-tight text-[#0f172a]">Почніть з персональної оцінки</h2>
              <p className="mt-5 text-base leading-8 text-[#4b5563]">Опишіть самопочуття або додайте аналізи, щоб отримати перший зрозумілий підсумок.</p>
              <div className="mt-7 grid gap-3">
                {['симптоми й аналізи в одному місці', 'підказки, що перевірити першим', 'питання до лікаря без медичного туману'].map((item) => (
                  <div key={item} className="flex items-center gap-3 rounded-full bg-white/72 px-4 py-3 text-sm font-black text-[#0f172a] ring-1 ring-[#e5dfd6]"><Check className="h-4 w-4 text-[#0f766e]" />{item}</div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  )
}
