import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import TenantSidebar from './TenantSidebar'
import TenantTopNavbar from './TenantTopNavbar'

export default function TenantLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 text-slate-300">
      <TenantSidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      
      <div className="flex flex-1 flex-col overflow-hidden">
        <TenantTopNavbar setMobileOpen={setMobileOpen} />
        <main className="flex-1 overflow-y-auto bg-slate-950">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
