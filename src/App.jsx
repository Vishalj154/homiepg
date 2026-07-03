import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Home from './pages/Home'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import BuildingDetail from './pages/BuildingDetail'
import Buildings from './pages/Buildings'
import Tenants from './pages/Tenants'
import TenantDetail from './pages/TenantDetail'
import Expenses from './pages/Expenses'
import Profile from './pages/Profile'


function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="min-h-screen flex items-center justify-center text-homie-blue">Loading...</div>
  return user ? children : <Navigate to="/login" />
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />

      {/* Protected routes */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />

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

      <Route path="/profile" element={
        <ProtectedRoute><Profile /></ProtectedRoute>
      } />

      {/* Catch-all → landing page */}
      <Route path="*" element={<Navigate to="/" />} />
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