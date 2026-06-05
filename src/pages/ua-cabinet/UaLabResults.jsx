import { ArrowRight, Calendar, FileText, Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import api from '../../lib/api.js'

function useUaUploads() {
  return useQuery({
    queryKey: ['ua-uploads-recent'],
    queryFn: async () => {
      try {
        const { data } = await api.get('/progress')
        if (Array.isArray(data) && data.length > 0) return data
        if (Array.isArray(data?.items) && data.items.length > 0) return data.items
      } catch {
        // Free users or local preview can fail on /progress; recent uploads is the safe fallback.
      }
      try {
        const { data } = await api.get('/uploads/recent')
        return Array.isArray(data) ? data : Array.isArray(data?.items) ? data.items : []
      } catch {
        return []
      }
    },
    staleTime: 3 * 60 * 1000,
  })
}

function normalizeStatus(status) {
  const value = String(status || '').toLowerCase()
  if (value.includes('optimal') || value.includes('normal')) return 'optimal'
  if (value.includes('deficient') || value.includes('elevated') || value.includes('critical')) return 'attention'
  return 'review'
}

function markerCounts(item) {
  const biomarkers = Array.isArray(item?.biomarkers) ? item.biomarkers : []
  return {
    total: biomarkers.length,
    optimal: biomarkers.filter((marker) => normalizeStatus(marker?.status) === 'optimal').length,
    attention: biomarkers.filter((marker) => normalizeStatus(marker?.status) === 'attention').length,
    review: biomarkers.filter((marker) => normalizeStatus(marker?.status) === 'review').length,
  }
}

function itemDate(item) {
  const raw = item?.test_date || item?.created_at || item?.updated_at
  return raw ? new Date(raw).toLocaleDateString('uk-UA', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Дата не вказана'
}

function itemId(item) {
  return item?.upload_id || item?.id
}

export default function UaLabResults() {
  const navigate = useNavigate()
  const { data, isLoading, error } = useUaUploads()
  const uploads = Array.isArray(data) ? data : []

  return (
    <div className="space-y-6">
      <section className="rounded-[30px] bg-white/82 p-6 shadow-[0_18px_55px_rgba(15,23,42,0.07)] ring-1 ring-[#e8dfd2] sm:p-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[#0f766e]">Історія</p>
            <h2 className="mt-3 text-[32px] font-black leading-tight tracking-tight sm:text-[44px]">Ваші аналізи</h2>
            <p className="mt-3 max-w-2xl text-base leading-8 text-[#64748b]">Тут зʼявляються завантажені результати, статус обробки та швидкий перехід до підсумку.</p>
          </div>
          <button onClick={() => navigate('/upload')} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#0f766e] px-5 text-sm font-black text-white transition hover:-translate-y-0.5">
            <Plus className="h-4 w-4" /> Додати аналіз
          </button>
        </div>
      </section>

      {isLoading && <div className="rounded-2xl bg-white p-4 text-sm font-bold text-[#64748b] ring-1 ring-[#e8dfd2]">Завантажуємо історію...</div>}
      {error && <div className="rounded-2xl bg-[#fff7ed] p-4 text-sm font-bold text-[#9a3412] ring-1 ring-[#fed7aa]">Не вдалося завантажити список аналізів.</div>}

      {uploads.length === 0 && !isLoading ? (
        <section className="rounded-[30px] bg-white/82 p-8 text-center ring-1 ring-[#e8dfd2]">
          <FileText className="mx-auto h-10 w-10 text-[#0f766e]" />
          <h3 className="mt-4 text-2xl font-black">Аналізів ще немає</h3>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-7 text-[#64748b]">Завантажте перший PDF або почніть з оцінки симптомів, якщо результатів лабораторії поки немає.</p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <button onClick={() => navigate('/upload')} className="rounded-full bg-[#0f766e] px-6 py-3 text-sm font-black text-white">Завантажити PDF</button>
            <button onClick={() => navigate('/questionnaire')} className="rounded-full bg-white px-6 py-3 text-sm font-black text-[#0f172a] ring-1 ring-[#e8dfd2]">Описати симптоми</button>
          </div>
        </section>
      ) : (
        <div className="grid gap-4">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-[24px] bg-white/78 p-4 ring-1 ring-[#e8dfd2]">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-[#64748b]">Завантажень</p>
              <p className="mt-2 text-3xl font-black">{uploads.length}</p>
            </div>
            <div className="rounded-[24px] bg-[#f1fbf8] p-4 ring-1 ring-[#b7d8d2]">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-[#0f766e]">Останній файл</p>
              <p className="mt-2 truncate text-base font-black">{uploads[0]?.lab_name || 'Лабораторний результат'}</p>
            </div>
            <div className="rounded-[24px] bg-[#fff8e7] p-4 ring-1 ring-[#ead7ab]">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-[#9a6a1d]">Наступний крок</p>
              <p className="mt-2 text-sm font-bold text-[#475569]">Відкрити маркери й пріоритети</p>
            </div>
          </div>

          {uploads.map((item, index) => {
            const counts = markerCounts(item)
            const uploadId = itemId(item)
            return (
              <button key={uploadId || `${itemDate(item)}-${index}`} onClick={() => uploadId && navigate(`/results/${uploadId}`)} className="rounded-[26px] bg-white/82 p-5 text-left ring-1 ring-[#e8dfd2] transition hover:-translate-y-0.5 hover:shadow-[0_18px_45px_rgba(15,118,110,0.10)] disabled:cursor-not-allowed disabled:opacity-60" disabled={!uploadId}>
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="min-w-0">
                    <p className="truncate text-lg font-black">{item.lab_name || `Лабораторний результат #${uploads.length - index}`}</p>
                    <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-[#64748b]">
                      <Calendar className="h-4 w-4" />
                      {itemDate(item)}
                      <span className="rounded-full bg-[#f8f5f0] px-2 py-1 text-xs font-black text-[#64748b] ring-1 ring-[#e8dfd2]">{item.status || 'оброблено'}</span>
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs font-black">
                    {counts.total > 0 ? (
                      <>
                        <span className="rounded-full bg-[#f1fbf8] px-3 py-2 text-[#0f766e] ring-1 ring-[#b7d8d2]">У межах {counts.optimal}</span>
                        <span className="rounded-full bg-[#fff8e7] px-3 py-2 text-[#9a6a1d] ring-1 ring-[#ead7ab]">Переглянути {counts.review}</span>
                        <span className="rounded-full bg-[#fff1f2] px-3 py-2 text-[#be123c] ring-1 ring-[#fecdd3]">Увага {counts.attention}</span>
                      </>
                    ) : (
                      <span className="rounded-full bg-[#f8f5f0] px-3 py-2 text-[#64748b] ring-1 ring-[#e8dfd2]">Маркери відкриються у підсумку</span>
                    )}
                    <ArrowRight className="h-5 w-5 text-[#0f766e]" />
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
