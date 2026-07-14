import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function RoleGuard({ allowedRoles = [], children, redirectTo = '/login' }) {
  const { user, profile, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-homie-blue">Loading your workspace...</div>
  }

  if (!user) {
    return <Navigate to={redirectTo} replace state={{ from: location }} />
  }

  const userRole = profile?.role || 'tenant'
  if (allowedRoles.length && !allowedRoles.includes(userRole)) {
    return <Navigate to={redirectTo} replace />
  }

  return children
}
