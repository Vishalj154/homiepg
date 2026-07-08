import { Routes, Route } from 'react-router-dom'
import { tenantRoutes } from './routes'

export default function TenantModule() {
  return (
    <Routes>
      {tenantRoutes.map((route) => (
        <Route key={route.path} path={route.path} element={route.element} />
      ))}
    </Routes>
  )
}
