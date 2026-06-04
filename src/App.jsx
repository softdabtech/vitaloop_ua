import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import UaLanding from './pages/UaLanding.jsx'
import UaPage from './pages/UaPage.jsx'
import Login from './pages/Login.jsx'
import UaCabinetLayout from './components/ua/UaCabinetLayout.jsx'
import UaDashboard from './pages/ua-cabinet/UaDashboard.jsx'
import UaUpload from './pages/ua-cabinet/UaUpload.jsx'
import UaLabResults from './pages/ua-cabinet/UaLabResults.jsx'
import UaResults from './pages/ua-cabinet/UaResults.jsx'
import UaQuestionnaire from './pages/ua-cabinet/UaQuestionnaire.jsx'
import { UaSettings, UaSubscription } from './pages/ua-cabinet/UaSimplePage.jsx'
import { useAuth } from './hooks/useAuth.js'

function LoadingScreen() {
  return (
    <div className="grid min-h-[100svh] place-items-center bg-[#f8f5f0] text-[#0f172a]">
      <div className="text-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#d4b483] border-t-[#0f766e]" />
        <p className="mt-4 text-sm font-black text-[#64748b]">Завантажуємо Vitaloop...</p>
      </div>
    </div>
  )
}

function ScrollToTop() {
  const location = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])
  return null
}

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <LoadingScreen />
  if (!user) return <Navigate to="/login" replace />
  return children
}

function CabinetRoute({ children }) {
  return (
    <ProtectedRoute>
      <UaCabinetLayout>{children}</UaCabinetLayout>
    </ProtectedRoute>
  )
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<UaLanding />} />
        <Route path="/samopochuttia" element={<UaPage pageSlug="samopochuttia" />} />
        <Route path="/symptomy" element={<UaPage pageSlug="symptomy" />} />
        <Route path="/analizy" element={<UaPage pageSlug="analizy" />} />
        <Route path="/laboratorii" element={<UaPage pageSlug="laboratorii" />} />
        <Route path="/tarify" element={<UaPage pageSlug="tarify" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/auth/confirmation" element={<Login pendingConfirmation />} />
        <Route path="/dashboard" element={<CabinetRoute><UaDashboard /></CabinetRoute>} />
        <Route path="/onboarding" element={<Navigate to="/dashboard" replace />} />
        <Route path="/questionnaire" element={<CabinetRoute><UaQuestionnaire /></CabinetRoute>} />
        <Route path="/upload" element={<CabinetRoute><UaUpload /></CabinetRoute>} />
        <Route path="/lab-results" element={<CabinetRoute><UaLabResults /></CabinetRoute>} />
        <Route path="/results/:uploadId" element={<CabinetRoute><UaResults /></CabinetRoute>} />
        <Route path="/subscription" element={<CabinetRoute><UaSubscription /></CabinetRoute>} />
        <Route path="/settings" element={<CabinetRoute><UaSettings /></CabinetRoute>} />
        <Route path="/protocol/:uploadId" element={<Navigate to="/lab-results" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}
