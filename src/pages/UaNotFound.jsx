import Seo from '../components/Seo.jsx'

export default function UaNotFound() {
  return (
    <>
      <Seo
        title="Сторінку не знайдено | VITALOOP Ukraine"
        description="Ця сторінка VITALOOP Ukraine недоступна або була переміщена."
        path="/404"
        noindex
      />
      <main className="grid min-h-[100svh] place-items-center bg-[#f8f5f0] px-4 text-[#0f172a]">
        <section className="w-full max-w-[560px] rounded-[32px] bg-white/86 p-7 text-center shadow-[0_24px_70px_rgba(15,23,42,0.10)] ring-1 ring-[#e8dfd2]">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[#0f766e]">404</p>
          <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Сторінку не знайдено</h1>
          <p className="mt-3 text-sm font-semibold leading-7 text-[#64748b]">
            Посилання може бути застарілим. Перейдіть на головну або відкрийте кабінет.
          </p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <a href="/" className="rounded-full bg-[#0f766e] px-6 py-3 text-sm font-black text-white">
              На головну
            </a>
            <a href="/dashboard" className="rounded-full bg-white px-6 py-3 text-sm font-black text-[#0f172a] ring-1 ring-[#e8dfd2]">
              До кабінету
            </a>
          </div>
        </section>
      </main>
    </>
  )
}
