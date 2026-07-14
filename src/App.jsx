import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import Home from './pages/Home'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import BuildingDetail from './pages/BuildingDetail'
import Buildings from './pages/Buildings'
import Tenants from './pages/Tenants'
import TenantDetail from './pages/TenantDetail'
import Expenses from './pages/Expenses'
import Profile from './pages/Profile'
import Staff from './pages/Staff'
import Complaints from './pages/Complaints'
import TenantModule from './modules/tenant/TenantModule'
import AdminModule from './modules/admin/AdminModule'
import OwnerModule from './modules/owner/OwnerModule'
import RoleGuard from './components/RoleGuard'
import { getRoleRedirectPath } from './services/auth.service'
import AboutPage from './pages/AboutPage'
import ServicesPage from './pages/ServicesPage'
import ContactPage from './pages/ContactPage'

function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user, profile, loading } = useAuth()
  if (loading) return <div className="min-h-screen flex items-center justify-center text-homie-blue">Loading...</div>
  if (!user) return <Navigate to="/login" />
  const userRole = profile?.role || 'tenant'
  if (allowedRoles.length && !allowedRoles.includes(userRole)) {
    return <Navigate to={getRoleRedirectPath(userRole)} replace />
  }
  return children
}

function AppRoutes() {
  const { user, profile } = useAuth()
  const role = profile?.role || 'tenant'

  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to={getRoleRedirectPath(role)} replace /> : <Home />} />
      <Route path="/login" element={user ? <Navigate to={getRoleRedirectPath(role)} replace /> : <Login />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/services" element={<ServicesPage />} />
      <Route path="/contact" element={<ContactPage />} />

      <Route path="/dashboard" element={<ProtectedRoute allowedRoles={['owner']}><Dashboard /></ProtectedRoute>} />
      <Route path="/owner/*" element={<RoleGuard allowedRoles={['owner']} redirectTo={getRoleRedirectPath(role)}><OwnerModule /></RoleGuard>} />
      <Route path="/tenant/*" element={<RoleGuard allowedRoles={['tenant']} redirectTo={getRoleRedirectPath(role)}><TenantModule /></RoleGuard>} />
      <Route path="/admin/*" element={<RoleGuard allowedRoles={['super_admin']} redirectTo={getRoleRedirectPath(role)}><AdminModule /></RoleGuard>} />
      <Route path="/buildings" element={<ProtectedRoute allowedRoles={['owner']}><Buildings /></ProtectedRoute>} />
      <Route path="/buildings/:id" element={<ProtectedRoute allowedRoles={['owner']}><BuildingDetail /></ProtectedRoute>} />
      <Route path="/tenants" element={<ProtectedRoute allowedRoles={['owner']}><Tenants /></ProtectedRoute>} />
      <Route path="/tenants/:id" element={<ProtectedRoute allowedRoles={['owner']}><TenantDetail /></ProtectedRoute>} />
      <Route path="/expenses" element={<ProtectedRoute allowedRoles={['owner']}><Expenses /></ProtectedRoute>} />
      <Route path="/staff" element={<ProtectedRoute allowedRoles={['owner']}><Staff /></ProtectedRoute>} />
      <Route path="/complaints" element={<ProtectedRoute allowedRoles={['owner']}><Complaints /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute allowedRoles={['owner']}><Profile /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to={user ? getRoleRedirectPath(role) : '/'} replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}