import { Routes, Route, Navigate } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import { ProtectedRoute } from './ProtectedRoute'

// Lazy load pages
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'))
const RegisterPage = lazy(() => import('@/pages/auth/RegisterPage'))
const GoogleCallback = lazy(() => import('@/pages/auth/GoogleCallback'))
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
        <Route path='/login' element={<LoginPage />} />
        <Route path='/register' element={<RegisterPage />} />

        {/* Google OAuth Callback */}
        <Route path='/auth/google/callback' element={<GoogleCallback />} />
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
            <ProtectedRoute allowedRoles={['EMPLOYER']}>
              <EmployerDashboard />
            </ProtectedRoute>
          }
        />

        {/* Default */}
        <Route path='/' element={<Navigate to='/login' replace />} />
        <Route path='*' element={<Navigate to='/login' replace />} />
      </Routes>
    </Suspense>
  )
}
