import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import ModuleShell from '../../shared/components/ModuleShell'
import SectionCard from '../../shared/components/SectionCard'
import { getPublicPGById } from '../services/pgService'

const navItems = [
  { label: 'Home', to: '/tenant', icon: '🏠' },
  { label: 'Search PG', to: '/tenant/search', icon: '🔎' },
  { label: 'Bookings', to: '/tenant/bookings', icon: '📅' },
  { label: 'Saved PGs', to: '/tenant/saved', icon: '💛' },
  { label: 'Payments', to: '/tenant/payments', icon: '💳' },
  { label: 'Notifications', to: '/tenant/notifications', icon: '🔔' },
  { label: 'Profile', to: '/tenant/profile', icon: '👤' },
  { label: 'Settings', to: '/tenant/settings', icon: '⚙️' },
  { label: 'Support', to: '/tenant/support', icon: '🆘' },
  { label: 'About', to: '/tenant/about', icon: 'ℹ️' },
]

export default function PgDetails() {
  const { id } = useParams()
  const [pg, setPg] = useState(null)

  useEffect(() => {
    if (!id) return
    getPublicPGById(id).then(setPg).catch(() => setPg(null))
  }, [id])

  if (!pg) {
    return (
      <ModuleShell title="Tenant Module" subtitle="PG Details" navItems={navItems} accent="from-violet-500 to-cyan-600">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-slate-600 dark:border-slate-800 dark:bg-slate-900">Loading PG details...</div>
      </ModuleShell>
    )
  }

  return (
    <ModuleShell title="Tenant Module" subtitle="PG Details" navItems={navItems} accent="from-violet-500 to-cyan-600">
      <div className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <img src={pg.image} alt={pg.name} className="h-72 w-full object-cover" />
            <div className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-semibold">{pg.name}</h2>
                  <p className="text-slate-500">{pg.area}, {pg.city}</p>
                </div>
                <span className="rounded-full bg-amber-100 px-3 py-1 text-sm text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">★ {pg.rating}</span>
              </div>
              <p className="mt-4 text-slate-600 dark:text-slate-300">{pg.description}</p>
            </div>
          </div>

          <SectionCard title="Quick facts" subtitle="Stay overview">
            <div className="space-y-3">
              {[`Rent: ${pg.rent}`, `Food: ${pg.food}`, `Timing: ${pg.waterSupply}`, `Security: ${pg.security ? 'Available' : 'Standard'}`, `Parking: ${pg.parking ? 'Available' : 'Not available'}`].map((item) => (
                <div key={item} className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm dark:border-slate-800 dark:bg-slate-800/60">{item}</div>
              ))}
            </div>
          </SectionCard>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <SectionCard title="Amenities" subtitle="Everything you need for a comfortable stay">
            <div className="flex flex-wrap gap-2">
              {pg.amenities.map((item) => (
                <span key={item} className="rounded-full bg-cyan-50 px-3 py-2 text-sm font-medium text-cyan-700 dark:bg-cyan-950/40 dark:text-cyan-300">{item}</span>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Available beds" subtitle="Reserve your preferred bed">
            <div className="flex gap-3">
              {Array.from({ length: Math.min(pg.vacantBeds, 4) }).map((_, index) => (
                <button key={index} className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800" onClick={() => window.location.assign(`/tenant/bed-selection/${id}`)}>Bed {index + 1}</button>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>
    </ModuleShell>
  )
}
