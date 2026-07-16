import { Navigate } from 'react-router-dom'
import TenantHome from './pages/TenantHome'
import SearchPage from './pages/SearchPage'
import PgDetails from './pages/PgDetails'
import BedSelection from './pages/BedSelection'
import BookingPage from './pages/BookingPage'
import PlaceholderPage from './pages/PlaceholderPage'
import TenantAuth from './pages/TenantAuth'

import TenantProfile from './pages/TenantProfile'
import TenantBookings from './pages/TenantBookings'
import TenantSaved from './pages/TenantSaved'
import TenantPayments from './pages/TenantPayments'
import TenantNotifications from './pages/TenantNotifications'
import TenantSettings from './pages/TenantSettings'

export const tenantRoutes = [
  { path: '', element: <TenantHome /> },
  { path: 'home', element: <TenantHome /> },
  { path: 'search', element: <SearchPage /> },
  { path: 'pg-details/:id', element: <PgDetails /> },
  { path: 'bed-selection', element: <BedSelection /> },
  { path: 'booking', element: <BookingPage /> },
  { path: 'bookings', element: <TenantBookings /> },
  { path: 'saved', element: <TenantSaved /> },
  { path: 'payments', element: <TenantPayments /> },
  { path: 'notifications', element: <TenantNotifications /> },
  { path: 'profile', element: <TenantProfile /> },
  { path: 'settings', element: <TenantSettings /> },
  { path: 'support', element: <PlaceholderPage title="Support" subtitle="Help center" description="Get support from the HomiePG team." /> },
  { path: 'about', element: <PlaceholderPage title="About" subtitle="About HomiePG" description="Learn more about our platform and values." /> },
  { path: 'logout', element: <Navigate to="/" replace /> },
  { path: 'login', element: <TenantAuth title="Welcome back" subtitle="Sign in to continue your search" cta="Sign in" /> },
  { path: 'signup', element: <TenantAuth title="Create account" subtitle="Join thousands of tenants" cta="Create account" /> },
  { path: 'forgot-password', element: <TenantAuth title="Reset password" subtitle="We will help you recover access" cta="Send reset link" /> },
  { path: '*', element: <Navigate to="/tenant" replace /> },
]
