import { Routes, Route } from 'react-router-dom'
import { adminRoutes } from './routes'

export default function AdminModule() {
  return (
    <Routes>
      {adminRoutes.map((route) => (
        <Route key={route.path} path={route.path} element={route.element} />
      ))}
    </Routes>
  )
}
