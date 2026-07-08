import { Routes, Route, Navigate } from 'react-router-dom'
import Dashboard from '../../pages/Dashboard'
import BuildingDetail from '../../pages/BuildingDetail'
import Buildings from '../../pages/Buildings'
import Tenants from '../../pages/Tenants'
import TenantDetail from '../../pages/TenantDetail'
import Expenses from '../../pages/Expenses'
import Profile from '../../pages/Profile'
import Staff from '../../pages/Staff'
import Complaints from '../../pages/Complaints'
import Login from '../../pages/Login'

export default function OwnerModule() {
  return (
    <Routes>
      <Route path="" element={<Dashboard />} />
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="buildings" element={<Buildings />} />
      <Route path="buildings/:id" element={<BuildingDetail />} />
      <Route path="tenants" element={<Tenants />} />
      <Route path="tenants/:id" element={<TenantDetail />} />
      <Route path="expenses" element={<Expenses />} />
      <Route path="staff" element={<Staff />} />
      <Route path="complaints" element={<Complaints />} />
      <Route path="profile" element={<Profile />} />
      <Route path="login" element={<Login />} />
      <Route path="*" element={<Navigate to="/owner" replace />} />
    </Routes>
  )
}
