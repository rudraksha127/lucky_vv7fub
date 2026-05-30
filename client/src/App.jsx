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
import ErrorBoundary from './components/shared/ErrorBoundary'

export default function App() {
  return (
    <ErrorBoundary>
      <Routes>
        {/* Standalone pages (no shared layout) */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/sign-in" element={<SignInPage />} />
        <Route path="/sign-up" element={<SignUpPage />} />

        {/* Full-screen code editor (has its own header) */}
        <Route path="/problems/:slug" element={<ProblemSolvePage />} />
        <Route path="/problems/:slug/solve" element={<ProblemSolvePage />} />

        {/* App layout with sidebar */}
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/problems" element={<ProblemsPage />} />
          <Route path="/contests" element={<ContestsPage />} />
          <Route path="/contests/:contestId" element={<ContestLivePage />} />
          <Route path="/battle" element={<BattlePage />} />
          <Route path="/classroom/join" element={<ClassroomJoinPage />} />
          <Route path="/classroom/manage" element={<ProfessorDashboardPage />} />
          <Route path="/professor" element={<ProfessorDashboardPage />} />
          <Route path="/admin" element={<AdminPanelPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </ErrorBoundary>
  )
}
