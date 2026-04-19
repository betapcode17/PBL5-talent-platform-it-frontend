import { Routes, Route, Navigate } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import { ProtectedRoute } from './ProtectedRoute'
import MainLayout from '@/components/layout/MainLayout'
import BrowseJobsPage from '@/pages/BrowseJobsPage'
import HomePage from '@/pages/HomePage'
import JobDetailPage from '@/pages/JobDetailPage'
import ChatbotPage from '@/pages/chatbot/ChatbotPage'
import ChatPage from '@/pages/chat/ChatPage'

// Lazy load pages
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'))
const RegisterPage = lazy(() => import('@/pages/auth/RegisterPage'))
const ForgotPasswordPage = lazy(() => import('@/pages/auth/ForgotPasswordPage'))
const ResetPasswordPage = lazy(() => import('@/pages/auth/ResetPasswordPage'))
const GoogleCallback = lazy(() => import('@/pages/auth/GoogleCallback'))
const SocialCallback = lazy(() => import('@/pages/auth/SocialCallback'))
const SeekerDashboard = lazy(() => import('@/pages/seeker/Dashboard'))
const EmployerDashboard = lazy(() => import('@/pages/employer/Dashboard'))

// Loading component
const PageLoader = () => (
  <div className='flex min-h-screen items-center justify-center'>
    <div className='h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent' />
  </div>
)

export function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public Routes */}
        <Route path='/' element={<HomePage />} />
        <Route path='/jobs' element={<BrowseJobsPage />} />
        <Route path='/jobs/:id' element={<JobDetailPage />} />
        <Route element={<MainLayout></MainLayout>}>
          <Route path='/login' element={<LoginPage />} />
          <Route path='/register' element={<RegisterPage />} />
          <Route path='/forgot-password' element={<ForgotPasswordPage />} />
          <Route path='/auth/forgot-password' element={<ForgotPasswordPage />} />
          <Route path='/reset-password' element={<ResetPasswordPage />} />
          <Route path='/reset-password/:token' element={<ResetPasswordPage />} />
          <Route path='/auth/reset-password' element={<ResetPasswordPage />} />
          <Route path='/auth/reset-password/:token' element={<ResetPasswordPage />} />
          <Route path='/chat' element={<ChatPage></ChatPage>}></Route>
        </Route>

        {/* Chat Full Page - outside MainLayout */}
        <Route path='/chatbot' element={<ChatbotPage />} />

        {/* Google OAuth Callback */}
        <Route path='/auth/google/callback' element={<GoogleCallback />} />
        <Route path='/auth/:provider/callback' element={<SocialCallback />} />
        {/* Candidate/Seeker Routes */}
        <Route
          path='/seeker/*'
          element={
            <ProtectedRoute allowedRoles={['SEEKER']}>
              <SeekerDashboard />
            </ProtectedRoute>
          }
        />

        {/* Employer Routes */}
        <Route
          path='/employer/*'
          element={
            <ProtectedRoute allowedRoles={['EMPLOYEE']}>
              <EmployerDashboard />
            </ProtectedRoute>
          }
        />

        <Route path='*' element={<Navigate to='/login' replace />} />
      </Routes>
    </Suspense>
  )
}
