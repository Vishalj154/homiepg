import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import BuildingDetail from './pages/BuildingDetail'
import Buildings from './pages/Buildings'
import Tenants from './pages/Tenants'
import TenantDetail from './pages/TenantDetail'
import Expenses from './pages/Expenses'


function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="min-h-screen flex items-center justify-center text-homie-blue">Loading...</div>
  return user ? children : <Navigate to="/login" />
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="*" element={<Navigate to="/login" />} />

      <Route path="/buildings" element={
        <ProtectedRoute>
          <Buildings />
        </ProtectedRoute>
      } />

      <Route path="/buildings/:id" element={
        <ProtectedRoute>
          <BuildingDetail />
        </ProtectedRoute>
      } />

      <Route path="/tenants" element={
        <ProtectedRoute><Tenants /></ProtectedRoute>
      } />
      <Route path="/tenants/:id" element={
        <ProtectedRoute><TenantDetail /></ProtectedRoute>
      } />

      <Route path="/expenses" element={<ProtectedRoute><Expenses /></ProtectedRoute>} />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  )
}