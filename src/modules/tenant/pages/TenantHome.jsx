import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ModuleShell from '../../shared/components/ModuleShell'
import SectionCard from '../../shared/components/SectionCard'
import { getPublicPGs } from '../services/pgService'

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

function PGCard({ pg }) {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900">
      <img src={pg.image} alt={pg.name} className="h-40 w-full object-cover" />
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <h4 className="font-semibold">{pg.name}</h4>
            <p className="text-sm text-slate-500">{pg.area}, {pg.city}</p>
          </div>
          <span className="rounded-full bg-amber-100 px-2.5 py-1 text-sm text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">★ {pg.rating}</span>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {pg.amenities.map((item) => (
            <span key={item} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300">{item}</span>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div>
            <p className="text-lg font-semibold text-cyan-600">{pg.rent}/month</p>
            <p className="text-sm text-slate-500">{pg.beds} vacant beds</p>
          </div>
          <Link to={`/tenant/pg-details/${pg.id}`} className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white dark:bg-cyan-600">View</Link>
        </div>
      </div>
    </div>
  )
}

export default function TenantHome() {
  const [pgs, setPgs] = useState([])

  useEffect(() => {
    getPublicPGs().then(setPgs).catch(() => setPgs([]))
  }, [])

  const featuredPgs = pgs.slice(0, 2)
  const nearbyPgs = pgs.slice(2, 5)

  return (
    <ModuleShell title="Tenant Module" subtitle="Find your perfect stay" navItems={navItems} accent="from-violet-500 to-cyan-600">
      <div className="space-y-6">
        <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-gradient-to-br from-violet-600 via-cyan-600 to-sky-700 p-8 text-white shadow-xl">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-white/80">Premium PG discovery</p>
              <h2 className="mt-3 text-4xl font-semibold">Book a comfortable stay with confidence.</h2>
              <p className="mt-4 max-w-xl text-white/90">Explore curated PGs, compare amenities, and reserve your bed in minutes.</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link to="/tenant/search" className="rounded-full bg-white px-5 py-3 font-semibold text-slate-900">Explore PGs</Link>
                <Link to="/tenant/bookings" className="rounded-full border border-white/50 px-5 py-3 font-semibold text-white">My bookings</Link>
              </div>
            </div>
            <div className="rounded-3xl bg-white/15 p-4 backdrop-blur">
              <div className="rounded-2xl bg-white/20 p-4">
                <p className="text-sm font-semibold uppercase tracking-[0.25em]">Search</p>
                <div className="mt-4 space-y-3">
                  <input className="w-full rounded-xl border border-white/20 bg-white/90 px-4 py-3 text-slate-800 outline-none" placeholder="City or locality" />
                  <input className="w-full rounded-xl border border-white/20 bg-white/90 px-4 py-3 text-slate-800 outline-none" placeholder="Budget" />
                  <button className="w-full rounded-xl bg-slate-900 px-4 py-3 font-semibold text-white">Search now</button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <SectionCard title="Featured PGs" subtitle="Handpicked stays with excellent ratings" action={<Link to="/tenant/search" className="text-sm font-semibold text-cyan-600">View all</Link>}>
          <div className="grid gap-4 md:grid-cols-2">
            {featuredPgs.map((pg) => <PGCard key={pg.id} pg={pg} />)}
          </div>
        </SectionCard>

        <SectionCard title="Nearby PGs" subtitle="Great options close to your work or study spot">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {nearbyPgs.map((pg) => <PGCard key={pg.id} pg={pg} />)}
          </div>
        </SectionCard>

        <div className="grid gap-6 lg:grid-cols-2">
          <SectionCard title="Popular locations" subtitle="Trending neighborhoods">
            <div className="grid gap-3 sm:grid-cols-2">
              {['Koramangala', 'Indiranagar', 'HSR Layout', 'Marathahalli'].map((location) => (
                <div key={location} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/60">
                  <p className="font-semibold">{location}</p>
                  <p className="text-sm text-slate-500">100+ verified listings</p>
                </div>
              ))}
            </div>
          </SectionCard>
          <SectionCard title="How it works" subtitle="A simple path to your next home">
            <div className="space-y-3">
              {['Shortlist PGs', 'Check amenities and bed status', 'Reserve your bed'].map((step, index) => (
                <div key={step} className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3 dark:bg-slate-800/60">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-cyan-600 text-sm font-semibold text-white">{index + 1}</div>
                  <p className="font-medium">{step}</p>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>
    </ModuleShell>
  )
}
