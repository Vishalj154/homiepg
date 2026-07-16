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

export default function SearchPage() {
  const [pgs, setPgs] = useState([])
  const [city, setCity] = useState('')
  const [area, setArea] = useState('')
  const [rent, setRent] = useState('all')
  const [gender, setGender] = useState('all')
  const [food, setFood] = useState('all')
  const [amenities, setAmenities] = useState([])
  const [sortBy, setSortBy] = useState('recommended')

  useEffect(() => {
    getPublicPGs().then(setPgs).catch(() => setPgs([]))
  }, [])

  const toggleAmenity = (value) => {
    setAmenities((prev) => prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value])
  }

  const filteredPgs = pgs.filter((pg) => {
    const cityMatch = !city || pg.city?.toLowerCase().includes(city.toLowerCase())
    const areaMatch = !area || pg.area?.toLowerCase().includes(area.toLowerCase())
    const rentMatch = rent === 'all' || (
      rent === 'under-12k' ? pg.rentValue < 12000 :
        rent === '12k-15k' ? pg.rentValue >= 12000 && pg.rentValue <= 15000 :
          rent === '15k-plus' ? pg.rentValue > 15000 : true
    )
    const genderMatch = gender === 'all' || pg.gender === gender
    const foodMatch = food === 'all' || pg.food === food
    const amenityMatch = amenities.length === 0 || amenities.every((item) => pg.amenities.includes(item))
    return cityMatch && areaMatch && rentMatch && genderMatch && foodMatch && amenityMatch
  }).sort((a, b) => {
    if (sortBy === 'rent-low') return a.rentValue - b.rentValue
    if (sortBy === 'rent-high') return b.rentValue - a.rentValue
    if (sortBy === 'rating') return Number(b.rating) - Number(a.rating)
    return Number(b.vacantBeds) - Number(a.vacantBeds)
  })

  return (
    <ModuleShell title="Tenant Module" subtitle="Search PG" navItems={navItems} accent="from-violet-500 to-cyan-600">
      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <SectionCard title="Filters" subtitle="Refine your stay preferences">
          <div className="space-y-3">
            <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="City" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-800/60" />
            <input value={area} onChange={(e) => setArea(e.target.value)} placeholder="Area" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-800/60" />
            <select value={rent} onChange={(e) => setRent(e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-800/60">
              <option value="all">Rent Range</option>
              <option value="under-12k">Under ₹12k</option>
              <option value="12k-15k">₹12k - ₹15k</option>
              <option value="15k-plus">₹15k+</option>
            </select>
            <select value={gender} onChange={(e) => setGender(e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-800/60">
              <option value="all">Gender</option>
              <option value="unisex">Co-living</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
            <select value={food} onChange={(e) => setFood(e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-800/60">
              <option value="all">Food</option>
              <option value="veg">Veg</option>
              <option value="non_veg">Non-veg</option>
              <option value="both">Both</option>
              <option value="not_included">Not included</option>
            </select>
            <div className="flex flex-wrap gap-2">
              {['WiFi', 'Parking', 'Laundry', 'Gym', 'Security'].map((item) => (
                <button key={item} onClick={() => toggleAmenity(item)} className={`rounded-full px-3 py-2 text-sm ${amenities.includes(item) ? 'bg-cyan-600 text-white' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-200'}`}>
                  {item}
                </button>
              ))}
            </div>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-800/60">
              <option value="recommended">Sort by recommended</option>
              <option value="rent-low">Rent: Low to High</option>
              <option value="rent-high">Rent: High to Low</option>
              <option value="rating">Top rated</option>
            </select>
          </div>
        </SectionCard>

        <SectionCard title="Matching PGs" subtitle="Discover the best fit for your routine">
          <div className="grid gap-4 md:grid-cols-2">
            {filteredPgs.map((pg) => (
              <div key={pg.id} className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <img src={pg.image} alt={pg.name} className="h-36 w-full object-cover" />
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">{pg.name}</h4>
                      <p className="text-sm text-slate-500">{pg.area}, {pg.city}</p>
                    </div>
                    <span className="rounded-full bg-amber-100 px-2.5 py-1 text-sm text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">★ {pg.rating}</span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {pg.amenities.map((item) => <span key={item} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300">{item}</span>)}
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div>
                      <p className="text-lg font-semibold text-cyan-600">{pg.rent}</p>
                      <p className="text-sm text-slate-500">{pg.vacantBeds} vacant beds • {pg.occupancy}% occupied</p>
                    </div>
                    <Link to={`/tenant/pg-details/${pg.id}`} className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white dark:bg-cyan-600">View</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </ModuleShell>
  )
}
