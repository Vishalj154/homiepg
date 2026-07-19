import { Navigate } from 'react-router-dom'
import AdminHome from './pages/AdminHome'
import AdminPlaceholder from './pages/AdminPlaceholder'
import AdminLogin from './pages/AdminLogin'
import AdminOwners from './pages/AdminOwners'
import AdminTenants from './pages/AdminTenants'
import AdminBuildings from './pages/AdminBuildings'
import AdminBookings from './pages/AdminBookings'

export const adminRoutes = [
  { path: '', element: <AdminHome /> },
  { path: 'dashboard', element: <AdminHome /> },
  { path: 'owners', element: <AdminOwners /> },
  { path: 'tenants', element: <AdminTenants /> },
  { path: 'buildings', element: <AdminBuildings /> },
  { path: 'rooms', element: <AdminPlaceholder title="Rooms" subtitle="Room inventory" description="View room wise occupancy and bed availability." /> },
  { path: 'beds', element: <AdminPlaceholder title="Beds" subtitle="Bed management" description="Monitor bed status across all buildings and rooms." /> },
  { path: 'bookings', element: <AdminBookings /> },
  { path: 'occupancy', element: <AdminPlaceholder title="Occupancy" subtitle="Occupancy insights" description="Compare occupancy and utilization across regions." /> },
  { path: 'revenue', element: <AdminPlaceholder title="Revenue" subtitle="Revenue reports" description="Monitor bookings, commissions, and platform earnings." /> },
  { path: 'subscriptions', element: <AdminPlaceholder title="Subscriptions" subtitle="Plans and usage" description="View free, starter, pro, and enterprise tiers." /> },
  { path: 'payments', element: <AdminPlaceholder title="Payments" subtitle="Payment history" description="Track all rent, deposit, and commission transactions." /> },
  { path: 'kyc', element: <AdminPlaceholder title="KYC" subtitle="Verification queue" description="Review owner and tenant documents before approval." /> },
  { path: 'support', element: <AdminPlaceholder title="Support" subtitle="Support tickets" description="Handle high-priority platform and property issues." /> },
  { path: 'reports', element: <AdminPlaceholder title="Reports" subtitle="Analytics and exports" description="Analyze revenue, occupancy, and growth metrics." /> },
  { path: 'notifications', element: <AdminPlaceholder title="Notifications" subtitle="Platform alerts" description="Send announcements and alerts to tenants and owners." /> },
  { path: 'settings', element: <AdminPlaceholder title="Settings" subtitle="Platform settings" description="Adjust global preferences and workflow controls." /> },
  { path: 'profile', element: <AdminPlaceholder title="Profile" subtitle="Admin profile" description="Manage your account and team access." /> },
  { path: 'logout', element: <Navigate to="/" replace /> },
  { path: 'login', element: <AdminLogin /> },
  { path: 'forgot-password', element: <AdminLogin /> },
  { path: '*', element: <Navigate to="/admin" replace /> },
]
