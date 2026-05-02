import { Routes, Route, Navigate } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import { ProtectedRoute } from './ProtectedRoute'
import MainLayout from '@/components/layout/MainLayout'
import ChatPage from '@/pages/chat/ChatPage'
import CompanyListPage from '@/pages/company/CompanyListPage'
import CompanyDetailPage from '@/pages/company/CompanyDetailPage'
import BrowseJobsPage from '@/pages/BrowseJobsPage'
import HomePage from '@/pages/HomePage'
import JobDetailPage from '@/pages/JobDetailPage'
import ChatbotPage from '@/pages/chatbot/ChatbotPage'
import CategoriesPage from '@/pages/CategoriesPage'
import EmployerOverviewPage from '@/pages/employer/OverviewPage'
import EmployerJobsPage from '@/pages/employer/JobsPage'
import EmployerCandidatesPage from '@/pages/employer/CandidatesPage'
import EmployerInterviewsPage from '@/pages/employer/InterviewsPage'
import CreateJobPage from '@/pages/employer/CreateJobPage'
import CreateInterviewPage from '@/pages/employer/CreateInterviewPage'
import ResourcesPage from '@/pages/ResourcesPage'

// Lazy load pages
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'))
const RegisterPage = lazy(() => import('@/pages/auth/RegisterPage'))
const ForgotPasswordPage = lazy(() => import('@/pages/auth/ForgotPasswordPage'))
const ResetPasswordPage = lazy(() => import('@/pages/auth/ResetPasswordPage'))
const GoogleCallback = lazy(() => import('@/pages/auth/GoogleCallback'))
const SocialCallback = lazy(() => import('@/pages/auth/SocialCallback'))
const RegisterEmployerPage = lazy(() => import('@/pages/employer/RegisterEmployerPage'))
const SeekerDashboard = lazy(() => import('@/pages/seeker/Dashboard'))
const EmployerDashboard = lazy(() => import('@/pages/employer/Dashboard'))
const AdminDashboard = lazy(() => import('@/pages/admin/Dashboard'))

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
        <Route element={<MainLayout></MainLayout>}>
          <Route path='/' element={<HomePage />} />
          <Route path='/jobs' element={<BrowseJobsPage />} />
          <Route path='/categories' element={<CategoriesPage />} />
          <Route path='/resources' element={<ResourcesPage />} />
          <Route path='/jobs/:id' element={<JobDetailPage />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/register' element={<RegisterPage />} />
          <Route path='//register/employer' element={<RegisterEmployerPage></RegisterEmployerPage>}></Route>
          <Route path='/register/employer' element={<RegisterEmployerPage />} />
          <Route path='/forgot-password' element={<ForgotPasswordPage />} />
          <Route path='/auth/forgot-password' element={<ForgotPasswordPage />} />
          <Route path='/reset-password' element={<ResetPasswordPage />} />
          <Route path='/reset-password/:token' element={<ResetPasswordPage />} />
          <Route path='/auth/reset-password' element={<ResetPasswordPage />} />
          <Route path='/auth/reset-password/:token' element={<ResetPasswordPage />} />
          <Route path='/companies' element={<CompanyListPage />} />
          <Route path='/companies/:id' element={<CompanyDetailPage />} />
          <Route path='/chat' element={<ChatPage></ChatPage>}></Route>

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
            path='/employer'
            element={
              <ProtectedRoute allowedRoles={['EMPLOYEE']}>
                <EmployerDashboard />
              </ProtectedRoute>
            }
          >
            <Route index element={<EmployerOverviewPage />} />
            <Route path='jobs' element={<EmployerJobsPage />} />
            <Route path='jobs/create' element={<CreateJobPage />} />
            <Route path='candidates' element={<EmployerCandidatesPage />} />
            <Route path='interviews' element={<EmployerInterviewsPage />} />
            <Route path='interviews/create' element={<CreateInterviewPage />} />
          </Route>
        </Route>

        {/* Admin Routes - outside MainLayout */}
        <Route
          path='/admin'
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <Navigate to='/admin/dashboard' replace />
            </ProtectedRoute>
          }
        />
        <Route
          path='/admin/dashboard'
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path='/admin/users'
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path='/admin/companies'
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path='/admin/reports'
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path='/admin/settings'
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Chat Full Page - outside MainLayout */}
        <Route path='/chatbot' element={<ChatbotPage />} />

        {/* Google OAuth Callback */}
        <Route path='/auth/google/callback' element={<GoogleCallback />} />
        <Route path='/auth/:provider/callback' element={<SocialCallback />} />

        <Route path='*' element={<Navigate to='/login' replace />} />
      </Routes>
    </Suspense>
  )
}
