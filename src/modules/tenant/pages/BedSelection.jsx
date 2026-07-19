import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import ModuleShell from '../../shared/components/ModuleShell'
import SectionCard from '../../shared/components/SectionCard'
import { getBuildingDetails } from '../../../services/property.service'

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

export default function BedSelection() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [building, setBuilding] = useState(null)
  const [selectedBed, setSelectedBed] = useState(null)

  useEffect(() => {
    if (!id) return
    getBuildingDetails(id).then((res) => {
      if (res.data) setBuilding(res.data)
    })
  }, [id])

  if (!building) {
    return (
      <ModuleShell title="Tenant Module" subtitle="Bed Selection" navItems={navItems} accent="from-violet-500 to-cyan-600">
        <div className="p-8 text-slate-600 dark:text-slate-400">Loading beds...</div>
      </ModuleShell>
    )
  }

  const handleContinue = () => {
    if (selectedBed) {
      navigate(`/tenant/booking/${selectedBed}`)
    }
  }

  return (
    <ModuleShell title="Tenant Module" subtitle={`Bed Selection for ${building.name}`} navItems={navItems} accent="from-violet-500 to-cyan-600">
      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <SectionCard title="Legend" subtitle="Understand bed availability">
          <div className="space-y-3">
            {[
              ['available', 'bg-emerald-500'],
              ['occupied', 'bg-rose-500'],
              ['reserved', 'bg-amber-500'],
              ['maintenance', 'bg-slate-500'],
            ].map(([label, color]) => (
              <div key={label} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3 capitalize dark:border-slate-800 dark:bg-slate-800/60">
                <span className={`h-3 w-3 rounded-full ${color}`} />
                <span className="font-medium">{label}</span>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Rooms & Beds" subtitle="Choose an available bed">
          {building.rooms && building.rooms.length > 0 ? (
            <div className="space-y-6">
              {building.rooms.map((room) => (
                <div key={room.id} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
                  <h3 className="mb-3 font-semibold text-slate-700 dark:text-slate-300">Room {room.room_number} (Capacity: {room.capacity})</h3>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {room.beds && room.beds.map((bed) => {
                      const isAvailable = bed.status === 'available'
                      const isSelected = selectedBed === bed.id
                      return (
                        <button 
                          key={bed.id} 
                          disabled={!isAvailable} 
                          onClick={() => setSelectedBed(bed.id)}
                          className={`rounded-2xl border p-4 text-left transition ${
                            isSelected ? 'border-cyan-500 bg-cyan-50 ring-2 ring-cyan-500/20 dark:bg-cyan-950/30' 
                            : isAvailable ? 'border-slate-200 hover:border-emerald-400 hover:bg-emerald-50 dark:border-slate-700 dark:hover:bg-emerald-950/20' 
                            : 'border-slate-200 bg-slate-50 opacity-50 dark:border-slate-800 dark:bg-slate-800/60'
                          }`}
                        >
                          <p className="text-lg font-semibold">Bed {bed.bed_number}</p>
                          <p className="mt-1 text-sm capitalize text-slate-500">{bed.status}</p>
                          <p className="mt-1 text-xs font-medium text-slate-600 dark:text-slate-400">Rent: ₹{bed.monthly_rent}</p>
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-500">No rooms available in this building.</p>
          )}

          <div className="mt-6 flex justify-end">
            <button 
              onClick={handleContinue} 
              disabled={!selectedBed}
              className={`rounded-full px-5 py-3 text-sm font-semibold text-white transition ${selectedBed ? 'bg-cyan-600 hover:bg-cyan-700' : 'cursor-not-allowed bg-slate-300 dark:bg-slate-700'}`}
            >
              Continue to booking
            </button>
          </div>
        </SectionCard>
      </div>
    </ModuleShell>
  )
}
