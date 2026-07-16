import { Routes, Route } from 'react-router-dom'
import { tenantRoutes } from './routes'
import TenantLayout from './components/TenantLayout'
import TenantAuth from './pages/TenantAuth'

export default function TenantModule() {
  return (
    <Routes>
      <Route path="login" element={<TenantAuth title="Welcome back" subtitle="Sign in to continue your search" cta="Sign in" />} />
      <Route path="signup" element={<TenantAuth title="Create account" subtitle="Join thousands of tenants" cta="Create account" />} />
      <Route path="forgot-password" element={<TenantAuth title="Reset password" subtitle="We will help you recover access" cta="Send reset link" />} />
      
      <Route element={<TenantLayout />}>
        {tenantRoutes.filter(r => !['login', 'signup', 'forgot-password'].includes(r.path)).map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
      </Route>
    </Routes>
  )
}
