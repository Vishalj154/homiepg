import { Navigate } from 'react-router-dom'
import TenantHome from './pages/TenantHome'
import SearchPage from './pages/SearchPage'
import PgDetails from './pages/PgDetails'
import BedSelection from './pages/BedSelection'
import BookingPage from './pages/BookingPage'
import PlaceholderPage from './pages/PlaceholderPage'
import TenantAuth from './pages/TenantAuth'

export const tenantRoutes = [
  { path: '', element: <TenantHome /> },
  { path: 'search', element: <SearchPage /> },
  { path: 'pg-details/:id', element: <PgDetails /> },
  { path: 'bed-selection', element: <BedSelection /> },
  { path: 'booking', element: <BookingPage /> },
  { path: 'bookings', element: <PlaceholderPage title="Bookings" subtitle="Your reservation history" description="Track confirmed, pending, and completed stays in one place." /> },
  { path: 'saved', element: <PlaceholderPage title="Saved PGs" subtitle="Saved properties" description="CollectPGs you love and compare them later." /> },
  { path: 'payments', element: <PlaceholderPage title="My Payments" subtitle="Payment history" description="Review invoices, deposits, and rent transactions." /> },
  { path: 'notifications', element: <PlaceholderPage title="Notifications" subtitle="Stay informed" description="Receive reminders, booking updates, and owner messages here." /> },
  { path: 'profile', element: <PlaceholderPage title="Profile" subtitle="Personal profile" description="Manage your details, documents, and preferences." /> },
  { path: 'settings', element: <PlaceholderPage title="Settings" subtitle="Preferences" description="Adjust theme, language, privacy, and alert preferences." /> },
  { path: 'support', element: <PlaceholderPage title="Support" subtitle="Help center" description="Get support from the HomiePG team." /> },
  { path: 'about', element: <PlaceholderPage title="About" subtitle="About HomiePG" description="Learn more about our platform and values." /> },
  { path: 'login', element: <TenantAuth title="Welcome back" subtitle="Sign in to continue your search" cta="Sign in" /> },
  { path: 'signup', element: <TenantAuth title="Create account" subtitle="Join thousands of tenants" cta="Create account" /> },
  { path: 'forgot-password', element: <TenantAuth title="Reset password" subtitle="We will help you recover access" cta="Send reset link" /> },
  { path: '*', element: <Navigate to="/tenant" replace /> },
]
