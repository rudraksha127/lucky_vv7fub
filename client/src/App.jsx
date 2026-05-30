import { Routes, Route } from 'react-router-dom'
import AppLayout from './components/shared/AppLayout'
import LandingPage from './pages/LandingPage'
import DashboardPage from './pages/DashboardPage'
import ProblemsPage from './pages/ProblemsPage'
import ProblemSolvePage from './pages/ProblemSolvePage'
import AdminPanelPage from './pages/AdminPanelPage'
import ProfilePage from './pages/ProfilePage'
import ContestsPage from './pages/ContestsPage'
import BattlePage from './pages/BattlePage'
import ClassroomJoinPage from './pages/ClassroomJoinPage'
import ProfessorDashboardPage from './pages/ProfessorDashboardPage'
import ContestLivePage from './pages/ContestLivePage'
import NotFoundPage from './pages/NotFoundPage'
import SignInPage from './pages/SignInPage'
import SignUpPage from './pages/SignUpPage'
import { useEffect } from 'react'
import { MotionConfig } from 'framer-motion'
import useSettingsStore from './stores/useSettingsStore'
import ErrorBoundary from './components/shared/ErrorBoundary'
import VisualizerTestPage from './pages/VisualizerTestPage'
import AIChatPage from './pages/AIChatPage'
import SettingsPage from './pages/SettingsPage'
import CommunityProblemsPage from './pages/CommunityProblemsPage'
import CommunitySubmitPage from './pages/CommunitySubmitPage'
import CommunityModerationPage from './pages/CommunityModerationPage'
import CommunityActivityPage from './pages/CommunityActivityPage'
import CertificatesPage from './pages/CertificatesPage'
import CertificateSharePage from './pages/CertificateSharePage'

function ReducedMotionSync() {
  const reducedMotion = useSettingsStore((s) => s.reducedMotion)

  useEffect(() => {
    if (reducedMotion) {
      document.documentElement.classList.add('reduced-motion')
    } else {
      document.documentElement.classList.remove('reduced-motion')
    }
  }, [reducedMotion])

  return null
}

export default function App() {
  const reducedMotion = useSettingsStore((s) => s.reducedMotion)

  return (
    <ErrorBoundary>
      <ReducedMotionSync />
      <MotionConfig reducedMotion={reducedMotion ? 'always' : 'never'}>
      <Routes>
        {/* Standalone pages (no shared layout) */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/sign-in" element={<SignInPage />} />
        <Route path="/sign-up" element={<SignUpPage />} />

        {/* Full-screen code editor (has its own header) */}
        <Route path="/problems/:slug" element={<ProblemSolvePage />} />
        <Route path="/problems/:slug/solve" element={<ProblemSolvePage />} />

        {/* Standalone visualizer test page (no auth needed) */}
        <Route path="/visualizer-test" element={<VisualizerTestPage />} />

        {/* Standalone AlgoGuru AI Chat (no sidebar) */}
        <Route path="/ai-chat" element={<AIChatPage />} />
        <Route path="/ai/chat" element={<AIChatPage />} />

        {/* Public certificate share page */}
        <Route path="/certificates/share/:shareToken" element={<CertificateSharePage />} />

        {/* App layout with sidebar */}
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/problems" element={<ProblemsPage />} />
          <Route path="/community" element={<CommunityProblemsPage />} />
          <Route path="/community/submit" element={<CommunitySubmitPage />} />
          <Route path="/community/moderation" element={<CommunityModerationPage />} />
          <Route path="/community/activity" element={<CommunityActivityPage />} />
          <Route path="/certificates" element={<CertificatesPage />} />
          <Route path="/contests" element={<ContestsPage />} />
          <Route path="/contests/:contestId" element={<ContestLivePage />} />
          <Route path="/battle" element={<BattlePage />} />
          <Route path="/classroom/join" element={<ClassroomJoinPage />} />
          <Route path="/classroom/manage" element={<ProfessorDashboardPage />} />
          <Route path="/professor" element={<ProfessorDashboardPage />} />
          <Route path="/admin" element={<AdminPanelPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
      </MotionConfig>
    </ErrorBoundary>
  )
}
